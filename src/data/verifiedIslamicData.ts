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
    reciterName: 'Mishary Rashid Alafasy',
    surahOrTitle: 'Sourate Ash-Sharh (V. 5)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3',
    durationSeconds: 22
  },
  {
    reciterName: 'Mishary Rashid Alafasy',
    surahOrTitle: 'Sourate Ad-Duha (V. 5)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6084.mp3',
    durationSeconds: 20
  },
  {
    reciterName: 'Mishary Rashid Alafasy',
    surahOrTitle: 'Sourate Al-Kahf (V. 1)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3',
    durationSeconds: 25
  },
  {
    reciterName: 'Mishary Rashid Alafasy',
    surahOrTitle: 'Sourate Ar-Rahman (V. 13)',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4914.mp3',
    durationSeconds: 14
  }
];

export const VERIFIED_ISLAMIC_POSTS: IslamicPostItem[] = [
  {
    id: 'islamic-0',
    type: 'quran_verse',
    topic: 'La grandeur des bienfaits d’Allah (Sourate Ar-Rahman)',
    arabicText: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    phonetic: 'Fa bi-ayyi ala\'i rabbikuma tukadhdhiban',
    translationFr: '« Lequel donc des bienfaits de votre Seigneur nierez-vous ? »',
    translationEn: '“So which of the favors of your Lord would you deny?”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate Ar-Rahman (Le Tout Miséricordieux)',
      numberOrAyah: 'Sourate 55, Verset 13',
      surahNumber: 55,
      ayahNumber: 13,
      arabicReference: 'سورة الرحمن ١٣',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: {
      reciterId: 'ar.luhaidan',
      reciterName: 'Sheikh Muhammad Al-Luhaidan',
      surahOrTitle: 'Sourate Ar-Rahman (Verset 13)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4914.mp3',
      durationSeconds: 14
    },
    visualTheme: 'reciter_luhaidan',
    reflection: {
      fr: 'Médite sur les innombrables bienfaits dont Allah t’a comblé sans même que tu ne t’en rendes compte.',
      en: 'Reflect upon the countless blessings Allah has bestowed upon you every second.',
      ar: 'تأمل في نعم الله التي لا تُعد ولا تُحصى واستشعر عظمته وفضله عليك.'
    },
    hashtags: {
      fr: ['#Coran', '#SourateArRahman', '#MuhammadAlLuhaidan', '#IslamRappel', '#KaelarIslamic'],
      en: ['#QuranRecitation', '#SurahRahman', '#MuslimTikTok', '#IslamicReminder', '#FYP'],
      ar: ['#محمد_اللحيدان', '#سورة_الرحمن', '#قرآن_كريم', '#تلاوة_خاشعة', '#راحة_نفسية']
    }
  },
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
      surahNumber: 94,
      ayahNumber: 5,
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
      fr: ['#IslamRappel', '#Coran', '#Patience', '#Tawakkul', '#Foi', '#KaelarIslamic'],
      en: ['#QuranQuotes', '#IslamicReminders', '#Sabr', '#TrustAllah', '#MuslimTikTok'],
      ar: ['#قرآن_كريم', '#تلاوات_خاشعة', '#أدعية', '#راحة_نفسية', '#إسلاميات']
    }
  },
  {
    id: 'islamic-2',
    type: 'sahih_hadith',
    topic: 'L’expiation des péchés (Kaffarah) et la prière',
    arabicText: 'الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، وَرَمَضَانُ إِلَى رَمَضَانَ، مُكَفِّرَاتٌ مَا بَيْنَهُنَّ إِذَا اجْتَنَبَ الْكَبَائِرَ',
    phonetic: 'As-salawatu al-khamsu, wal-jumu\'atu ilal-jumu\'ati, wa ramadanu ila ramadan, mukaffiratun ma baynahunna idhaj-tanabal-kaba\'ir',
    translationFr: 'Le Prophète ﷺ a dit : « Les cinq prières quotidiennes, la prière du vendredi jusqu’à la suivante, et le jeûne de Ramadan jusqu’au suivant effacent les péchés commis entre eux, tant que l’on évite les grands péchés. »',
    translationEn: 'The Prophet ﷺ said: “The five daily prayers, from one Friday prayer to the next, and from Ramadan to the next Ramadan, are expiations for whatever sins are committed between them, provided major sins are avoided.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih Muslim',
      numberOrAyah: 'Hadith n° 233',
      arabicReference: 'صحيح مسلم ٢٣٣',
      authenticityGrade: 'Sahih Muslim',
      verifiedBy: 'Imam Muslim (Authentique)'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Al-Ankaboot (Verset 45)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3385.mp3',
      durationSeconds: 28
    },
    visualTheme: 'emerald_mosque',
    reflection: {
      fr: 'Chaque prière accomplie à l’heure est une source d’effacement des fautes et un nouveau départ pour l’âme.',
      en: 'Every prayer established on time purifies the soul and wipes away shortcomings.',
      ar: 'المحافظة على الصلوات في أوقاتها كفارة للذنوب ونور للقلوب.'
    },
    hashtags: {
      fr: ['#HadithSahih', '#Kaffarah', '#Priere', '#Pardon', '#KaelarIslamic'],
      en: ['#HadithOfTheDay', '#Forgiveness', '#Salah', '#IslamicReminder'],
      ar: ['#حديث_شريف', '#صحيح_مسلم', '#كفارة_الذنوب', '#الصلاة']
    }
  },
  {
    id: 'islamic-3',
    type: 'authentic_dua',
    topic: 'Invocation contre la tristesse, l’angoisse et les dettes',
    arabicText: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    phonetic: 'Hasbiyallahu la ilaha illa Huwa, \'alayhi tawakkaltu wa Huwa Rabbul-\'Arshil-\'Adhim',
    translationFr: '« Allah me suffit. Il n’y a de divinité que Lui. En Lui je place ma confiance, et Il est le Seigneur du Trône Immense. »',
    translationEn: '“Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.”',
    source: {
      type: 'dua',
      bookOrSurah: 'Sourate At-Tawbah & Hisn al-Muslim',
      numberOrAyah: 'Sourate 9, Verset 129',
      arabicReference: 'سورة التوبة ١٢٩ - حصن المسلم',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate At-Tawbah (Verset 129)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1364.mp3',
      durationSeconds: 18
    },
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
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا',
    phonetic: 'Al-hamdu lillahilladhi anzala \'ala \'abdihil-kitaba wa lam yaj\'al lahu \'iwaja',
    translationFr: '« Louange à Allah qui a fait descendre sur Son serviteur le Livre, et n\'y a point introduit de tortuosité ! »',
    translationEn: '“[All] praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate Al-Kahf (La Caverne)',
      numberOrAyah: 'Sourate 18, Verset 1',
      arabicReference: 'سورة الكهف ١',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
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
    arabicText: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا',
    phonetic: 'Wa minal-layli fatahajjad bihi nafilatan laka \'asa an yab\'athaka Rabbuka maqaman mahmuda',
    translationFr: '« Et de la nuit, consacre une partie [avant l’aube] pour des prières surérogatoires : afin que ton Seigneur te ressuscite en une position de gloire. »',
    translationEn: '“And from [part of] the night, pray with it as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station.”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate Al-Isra (Le Voyage Nocturne)',
      numberOrAyah: 'Sourate 17, Verset 79',
      arabicReference: 'سورة الإسراء ٧٩',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Al-Isra (Verset 79)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3',
      durationSeconds: 20
    },
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
  },
  {
    id: 'islamic-6',
    type: 'sahih_hadith',
    topic: 'La pureté de l’intention (Al-Ikhlas) et la valeur des actes',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    phonetic: 'Innamal-a\'malu bin-niyyat, wa innama likullim-ri\'in ma nawa',
    translationFr: 'Le Prophète ﷺ a dit : « Les actions ne valent que par leurs intentions, et chacun ne sera rétribué que selon ce qu’il a eu l’intention de faire. »',
    translationEn: 'The Prophet ﷺ said: “Actions are judged only by intentions, and every person will have only that which he intended.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih Al-Bukhari',
      numberOrAyah: 'Hadith n° 1',
      arabicReference: 'صحيح البخاري ١',
      authenticityGrade: 'Sahih Bukhari',
      verifiedBy: 'Imam Al-Bukhari (Authentique)'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Al-Ahzab (Verset 21)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3554.mp3',
      durationSeconds: 24
    },
    visualTheme: 'golden_night',
    reflection: {
      fr: 'Purifie ton intention avant chaque parole et chaque action. Seule l’œuvre accomplie sincèrement pour Allah élève l’âme.',
      en: 'Purify your intention before every word and deed. Only what is done sincerely for Allah elevates the heart.',
      ar: 'إخلاص النية لله هو ميزان الأعمال وقبولها.'
    },
    hashtags: {
      fr: ['#HadithSahih', '#Ikhlas', '#Sincerite', '#RappelIslam', '#KaelarIslamic'],
      en: ['#Bukhari', '#Intentions', '#IslamicQuotes', '#Sunnah'],
      ar: ['#حديث_شريف', '#صحيح_البخاري', '#النية', '#إخلاص']
    }
  },
  {
    id: 'islamic-7',
    type: 'sahih_hadith',
    topic: 'La maîtrise de la parole et le bon comportement',
    arabicText: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    phonetic: 'Man kana yu\'minu billahi wal-yawmil-akhiri fal-yaqul khayran aw li-yasmut',
    translationFr: 'Le Prophète ﷺ a dit : « Que celui qui croit en Allah et au Jour dernier dise du bien ou qu’il se taise. »',
    translationEn: 'The Prophet ﷺ said: “Whoever believes in Allah and the Last Day should speak good or remain silent.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih Al-Bukhari & Muslim',
      numberOrAyah: 'Bukhari 6018 / Muslim 47',
      arabicReference: 'صحيح البخاري ٦٠١٨ - صحيح مسلم ٤٧',
      authenticityGrade: 'Muttafaq Alayh (Bukhari & Muslim)',
      verifiedBy: 'Bukhari & Muslim (Unanimement Authentique)'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Qaf (Verset 18)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4648.mp3',
      durationSeconds: 20
    },
    visualTheme: 'emerald_mosque',
    reflection: {
      fr: 'Tes paroles forgent ta destinée spirituelle. Choisis toujours des mots qui réconfortent, enseignent ou apaisent, sinon préserve ton silence.',
      en: 'Your tongue shapes your spiritual reality. Always speak that which brings healing and peace, or choose dignity in silence.',
      ar: 'حفظ اللسان من أعظم شعب الإيمان وسلامة الصدور.'
    },
    hashtags: {
      fr: ['#Hadith', '#Sagesse', '#BonComportement', '#Islam', '#KaelarIslamic'],
      en: ['#ProphetMuhammad', '#GoodSpeech', '#Kindness', '#IslamReminders'],
      ar: ['#حديث', '#حفظ_اللسان', '#أخلاق_المسلم', '#حكمة']
    }
  },
  {
    id: 'islamic-8',
    type: 'sahih_hadith',
    topic: 'La fraternité et la bienveillance sincère',
    arabicText: 'لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    phonetic: 'La yu\'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsih',
    translationFr: 'Le Prophète ﷺ a dit : « Nul d’entre vous ne sera véritablement croyant tant qu’il n’aimera pas pour son frère ce qu’il aime pour lui-même. »',
    translationEn: 'The Prophet ﷺ said: “None of you truly believes until he loves for his brother what he loves for himself.”',
    source: {
      type: 'hadith',
      bookOrSurah: 'Sahih Al-Bukhari & Muslim',
      numberOrAyah: 'Bukhari 13 / Muslim 45',
      arabicReference: 'صحيح البخاري ١٣ - صحيح مسلم ٤٥',
      authenticityGrade: 'Muttafaq Alayh (Bukhari & Muslim)',
      verifiedBy: 'Bukhari & Muslim (Unanimement Authentique)'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Al-Hujurat (Verset 10)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4622.mp3',
      durationSeconds: 22
    },
    visualTheme: 'golden_night',
    reflection: {
      fr: 'La foi n’atteint son accomplissement que lorsque le cœur se libère de l’égoïsme pour souhaiter le bien, le succès et la paix à autrui.',
      en: 'Faith reaches completeness only when the heart frees itself from envy to desire good, success, and peace for others.',
      ar: 'سلامة القلب ومحبة الخير للغير عنوان الإيمان الصادق.'
    },
    hashtags: {
      fr: ['#Fraternite', '#AmourEnAllah', '#HadithDuJour', '#KaelarIslamic'],
      en: ['#Brotherhood', '#LoveInIslam', '#MuslimCommunity', '#Hadith'],
      ar: ['#الأخوة_في_الله', '#حديث_شريف', '#محبة', '#أخلاق']
    }
  },
  {
    id: 'islamic-9',
    type: 'quran_verse',
    topic: 'La proximité d’Allah et la réponse aux invocations',
    arabicText: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    phonetic: 'Wa idha sa\'alaka \'ibadi \'anni fa-inni qarib, ujibu da\'watad-da\'i idha da\'an',
    translationFr: '« Et quand Mes serviteurs t’interrogent sur Moi.. alors Je suis tout proche : Je réponds à l’appel de celui qui Me prie quand il Me prie. »',
    translationEn: '“And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate Al-Baqarah (La Vache)',
      numberOrAyah: 'Sourate 2, Verset 186',
      surahNumber: 2,
      ayahNumber: 186,
      arabicReference: 'سورة البقرة ١٨٦',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Sheikh Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate Al-Baqarah (Verset 186)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/193.mp3',
      durationSeconds: 26
    },
    visualTheme: 'celestial_sky',
    reflection: {
      fr: 'Allah n’a placé aucun intermédiaire entre toi et Lui. Lève tes mains et confie-Lui tes secrets, Il t’écoute à chaque instant.',
      en: 'Allah placed no barrier between you and Him. Raise your hands and pour out your heart, He hears you at every moment.',
      ar: 'الله أقرب إليك من حبل الوريد، يسمع نجواك ويجيب دعاءك.'
    },
    hashtags: {
      fr: ['#Coran', '#AlBaqarah', '#InvocationExaucee', '#Tawakkul', '#KaelarIslamic'],
      en: ['#QuranVerses', '#DuaAnswered', '#NearnessToAllah', '#Peace'],
      ar: ['#قرآن_كريم', '#سورة_البقرة', '#إجابة_الدعاء', '#قريب_مجيب']
    }
  },
  {
    id: 'islamic-10',
    type: 'islamic_reminder',
    topic: 'La confiance absolue en Allah (Tawakkul)',
    arabicText: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
    phonetic: 'Wa man yatawakkal \'alallahi fahuwa hasbuh, innallaha balighu amrih',
    translationFr: '« Et quiconque place sa confiance en Allah, Il lui suffit. Allah atteint toujours ce qu’Il S’est assigné. »',
    translationEn: '“And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.”',
    source: {
      type: 'quran',
      bookOrSurah: 'Sourate At-Talaq (Le Divorce)',
      numberOrAyah: 'Sourate 65, Verset 3',
      surahNumber: 65,
      ayahNumber: 3,
      arabicReference: 'سورة الطلاق ٣',
      authenticityGrade: 'Coran (Parole d’Allah)',
      verifiedBy: 'Texte Sacré Authentifié'
    },
    reciterAudio: {
      reciterId: 'ar.alafasy',
      reciterName: 'Mishary Rashid Alafasy',
      surahOrTitle: 'Sourate At-Talaq (Verset 3)',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5222.mp3',
      durationSeconds: 22
    },
    visualTheme: 'desert_dunes',
    reflection: {
      fr: 'Laisse tes angoisses à Allah. Quand tu t’en remets entièrement à Lui avec sincérité, Sa paix inonde ton cœur et Ses solutions surpassent tes calculs.',
      en: 'Surrender your worries to Allah. When you place your trust in Him, His peace fills your soul and His plans surpass your imagination.',
      ar: 'التوكل على الله هو الأمان من كل خوف، والكفاية من كل هم.'
    },
    hashtags: {
      fr: ['#Tawakkul', '#ConfianceEnAllah', '#PaixInterieure', '#RappelDuJour', '#KaelarIslamic'],
      en: ['#TrustAllah', '#PeaceOfMind', '#IslamicQuotes', '#DailyReminder'],
      ar: ['#توكل_على_الله', '#حسبي_الله', '#راحة_نفسية', '#يقين']
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
    defaultTopic: 'L’expiation des péchés (Kaffarah) et la prière'
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
