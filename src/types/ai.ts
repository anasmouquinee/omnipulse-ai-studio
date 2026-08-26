/**
 * OmniPulse AI - Generative AI Types & Configurations
 * Defines structures for Gemini Flash, Imagen 3, and Video Generation engines.
 */

import type { SocialPlatform } from './content';

export type AITone = 
  | 'viral' 
  | 'professional' 
  | 'educational' 
  | 'humorous' 
  | 'storytelling' 
  | 'direct_sales' 
  | 'inspiring';

export type ImageStylePreset = 
  | 'cinematic' 
  | 'hyperrealistic_photo' 
  | 'minimalist_3d' 
  | 'cyberpunk_neon' 
  | 'editorial_luxury' 
  | 'retro_vintage'
  | 'vector_illustration';

export type ImageAspectRatio = '1:1' | '4:5' | '9:16' | '16:9';

export type VideoMotionPreset = 
  | 'subtle_zoom' 
  | 'dynamic_pan' 
  | 'fpv_drone' 
  | 'orbit_360' 
  | 'timelapse';

export type VideoProviderType = 
  | 'google_veo' 
  | 'runway' 
  | 'luma' 
  | 'kling' 
  | 'fal_ai' 
  | 'simulator';

export interface AISettings {
  geminiApiKey: string;
  geminiModel: string;
  imagenApiKey: string;
  videoProvider?: VideoProviderType;
  videoApiEndpoint: string;
  videoApiKey: string;
  useLiveApi: boolean;
  defaultLanguage: 'fr' | 'en' | 'es';
}

export interface GeminiTextGenerationParams {
  prompt: string;
  tone: AITone;
  targetPlatforms: SocialPlatform[];
  customInstructions?: string;
  language?: string;
  campaignContext?: string;
}

export interface GeneratedSocialPack {
  originalIdea: string;
  overallHook: string;
  suggestedImagePrompt: string;
  suggestedVideoPrompt: string;
  platforms: {
    tiktok: {
      hook: string;
      videoScript: string;
      caption: string;
      hashtags: string[];
      audioTrackSuggestion: string;
    };
    instagram: {
      caption: string;
      hook: string;
      callToAction: string;
      hashtags: string[];
      carouselTips?: string[];
    };
    facebook: {
      text: string;
      hook: string;
      callToAction: string;
      hashtags: string[];
    };
    linkedin: {
      text: string;
      headline: string;
      bulletPoints?: string[];
      callToAction: string;
      hashtags: string[];
    };
    x: {
      tweet: string;
      threadParts: string[];
      hashtags: string[];
    };
  };
}

export interface ImagenGenerationParams {
  prompt: string;
  aspectRatio: ImageAspectRatio;
  style: ImageStylePreset;
  negativePrompt?: string;
}

export interface VideoGenerationParams {
  prompt: string;
  sourceImageUrl?: string;
  mode?: 'text_to_video' | 'image_to_video';
  durationSeconds: 5 | 10 | 15;
  motion: VideoMotionPreset;
  aspectRatio: '9:16' | '16:9' | '1:1';
}
