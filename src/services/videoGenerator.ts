import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { StorageService } from './storageService';

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

      ctx.clearRect(0, 0, width, height);

      // 1. Cinematic Ken Burns Slow Zoom (Smooth 1.0 -> 1.055 zoom-in)
      const scale = 1.0 + 0.055 * (i / totalFrames);
      const w = width * scale;
      const h = height * scale;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.drawImage(img, x, y, w, h);

      // 2. Dynamic breathing spiritual glow behind Arabic text
      const glowOpacity = 0.14 + 0.06 * Math.sin((i / 20) * Math.PI);
      const glowGrad = ctx.createRadialGradient(width / 2, height * 0.32, 20, width / 2, height * 0.32, width * 0.55);
      glowGrad.addColorStop(0, `rgba(245, 158, 11, ${glowOpacity})`);
      glowGrad.addColorStop(0.6, `rgba(16, 185, 129, ${glowOpacity * 0.5})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Floating golden bokeh particles
      for (let p = 0; p < 22; p++) {
        const seed = p * 7393;
        const px = ((Math.sin(seed + i * 0.012) * 0.5 + 0.5) * (width - 120)) + 60;
        const py = ((seed * 137 + i * 2.2) % (height + 200)) - 100;
        const pr = 2 + (p % 4);
        const particleOpacity = 0.2 + 0.25 * Math.sin(i * 0.06 + seed);
        
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0, particleOpacity)})`;
        ctx.beginPath();
        ctx.arc(px, height - py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Dynamic Golden Audio Waveform Visualizer (TikTok/Reels Frequency Spectrum)
      const numWaveformBars = 36;
      const waveBarW = 6;
      const waveGap = 7;
      const totalWaveW = (numWaveformBars * waveBarW) + ((numWaveformBars - 1) * waveGap);
      const waveStartX = (width - totalWaveW) / 2;
      const waveBaseY = height - 130;
      const currentSample = Math.floor((i / fps) * sampleRate);

      ctx.save();
      for (let b = 0; b < numWaveformBars; b++) {
        const offsetSample = currentSample + Math.round((b - numWaveformBars / 2) * 140);
        let amp = 0.15;
        if (channel0 && offsetSample >= 0 && offsetSample < channel0.length) {
          amp = Math.min(1, Math.abs(channel0[offsetSample]) * 3.2 + 0.12);
        }
        const vocalHarmonic = Math.sin(i * 0.2 + b * 0.28) * 0.14;
        const barHeight = Math.max(6, Math.min(68, (amp + vocalHarmonic) * 58));
        const bx = waveStartX + b * (waveBarW + waveGap);
        const by = waveBaseY - barHeight / 2;

        const waveGrad = ctx.createLinearGradient(0, by, 0, by + barHeight);
        waveGrad.addColorStop(0, '#fef08a');
        waveGrad.addColorStop(0.5, '#f59e0b');
        waveGrad.addColorStop(1, '#10b981');

        ctx.fillStyle = waveGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(bx, by, waveBarW, barHeight, 3);
        ctx.fill();
      }
      ctx.restore();

      // 5. Sleek bottom audio progress bar
      const progress = Math.min(1, i / totalFrames);
      const barY = height - 85;
      const barW = width - 160;
      
      // Track background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(80, barY, barW, 4);

      // Gradient Fill
      const progGrad = ctx.createLinearGradient(80, 0, width - 80, 0);
      progGrad.addColorStop(0, '#10b981');
      progGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = progGrad;
      ctx.fillRect(80, barY, barW * progress, 4);

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
    const channel0 = audioBuffer.getChannelData(0);

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

    const startTime = Date.now();
    let animId: number;
    const renderFrame = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(1, elapsed / audioDuration);

      ctx.clearRect(0, 0, 1080, 1920);

      // Ken Burns Slow Zoom
      const scale = 1.0 + 0.055 * progress;
      const w = 1080 * scale;
      const h = 1920 * scale;
      ctx.drawImage(img, (1080 - w) / 2, (1920 - h) / 2, w, h);

      // Audio Waveform Visualizer
      const numBars = 32;
      const waveBarW = 6;
      const waveGap = 7;
      const totalW = (numBars * waveBarW) + ((numBars - 1) * waveGap);
      const startX = (1080 - totalW) / 2;
      const baseY = 1920 - 130;
      const currentSample = Math.floor(elapsed * audioBuffer.sampleRate);

      for (let b = 0; b < numBars; b++) {
        const offset = currentSample + (b - numBars / 2) * 140;
        let amp = 0.15;
        if (offset >= 0 && offset < channel0.length) {
          amp = Math.min(1, Math.abs(channel0[offset]) * 3 + 0.12);
        }
        const barH = Math.max(6, Math.min(65, amp * 55));
        const bx = startX + b * (waveBarW + waveGap);
        const by = baseY - barH / 2;

        const grad = ctx.createLinearGradient(0, by, 0, by + barH);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#10b981');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(bx, by, waveBarW, barH, 3);
        ctx.fill();
      }

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
    const bridge = StorageService.getBridgeConfig();
    const cloud = bridge.cloudStorage;

    // 1. Cloudinary Direct Upload
    const cloudName = cloud?.cloudinaryCloudName?.trim() || 'zmgzjmpl';
    const preset = cloud?.cloudinaryUploadPreset?.trim() || 'ml_default';

    if (cloudName) {
      try {
        // Convert blob to Base64 Data URL for 100% universal browser compatibility
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Erreur de lecture du fichier vidéo'));
          reader.readAsDataURL(blob);
        });

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            upload_preset: preset
          })
        });
        const json = await res.json();
        if (json.secure_url) {
          return json.secure_url;
        }
        if (json.error?.message) {
          throw new Error(`Cloudinary: ${json.error.message}`);
        }
      } catch (err: any) {
        throw new Error(`Erreur Cloudinary: ${err.message}`);
      }
    }

    // 2. Supabase Storage Direct Upload
    if (cloud?.provider === 'supabase' && cloud.supabaseUrl?.trim()) {
      try {
        const bucket = cloud.supabaseBucket?.trim() || 'reels';
        const fileName = `reel_${Date.now()}.mp4`;
        const uploadUrl = `${cloud.supabaseUrl.trim().replace(/\/$/, '')}/storage/v1/object/${bucket}/${fileName}`;

        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloud.supabaseAnonKey?.trim() || ''}`,
            'apikey': `${cloud.supabaseAnonKey?.trim() || ''}`,
            'Content-Type': 'video/mp4'
          },
          body: blob
        });

        if (res.ok) {
          return `${cloud.supabaseUrl.trim().replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${fileName}`;
        }
        const errText = await res.text();
        throw new Error(`Supabase: ${errText}`);
      } catch (err: any) {
        throw new Error(`Erreur Supabase: ${err.message}`);
      }
    }

    throw new Error('Veuillez configurer Cloudinary ou Supabase dans les paramètres (⚙️) pour héberger vos vidéos sans blocage.');
  }
}
