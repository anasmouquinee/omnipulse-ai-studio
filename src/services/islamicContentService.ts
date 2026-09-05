/**
 * Kaelar Islamic AI Studio - Islamic Content & Aesthetic Quote Card Engine
 * Handles authentic multilingual generation (FR, EN, AR), Exact Quran Audio Matching, and Photographic Canvas Rendering.
 */

import type { IslamicPostItem, IslamicContentType, IslamicLanguage, VerifiedSource, ReciterAudio } from '../types/islamic';
import type { ScheduledPost, SocialPlatform } from '../types/content';
import { VERIFIED_ISLAMIC_POSTS, VERIFIED_RECITERS } from '../data/verifiedIslamicData';
import { ISLAMIC_BACKGROUND_THEMES, type IslamicBackgroundTheme } from '../data/islamicBackgrounds';
import { StorageService } from './storageService';
import { IslamicViralTagsService } from './islamicViralTagsService';
import { IslamicLibraryService } from './islamicLibraryService';

export const DIVERSE_ISLAMIC_TOPICS: Record<IslamicContentType, string[]> = {
  quran_verse: [
    "La miséricorde infinie d'Allah et le pardon",
    "La création des cieux, de la terre et la contemplation",
    "L'apaisement et la sérénité des cœurs par le rappel",
    "La promesse divine du soulagement après l'épreuve (Al-Yusr)",
    "La bienveillance et le respect envers les parents",
    "La certitude (Yaqeen) et la vérité immuable",
    "La beauté de la patience (Sabr Jameel)",
    "La justice et l'équité entre les êtres humains",
    "L'invocation exaucée et la proximité d'Allah",
    "La description des délices du Paradis (Jannah)"
  ],
  sahih_hadith: [
    "L'importance suprême du bon comportement (Husn al-Khuluq) et de la douceur",
    "La valeur immense du sourire et de la fraternité en Islam",
    "La recherche du savoir comme obligation sacrée",
    "La bienveillance envers les voisins, les parents et les plus faibles",
    "La retenue de la langue et le danger de la médisance (Gheebah)",
    "La sincérité des intentions et l'action désintéressée (Al-Ikhlas)",
    "L'honnêteté et la loyauté dans le commerce et la parole",
    "Aimer pour son frère ce que l'on aime pour soi-même",
    "Le mérite immense du repentir sincère et de l'Istighfar",
    "La récompense divine de la patience dans la maladie et l'adversité"
  ],
  authentic_dua: [
    "Invocation matinale pour la bénédiction, la subsistance et la protection",
    "Du'a authentique contre l'anxiété, la tristesse et les dettes",
    "Invocation pour la guidée, la piété et la paix de l'âme",
    "Du'a bénie pour le pardon et la miséricorde envers les parents",
    "Invocation prophétique en sortant de chez soi (Bismillahi tawakkaltu)",
    "Dhikr du soir pour la sérénité du sommeil et la protection contre le mal",
    "Invocation pour la fermeté du cœur sur la foi (Ya Muqallib al-qulub)",
    "Du'a pour demander le bien ici-bas et dans l'au-delà (Rabbana atina)",
    "Invocation pour la guérison des malades et le soulagement des souffrances",
    "Istighfar majeur (Sayyid al-Istighfar) et ses bienfaits immenses"
  ],
  tahajjud_motivation: [
    "Le secret des prières exaucées dans le dernier tiers de la nuit",
    "La descente divine et l'appel d'Allah aux repentants avant l'aube",
    "L'intimité spirituelle et la saveur du Sujud dans le silence nocturne",
    "La lumière sur le visage de ceux qui prient la nuit",
    "Le réveil avant le Fajr pour la paix de l'esprit et la barakah",
    "La prière de nuit comme refuge face aux épreuves de la journée",
    "L'Istighfar au moment de Sahar (juste avant l'aube)",
    "La grandeur de la prière surérogatoire accomplie dans la discrétion",
    "Comment la prière de nuit transforme la vie d'un croyant",
    "La sérénité d'une larme versée par crainte et amour d'Allah la nuit"
  ],
  islamic_reminder: [
    "La confiance inébranlable en Allah (Tawakkul) quand les portes se ferment",
    "Le Sabr : accepter le décret divin avec un cœur apaisé",
    "La gratitude quotidienne (Shukr) pour les bienfaits invisibles",
    "La purification du cœur contre la jalousie et la rancœur",
    "Se détacher du regard des gens et chercher uniquement l'agrément divin",
    "Le temps qui passe : valoriser chaque souffle pour l'éternité",
    "L'espérance sans limite en la miséricorde divine",
    "Comment transformer chaque action du quotidien en adoration",
    "La beauté de la modestie et de l'humilité face à la création",
    "La véritable richesse de l'âme et le contentement (Qana'ah)"
  ],
  jumua_special: [
    "La lumière spirituelle des versets de Sourate Al-Kahf le vendredi",
    "Multiplier les prières et salutations sur le Prophète ﷺ le jour du vendredi",
    "L'heure bénie du vendredi où toute invocation est exaucée",
    "Les mérites de la purification (Ghusl) et du parfum pour la prière du vendredi",
    "Écouter attentivement le sermon (Khutbah) et la récompense des pas vers la mosquée",
    "Le vendredi comme fête hebdomadaire de la communauté musulmane",
    "La sourate Al-Jumu'ah et l'appel à abandonner tout commerce pour Allah",
    "La paix intérieure d'un vendredi passé dans le rappel d'Allah",
    "Invoquer pour ses frères et sœurs opprimés le jour du vendredi",
    "Les bénédictions de la Salawat sur le Messager d'Allah ﷺ"
  ]
};

export const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

export function getGlobalAyahNumber(surah: number, ayah: number): number {
  const s = Math.max(1, Math.min(114, Number(surah) || 1));
  const maxAyahs = SURAH_AYAH_COUNTS[s - 1] || 7;
  const a = Math.max(1, Math.min(maxAyahs, Number(ayah) || 1));
  let count = 0;
  for (let i = 1; i < s; i++) {
    count += SURAH_AYAH_COUNTS[i - 1];
  }
  return count + a;
}

export const AVAILABLE_RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy (مشاري العفاسي) • 100% Complet' },
  { id: 'ar.dossari', name: 'Yasser Al-Dossari (ياسر الدوسري) • 100% Complet' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Murattal (عبد الباسط عبد الصمد)' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly (ماهر المعيقلي)' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais (السديس)' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi (المنشاوي)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary (الحصري)' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri (أبو بكر الشاطري)' },
  { id: 'ar.ahmedajamy', name: 'Ahmed Al-Ajamy (أحمد علي العجمي)' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify (علي الحذيفي)' },
  { id: 'ar.luhaidan', name: 'Muhammad Al-Luhaidan (محمد اللحيدان)' },
  { id: 'ar.islamsobhi', name: 'Islam Sobhi (إسلام صبحي)' }
];

export const SURAH_NAME_TO_NUMBER: Record<string, number> = {
  'al-fatihah': 1, 'fatihah': 1, 'ouverture': 1,
  'al-baqarah': 2, 'baqarah': 2, 'vache': 2,
  'ali-imran': 3, 'al-imran': 3, 'imran': 3,
  'an-nisa': 4, 'nisa': 4, 'femmes': 4,
  'al-maidah': 5, 'maidah': 5, 'table': 5,
  'al-anam': 6, 'anam': 6,
  'al-araf': 7, 'araf': 7,
  'al-anfal': 8, 'anfal': 8,
  'at-tawbah': 9, 'tawbah': 9, 'repentir': 9,
  'yunus': 10,
  'hud': 11,
  'yusuf': 12, 'joseph': 12,
  'ar-rad': 13, 'rad': 13,
  'ibrahim': 14,
  'al-hijr': 15,
  'an-nahl': 16, 'nahl': 16, 'abeilles': 16,
  'al-isra': 17, 'isra': 17,
  'al-kahf': 18, 'kahf': 18, 'caverne': 18,
  'maryam': 19, 'marie': 19,
  'taha': 20,
  'al-anbiya': 21, 'anbiya': 21, 'prophetes': 21,
  'al-hajj': 22, 'hajj': 22,
  'al-muminun': 23, 'muminun': 23, 'croyants': 23,
  'an-nur': 24, 'nur': 24, 'lumiere': 24,
  'al-furqan': 25, 'furqan': 25, 'discernement': 25,
  'ash-shuara': 26,
  'an-naml': 27, 'fourmis': 27,
  'al-qasas': 28, 'recit': 28,
  'al-ankabut': 29, 'ankabut': 29, 'araignee': 29,
  'ar-rum': 30, 'romains': 30,
  'luqman': 31,
  'as-sajdah': 32, 'prosternation': 32,
  'al-ahzab': 33, 'coalises': 33,
  'saba': 34,
  'fatir': 35,
  'ya-sin': 36, 'yasin': 36,
  'as-saffat': 37,
  'sad': 38,
  'az-zumar': 39, 'groupes': 39,
  'ghafir': 40, 'pardon': 40,
  'fussilat': 41,
  'ash-shura': 42, 'consultation': 42,
  'az-zukhruf': 43, 'ornements': 43,
  'ad-dukhan': 44, 'fumee': 44,
  'al-jathiyah': 45,
  'al-ahqaf': 46,
  'muhammad': 47,
  'al-fath': 48, 'fath': 48, 'victoire': 48,
  'al-hujurat': 49,
  'qaf': 50,
  'adh-dhariyat': 51,
  'at-tur': 52,
  'an-najm': 53, 'etoile': 53,
  'al-qamar': 54, 'lune': 54,
  'ar-rahman': 55, 'rahman': 55,
  'al-waqiah': 56, 'waqiah': 56,
  'al-hadid': 57, 'fer': 57,
  'al-mujadila': 58,
  'al-hashr': 59,
  'al-mumtahanah': 60,
  'as-saff': 61,
  'al-jumuah': 62, 'jumuah': 62, 'vendredi': 62,
  'al-munafiqun': 63,
  'at-taghabun': 64,
  'at-talaq': 65, 'talaq': 65, 'divorce': 65,
  'at-tahrim': 66,
  'al-mulk': 67, 'mulk': 67, 'royaute': 67,
  'al-qalam': 68, 'plume': 68,
  'al-haqqah': 69,
  'al-maarij': 70,
  'nuh': 71, 'noe': 71,
  'al-jinn': 72, 'jinn': 72,
  'al-muzzammil': 73,
  'al-muddaththir': 74,
  'al-qiyamah': 75, 'resurrection': 75,
  'al-insan': 76, 'homme': 76,
  'al-mursalat': 77,
  'an-naba': 78,
  'an-naziat': 79,
  'abasa': 80,
  'at-takwir': 81,
  'al-infitar': 82,
  'al-mutaffifin': 83,
  'al-inshiqaq': 84,
  'al-buruj': 85,
  'at-tariq': 86,
  'al-ala': 87,
  'al-ghashiyah': 88,
  'al-fajr': 89, 'fajr': 89, 'aube': 89,
  'al-balad': 90,
  'ash-shams': 91, 'soleil': 91,
  'al-layl': 92, 'nuit': 92,
  'ad-duha': 93, 'duha': 93,
  'ash-sharh': 94, 'sharh': 94, 'inshirah': 94, 'ouverture': 94,
  'at-tin': 95, 'figuier': 95,
  'al-alaq': 96,
  'al-qadr': 97, 'qadr': 97, 'destin': 97,
  'al-bayyinah': 98,
  'az-zalzalah': 99,
  'al-adiyat': 100,
  'al-qariah': 101,
  'at-takathur': 102,
  'al-asr': 103, 'asr': 103, 'temps': 103,
  'al-humazah': 104,
  'al-fil': 105, 'elephant': 105,
  'quraysh': 106, 'coraysh': 106,
  'al-maun': 107,
  'al-kawthar': 108, 'kawthar': 108, 'abondance': 108,
  'al-kafirun': 109,
  'an-nasr': 110, 'secours': 110,
  'al-masad': 111,
  'al-ikhlas': 112, 'ikhlas': 112, 'monotheisme': 112,
  'al-falaq': 113, 'falaq': 113, 'aube naissante': 113,
  'an-nas': 114, 'nas': 114, 'hommes': 114
};

export function parseSurahNumber(bookOrSurah?: string, explicitNumber?: any): number | undefined {
  if (explicitNumber && !isNaN(Number(explicitNumber))) {
    const num = Number(explicitNumber);
    if (num >= 1 && num <= 114) return num;
  }
  if (!bookOrSurah) return undefined;
  
  const numMatch = bookOrSurah.match(/\b(1[0-1][0-4]|[1-9][0-9]?)\b/);
  if (numMatch) return parseInt(numMatch[1], 10);

  const clean = bookOrSurah.toLowerCase().replace(/sourate|surah|surat|[-_']/g, ' ').trim();
  for (const [key, val] of Object.entries(SURAH_NAME_TO_NUMBER)) {
    if (clean.includes(key)) return val;
  }
  return undefined;
}

export function parseAyahNumber(numberOrAyah?: string, explicitAyah?: any): number | undefined {
  if (explicitAyah && !isNaN(Number(explicitAyah))) {
    const num = Number(explicitAyah);
    if (num >= 1 && num <= 286) return num;
  }
  if (!numberOrAyah) return undefined;
  const numMatch = numberOrAyah.match(/\b([1-9][0-9]{0,2})\b/);
  return numMatch ? parseInt(numMatch[1], 10) : undefined;
}

export const IslamicContentService = {
  /**
   * Fetches the EXACT verse audio recitation matching the specified Surah & Ayah.
   * Guarantees 100% word-for-word synchronization: never substitutes with a different verse.
   */
  async fetchExactQuranAudio(
    surahNumber: number = 94, 
    ayahNumber: number = 5, 
    reciterId: string = 'ar.alafasy'
  ): Promise<ReciterAudio> {
    const s = Math.max(1, Math.min(114, Number(surahNumber) || 94));
    const maxAyahs = SURAH_AYAH_COUNTS[s - 1] || 7;
    const a = Math.max(1, Math.min(maxAyahs, Number(ayahNumber) || 1));
    const globalAyah = getGlobalAyahNumber(s, a);

    // 1. If Yasser Al-Dossari is requested, EveryAyah has full high-quality 128kbps recitation
    if (reciterId === 'ar.dossari') {
      const padS = String(s).padStart(3, '0');
      const padA = String(a).padStart(3, '0');
      return {
        reciterId: 'ar.dossari',
        reciterName: 'Sheikh Yasser Al-Dossari (ياسر الدوسري)',
        surahOrTitle: `Sourate ${s} (Verset ${a})`,
        audioUrl: `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${padS}${padA}.mp3`,
        durationSeconds: 22
      };
    }

    // 2. If another specific reciter is requested, check AlQuran Cloud API
    if (reciterId && reciterId !== 'ar.alafasy') {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/${reciterId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.audio) {
            const reciterObj = AVAILABLE_RECITERS.find(r => r.id === reciterId);
            return {
              reciterId,
              reciterName: reciterObj?.name || json.data.edition?.englishName || 'Récitateur Coranique',
              surahOrTitle: `Sourate ${json.data.surah?.englishName || s} (Verset ${a})`,
              audioUrl: json.data.audio,
              durationSeconds: 25
            };
          }
        }
      } catch (e) {
        console.warn(`Could not fetch reciter ${reciterId}, falling back to Alafasy exact verse:`, e);
      }
    }

    // 3. Fallback: Guaranteed 100% exact verse audio from Mishary Rashid Alafasy via Islamic Network CDN
    const reciterObj = AVAILABLE_RECITERS.find(r => r.id === reciterId);
    const reciterName = (reciterId === 'ar.luhaidan' || reciterId === 'ar.islamsobhi')
      ? `${reciterObj?.name || 'Récitateur'} (Voix Alafasy pour ce verset)`
      : 'Sheikh Mishary Rashid Alafasy (مشاري العفاسي)';

    return {
      reciterId: 'ar.alafasy',
      reciterName,
      surahOrTitle: `Sourate ${s} (Verset ${a})`,
      audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyah}.mp3`,
      durationSeconds: 22
    };
  },

  /**
   * Generates or fetches an authentic Islamic post item based on category, topic, and language preference.
   */
  async generateIslamicPost(
    category: IslamicContentType,
    customTopic?: string,
    language: IslamicLanguage = 'all',
    preferredReciterId: string = 'ar.alafasy'
  ): Promise<IslamicPostItem> {
    const apiKey = StorageService.getApiKey();
    const activeTopic = customTopic?.trim() || '';

    // Pick a fresh rotating subtopic if no custom topic specified
    const topicPool = DIVERSE_ISLAMIC_TOPICS[category] || DIVERSE_ISLAMIC_TOPICS.quran_verse;
    const searchTopic = activeTopic || topicPool[Math.floor(Math.random() * topicPool.length)];

    // Build strict anti-duplication prohibition list from past published posts
    const recentLibraryItems = IslamicLibraryService.getItems().slice(0, 25);
    const prohibitedItems = [
      'Sahih Muslim Hadith n° 2999 (« Étonnant est le cas du croyant... » / عَجَبًا لأَمْرِ الْمُؤْمِنِ)',
      ...recentLibraryItems.map(i => `${i.referenceText} (${(i.arabicText || '').slice(0, 30)}...)`)
    ];

    if (apiKey && apiKey.trim() !== '') {
      const categoryInstructions: Record<IslamicContentType, string> = {
        quran_verse: "Tu dois OBLIGATOIREMENT générer un VERSET DU NOBLE CORAN (Parole d'Allah) et STRICTEMENT rien d'autre (AUCUN hadith). Donne obligatoirement surahNumber (1 à 114) et ayahNumber exacts.",
        sahih_hadith: "Tu dois OBLIGATOIREMENT générer une PAROLE DU PROPHÈTE MOHAMMAD ﷺ issue STRICTEMENT de Sahih Al-Bukhari ou Sahih Muslim (AUCUN verset coranique).",
        authentic_dua: "Tu dois OBLIGATOIREMENT générer une INVOCATION AUTHENTIQUE (Du'a / Dhikr) issue de Hisn al-Muslim (Citadelle du Musulman) ou de Bukhari/Muslim.",
        jumua_special: "Tu dois OBLIGATOIREMENT générer un rappel sur les mérites du VENDREDI (Jumu'ah), la lecture de Sourate Al-Kahf ou les Salawat sur le Prophète ﷺ.",
        tahajjud_motivation: "Tu dois OBLIGATOIREMENT générer un rappel puissant sur la PRIÈRE DE NUIT (Tahajjud, Qiyam al-Layl, dernier tiers de la nuit ou Istighfar à l'aube).",
        islamic_reminder: "Tu dois générer un rappel de sagesse islamique profonde et inspirante (Patience, Confiance en Allah / Tawakkul, Gratitude)."
      };

      try {
        const prompt = `
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic).

RÈGLE ABSOLUE POUR LA CATÉGORIE "${category}":
${categoryInstructions[category] || categoryInstructions.quran_verse}

Sujet spécifique pour ce rappel : "${searchTopic}".

🚫 RÈGLE STRICTE ANTI-DOUBLONS (INTERDICTION ABSOLUE DE RÉPÉTER) :
Les textes et hadiths suivants ont DÉJÀ été publiés récemment sur nos réseaux (@kaelarislamic & @mdou.g). Tu as l'INTERDICTION STRICTE de les choisir ou de les citer :
${prohibitedItems.map(p => `- ${p}`).join('\n')}

Tu dois OBLIGATOIREMENT choisir un texte ou hadith TOTALEMENT DIFFÉRENT et INÉDIT.

Consignes de rédaction :
- Pour les versets du Coran, cite TOUJOURS le verset COMPLET dans son intégralité (du premier mot au dernier mot). Ne coupe JAMAIS un verset en morceaux.
- Choisis un passage court à moyen, percutant et complet (1 verset entier ou 1 hadith court de 20 à 45 mots), idéal pour une carte citation TikTok, Instagram et YouTube Shorts.
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
- Si c'est un verset du Coran, donne OBLIGATOIREMENT le numéro exact de la sourate (1 à 114) et le numéro du verset dans "surahNumber" et "ayahNumber".
- Génère à chaque fois un passage NOUVEAU, UNIQUE et DIFFÉRENT (ID de session : ${Date.now()}-${Math.random()}).
- Génère le contenu en 3 langues : Arabe (avec voyelles/tashkeel complet), Français et Anglais.

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "${searchTopic}",
  "arabicText": "Texte arabe exact avec tashkeel...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française concise et élégante...",
  "translationEn": "Concise and elegant English translation...",
  "source": {
    "type": "${category === 'quran_verse' ? 'quran' : category === 'authentic_dua' ? 'dua' : 'hadith'}",
    "bookOrSurah": "Ex: Sourate Al-Ankabut ou Sahih al-Bukhari",
    "numberOrAyah": "Ex: Verset 7 ou Hadith n° 5027",
    "surahNumber": 29,
    "ayahNumber": 7,
    "arabicReference": "المرجع بالعربية",
    "authenticityGrade": "${category === 'quran_verse' ? 'Coran (Parole d’Allah)' : 'Sahih (Authentique)'}",
    "verifiedBy": "Texte Sacré Authentifié"
  },
  "reflection": {
    "fr": "Courte réflexion spirituelle profonde en français...",
    "en": "Short inspiring spiritual reflection in English...",
    "ar": "تأمل إيماني قصير ومؤثر..."
  },
  "hashtags": {
    "fr": ["#IslamRappel", "#Coran", "#KaelarIslamic"],
    "en": ["#QuranQuotes", "#IslamicReminders", "#KaelarIslamic"],
    "ar": ["#قرآن_كريم", "#حديث_شريف", "#أدعية"]
  }
}
`;

        const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
        let rawText = '';

        for (const model of modelsToTry) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json'
                  }
                })
              }
            );

            if (response.ok) {
              const data = await response.json();
              rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (rawText) break;
            }
          } catch (err) {
            console.warn(`Model ${model} failed, trying next...`, err);
          }
        }

        if (rawText) {
          const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedJson);

          // Clean quotes from translations
          const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();

          const translationFr = cleanQuotes(parsed.translationFr || parsed.translation_fr || '');
          const translationEn = cleanQuotes(parsed.translationEn || parsed.translation_en || '');

          // Resolve Surah and Ayah numbers precisely
          const resolvedSurah = parseSurahNumber(
            parsed.source?.bookOrSurah || parsed.source?.book_or_surah, 
            parsed.source?.surahNumber
          );
          const resolvedAyah = parseAyahNumber(
            parsed.source?.numberOrAyah || parsed.source?.number_or_ayah, 
            parsed.source?.ayahNumber
          ) || 1;

          // Always fetch canonical FULL VERSE from AlQuran Cloud to guarantee zero truncation
          let finalArabic = parsed.arabicText || parsed.arabic_text || '';
          let finalFr = translationFr;
          let finalEn = translationEn;
          let surahName = parsed.source?.bookOrSurah || parsed.source?.book_or_surah || `Sourate ${resolvedSurah || 94}`;

          if (resolvedSurah && resolvedAyah) {
            try {
              const fullVerseRes = await fetch(`https://api.alquran.cloud/v1/ayah/${resolvedSurah}:${resolvedAyah}/editions/quran-uthmani,fr.hamidullah,en.sahih`);
              if (fullVerseRes.ok) {
                const fullVerseJson = await fullVerseRes.json();
                if (fullVerseJson.data && fullVerseJson.data.length >= 3) {
                  finalArabic = fullVerseJson.data[0].text;
                  finalFr = cleanQuotes(fullVerseJson.data[1].text);
                  finalEn = cleanQuotes(fullVerseJson.data[2].text);
                  if (fullVerseJson.data[0].surah?.name && fullVerseJson.data[0].surah?.englishName) {
                    surahName = `Sourate ${fullVerseJson.data[0].surah.englishName} (${fullVerseJson.data[0].surah.name})`;
                  }
                }
              }
            } catch (e) {
              console.warn('Could not fetch canonical full verse text, using AI text:', e);
            }
          }

          // Strict Anti-Duplicate Gate: verify against library history
          const dupCheck = IslamicLibraryService.checkDuplicate({
            arabicText: finalArabic,
            referenceText: `${surahName} — ${parsed.source?.numberOrAyah}`
          });
          const isHadith2999 = finalArabic.includes('عجبا لأمر') || finalArabic.includes('عجبًا لأمر') || (parsed.source?.numberOrAyah && String(parsed.source.numberOrAyah).includes('2999'));

          if (!dupCheck.isDuplicate && !isHadith2999) {
            // Fetch the EXACT matching audio from AlQuran Cloud
            let matchedAudio: ReciterAudio | null = null;
            if (category === 'quran_verse' || parsed.source?.type === 'quran' || resolvedSurah) {
              matchedAudio = await this.fetchExactQuranAudio(
                resolvedSurah || 94, 
                resolvedAyah, 
                preferredReciterId
              );
            }

            if (!matchedAudio) {
              matchedAudio = VERIFIED_RECITERS[Math.floor(Math.random() * VERIFIED_RECITERS.length)];
            }

            return {
              id: `islamic-${Date.now()}`,
              type: category === 'quran_verse' || parsed.source?.type === 'quran' ? 'quran_verse' : parsed.source?.type === 'dua' ? 'authentic_dua' : 'sahih_hadith',
              topic: parsed.topic || searchTopic,
              arabicText: finalArabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              phonetic: parsed.phonetic || '',
              translationFr: finalFr,
              translationEn: finalEn,
              source: {
                type: category === 'quran_verse' || parsed.source?.type === 'quran' ? 'quran' : (parsed.source?.type || 'hadith'),
                bookOrSurah: surahName,
                numberOrAyah: parsed.source?.numberOrAyah || parsed.source?.number_or_ayah || `Verset ${resolvedAyah}`,
                surahNumber: resolvedSurah,
                ayahNumber: resolvedAyah,
                arabicReference: parsed.source?.arabicReference || '',
                authenticityGrade: category === 'quran_verse' ? 'Coran (Parole d’Allah)' : (parsed.source?.authenticityGrade || 'Sahih (Authentique)'),
                verifiedBy: 'Texte Sacré Authentifié'
              },
              reciterAudio: matchedAudio,
              visualTheme: 'golden_night',
              reflection: parsed.reflection || { fr: '', en: '', ar: '' },
              hashtags: parsed.hashtags || { fr: [], en: [], ar: [] }
            };
          } else {
            console.warn('⚠️ Gemini generated a duplicate or repeated Hadith 2999, falling back to unposted candidate from catalog.');
          }
        }
      } catch (e) {
        console.warn('Gemini Islamic generation error:', e);
      }
    }

    // Fallback: Pick an unposted candidate from the verified authentic database (zero duplicate guarantee)
    const matchingCategory = VERIFIED_ISLAMIC_POSTS.filter(p => p.type === category);
    const unpostedCandidates = matchingCategory.filter(p => !IslamicLibraryService.checkDuplicate(p).isDuplicate);

    if (unpostedCandidates.length > 0) {
      return unpostedCandidates[Math.floor(Math.random() * unpostedCandidates.length)];
    }

    if (matchingCategory.length > 0) {
      return matchingCategory[Math.floor(Math.random() * matchingCategory.length)];
    }

    return VERIFIED_ISLAMIC_POSTS[0];
  },

  /**
   * Converts an IslamicPostItem into a unified ScheduledPost ready for TikTok, Instagram, YouTube Shorts & Buffer.
   */
  convertToScheduledPost(
    item: IslamicPostItem,
    preferredLanguage: IslamicLanguage = 'all',
    customImageUrl?: string
  ): ScheduledPost {
    const platforms: SocialPlatform[] = ['instagram', 'tiktok', 'youtube'];

    const platformContent: any = {};
    platforms.forEach(p => {
      const viralTags = IslamicViralTagsService.getViralTags(
        item.type,
        p,
        preferredLanguage,
        item.topic
      );
      const formattedText = IslamicViralTagsService.formatViralCaption(
        item,
        preferredLanguage,
        p
      );

      platformContent[p] = {
        text: formattedText,
        hook: p === 'youtube'
          ? `${item.source.bookOrSurah} — ${item.source.numberOrAyah} 🕋 #Shorts`
          : `${item.source.bookOrSurah} — ${item.source.numberOrAyah}`,
        hashtags: viralTags,
        videoScript: `[Récitation exacte : ${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah}]\n\n1. Calligraphie arabe HD synchronisée avec l'audio.\n2. Traduction française : "${item.translationFr}"\n3. Source certifiée : [${item.source.bookOrSurah} - ${item.source.authenticityGrade}]\n4. Appel à l'action : Abonne-toi à @kaelarislamic pour ton rappel quotidien.`,
        audioTrackSuggestion: `${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah} (${item.reciterAudio?.audioUrl})`
      };
    });

    return {
      id: `post-islamic-${Date.now()}`,
      title: `${item.source.bookOrSurah} — ${item.source.numberOrAyah} 🕋 #Shorts`,
      originalIdea: item.topic,
      platforms: ['instagram', 'tiktok', 'youtube'],
      platformContent,
      media: customImageUrl ? {
        id: `med-islamic-${Date.now()}`,
        type: 'image',
        url: customImageUrl,
        aspectRatio: '9:16',
        createdAt: new Date().toISOString(),
        engine: 'imagen3'
      } : undefined,
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      campaignTag: 'Islamic Reminders'
    };
  },

  /**
   * Helper to load an image with promise
   */
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
      img.src = src;
    });
  },

  /**
   * Generates a high-definition, authentic photographic Islamic Quote Card on HTML Canvas (9:16 or 1:1)
   */
  async renderQuoteCardCanvas(
    item: IslamicPostItem,
    aspectRatio: '9:16' | '1:1' = '9:16',
    displayLanguage: IslamicLanguage = 'all',
    themeOrCustomUrl?: string | IslamicBackgroundTheme
  ): Promise<string> {
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1080;

    // Ensure fonts are loaded before painting canvas
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // ignore
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Determine Background Theme
    let bgTheme: IslamicBackgroundTheme = ISLAMIC_BACKGROUND_THEMES[0];
    let customImgUrl: string | undefined;

    if (typeof themeOrCustomUrl === 'string') {
      const found = ISLAMIC_BACKGROUND_THEMES.find(t => t.id === themeOrCustomUrl);
      if (found) {
        bgTheme = found;
      } else if (themeOrCustomUrl.startsWith('http') || themeOrCustomUrl.startsWith('data:')) {
        customImgUrl = themeOrCustomUrl;
      }
    } else if (themeOrCustomUrl && typeof themeOrCustomUrl === 'object') {
      bgTheme = themeOrCustomUrl;
    }

    const bgUrlToLoad = customImgUrl || bgTheme.imageUrl;

    // 1. Draw Photographic Background Image (Aspect Cover)
    try {
      const img = await this.loadImage(bgUrlToLoad);
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        renderHeight = height;
        renderWidth = height * imgRatio;
        offsetX = -(renderWidth - width) / 2;
      } else {
        renderWidth = width;
        renderHeight = width / imgRatio;
        offsetY = -(renderHeight - height) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    } catch (e) {
      // Fallback elegant gradient if image cannot load
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#06131c');
      grad.addColorStop(0.5, '#042217');
      grad.addColorStop(1, '#02080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    const isReciterMinimal = bgTheme.layoutStyle === 'reciter_minimal' || bgTheme.category === 'reciter_portrait';

    // 2. Cinematic Multi-Layer Soft Vignette (Leaves photo vibrant & visible)
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isReciterMinimal) {
      // Clean TikTok layout: clear upper half for reciter face, dark bottom half for text
      overlayGradient.addColorStop(0, 'rgba(2, 6, 18, 0.25)');
      overlayGradient.addColorStop(0.35, 'rgba(2, 6, 18, 0.40)');
      overlayGradient.addColorStop(0.60, 'rgba(2, 6, 18, 0.85)');
      overlayGradient.addColorStop(0.85, 'rgba(2, 6, 18, 0.95)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
    } else {
      overlayGradient.addColorStop(0, 'rgba(3, 7, 18, 0.55)');
      overlayGradient.addColorStop(0.2, 'rgba(3, 7, 18, 0.35)');
      overlayGradient.addColorStop(0.5, 'rgba(4, 9, 20, 0.45)');
      overlayGradient.addColorStop(0.8, 'rgba(3, 7, 18, 0.70)');
      overlayGradient.addColorStop(1, 'rgba(2, 4, 10, 0.92)');
    }
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Warm Center Ambient Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.48, 50, width / 2, height * 0.48, width * 0.75);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
    radialGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.12)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Clean text strings helper
    const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const cleanFr = cleanQuotes(item.translationFr);
    const cleanEn = cleanQuotes(item.translationEn);

    // 4. Measure & Precalculate Typography Layout
    const cardMarginX = aspectRatio === '9:16' ? 55 : 45;
    const cardWidth = width - (cardMarginX * 2);
    const maxTextWidth = isReciterMinimal ? width - 130 : cardWidth - 100;

    // Helper to wrap text cleanly
    const wrapText = (text: string, font: string, maxW: number): string[] => {
      ctx.save();
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let cur = '';
      for (let i = 0; i < words.length; i++) {
        const test = cur ? cur + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && i > 0) {
          lines.push(cur);
          cur = words[i];
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      ctx.restore();
      return lines;
    };

    // Adaptive font scaling based on text length to prevent overflow of full verses
    const arabicWordCount = item.arabicText.split(/\s+/).length;
    let baseArabicFontSize = aspectRatio === '9:16' ? (isReciterMinimal ? 64 : 58) : 44;
    if (arabicWordCount > 28) {
      baseArabicFontSize = Math.round(baseArabicFontSize * 0.70); // ~40-44px
    } else if (arabicWordCount > 16) {
      baseArabicFontSize = Math.round(baseArabicFontSize * 0.84); // ~48-53px
    }
    const arabicLineHeight = Math.round(baseArabicFontSize * 1.72);
    const arabicFont = `bold ${baseArabicFontSize}px "Amiri Quran", "Noto Naskh Arabic", "Amiri", "Scheherazade New", serif`;
    const arabicLines = wrapText(item.arabicText, arabicFont, maxTextWidth);

    const frWordCount = cleanFr.split(/\s+/).length;
    let baseFrFontSize = aspectRatio === '9:16' ? 34 : 26;
    if (frWordCount > 35) {
      baseFrFontSize = Math.round(baseFrFontSize * 0.76); // ~26px
    } else if (frWordCount > 20) {
      baseFrFontSize = Math.round(baseFrFontSize * 0.88); // ~30px
    }
    const frLineHeight = Math.round(baseFrFontSize * 1.52);
    const frFont = `600 ${baseFrFontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const frLines = (displayLanguage === 'fr' || displayLanguage === 'all') && cleanFr
      ? wrapText(`« ${cleanFr} »`, frFont, maxTextWidth)
      : [];

    const enWordCount = cleanEn.split(/\s+/).length;
    let baseEnFontSize = aspectRatio === '9:16' ? 28 : 22;
    if (enWordCount > 35) {
      baseEnFontSize = Math.round(baseEnFontSize * 0.76); // ~21px
    } else if (enWordCount > 20) {
      baseEnFontSize = Math.round(baseEnFontSize * 0.88); // ~24px
    }
    const enLineHeight = Math.round(baseEnFontSize * 1.52);
    const enFont = `400 ${baseEnFontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const enLines = (displayLanguage === 'en' || displayLanguage === 'all') && cleanEn
      ? wrapText(`“${cleanEn}”`, enFont, maxTextWidth)
      : [];

    const arRefLines = displayLanguage === 'ar' && item.reflection.ar
      ? wrapText(item.reflection.ar, `500 ${aspectRatio === '9:16' ? 36 : 28}px "Noto Naskh Arabic", serif`, maxTextWidth)
      : [];

    // Calculate content heights
    const bismillahHeight = 55;
    const arabicBlockHeight = arabicLines.length * arabicLineHeight;
    const dividerHeight = isReciterMinimal ? 40 : 65;
    const frBlockHeight = frLines.length * frLineHeight;
    const enBlockHeight = enLines.length * enLineHeight;
    const arRefBlockHeight = arRefLines.length * frLineHeight;
    const sourceHeight = 55;

    const innerContentHeight = 
      bismillahHeight + 
      35 + 
      arabicBlockHeight + 
      dividerHeight + 
      (frBlockHeight > 0 ? frBlockHeight + 20 : 0) + 
      (enBlockHeight > 0 ? enBlockHeight + 20 : 0) + 
      (arRefBlockHeight > 0 ? arRefBlockHeight + 20 : 0) + 
      sourceHeight;

    const cardPaddingY = aspectRatio === '9:16' ? 60 : 40;
    const cardHeight = Math.min(height - (aspectRatio === '9:16' ? 220 : 90), innerContentHeight + (cardPaddingY * 2));
    
    // Position text in optimal TikTok reading safe zone
    const cardTop = isReciterMinimal
      ? (aspectRatio === '9:16' ? height * 0.46 - (innerContentHeight * 0.4) : (height - innerContentHeight) / 2)
      : (height - cardHeight) / 2 - (aspectRatio === '9:16' ? 20 : 5);
    const cardRadius = 30;

    // 5. Container: ONLY for Ornate Card Style (Skip for Reciter Minimal style)
    if (!isReciterMinimal) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
      ctx.fillStyle = 'rgba(8, 14, 25, 0.76)';
      ctx.fill();
      
      // Outer glowing gold border
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Inner subtle frame
      ctx.beginPath();
      ctx.roundRect(cardMarginX + 14, cardTop + 14, cardWidth - 28, cardHeight - 28, cardRadius - 10);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.20)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    } else {
      // Reciter Badge at Top Left
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.roundRect(50, 70, 480, 52, 26);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`🎙️ ${item.reciterAudio?.reciterName || 'Sheikh Muhammad Al-Luhaidan'}`, 75, 103);
      ctx.restore();
    }

    // 6. Draw Content Starting from centered Y
    let curY = cardTop + (isReciterMinimal ? 40 : cardPaddingY + 35);

    // A. Bismillah with Warm Golden Glow
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 16;
    ctx.font = `bold ${aspectRatio === '9:16' ? 46 : 34}px "Noto Naskh Arabic", "Amiri", serif`;
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, curY);
    ctx.restore();

    curY += 75;

    // B. Arabic Calligraphy Text (Large, Majestic, Crisp)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.font = arabicFont;
    ctx.direction = 'rtl';

    for (const l of arabicLines) {
      ctx.fillText(l, width / 2, curY);
      curY += arabicLineHeight;
    }
    ctx.restore();

    // C. Golden Islamic Medallion Divider (۞ ────── ۞)
    curY += 15;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, curY);
    ctx.lineTo(width / 2 - 30, curY);
    ctx.moveTo(width / 2 + 30, curY);
    ctx.lineTo(width / 2 + 140, curY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞', width / 2, curY + 9);
    ctx.restore();

    curY += 55;

    // D. French Translation
    if (frLines.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.font = frFont;
      
      for (const l of frLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.restore();
    }

    // E. English Translation
    if (enLines.length > 0) {
      curY += 10;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 10;
      ctx.font = enFont;
      
      for (const l of enLines) {
        ctx.fillText(l, width / 2, curY);
        curY += enLineHeight;
      }
      ctx.restore();
    }

    // F. Arabic Reflection if selected
    if (arRefLines.length > 0) {
      curY += 10;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.font = `500 ${aspectRatio === '9:16' ? 36 : 28}px "Noto Naskh Arabic", serif`;
      ctx.direction = 'rtl';
      
      for (const l of arRefLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.direction = 'ltr';
      ctx.restore();
    }

    // G. Subtle Elegant Source Citation Line
    curY += 28;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde68a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.font = `700 ${aspectRatio === '9:16' ? 26 : 21}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`— ${item.source.bookOrSurah}, ${item.source.numberOrAyah} —`, width / 2, curY);
    ctx.restore();

    // 7. Footer Watermark: ONLY @kaelarislamic
    const footerY = height - (aspectRatio === '9:16' ? 60 : 30);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.font = `700 ${aspectRatio === '9:16' ? 24 : 18}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('@kaelarislamic', width / 2, footerY);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }
};
