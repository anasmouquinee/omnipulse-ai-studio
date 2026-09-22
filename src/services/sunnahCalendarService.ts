/**
 * Kaelar Islamic AI Studio - Sunnah & Hijri Calendar Intelligence Service
 * Provides astronomical Hijri calculations, White Days (Ayyam al-Beed), Monday/Thursday Sunnah,
 * Friday Sa'at al-Istijabah, and Viral Hook variations.
 */

export interface SunnahEvent {
  id: string;
  title: string;
  badge: string;
  description: string;
  actionText: string;
  recommendedCategory: 'quran_verse' | 'sahih_hadith' | 'authentic_dua' | 'adhkar_routine' | 'tahajjud_motivation' | 'islamic_reminder' | 'jumua_special';
  defaultHook: string;
  isActiveNow: boolean;
  priority: number;
}

export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameAr: string;
  monthNameFr: string;
  year: number;
  formattedStr: string;
  isWhiteDay: boolean; // 13, 14, or 15 of lunar month
}

export const VIRAL_ISLAMIC_HOOKS = [
  { id: 'hook-30s', text: 'نصف دقيقة فقط 🤍', description: 'Routine d’adhkar sans friction (Meilleur taux de complétion)' },
  { id: 'hook-scroll', text: 'لا تمر دون أن تستغفر ✨', description: 'Accroche anti-scroll à forte rétention (Curiosité)' },
  { id: 'hook-night', text: 'رسالة إلى قلبك الليلة 🌙', description: 'Idéal pour Tahajjud et fin de soirée (Émotion)' },
  { id: 'hook-sins', text: '30 ثانية تمحو بها ذنوبك 🤍', description: 'Axé sur la récompense et les mérites' },
  { id: 'hook-peace', text: 'خُذ استراحة مع ذكر الله 🕊️', description: 'Apaisement et sérénité mentale' },
  { id: 'hook-treasure', text: 'كنز عظيم من كنوز الجنة 💎', description: 'Hadiths et paroles prophétiques d’or' },
  { id: 'hook-reminder', text: '﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾', description: 'Verset de rappel solennel' }
];

const HIJRI_MONTHS = [
  { ar: 'المحرّم', fr: 'Muharram' },
  { ar: 'صفر', fr: 'Safar' },
  { ar: 'ربيع الأول', fr: 'Rabi al-Awwal' },
  { ar: 'ربيع الثاني', fr: 'Rabi ath-Thani' },
  { ar: 'جمادى الأولى', fr: 'Jumada al-Ula' },
  { ar: 'جمادى الآخرة', fr: 'Jumada al-Akhirah' },
  { ar: 'رجب', fr: 'Rajab' },
  { ar: 'شعبان', fr: 'Sha\'ban' },
  { ar: 'رمضان', fr: 'Ramadan' },
  { ar: 'شوّال', fr: 'Shawwal' },
  { ar: 'ذو القعدة', fr: 'Dhu al-Qi\'dah' },
  { ar: 'ذو الحجة', fr: 'Dhu al-Hijjah' }
];

export const SunnahCalendarService = {
  /**
   * Computes precise Hijri date using native Intl formatting
   */
  getHijriDate(date: Date = new Date()): HijriDateInfo {
    try {
      const formatter = new Intl.DateTimeFormat('fr-TN-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(date);
      let day = 1;
      let month = 1;
      let year = 1447;

      for (const p of parts) {
        if (p.type === 'day') day = parseInt(p.value, 10) || 1;
        if (p.type === 'month') month = parseInt(p.value, 10) || 1;
        if (p.type === 'year') year = parseInt(p.value, 10) || 1447;
      }

      // Safe clamp
      month = Math.max(1, Math.min(12, month));
      const monthObj = HIJRI_MONTHS[month - 1];
      const isWhiteDay = day === 13 || day === 14 || day === 15;

      return {
        day,
        month,
        monthNameAr: monthObj.ar,
        monthNameFr: monthObj.fr,
        year,
        formattedStr: `${day} ${monthObj.fr} ${year} هـ (${day} ${monthObj.ar})`,
        isWhiteDay
      };
    } catch {
      // Fallback approximation
      return {
        day: 15,
        month: 9,
        monthNameAr: 'رمضان',
        monthNameFr: 'Ramadan',
        year: 1447,
        formattedStr: '15 Ramadan 1447 هـ',
        isWhiteDay: true
      };
    }
  },

  /**
   * Evaluates all Sunnah opportunities active for today and current hour
   */
  getActiveSunnahEvents(date: Date = new Date()): SunnahEvent[] {
    const day = date.getDay(); // 0 = Sun, 1 = Mon, 4 = Thu, 5 = Fri
    const hour = date.getHours();
    const hijri = this.getHijriDate(date);
    const events: SunnahEvent[] = [];

    // 1. Spécial Jumu'ah (Vendredi)
    if (day === 5 || (day === 4 && hour >= 17)) {
      const isIstijabah = day === 5 && hour >= 15 && hour <= 19;
      events.push({
        id: 'evt-jumuah',
        title: isIstijabah ? "Heure Bénie de l’Exaucement (ساعة الاستجابة)" : "Vendredi Béni — Sourate Al-Kahf & Salawat",
        badge: isIstijabah ? '✨ Exaucement Immédiat' : '🕌 Jumu’ah',
        description: isIstijabah 
          ? "Le Prophète ﷺ a mentionné une heure le vendredi avant le coucher du soleil où chaque invocation faite par le croyant est exaucée."
          : "Multiplier la prière sur le Prophète ﷺ et lire Sourate Al-Kahf pour illuminer la semaine.",
        actionText: isIstijabah ? "Générer Du'a d'Exaucement" : "Générer Rappel Al-Kahf",
        recommendedCategory: isIstijabah ? 'authentic_dua' : 'jumua_special',
        defaultHook: isIstijabah ? 'لا تفوّت هذه الساعة المباركة 🤲' : 'جمعة مباركة مع سورة الكهف 🕌',
        isActiveNow: true,
        priority: isIstijabah ? 10 : 8
      });
    }

    // 2. White Days (الأيام البيض)
    if (hijri.isWhiteDay) {
      events.push({
        id: 'evt-whitedays',
        title: `Jour Blanc (${hijri.day} ${hijri.monthNameFr}) — Jeûne Sunnah`,
        badge: '🌕 الأيام البيض',
        description: `Le jeûne des 13, 14 et 15 de chaque mois lunaire équivaut selon le Prophète ﷺ au jeûne d'une année entière.`,
        actionText: "Générer Rappel Jours Blancs",
        recommendedCategory: 'islamic_reminder',
        defaultHook: `أجر صيام الدهر 🌕 (${hijri.day} ${hijri.monthNameAr})`,
        isActiveNow: true,
        priority: 9
      });
    }

    // 3. Monday / Thursday Sunnah Fasting
    if (day === 1 || day === 4) {
      const dayName = day === 1 ? 'Lundi' : 'Jeudi';
      events.push({
        id: `evt-fasting-${day}`,
        title: `Sunnah du ${dayName} — Présentation des Actions`,
        badge: `🌿 Jeûne du ${dayName}`,
        description: `Les actions des serviteurs sont présentées à Allah le lundi et le jeudi. Le Prophète ﷺ aimait que ses actions soient présentées alors qu'il jeûnait.`,
        actionText: `Générer Rappel du ${dayName}`,
        recommendedCategory: 'sahih_hadith',
        defaultHook: `سنة صيام ${day === 1 ? 'الاثنين' : 'الخميس'} 🌿`,
        isActiveNow: true,
        priority: 7
      });
    }

    // 4. Tahajjud / Qiyam al-Layl Window (22h - 04h)
    if (hour >= 22 || hour <= 4) {
      events.push({
        id: 'evt-tahajjud',
        title: "Dernier Tiers de la Nuit (Prière de Nuit & Istighfar)",
        badge: '🌙 Qiyam al-Layl',
        description: "Notre Seigneur descend au ciel de la terre et dit : « Qui M'invoque pour que Je l'exauce ? Qui Me demande pour que Je lui donne ? »",
        actionText: "Générer Motivation Tahajjud",
        recommendedCategory: 'tahajjud_motivation',
        defaultHook: 'رسالة إلى قلبك الليلة 🌙',
        isActiveNow: true,
        priority: 6
      });
    }

    // 5. Morning / Evening Routine Adhkar
    events.push({
      id: 'evt-adhkar-routine',
      title: "Routine Adhkar 30s (Tranquillité du Cœur)",
      badge: '🤍 نصف دقيقة',
      description: "Checklist minimaliste d'évocations : Subhanallah, Alhamdulillah, Astaghfirullah pour apaiser l'esprit.",
      actionText: "Générer Routine Adhkar",
      recommendedCategory: 'adhkar_routine',
      defaultHook: 'نصف دقيقة فقط 🤍',
      isActiveNow: true,
      priority: 5
    });

    return events.sort((a, b) => b.priority - a.priority);
  }
};
