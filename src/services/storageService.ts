/**
 * OmniPulse AI - Local Storage & Persistence Service
 * Manages persisting posts, accounts, media assets, API settings, and social bridges.
 */

import type { ScheduledPost, SocialAccount, MediaAsset, SocialBridgeConfig, PublishLog } from '../types/content';
import type { AISettings } from '../types/ai';
import { 
  INITIAL_SETTINGS, 
  INITIAL_ACCOUNTS, 
  INITIAL_MEDIA_LIBRARY, 
  INITIAL_SCHEDULED_POSTS 
} from '../data/mockData';

const STORAGE_KEYS = {
  SETTINGS: 'omnipulse_ai_settings',
  POSTS: 'omnipulse_scheduled_posts',
  ACCOUNTS: 'omnipulse_social_accounts',
  MEDIA: 'omnipulse_media_library',
  BRIDGE: 'omnipulse_social_bridge_config',
  LOGS: 'omnipulse_social_publish_logs',
};

const DEFAULT_BRIDGE_CONFIG: SocialBridgeConfig = {
  bridgeType: 'buffer',
  universalWebhookUrl: 'https://hook.eu1.make.com/5ftvjpexv24p5bwyvu9fifjhokrn7exs',
  bufferAccessToken: 'vXkaxUF8bX5anmrPe_4BMyXe6Lo36lwZYTAPYmCDHkM',
  bufferYoutubeChannelId: '',
  autoDispatch: true,
  platformWebhooks: {
    tiktok: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    x: '',
    youtube: '',
  },
  cloudStorage: {
    provider: 'cloudinary',
    cloudinaryCloudName: 'zmgzjmpl',
    cloudinaryUploadPreset: 'ml_default'
  },
  discordWebhookUrl: 'https://discord.com/api/webhooks/1542317690255839402/lJKv3K4988iwAhvc7Jpay8zvBhJ4aXB3dL6GMPGR8o4D9FauC3cuGoIcrOTfJBzAZkPU',
  discordEnabled: true
};

export const StorageService = {
  // --- AI Settings ---
  getSettings(): AISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...INITIAL_SETTINGS, ...JSON.parse(data) } : INITIAL_SETTINGS;
    } catch (e) {
      console.warn('Could not read settings from localStorage, using defaults.', e);
      return INITIAL_SETTINGS;
    }
  },

  getApiKey(): string {
    const userKey = this.getSettings().geminiApiKey;
    if (userKey && userKey.trim() !== '') return userKey.trim();
    try {
      if (typeof atob !== 'undefined') {
        return atob('QVEuQWI4Uk42Szh0TmZOekVTemtPVFEwTkdIU1VpVUx0TVo5Q1lqZFFtM3Y3WGRnb216QWc=');
      }
    } catch (e) {
      console.warn('Could not decode default key:', e);
    }
    return '';
  },

  saveSettings(settings: AISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  // --- Scheduled Posts ---
  getPosts(): ScheduledPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : INITIAL_SCHEDULED_POSTS;
    } catch (e) {
      console.warn('Could not read posts from localStorage, using default sample.', e);
      return INITIAL_SCHEDULED_POSTS;
    }
  },

  savePosts(posts: ScheduledPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts to localStorage', e);
    }
  },

  savePost(post: ScheduledPost): ScheduledPost[] {
    const current = this.getPosts();
    const index = current.findIndex(p => p.id === post.id);
    let updated: ScheduledPost[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      updated = [post, ...current];
    }
    this.savePosts(updated);
    return updated;
  },

  deletePost(postId: string): ScheduledPost[] {
    const current = this.getPosts();
    const updated = current.filter(p => p.id !== postId);
    this.savePosts(updated);
    return updated;
  },

  // --- Social Accounts ---
  getAccounts(): SocialAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : INITIAL_ACCOUNTS;
    } catch (e) {
      console.warn('Could not read accounts from localStorage, using initial state.', e);
      return INITIAL_ACCOUNTS;
    }
  },

  saveAccounts(accounts: SocialAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  },

  toggleAccountConnection(accountId: string): SocialAccount[] {
    const accounts = this.getAccounts().map(acc => {
      if (acc.id === accountId) {
        return { 
          ...acc, 
          connected: !acc.connected, 
          lastSync: !acc.connected ? new Date().toISOString() : acc.lastSync 
        };
      }
      return acc;
    });
    this.saveAccounts(accounts);
    return accounts;
  },

  updateAccountWebhook(accountId: string, webhookUrl: string, username?: string): SocialAccount[] {
    const accounts = this.getAccounts().map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          webhookUrl,
          username: username || acc.username,
          connected: true,
          lastSync: new Date().toISOString()
        };
      }
      return acc;
    });
    this.saveAccounts(accounts);
    return accounts;
  },

  // --- Social Bridge & Webhooks ---
  getBridgeConfig(): SocialBridgeConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRIDGE);
      return data ? { ...DEFAULT_BRIDGE_CONFIG, ...JSON.parse(data) } : DEFAULT_BRIDGE_CONFIG;
    } catch (e) {
      return DEFAULT_BRIDGE_CONFIG;
    }
  },

  saveBridgeConfig(config: SocialBridgeConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BRIDGE, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save bridge config to localStorage', e);
    }
  },

  // --- Publish Logs ---
  getPublishLogs(): PublishLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addPublishLog(log: PublishLog): PublishLog[] {
    const current = this.getPublishLogs();
    const updated = [log, ...current].slice(0, 50); // Keep 50 most recent logs
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save publish log', e);
    }
    return updated;
  },

  // --- Media Library ---
  getMediaLibrary(): MediaAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return data ? JSON.parse(data) : INITIAL_MEDIA_LIBRARY;
    } catch (e) {
      console.warn('Could not read media from localStorage, using initial sample.', e);
      return INITIAL_MEDIA_LIBRARY;
    }
  },

  saveMediaLibrary(media: MediaAsset[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    } catch (e) {
      console.error('Failed to save media to localStorage', e);
    }
  },

  addMediaAsset(asset: MediaAsset): MediaAsset[] {
    const current = this.getMediaLibrary();
    const updated = [asset, ...current];
    this.saveMediaLibrary(updated);
    return updated;
  }
};
