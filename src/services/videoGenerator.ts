import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

export class VideoGenerator {
  /**
   * Generates a true standard H.264 Baseline / AAC MP4 video in ~1-2 seconds using WebCodecs & mp4-muxer
   */
  public static async generateQuoteVideoMp4(
    cardImageUrl: string,
    audioUrl: string,
    onProgress?: (percent: number) => void
  ): Promise<Blob> {
    try {
      // Check if WebCodecs VideoEncoder is available
      if (typeof VideoEncoder !== 'undefined' && typeof AudioData !== 'undefined') {
        return await this.encodeFastWebCodecsMp4(cardImageUrl, audioUrl, onProgress);
      }
    } catch (e) {
      console.warn('Fast WebCodecs encoding failed, falling back to MediaRecorder:', e);
    }

    return await this.fallbackCanvasRecorder(cardImageUrl, audioUrl);
  }

  /**
   * Fast hardware-accelerated H.264 / AAC MP4 encoding
   */
  private static async encodeFastWebCodecsMp4(
    cardImageUrl: string,
    audioUrl: string,
    onProgress?: (percent: number) => void
  ): Promise<Blob> {
    // 1. Fetch audio with CORS proxy
    const proxyAudio = `/api/proxy-audio?url=${encodeURIComponent(audioUrl)}`;
    const audioRes = await fetch(proxyAudio);
    if (!audioRes.ok) throw new Error('Impossible de charger le fichier audio de récitation.');
    const audioArrayBuffer = await audioRes.arrayBuffer();

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);
    const duration = audioBuffer.duration;
    const sampleRate = audioBuffer.sampleRate;
    const numChannels = Math.min(2, audioBuffer.numberOfChannels);

    // 2. Load card image
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Erreur de chargement de la carte.'));
      img.src = cardImageUrl;
    });

    const width = 1080;
    const height = 1920;
    const fps = 30;
    const totalFrames = Math.ceil(duration * fps);

    // 3. Setup MP4 Muxer with H.264 & AAC
    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: {
        codec: 'avc',
        width,
        height
      },
      audio: {
        codec: 'aac',
        numberOfChannels: numChannels,
        sampleRate
      },
      fastStart: 'in-memory'
    });

    // 4. Video Encoder (H.264 Baseline for universal Instagram & TikTok compatibility)
    const videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (err) => console.error('VideoEncoder error:', err)
    });

    videoEncoder.configure({
      codec: 'avc1.42001f', // Baseline profile
      width,
      height,
      bitrate: 4_500_000,
      framerate: fps
    });

    // 5. Audio Encoder (AAC)
    let audioEncoder: AudioEncoder | null = null;
    try {
      audioEncoder = new AudioEncoder({
        output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
        error: (err) => console.error('AudioEncoder error:', err)
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2', // AAC-LC
        numberOfChannels: numChannels,
        sampleRate,
        bitrate: 192_000
      });
    } catch (e) {
      console.warn('AudioEncoder configuration error:', e);
    }

    // Feed Audio Data
    if (audioEncoder) {
      const channel0 = audioBuffer.getChannelData(0);
      const channel1 = numChannels > 1 ? audioBuffer.getChannelData(1) : channel0;
      const chunkSize = 1024;
      let offset = 0;
      let audioTimeUs = 0;

      while (offset < channel0.length) {
        const count = Math.min(chunkSize, channel0.length - offset);
        const planar = new Float32Array(count * numChannels);
        planar.set(channel0.subarray(offset, offset + count), 0);
        if (numChannels > 1) {
          planar.set(channel1.subarray(offset, offset + count), count);
        }

        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate,
          numberOfFrames: count,
          numberOfChannels: numChannels,
          timestamp: audioTimeUs,
          data: planar
        });

        audioEncoder.encode(audioData);
        audioData.close();

        offset += count;
        audioTimeUs += Math.round((count / sampleRate) * 1_000_000);
      }
    }

    // 6. Render & Encode Video Frames
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    for (let i = 0; i < totalFrames; i++) {
      const timestampUs = Math.round((i / fps) * 1_000_000);
      const keyFrame = i % (fps * 2) === 0;

      // Subtle dynamic zoom
      ctx.clearRect(0, 0, width, height);
      const scale = 1 + 0.015 * Math.sin((i / totalFrames) * Math.PI);
      const w = width * scale;
      const h = height * scale;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.drawImage(img, x, y, w, h);

      const videoFrame = new VideoFrame(canvas, {
        timestamp: timestampUs,
        duration: Math.round((1 / fps) * 1_000_000)
      });

      videoEncoder.encode(videoFrame, { keyFrame });
      videoFrame.close();

      if (onProgress && i % 10 === 0) {
        onProgress(Math.round((i / totalFrames) * 100));
      }
    }

    await videoEncoder.flush();
    videoEncoder.close();

    if (audioEncoder) {
      await audioEncoder.flush();
      audioEncoder.close();
    }

    muxer.finalize();
    audioCtx.close().catch(() => {});

    return new Blob([target.buffer], { type: 'video/mp4' });
  }

  /**
   * Fallback using MediaRecorder if WebCodecs is not supported
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
