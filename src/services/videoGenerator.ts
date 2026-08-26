import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoadingFFmpeg = false;

export class VideoGenerator {
  private static async getFFmpeg(): Promise<FFmpeg> {
    if (ffmpegInstance && ffmpegInstance.loaded) {
      return ffmpegInstance;
    }

    if (isLoadingFFmpeg) {
      while (isLoadingFFmpeg) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;
    }

    isLoadingFFmpeg = true;
    try {
      const ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      });
      ffmpegInstance = ffmpeg;
      return ffmpeg;
    } finally {
      isLoadingFFmpeg = false;
    }
  }

  /**
   * Generates a real H.264 / AAC MP4 video from a card image and audio URL
   */
  public static async generateQuoteVideoMp4(
    cardImageUrl: string,
    audioUrl: string,
    onProgress?: (percent: number) => void
  ): Promise<Blob> {
    try {
      const ffmpeg = await this.getFFmpeg();

      // 1. Fetch audio via CORS proxy & image
      const proxyAudio = `/api/proxy-audio?url=${encodeURIComponent(audioUrl)}`;
      const [audioData, imageData] = await Promise.all([
        fetchFile(proxyAudio),
        fetchFile(cardImageUrl)
      ]);

      const inImg = `card_${Date.now()}.png`;
      const inAud = `audio_${Date.now()}.mp3`;
      const outVid = `out_${Date.now()}.mp4`;

      await ffmpeg.writeFile(inImg, imageData);
      await ffmpeg.writeFile(inAud, audioData);

      const progressHandler = ({ progress }: { progress: number }) => {
        if (onProgress) onProgress(Math.min(100, Math.round(progress * 100)));
      };
      ffmpeg.on('progress', progressHandler);

      try {
        // Encode compliant MP4 video (H.264 + AAC + yuv420p for Instagram & TikTok)
        await ffmpeg.exec([
          '-loop', '1',
          '-i', inImg,
          '-i', inAud,
          '-c:v', 'libx264',
          '-tune', 'stillimage',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-pix_fmt', 'yuv420p',
          '-shortest',
          outVid
        ]);

        const data = await ffmpeg.readFile(outVid);
        const buffer = (data as any).buffer ? (data as any).buffer : data;
        const blob = new Blob([buffer], { type: 'video/mp4' });
        return blob;
      } finally {
        ffmpeg.off('progress', progressHandler);
        try {
          await ffmpeg.deleteFile(inImg);
          await ffmpeg.deleteFile(inAud);
          await ffmpeg.deleteFile(outVid);
        } catch {}
      }
    } catch (ffmpegErr) {
      console.warn('FFmpeg wasm fallback to MediaRecorder:', ffmpegErr);
      return this.fallbackCanvasRecorder(cardImageUrl, audioUrl);
    }
  }

  /**
   * Fallback using MediaRecorder if WebAssembly is not supported
   */
  private static async fallbackCanvasRecorder(cardUrl: string, audioUrl: string): Promise<Blob> {
    const proxyAudioUrl = `/api/proxy-audio?url=${encodeURIComponent(audioUrl)}`;
    const audioRes = await fetch(proxyAudioUrl);
    if (!audioRes.ok) throw new Error('Impossible de charger le fichier audio.');
    const audioArrayBuffer = await audioRes.arrayBuffer();

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Erreur image'));
      img.src = cardUrl;
    });

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);
    const audioDuration = audioBuffer.duration;

    const dest = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(dest);
    source.connect(audioCtx.destination);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas non supporté');

    let animId: number;
    const renderFrame = () => {
      ctx.clearRect(0, 0, 1080, 1920);
      ctx.drawImage(img, 0, 0, 1080, 1920);
      animId = requestAnimationFrame(renderFrame);
    };
    renderFrame();

    const canvasStream = canvas.captureStream(30);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ]);

    const mimeType = MediaRecorder.isTypeSupported('video/mp4') 
      ? 'video/mp4' 
      : (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm');

    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 4000000 });
    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        cancelAnimationFrame(animId);
        audioCtx.close().catch(() => {});
        resolve(new Blob(chunks, { type: mimeType }));
      };
      recorder.onerror = (err) => {
        cancelAnimationFrame(animId);
        audioCtx.close().catch(() => {});
        reject(err);
      };

      recorder.start();
      source.start(0);

      const timeout = setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, (audioDuration + 0.5) * 1000);

      source.onended = () => {
        clearTimeout(timeout);
        setTimeout(() => {
          if (recorder.state === 'recording') recorder.stop();
        }, 400);
      };
    });
  }

  /**
   * Uploads video Blob to high-availability CDN for Buffer ingestion
   */
  public static async uploadVideoToCDN(blob: Blob): Promise<string> {
    // 1. Primary: Catbox
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', blob, 'quran-reel.mp4');
      const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
      const text = await res.text();
      if (text && text.startsWith('http')) {
        return text.trim();
      }
    } catch (e) {
      console.warn('Catbox upload failed, trying tmpfiles:', e);
    }

    // 2. Fallback: Tmpfiles
    try {
      const form2 = new FormData();
      form2.append('file', blob, 'quran-reel.mp4');
      const res2 = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: form2 });
      const json2 = await res2.json();
      if (json2?.data?.url) {
        return json2.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      }
    } catch (e) {
      console.warn('Tmpfiles upload failed:', e);
    }

    throw new Error('Impossible d’héberger la vidéo sur le CDN public pour Buffer.');
  }
}
