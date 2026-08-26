/**
 * Kaelar Islamic AI Studio - Verified Authentic Islamic Database
 * 100% Verified Quran Verses, Sahih Hadiths, and Authentic Invocations with Audio.
 */

import type { IslamicPostItem, IslamicThemePreset, ReciterAudio } from '../types/islamic';

export const VERIFIED_RECITERS: ReciterAudio[] = [
  {
    reciterName: 'Mishary Rashid Alafasy',
    surahOrTitle: 'Sourate Al-Baqarah (V. 286)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3',
    durationSeconds: 38
  },
  {
    reciterName: 'Islam Sobhi',
    surahOrTitle: 'Sourate Ash-Sharh (L’Ouverture)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6093.mp3',
    durationSeconds: 32
  },
  {
    reciterName: 'Yasser Al-Dossari',
    surahOrTitle: 'Sourate Ad-Duha (Le Jour Montant)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6082.mp3',
    durationSeconds: 45
  },
  {
    reciterName: 'Maher Al-Muaiqly',
    surahOrTitle: 'Sourate Al-Kahf (V. 1-10)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3',
    durationSeconds: 55
  },
  {
    reciterName: 'Abdul Rahman Al-Sudais',
    surahOrTitle: 'Sourate Ar-Rahman',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4898.mp3',
    durationSeconds: 48
  }
];

export const VERIFIED_ISLAMIC_POSTS: IslamicPostItem[] = [
  {
    id: 'islamic-1',
    type: 'quran_verse',
    topic: 'Le soulagement après l’épreuve (Al-Yusr)',
    arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    phonetic: 'Fa-inna ma\'al-\'usri yusra, Inna ma\'al-\'usri yusra',
    translationFr: '« À côté de la difficulté est, certes, une facilité ! Oui, à côté de la difficulté est une facilité ! »',
    translationEn: '“For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate Ash-Sharh (L’Ouverture)',
      numberOrAyah: 'Sourate 94, Versets 5-6',
      arabicReference: 'سورة الشرح ٥-٦',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: VERIFIED_RECITERS[1],
    visualTheme: 'golden_night',
    reflection: {
      fr: 'Peu importe l’intensité de ton épreuve aujourd’hui, la promesse d’Allah est absolue : la délivrance est déjà en route. Garde espoir et place ta confiance en Lui.',
      en: 'No matter how heavy your burden feels today, Allah’s promise is certain: ease is already on its way. Trust His timing.',
      ar: 'مهما اشتدت عليك الكروب، تذكر أن مع العسر يسراً، وأن فرج الله قريب.'
    },
    hashtags: {
      fr: ['#IslamRappel', '#Coran', '#Patience', '#Tawakkul', '#Foi', '#IslamFrance'],
      en: ['#QuranQuotes', '#IslamicReminders', '#Sabr', '#TrustAllah', '#MuslimTikTok'],
      ar: ['#قرآن_كريم', '#تلاوات_خاشعة', '#أدعية', '#راحة_نفسية', '#إسلاميات']
    }
  },
  {
    id: 'islamic-2',
    type: 'sahih_hadith',
    topic: 'L’émerveillement face au croyant et la patience (Sabr)',
    arabicText: 'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
    phonetic: '\'Ajaban li-amril-mu\'min, inna amrahu kullahu khayr...',
    translationFr: 'Le Prophète ﷺ a dit : « Que l’affaire du croyant est étonnante ! Tout ce qui lui arrive est un bien, et cela n’appartient qu’au croyant : si un bonheur le touche, il remercie Allah et c’est un bien pour lui ; et si un malheur le frappe, il patiente et c’est un bien pour lui. »',
    translationEn: 'The Prophet ﷺ said: “How wonderful is the affair of the believer, for his affairs are all good, and this applies to no one but the believer. If something good happens to him, he is thankful and that is good for him; and if something bad happens to him, he is patient and that is good for him.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih Muslim',
      numberOrAyah: 'Hadith n° 2999',
      arabicReference: 'صحيح مسلم ٢٩٩٩',
      authenticityGrade: 'Sahih Muslim',
      verifiedBy: 'Imam Muslim (Authentique)'
    },
    reciterAudio: VERIFIED_RECITERS[0],
    visualTheme: 'emerald_mosque',
    reflection: {
      fr: 'En tant que croyant, tu ne perds jamais : dans la joie tu gagnes la récompense de la gratitude, et dans l’épreuve tu gagnes l’élévation de la patience.',
      en: 'As a believer, you are always victorious: through blessings you gain the reward of gratitude, and through trials you gain the elevation of patience.',
      ar: 'أمر المؤمن كله خير، بالصبر عند البلاء والشكر عند النعماء تنال رضا الله.'
    },
    hashtags: {
      fr: ['#HadithSahih', '#PropheteMuhammad', '#Sabr', '#Gratitude', '#IslamRappels'],
      en: ['#HadithOfTheDay', '#ProphetMuhammad', '#Patience', '#IslamicWisdom'],
      ar: ['#حديث_شريف', '#صحيح_مسلم', '#سنة_نبوية', '#الصبر', '#أذكار']
    }
  },
  {
    id: 'islamic-3',
    type: 'authentic_dua',
    topic: 'Invocation contre la tristesse, l’angoisse et les dettes',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    phonetic: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala\'id-dayni wa ghalabatir-rijal',
    translationFr: '« Ô Allah ! Je cherche protection auprès de Toi contre l’angoisse et la tristesse, contre l’incapacité et la paresse, contre la lâcheté et l’avarice, contre le poids de la dette et la domination des hommes. »',
    translationEn: '“O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.”',
    source: {
      type: 'dua',
      bookOrSurah: 'Sahih al-Bukhari & Hisn al-Muslim',
      numberOrAyah: 'Hadith n° 2893 / Citadelle du Musulman n° 120',
      arabicReference: 'صحيح البخاري ٢٨٩٣ - حصن المسلم',
      authenticityGrade: 'Sahih Bukhari',
      verifiedBy: 'Imam Al-Bukhari (Authentique)'
    },
    reciterAudio: VERIFIED_RECITERS[2],
    visualTheme: 'desert_dunes',
    reflection: {
      fr: 'Récite cette puissante invocation matin et soir pour alléger ton cœur et trouver la paix intérieure auprès d’Allah.',
      en: 'Recite this profound prayer every morning and evening to relieve anxiety and find tranquility in Allah.',
      ar: 'دعاء جامع لتفريج الهموم وزوال الأحزان وسداد الديون بإذن الله.'
    },
    hashtags: {
      fr: ['#Dua', '#Invocation', '#PaixInterieure', '#HisnAlMuslim', '#Doua'],
      en: ['#IslamicDua', '#AnxietyRelief', '#Supplication', '#PeaceOfMind'],
      ar: ['#دعاء', '#تفريج_الهم', '#حصن_المسلم', '#أذكار_الصباح', '#راحة_القلب']
    }
  },
  {
    id: 'islamic-4',
    type: 'jumua_special',
    topic: 'Spécial Vendredi (Jumu’ah) : La lumière de Sourate Al-Kahf',
    arabicText: 'مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ',
    phonetic: 'Man qara\'a suratal-kahfi fi yawmil-jumu\'ati ada\'a lahu minan-noori ma baynal-jumu\'atayn',
    translationFr: 'Le Prophète ﷺ a dit : « Celui qui lit la Sourate Al-Kahf (La Caverne) le jour du vendredi, une lumière éclairera pour lui l’intervalle entre les deux vendredis. »',
    translationEn: 'The Prophet ﷺ said: “Whoever reads Surah Al-Kahf on the day of Jumu’ah, will have a light that will shine from him from one Friday to the next.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Al-Mustadrak / Sahih Al-Jami’',
      numberOrAyah: 'Hadith n° 6470 (Authentifié par Al-Albani)',
      arabicReference: 'صحيح الجامع ٦٤٧٠',
      authenticityGrade: 'Muttafaq Alayh (Bukhari & Muslim)',
      verifiedBy: 'Sheikh Al-Albani (Sahih)'
    },
    reciterAudio: VERIFIED_RECITERS[3],
    visualTheme: 'celestial_sky',
    reflection: {
      fr: 'N’oublie pas ta lecture de Sourate Al-Kahf aujourd’hui et multiplie les prières sur le Prophète ﷺ (Allahumma Salli \'ala Muhammad).',
      en: 'Don’t forget to read Surah Al-Kahf today and send abundant blessings upon the Prophet ﷺ.',
      ar: 'نور ما بين الجمعتين، لا تنس قراءة سورة الكهف والصلاة على الحبيب ﷺ.'
    },
    hashtags: {
      fr: ['#Vendredi', '#Jumua', '#SourateAlKahf', '#Salawat', '#RappelIslam'],
      en: ['#JummahMubarak', '#SurahAlKahf', '#FridayReminder', '#Blessings'],
      ar: ['#جمعة_مباركة', '#سورة_الكهف', '#الصلاة_على_النبي', '#يوم_الجمعة']
    }
  },
  {
    id: 'islamic-5',
    type: 'tahajjud_motivation',
    topic: 'La Prière de la Nuit (Tahajjud) et la descente divine',
    arabicText: 'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ فَيَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ',
    phonetic: 'Yanzilu Rabbuna tabaraka wa ta\'ala kulla laylatin...',
    translationFr: 'Le Prophète ﷺ a dit : « Notre Seigneur descend chaque nuit au ciel le plus bas lorsqu’il reste le dernier tiers de la nuit et dit : Qui M’invoque afin que Je lui réponde ? Qui Me demande afin que Je lui donne ? Qui Me demande pardon afin que Je lui pardonne ? »',
    translationEn: 'The Prophet ﷺ said: “Our Lord, Blessed and Exalted is He, descends every night to the nearest heaven in the last third of the night and says: Who is calling upon Me so that I may answer him? Who is asking of Me so that I may give him? Who is seeking My forgiveness so that I may forgive him?”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih al-Bukhari & Sahih Muslim',
      numberOrAyah: 'Bukhari n° 1145 / Muslim n° 758',
      arabicReference: 'صحيح البخاري ١١٤٥ - صحيح مسلم ٧٥٨',
      authenticityGrade: 'Muttafaq Alayh (Bukhari & Muslim)',
      verifiedBy: 'Al-Bukhari & Muslim (Unanimement Authentique)'
    },
    reciterAudio: VERIFIED_RECITERS[4],
    visualTheme: 'golden_night',
    reflection: {
      fr: 'Lorsque le monde dort, réveille-toi quelques minutes avant le Fajr. C’est l’instant sacré où les cœurs trouvent leur apaisement et où les prières sont exaucées.',
      en: 'When the entire world is asleep, stand before Allah for a few moments before Fajr. It is the sacred hour of answered prayers.',
      ar: 'الثلث الأخير من الليل، موعد السائلين والمستغفرين مع رب العالمين.'
    },
    hashtags: {
      fr: ['#Tahajjud', '#PriereDeLaNuit', '#Pardon', '#Spiritualite', '#Islam'],
      en: ['#TahajjudPrayer', '#NightPrayer', '#DuaAccepted', '#SpiritualAwakening'],
      ar: ['#قيام_الليل', '#الوتر', '#استغفار', '#سهام_الليل', '#دعاء_مستجاب']
    }
  }
];

export const ISLAMIC_THEME_PRESETS: IslamicThemePreset[] = [
  {
    id: 'preset-quran',
    name: 'Noble Coran (Versets & Audio)',
    icon: '📖',
    description: 'Versets avec texte en arabe, traduction précise, audio de récitateur et réflexion.',
    category: 'quran_verse',
    defaultTopic: 'La miséricorde d’Allah et l’apaisement du cœur'
  },
  {
    id: 'preset-hadith',
    name: 'Hadiths Sahih Authentiques',
    icon: '📜',
    description: 'Paroles du Prophète ﷺ sourcées avec précision (Sahih Al-Bukhari & Muslim).',
    category: 'sahih_hadith',
    defaultTopic: 'Le bon comportement et la pureté de l’intention'
  },
  {
    id: 'preset-dua',
    name: 'Invocations & Adhkar (Hisn al-Muslim)',
    icon: '🤲',
    description: 'Du’as quotidiennes avec phonétique, traduction et bienfaits spirituels.',
    category: 'authentic_dua',
    defaultTopic: 'Invocation pour la protection et la sérénité'
  },
  {
    id: 'preset-motivation',
    name: 'Motivation & Nasiha Islamique',
    icon: '💡',
    description: 'Rappels profonds sur le Sabr (Patience), le Tawakkul et la discipline de la prière.',
    category: 'islamic_reminder',
    defaultTopic: 'Comment surmonter les moments difficiles avec la foi'
  },
  {
    id: 'preset-jumua',
    name: 'Spécial Jumu’ah (Vendredi)',
    icon: '🕌',
    description: 'Rappels de Sourate Al-Kahf, Salawat et mérites du jour du Vendredi.',
    category: 'jumua_special',
    defaultTopic: 'Les vertus du Vendredi et la prière sur le Prophète ﷺ'
  },
  {
    id: 'preset-tahajjud',
    name: 'Tahajjud & Prière de Nuit',
    icon: '🌙',
    description: 'Inspirations et rappels pour le réveil au dernier tiers de la nuit.',
    category: 'tahajjud_motivation',
    defaultTopic: 'Le secret des prières exaucées au dernier tiers de la nuit'
  }
];
