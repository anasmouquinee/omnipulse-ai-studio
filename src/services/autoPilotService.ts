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
const AUTOPILOT_LOCK_KEY = 'omnipulse_autopilot_exec_lock';

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
    // Start background tick monitor safely in browser
    if (typeof window !== 'undefined') {
      this.initTimer();
    }
  }

  /**
   * Acquire a cross-tab execution lock in localStorage
   * Prevents multiple open tabs from triggering duplicate publications simultaneously.
   */
  private acquireLock(): boolean {
    try {
      const lock = localStorage.getItem(AUTOPILOT_LOCK_KEY);
      if (lock) {
        const timestamp = parseInt(lock, 10);
        // Active lease valid for 8 minutes max (in case of an unexpected crash)
        if (Date.now() - timestamp < 8 * 60 * 1000) {
          return false;
        }
      }
      localStorage.setItem(AUTOPILOT_LOCK_KEY, Date.now().toString());
      return true;
    } catch {
      return true;
    }
  }

  /**
   * Release the cross-tab execution lock
   */
  private releaseLock(): void {
    try {
      localStorage.removeItem(AUTOPILOT_LOCK_KEY);
    } catch {}
  }

  public getConfig(): AutoPilotConfig {
    try {
      const data = localStorage.getItem(AUTOPILOT_STORAGE_KEY);
      if (!data) return DEFAULT_CONFIG;
      const parsed = JSON.parse(data);

      // Strict validation of intervalHours: must be a finite number >= 1
      const intervalHours = (typeof parsed.intervalHours === 'number' && parsed.intervalHours >= 1 && !isNaN(parsed.intervalHours))
        ? parsed.intervalHours
        : 6;

      // Strict validation of nextRunAt: must be a valid ISO date
      let nextRunAt = parsed.nextRunAt;
      if (!nextRunAt || isNaN(new Date(nextRunAt).getTime())) {
        nextRunAt = new Date(Date.now() + intervalHours * 3600 * 1000).toISOString();
      }

      return { 
        ...DEFAULT_CONFIG, 
        ...parsed,
        intervalHours,
        nextRunAt,
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
   * Reset countdown timer to full interval (default: 6 hours from now)
   */
  public resetTimer(hours: number = 6): void {
    const config = this.getConfig();
    config.intervalHours = Math.max(hours, 1);
    config.lastRunAt = new Date().toISOString();
    config.nextRunAt = new Date(Date.now() + config.intervalHours * 3600 * 1000).toISOString();
    this.saveConfig(config);
    this.releaseLock();
    console.log(`⏱️ AutoPilot timer reset: next publication in ${config.intervalHours} hours.`);
  }

  /**
   * Run one complete autonomous publication cycle
   * Protected with anti-berserk cooldowns, cross-tab locks, and immediate pre-scheduling.
   */
  public async executeCycle(
    onProgress?: (step: string) => void,
    isAutomatic: boolean = false
  ): Promise<{ success: boolean; message: string; log: AutoPilotLog }> {
    const currentTheme = this.getNextRecommendedTheme();

    // 1. In-memory concurrency guard
    if (this.isProcessing) {
      return {
        success: false,
        message: 'Un cycle de publication est déjà en cours dans cette session.',
        log: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          themeTitle: currentTheme.title,
          type: currentTheme.category,
          status: 'failed',
          message: 'Cycle déjà en cours.'
        }
      };
    }

    // 2. Cross-tab concurrency guard
    if (!this.acquireLock()) {
      return {
        success: false,
        message: 'Un cycle est déjà en cours d’exécution dans un autre onglet.',
        log: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          themeTitle: currentTheme.title,
          type: currentTheme.category,
          status: 'failed',
          message: 'Verrou inter-onglets actif.'
        }
      };
    }

    // 3. Safety Guard: Check if Buffer is in 24h rate-limit cooldown
    const rateLimit = getBufferRateLimitStatus();
    if (rateLimit.isLimited) {
      this.releaseLock();
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

    // 4. Strict Minimum Cooldown Guard between automatic publications (At least 45 minutes)
    const config = this.getConfig();
    const now = Date.now();
    const lastRunTime = config.lastRunAt ? new Date(config.lastRunAt).getTime() : 0;
    const minGapMs = Math.max(config.intervalHours * 3600 * 1000, 45 * 60 * 1000);

    if (isAutomatic && lastRunTime > 0 && (now - lastRunTime) < minGapMs) {
      const waitMin = Math.ceil((minGapMs - (now - lastRunTime)) / 60000);
      console.warn(`🛡️ Anti-runaway guard: le dernier cycle a eu lieu il y a ${Math.round((now - lastRunTime) / 60000)}m. Repos obligatoire de encore ${waitMin}m.`);
      config.nextRunAt = new Date(lastRunTime + minGapMs).toISOString();
      this.saveConfig(config);
      this.releaseLock();
      return {
        success: false,
        message: `Pause de sécurité active. Prochain créneau dans ${waitMin} min.`,
        log: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          themeTitle: currentTheme.title,
          type: currentTheme.category,
          status: 'failed',
          message: `Délai de temporisation non écoulé (${waitMin}m restantes).`
        }
      };
    }

    this.isProcessing = true;
    const startTime = new Date().toISOString();

    // 5. CRITICAL: Immediately pre-allocate nextRunAt 6 hours in the future in localStorage
    // This prevents ANY other tick, reloaded tab, or subscriber from triggering during generation!
    config.nextRunAt = new Date(now + config.intervalHours * 3600 * 1000).toISOString();
    this.saveConfig(config);

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

      if (onProgress) onProgress('4/4 Envoi vers Instagram (@kae.islamic), TikTok (@kaelar.islamic) & YouTube Shorts...');

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
      const finalConfig = this.getConfig();
      finalConfig.currentThemeIndex = ((finalConfig.currentThemeIndex || 0) + 1) % AUTOPILOT_THEMES.length;
      finalConfig.lastRunAt = startTime;
      finalConfig.nextRunAt = new Date(Date.now() + finalConfig.intervalHours * 3600 * 1000).toISOString();
      
      log.status = 'success';
      log.message = `Reel publié avec succès sur Instagram & TikTok : "${selectedItem.source.bookOrSurah}"`;
      log.videoUrl = publicVideoUrl;
      log.cardUrl = cardUrl;

      finalConfig.logs = [log, ...(finalConfig.logs || [])].slice(0, 50);
      this.saveConfig(finalConfig);

      return { success: true, message: log.message, log };
    } catch (err: any) {
      console.error('AutoPilot cycle failed:', err);
      log.status = 'failed';
      log.message = `Échec Auto-Pilot: ${err.message || 'Erreur inconnue'}`;

      const errorConfig = this.getConfig();
      errorConfig.currentThemeIndex = ((errorConfig.currentThemeIndex || 0) + 1) % AUTOPILOT_THEMES.length;

      // Safety Backoff: NEVER leave nextRunAt in the past
      const currentRateLimit = getBufferRateLimitStatus();
      let cooldownMs = 60 * 60 * 1000; // minimum 1 hour backoff on failure
      if (currentRateLimit.isLimited) {
        cooldownMs = Math.max(currentRateLimit.remainingMs, 2 * 3600 * 1000);
        log.message += ` (Pause de sécurité Buffer: ${currentRateLimit.message})`;
      }

      errorConfig.nextRunAt = new Date(Date.now() + cooldownMs).toISOString();
      errorConfig.logs = [log, ...(errorConfig.logs || [])].slice(0, 50);
      this.saveConfig(errorConfig);

      return { success: false, message: log.message, log };
    } finally {
      this.isProcessing = false;
      this.releaseLock();
    }
  }

  /**
   * Helper to render luxury card image
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
      const lastRunTime = config.lastRunAt ? new Date(config.lastRunAt).getTime() : 0;
      const minGapMs = Math.max(config.intervalHours * 3600 * 1000, 45 * 60 * 1000);

      // If last run was too recent, enforce cooldown and shift nextRunAt forward
      if (lastRunTime > 0 && (now - lastRunTime) < minGapMs) {
        if (nextRun <= now) {
          config.nextRunAt = new Date(lastRunTime + minGapMs).toISOString();
          this.saveConfig(config);
        }
        return;
      }

      // If scheduled time has arrived and no cycle is processing
      if (now >= nextRun && !this.isProcessing) {
        console.log('⏰ AutoPilot trigger time reached. Executing cycle with cooldown locks...');
        await this.executeCycle(undefined, true);
      }
    }, 60000); // check once every 60s
  }
}

export const AutoPilotService = new AutoPilotServiceClass();
