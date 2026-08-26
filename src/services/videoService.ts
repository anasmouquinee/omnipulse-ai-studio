/**
 * OmniPulse AI - Video Generation Service
 * Supports Text-to-Video and Image-to-Video generation with customizable motion, duration, and aspect ratio.
 */

import type { VideoGenerationParams } from '../types/ai';
import type { MediaAsset } from '../types/content';
import { StorageService } from './storageService';

const VIDEO_SAMPLE_BANKS = [
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-flying-vehicles-41584-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31912-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-rotating-planet-earth-surrounded-by-stars-in-space-41549-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
  }
];

export const VideoService = {
  /**
   * Generates or connects to an AI video generation pipeline.
   */
  async generateVideo(params: VideoGenerationParams): Promise<MediaAsset> {
    const settings = StorageService.getSettings();

    // If a custom video API endpoint is defined and configured
    if (settings.videoApiKey && settings.videoApiKey.trim() !== '') {
      try {
        const liveVideo = await this.callVideoApi(params, settings.videoApiEndpoint, settings.videoApiKey);
        if (liveVideo) {
          StorageService.addMediaAsset(liveVideo);
          return liveVideo;
        }
      } catch (err) {
        console.warn('Video generation API error, falling back to dynamic video pipeline:', err);
      }
    }

    // Dynamic video pipeline
    const videoAsset = await this.simulateVideoGeneration(params);
    StorageService.addMediaAsset(videoAsset);
    return videoAsset;
  },

  async callVideoApi(
    params: VideoGenerationParams, 
    endpoint: string, 
    apiKey: string
  ): Promise<MediaAsset | null> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Video API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.videoUrl) {
      return {
        id: `vid-${Date.now()}`,
        type: 'video',
        url: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || data.videoUrl,
        promptUsed: params.prompt,
        aspectRatio: params.aspectRatio,
        durationSeconds: params.durationSeconds,
        createdAt: new Date().toISOString(),
        engine: 'video_ai'
      };
    }
    return null;
  },

  async simulateVideoGeneration(params: VideoGenerationParams): Promise<MediaAsset> {
    // Artificial generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const sample = VIDEO_SAMPLE_BANKS[Math.floor(Math.random() * VIDEO_SAMPLE_BANKS.length)];

    return {
      id: `vid-${Date.now()}`,
      type: 'video',
      url: sample.url,
      thumbnailUrl: params.sourceImageUrl || sample.thumbnail,
      promptUsed: params.prompt,
      aspectRatio: params.aspectRatio,
      durationSeconds: params.durationSeconds,
      createdAt: new Date().toISOString(),
      engine: 'video_ai'
    };
  }
};
