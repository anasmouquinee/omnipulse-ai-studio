/**
 * OmniPulse AI - Autonomous Auto-Pilot Service
 * Automates content generation, HD rendering, MP4 video encoding, Cloudinary hosting,
 * and Buffer multi-platform publishing every 6 hours with intelligent theme rotation.
 */

import { IslamicContentService } from './islamicContentService';
import { IslamicLibraryService } from './islamicLibraryService';
import { VideoGenerator } from './videoGenerator';
import { SocialPublisher } from './socialPublisher';
import type { IslamicQuoteItem, IslamicThemeCategory } from '../types/islamic';

const AUTOPILOT_STORAGE_KEY = 'omnipulse_autopilot_config';

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
  logs: AutoPilotLog[];
}

const DEFAULT_CONFIG: AutoPilotConfig = {
  isEnabled: true,
  intervalHours: 6,
  lastRunAt: null,
  nextRunAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
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
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
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
   * Determine theme based on current time & day
   */
  public getNextRecommendedTheme(): { category: IslamicThemeCategory; title: string } {
    const now = new Date();
    const day = now.getDay(); // 5 = Friday
    const hour = now.getHours();

    if (day === 5) {
      return {
        category: 'jumuah',
        title: "Spécial Jumu'ah & Sourate Al-Kahf (Vendredi Béni)"
      };
    }

    if (hour >= 4 && hour < 10) {
      return {
        category: 'adhkar',
        title: 'Invocations & Adhkar du Matin (Protection & Barakah)'
      };
    } else if (hour >= 10 && hour < 16) {
      return {
        category: 'quran_audio',
        title: 'Noble Coran — Versets & Récitation Audio Apaisante'
      };
    } else if (hour >= 16 && hour < 21) {
      return {
        category: 'hadith_sahih',
        title: 'Hadith Sahih Authentique & Sagesse Prophétique'
      };
    } else {
      return {
        category: 'tahajjud',
        title: 'Tahajjud & Prière de Nuit (Dernier Tiers de la Nuit)'
      };
    }
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
          type: 'quran',
          status: 'failed',
          message: 'Cycle déjà en cours.'
        }
      };
    }

    this.isProcessing = true;
    const { category, title: themeTitle } = this.getNextRecommendedTheme();
    const startTime = new Date().toISOString();

    const log: AutoPilotLog = {
      id: `log-${Date.now()}`,
      timestamp: startTime,
      themeTitle,
      type: category,
      status: 'running',
      message: 'Initialisation du cycle...'
    };

    try {
      if (onProgress) onProgress('1/4 Sélection d’un contenu islamique inédit...');

      // 1. Fetch fresh items excluding already published keys
      const candidateItems = await IslamicContentService.generateSmartCuratedContent(
        category,
        undefined,
        'trilingual'
      );

      // Find first item that is NOT a duplicate
      let selectedItem: IslamicQuoteItem | null = null;
      for (const item of candidateItems) {
        const check = IslamicLibraryService.checkDuplicate(item);
        if (!check.isDuplicate) {
          selectedItem = item;
          break;
        }
      }

      if (!selectedItem && candidateItems.length > 0) {
        selectedItem = candidateItems[0];
      }

      if (!selectedItem) {
        throw new Error('Aucun contenu inédit trouvé pour ce créneau.');
      }

      if (onProgress) onProgress(`2/4 Rendu graphique HD 9:16 pour "${selectedItem.themeTitle}"...`);

      // 2. Render Card Canvas
      const cardUrl = await this.renderCardImage(selectedItem);

      // 3. Audio & Video Reel Generation
      let publicVideoUrl = '';
      const audioUrl = selectedItem.reciterAudio?.audioUrl || 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3';

      if (onProgress) onProgress('3/4 Encodage vidéo MP4 H.264 & Upload Cloudinary...');

      const videoBlob = await VideoGenerator.generateQuoteVideoMp4(cardUrl, audioUrl);
      publicVideoUrl = await VideoGenerator.uploadVideoToCDN(videoBlob);

      if (onProgress) onProgress('4/4 Envoi vers Instagram (@kaelarislamic) & TikTok (@mdou.g)...');

      // 4. Dispatch to Buffer
      const scheduled = IslamicContentService.convertToScheduledPost(
        selectedItem,
        'fr',
        cardUrl
      );
      scheduled.platforms = ['instagram', 'tiktok'];
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

      // 5. Record to Library
      IslamicLibraryService.recordPublication(
        selectedItem,
        cardUrl,
        publicVideoUrl,
        'reel',
        ['instagram', 'tiktok']
      );

      // 6. Update config
      const config = this.getConfig();
      const nextRun = new Date(Date.now() + config.intervalHours * 3600 * 1000).toISOString();
      
      log.status = 'success';
      log.message = `Reel publié avec succès sur Instagram & TikTok : "${selectedItem.themeTitle}"`;
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
      config.logs = [log, ...(config.logs || [])].slice(0, 50);
      this.saveConfig(config);

      return { success: false, message: log.message, log };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Helper to render card image on offscreen canvas
   */
  private async renderCardImage(item: IslamicQuoteItem): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas non disponible');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative Islamic border
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 960, 1800);

    ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(75, 75, 930, 1770);

    // Bismillah
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 38px Amiri, "Traditional Arabic", serif';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 540, 240);

    // Arabic Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Amiri, "Traditional Arabic", serif';
    this.wrapText(ctx, item.arabicText, 540, 420, 840, 75);

    // French Translation
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
    this.wrapText(ctx, item.translationFr, 540, 980, 840, 52);

    // English Translation
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 28px "Plus Jakarta Sans", sans-serif';
    this.wrapText(ctx, item.translationEn, 540, 1380, 840, 46);

    // Reference
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`📍 ${item.referenceText}`, 540, 1680);

    // Footer Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('@kaelarislamic • @mdou.g', 540, 1780);

    return canvas.toDataURL('image/png', 0.95);
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  private initTimer(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      const config = this.getConfig();
      if (!config.isEnabled || this.isProcessing) return;

      const now = Date.now();
      const nextRun = config.nextRunAt ? new Date(config.nextRunAt).getTime() : 0;

      if (now >= nextRun) {
        console.log('⏰ AutoPilot trigger: Scheduled time reached, executing autonomous cycle...');
        this.executeCycle();
      }
    }, 60000); // check every minute
  }
}

export const AutoPilotService = new AutoPilotServiceClass();
