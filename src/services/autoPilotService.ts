/**
 * OmniPulse AI - Autonomous Auto-Pilot Service
 * Automates content generation, HD rendering, MP4 video encoding, Cloudinary hosting,
 * and Buffer multi-platform publishing every 6 hours with intelligent sequential theme rotation.
 */

import { IslamicContentService } from './islamicContentService';
import { IslamicLibraryService } from './islamicLibraryService';
import { VideoGenerator } from './videoGenerator';
import { SocialPublisher, getBufferRateLimitStatus } from './socialPublisher';
import type { IslamicContentType } from '../types/islamic';

const AUTOPILOT_STORAGE_KEY = 'omnipulse_autopilot_config';

export interface AutoPilotTheme {
  id: string;
  category: IslamicContentType;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
}

export const AUTOPILOT_THEMES: AutoPilotTheme[] = [
  {
    id: 'theme-quran',
    category: 'quran_verse',
    title: 'Noble Coran — Versets & Récitation Audio',
    subtitle: 'Récitations apaisantes (Alafasy, Minshawi) avec sous-titres trilingues',
    icon: '📖',
    badge: 'Coran'
  },
  {
    id: 'theme-hadith',
    category: 'sahih_hadith',
    title: 'Hadith Sahih Authentique & Sagesse',
    subtitle: 'Paroles prophétiques vérifiées issues de Sahih Al-Bukhari & Muslim',
    icon: '📜',
    badge: 'Hadith'
  },
  {
    id: 'theme-dua',
    category: 'authentic_dua',
    title: 'Invocations & Adhkar (Protection & Barakah)',
    subtitle: 'Invocations authentiques de Hisn al-Muslim (Citadelle du Musulman)',
    icon: '🤲',
    badge: 'Dhikr / Du’a'
  },
  {
    id: 'theme-tahajjud',
    category: 'tahajjud_motivation',
    title: 'Tahajjud & Prière de Nuit (Dernier Tiers)',
    subtitle: 'Rappels spirituels profonds sur l’Istighfar et le Qiyam al-Layl',
    icon: '🌙',
    badge: 'Tahajjud'
  },
  {
    id: 'theme-reminder',
    category: 'islamic_reminder',
    title: 'Motivation & Sagesse Islamique (Tawakkul)',
    subtitle: 'Rappels inspirants sur la patience (Sabr) et la confiance en Allah',
    icon: '💡',
    badge: 'Sagesse'
  },
  {
    id: 'theme-jumuah',
    category: 'jumua_special',
    title: "Spécial Jumu'ah & Sourate Al-Kahf",
    subtitle: 'Mérites du vendredi béni, lecture de la caverne et Salawat',
    icon: '🕌',
    badge: 'Jumu’ah'
  }
];

export interface AutoPilotLog {
  id: string;
  timestamp: string;
  themeTitle: string;
  type: string;
  status: 'success' | 'failed' | 'running';
  message: string;
  videoUrl?: string;
  cardUrl?: string;
}

export interface AutoPilotConfig {
  isEnabled: boolean;
  intervalHours: number; // default 6
  lastRunAt: string | null;
  nextRunAt: string | null;
  currentThemeIndex: number;
  logs: AutoPilotLog[];
}

const DEFAULT_CONFIG: AutoPilotConfig = {
  isEnabled: true,
  intervalHours: 6,
  lastRunAt: null,
  nextRunAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  currentThemeIndex: 0,
  logs: []
};

type AutoPilotSubscriber = (config: AutoPilotConfig) => void;

class AutoPilotServiceClass {
  private timer: any = null;
  private subscribers: AutoPilotSubscriber[] = [];
  private isProcessing: boolean = false;

  constructor() {
    // Start background tick monitor
    if (typeof window !== 'undefined') {
      this.initTimer();
    }
  }

  public getConfig(): AutoPilotConfig {
    try {
      const data = localStorage.getItem(AUTOPILOT_STORAGE_KEY);
      if (!data) return DEFAULT_CONFIG;
      const parsed = JSON.parse(data);
      return { 
        ...DEFAULT_CONFIG, 
        ...parsed,
        currentThemeIndex: typeof parsed.currentThemeIndex === 'number' ? parsed.currentThemeIndex : 0
      };
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  public saveConfig(config: AutoPilotConfig): void {
    try {
      localStorage.setItem(AUTOPILOT_STORAGE_KEY, JSON.stringify(config));
      this.notifySubscribers();
    } catch (e) {
      console.error('Failed to save autopilot config:', e);
    }
  }

  public subscribe(cb: AutoPilotSubscriber): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notifySubscribers(): void {
    const config = this.getConfig();
    this.subscribers.forEach(cb => cb(config));
  }

  /**
   * Determine the current rotating theme
   */
  public getNextRecommendedTheme(): AutoPilotTheme {
    const config = this.getConfig();
    const idx = (config.currentThemeIndex || 0) % AUTOPILOT_THEMES.length;
    return AUTOPILOT_THEMES[idx];
  }

  /**
   * Manually select/advance to a specific theme in rotation
   */
  public setThemeIndex(index: number): void {
    const config = this.getConfig();
    config.currentThemeIndex = index % AUTOPILOT_THEMES.length;
    this.saveConfig(config);
  }

  /**
   * Run one complete autonomous publication cycle
   */
  public async executeCycle(
    onProgress?: (step: string) => void
  ): Promise<{ success: boolean; message: string; log: AutoPilotLog }> {
    if (this.isProcessing) {
      return {
        success: false,
        message: 'Un cycle de publication est déjà en cours.',
        log: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          themeTitle: 'Auto-Pilot',
          type: 'quran_verse',
          status: 'failed',
          message: 'Cycle déjà en cours.'
        }
      };
    }

    // 0. Safety Guard: Check if Buffer is in 24h rate-limit cooldown
    const rateLimit = getBufferRateLimitStatus();
    if (rateLimit.isLimited) {
      const hoursLeft = Math.ceil(rateLimit.remainingMs / (1000 * 60 * 60));
      return {
        success: false,
        message: `⚠️ Quota Buffer API 24h atteint (250 req/jour). Prochaine réinitialisation dans ~${hoursLeft}h. Le cycle est mis en pause de sécurité pour éviter tout blocage.`,
        log: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          themeTitle: currentTheme.title,
          type: currentTheme.category,
          status: 'failed',
          message: rateLimit.message
        }
      };
    }

    this.isProcessing = true;
    const currentTheme = this.getNextRecommendedTheme();
    const startTime = new Date().toISOString();

    const log: AutoPilotLog = {
      id: `log-${Date.now()}`,
      timestamp: startTime,
      themeTitle: currentTheme.title,
      type: currentTheme.category,
      status: 'running',
      message: 'Initialisation du cycle...'
    };

    try {
      if (onProgress) onProgress(`1/4 Génération d’un contenu inédit pour : "${currentTheme.title}"...`);

      // 1. Generate fresh item for the designated theme
      const selectedItem = await IslamicContentService.generateIslamicPost(
        currentTheme.category,
        undefined,
        'all',
        'ar.alafasy'
      );

      if (!selectedItem) {
        throw new Error('Aucun contenu inédit trouvé pour ce créneau.');
      }

      const referenceText = `${selectedItem.source.bookOrSurah} — ${selectedItem.source.numberOrAyah}`;
      if (onProgress) onProgress(`2/4 Rendu graphique HD 9:16 pour "${selectedItem.source.bookOrSurah}"...`);

      // 2. Render Luxury 4K Quote Card Canvas (Photographic background + Calligraphy)
      const cardUrl = await IslamicContentService.renderQuoteCardCanvas(
        selectedItem,
        '9:16',
        'all',
        selectedItem.visualTheme || 'golden_night'
      );

      // 3. Audio & Video Reel Generation
      let publicVideoUrl = '';
      const audioUrl = selectedItem.reciterAudio?.audioUrl || 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3';

      if (onProgress) onProgress('3/4 Encodage vidéo MP4 H.264 & Upload Cloudinary...');

      const videoBlob = await VideoGenerator.generateQuoteVideoMp4(cardUrl, audioUrl);
      publicVideoUrl = await VideoGenerator.uploadVideoToCDN(videoBlob);

      if (onProgress) onProgress('4/4 Envoi vers Instagram (@kaelarislamic), TikTok (@mdou.g) & YouTube Shorts...');

      // 4. Dispatch to Buffer (All 3 platforms)
      const scheduled = IslamicContentService.convertToScheduledPost(
        selectedItem,
        'all',
        cardUrl
      );
      scheduled.platforms = ['instagram', 'tiktok', 'youtube'];
      scheduled.title = `${selectedItem.source.bookOrSurah} — ${selectedItem.source.numberOrAyah} 🕋 #Shorts`;
      scheduled.media = {
        id: `med-auto-${Date.now()}`,
        type: 'video',
        url: publicVideoUrl,
        aspectRatio: '9:16',
        durationSeconds: Math.ceil(selectedItem.reciterAudio?.durationSeconds || 15),
        createdAt: new Date().toISOString(),
        engine: 'autopilot-reel'
      };

      await SocialPublisher.publishNow(scheduled);

      // 5. Record to Library (Zero Duplicate Guarantee)
      IslamicLibraryService.recordPublication(
        selectedItem,
        cardUrl,
        publicVideoUrl,
        'reel',
        ['instagram', 'tiktok', 'youtube']
      );

      // 5b. Send Discord Notification
      SocialPublisher.sendDiscordNotification({
        title: `Auto-Pilot 6h : ${currentTheme.title}`,
        description: `${selectedItem.arabicText}\n\n*${selectedItem.translationFr}*\n\n📍 ${selectedItem.source.bookOrSurah} — ${selectedItem.source.numberOrAyah}`,
        videoUrl: publicVideoUrl,
        platforms: ['instagram', 'tiktok', 'youtube']
      });

      // 6. Update config & advance theme index to next in line
      const config = this.getConfig();
      config.currentThemeIndex = ((config.currentThemeIndex || 0) + 1) % AUTOPILOT_THEMES.length;
      const nextRun = new Date(Date.now() + config.intervalHours * 3600 * 1000).toISOString();
      
      log.status = 'success';
      log.message = `Reel publié avec succès sur Instagram, TikTok & YouTube Shorts : "${selectedItem.source.bookOrSurah}"`;
      log.videoUrl = publicVideoUrl;
      log.cardUrl = cardUrl;

      config.lastRunAt = startTime;
      config.nextRunAt = nextRun;
      config.logs = [log, ...(config.logs || [])].slice(0, 50);
      this.saveConfig(config);

      return { success: true, message: log.message, log };
    } catch (err: any) {
      console.error('AutoPilot cycle failed:', err);
      log.status = 'failed';
      log.message = `Échec Auto-Pilot: ${err.message || 'Erreur inconnue'}`;

      const config = this.getConfig();

      // Advance theme index even on error to guarantee rotation never loops on the same theme!
      config.currentThemeIndex = ((config.currentThemeIndex || 0) + 1) % AUTOPILOT_THEMES.length;

      // Safety Backoff: NEVER leave nextRunAt in the past, preventing runaway 15s retry loops!
      const currentRateLimit = getBufferRateLimitStatus();
      let cooldownMs = 60 * 60 * 1000; // minimum 1 hour backoff on general failure
      if (currentRateLimit.isLimited) {
        cooldownMs = Math.max(currentRateLimit.remainingMs, 2 * 3600 * 1000);
        log.message += ` (Pause de sécurité Buffer: ${currentRateLimit.message})`;
      }

      config.nextRunAt = new Date(Date.now() + cooldownMs).toISOString();
      config.logs = [log, ...(config.logs || [])].slice(0, 50);
      this.saveConfig(config);

      return { success: false, message: log.message, log };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Helper to render luxury card image (delegates to the official photographic/calligraphy canvas engine)
   */
  private async renderCardImage(item: any, referenceText: string): Promise<string> {
    return IslamicContentService.renderQuoteCardCanvas(
      item,
      '9:16',
      'all',
      item.visualTheme || 'golden_night'
    );
  }

  private initTimer(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(async () => {
      const config = this.getConfig();
      if (!config.isEnabled || !config.nextRunAt) return;

      // Skip tick if Buffer API is in rate-limit cooldown
      const rateLimit = getBufferRateLimitStatus();
      if (rateLimit.isLimited) return;

      const now = Date.now();
      const nextRun = new Date(config.nextRunAt).getTime();

      if (now >= nextRun && !this.isProcessing) {
        console.log('⏰ AutoPilot trigger time reached. Executing cycle...');
        await this.executeCycle();
      }
    }, 60000); // check once every 60s
  }
}

export const AutoPilotService = new AutoPilotServiceClass();
