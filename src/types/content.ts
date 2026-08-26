/**
 * OmniPulse AI - Social Media Content & Scheduling Types
 */

export type SocialPlatform = 'tiktok' | 'instagram' | 'facebook' | 'linkedin' | 'x';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export type MediaType = 'image' | 'video' | 'carousel' | 'none';

export interface PlatformContent {
  text: string;
  hashtags: string[];
  hook?: string;
  callToAction?: string;
  charLimit?: number;
  videoScript?: string;
  audioTrackSuggestion?: string;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  promptUsed?: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  createdAt: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  engine: 'imagen3' | 'video_ai' | 'upload';
}

export interface ScheduledPost {
  id: string;
  title: string;
  originalIdea: string;
  platforms: SocialPlatform[];
  platformContent: Record<SocialPlatform, PlatformContent>;
  media?: MediaAsset;
  scheduledTime: string; // ISO string
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  campaignTag?: string;
  engagementStats?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl: string;
  connected: boolean;
  followerCount: number;
  lastSync?: string;
  webhookUrl?: string;
  accountType?: 'direct_webhook' | 'buffer' | 'ayrshare' | 'make';
}

export interface CloudStorageConfig {
  provider: 'cloudinary' | 'supabase' | 'none';
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseBucket?: string;
}

export interface SocialBridgeConfig {
  bridgeType: 'make_webhook' | 'buffer' | 'n8n_webhook' | 'zapier_webhook' | 'ayrshare' | 'custom_webhook';
  universalWebhookUrl: string;
  bufferAccessToken?: string;
  ayrshareApiKey?: string;
  autoDispatch: boolean;
  platformWebhooks?: Partial<Record<SocialPlatform, string>>;
  cloudStorage?: CloudStorageConfig;
  discordWebhookUrl?: string;
  discordEnabled?: boolean;
}

export interface PublishLog {
  id: string;
  postId: string;
  platform: SocialPlatform;
  timestamp: string;
  status: 'success' | 'failed';
  responseMessage: string;
  httpStatus?: number;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  days: number;
  targetAudience: string;
  tone: string;
  postsPerDay: number;
}
