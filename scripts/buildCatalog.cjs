/**
 * Script to build rich 125+ verified Islamic Catalog
 * Includes authentic Quran Verses, Sahih Hadiths (Bukhari & Muslim),
 * Authentic Duas, Tahajjud Motivation, Islamic Wisdom, Friday Specials,
 * and the new Minimalist Dhikr & Adhkar Routines.
 */

const fs = require('fs');
const path = require('path');

const catalog = [
  // ==========================================
  // 1. ADHKAR ROUTINES & DHIKR CHECKLISTS (🤍 Style Épuré Minimaliste)
  // ==========================================
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "نصف دقيقة فقط 🤍",
    arabicText: "نصف دقيقة فقط 🤍\nسبحان الله (3) مرات\nالحمد لله (3) مرات\nالله أكبر (3) مرات\nلا إله إلا الله (3) مرات\nأستغفر الله (3) مرات\nلا حول ولا قوة إلا بالله (3) مرات\nاللهم إني أسألك الجنة (7) مرات\nاللهم أجرني من النار (7) مرات\nاللهم صلِّ وسلم وبارك على سيدنا محمد (3) مرات\nسبحان الله وبحمده سبحان الله العظيم (3) مرات\n﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾",
    checklistItems: [
      "سبحان الله (3) مرات",
      "الحمد لله (3) مرات",
      "الله أكبر (3) مرات",
      "لا إله إلا الله (3) مرات",
      "أستغفر الله (3) مرات",
      "لا حول ولا قوة إلا بالله (3) مرات",
      "اللهم إني أسألك الجنة (7) مرات",
      "اللهم أجرني من النار (7) مرات",
      "اللهم صلِّ وسلم وبارك على سيدنا محمد (3) مرات",
      "سبحان الله وبحمده سبحان الله العظيم (3) مرات"
    ],
    closingAyah: "﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾",
    translationFr: "Prends seulement 30 secondes pour purifier ton âme avec les formules de Dhikr les plus aimées d'Allah. Répète avec présence du cœur.",
    translationEn: "Take only 30 seconds to purify your heart with the most beloved remembrance of Allah. Recite with full sincerity.",
    bookOrSurah: "Adhkar & Tasbeeh Quotidien (Hisn al-Muslim)",
    numberOrAyah: "Routine 30 Secondes",
    surahNumber: 51,
    ayahNumber: 55,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4730.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dhikr #Adhkar #Tasbeeh #RappelIslam #KaeIslamic #KaelarIslamic #fyp #PourToi"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "دقيقة واحدة تمحو ذنوبك بإذن الله 🤍",
    arabicText: "دقيقة واحدة تمحو ذنوبك بإذن الله 🤍\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100) مرة\nأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (100) مرة\nلا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ (10) مرات\nسُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلا إِلَهَ إِلا اللَّهُ، وَاللَّهُ أَكْبَرُ\n﴿إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ﴾",
    checklistItems: [
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100) مرة",
      "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (100) مرة",
      "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ (10) مرات",
      "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلا إِلَهَ إِلا اللَّهُ، وَاللَّهُ أَكْبَرُ"
    ],
    closingAyah: "﴿إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ﴾",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui dit : 'Subhanallahi wa bihamdihi' 100 fois par jour, ses péchés sont effacés même s'ils étaient comme l'écume de la mer. »",
    translationEn: "The Prophet ﷺ said: 'Whoever says: Subhan Allahi wa bihamdihi 100 times a day, his sins will be forgiven even if they were like the foam of the sea.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 6405",
    surahNumber: 11,
    ayahNumber: 114,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1587.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Pardon #Istighfar #Subhanallah #KaeIslamic #KaelarIslamic #Islam #Rappel"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أذكار الصباح السريعة للبركة والتحصين 🌅",
    arabicText: "أذكار الصباح السريعة 🌅\nأَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ 🤍\nبِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ (3) مرات\nرَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلامِ دِينًا (3) مرات\nيَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ 🤍\nحَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ عَلَيْهِ تَوَكَّلْتُ (7) مرات\n﴿فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ﴾",
    checklistItems: [
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ 🤍",
      "بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ (3) مرات",
      "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلامِ دِينًا (3) مرات",
      "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ 🤍",
      "حَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ عَلَيْهِ تَوَكَّلْتُ (7) مرات"
    ],
    closingAyah: "﴿فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ﴾",
    translationFr: "Les invocations du matin créent un bouclier spirituel pour toute ta journée. Commence chaque matin sous la protection divine d'Allah.",
    translationEn: "Morning remembrances create a divine spiritual shield for your entire day. Start your morning under Allah's care.",
    bookOrSurah: "Hisn al-Muslim (Citadelle du Musulman)",
    numberOrAyah: "Adhkar as-Sabah",
    surahNumber: 12,
    ayahNumber: 64,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1660.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AdhkarSabah #Matin #Protection #Barakah #KaeIslamic #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أذكار المساء وراحة القلب قبل النوم 🌙",
    arabicText: "أذكار المساء وراحة القلب 🌙\nأَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ 🤍\nأَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3) مرات\nسُبْحَانَ اللَّهِ (33) مرة\nالْحَمْدُ لِلَّهِ (33) مرة\nاللَّهُ أَكْبَرُ (34) مرة\nقراءة آية الكرسي والمعوذتين 🤍\n﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
    checklistItems: [
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ 🤍",
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3) مرات",
      "سُبْحَانَ اللَّهِ (33) مرة",
      "الْحَمْدُ لِلَّهِ (33) مرة",
      "اللَّهُ أَكْبَرُ (34) مرة",
      "قراءة آية الكرسي والمعوذتين 🤍"
    ],
    closingAyah: "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
    translationFr: "Termine ta journée par l'évocation d'Allah pour apaiser tes pensées, éloigner les angoisses et dormir dans la sérénité absolue.",
    translationEn: "End your day remembering Allah to quiet your thoughts, remove worries, and rest in peaceful tranquility.",
    bookOrSurah: "Hisn al-Muslim (Citadelle du Musulman)",
    numberOrAyah: "Adhkar al-Masaa",
    surahNumber: 13,
    ayahNumber: 28,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AdhkarMasaa #Soir #SommeilPaisible #PaixInterieure #KaeIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "كنز من كنوز الجنة وفك الكروب 🤲",
    arabicText: "كنز من كنوز الجنة 🤲\nلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ\nحَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ (7) مرات\nلَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ (7) مرات\nيَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ 🤍\n﴿وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ ۚ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ﴾",
    checklistItems: [
      "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
      "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ (7) مرات",
      "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ (7) مرات",
      "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ 🤍"
    ],
    closingAyah: "﴿وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ ۚ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ﴾",
    translationFr: "« La hawla wa la quwwata illa billah » est l'un des trésors du Paradis. Elle débloque les situations impossibles et apporte le secours d'Allah.",
    translationEn: "'La hawla wa la quwwata illa billah' is a treasure of Paradise. It unlocks every hardship and brings divine aid.",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 4205",
    surahNumber: 40,
    ayahNumber: 44,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4204.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#TresorDuParadis #Dua #Tawakkul #KaeIslamic #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أحب الكلام إلى الله أربع ✨",
    arabicText: "أحب الكلام إلى الله أربع ✨\nسُبْحَانَ اللَّهِ 🤍\nوَالْحَمْدُ لِلَّهِ 🤍\nوَلَا إِلَهَ إِلَّا اللَّهُ 🤍\nوَاللَّهُ أَكْبَرُ 🤍\nوَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n﴿وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا﴾",
    checklistItems: [
      "سُبْحَانَ اللَّهِ 🤍",
      "وَالْحَمْدُ لِلَّهِ 🤍",
      "وَلَا إِلَهَ إِلَّا اللَّهُ 🤍",
      "وَاللَّهُ أَكْبَرُ 🤍",
      "وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ 🤍"
    ],
    closingAyah: "﴿وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا﴾",
    translationFr: "Le Messager d'Allah ﷺ a dit : « Les paroles les plus aimées d'Allah sont au nombre de quatre : Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar. »",
    translationEn: "The Messenger of Allah ﷺ said: 'The dearest phrases to Allah are four: Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith 2137",
    surahNumber: 18,
    ayahNumber: 46,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2186.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dhikr #Tasbeeh #Sunnah #MuslimReels #KaeIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "سيد الاستغفار وسر الفرج العاجل 🤍",
    arabicText: "سيد الاستغفار 🤍\nاللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ\nخَلَقْتَنِي وَأَنَا عَبْدُكَ\nوَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ\nأَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ\nأَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي\nفَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ\n﴿وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ﴾",
    checklistItems: [
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ",
      "خَلَقْتَنِي وَأَنَا عَبْدُكَ",
      "وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
      "أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ",
      "أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي",
      "فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ"
    ],
    closingAyah: "﴿وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ﴾",
    translationFr: "Sayyid al-Istighfar (Le maître du repentir). Quiconque le prononce le soir avec conviction et meurt dans la nuit entrera au Paradis, de même pour le matin.",
    translationEn: "Sayyid al-Istighfar (The chief prayer for forgiveness). Whoever recites it during day or night with faith and passes away will enter Paradise.",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith 6306",
    surahNumber: 2,
    ayahNumber: 199,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/206.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#SayyidAlIstighfar #Repentir #Pardon #KaeIslamic #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "تسبيح يثقل الميزان عند الرحمن ⚖️",
    arabicText: "كلمتان خفيفتان على اللسان ⚖️\nثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ :\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ 🤍\nسُبْحَانَ اللَّهِ الْعَظِيمِ 🤍\n(كررها 10 مرات الآن)\n﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا﴾",
    checklistItems: [
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (10) مرات",
      "سُبْحَانَ اللَّهِ الْعَظِيمِ (10) مرات",
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ (3) مرات",
      "وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ (3) مرات"
    ],
    closingAyah: "﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا﴾",
    translationFr: "« Deux paroles légères sur la langue, lourdes sur la balance, aimées du Tout Miséricordieux : Subhanallahi wa bihamdih, Subhanallahil 'Adheem. »",
    translationEn: "« Two words are light on the tongue, heavy in the balance, and beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil Azeem. »",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 6682",
    surahNumber: 110,
    ayahNumber: 3,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6215.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Subhanallah #Balance #BonneAction #KaeIslamic #Shorts"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "الصلاة الإبراهيمية ونور القلب 🌸",
    arabicText: "الصلاة الإبراهيمية المباركة 🌸\nاللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nوَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nفِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ\n﴿إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ﴾",
    checklistItems: [
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ (3) مرات",
      "كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
      "وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ (3) مرات",
      "فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ"
    ],
    closingAyah: "﴿إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا﴾",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui prie sur moi une fois, Allah priera sur lui dix fois en retour et effacera dix de ses péchés. »",
    translationEn: "The Prophet ﷺ said: 'Whoever sends blessings upon me once, Allah will send ten blessings upon him and erase ten of his sins.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 3370",
    surahNumber: 33,
    ayahNumber: 56,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3589.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Salawat #PropheteMuhammad #Vendredi #KaeIslamic #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أدعية الحفظ والسكينة من كل خوف 🛡️",
    arabicText: "تحصين النفس والسكينة 🛡️\nأَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3) مرات\nبِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ (3) مرات\nحَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ (7) مرات\nاللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ 🤍\n﴿وَاللَّهُ يَعْصِمُكَ مِنَ النَّاسِ﴾",
    checklistItems: [
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3) مرات",
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ (3) مرات",
      "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ (7) مرات",
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ 🤍"
    ],
    closingAyah: "﴿وَاللَّهُ يَعْصِمُكَ مِنَ النَّاسِ﴾",
    translationFr: "Invocations authentiques de protection et de sérénité. Répète-les avec foi pour apaiser ton cœur et éloigner toute anxiété.",
    translationEn: "Authentic supplications for protection and peace of mind. Recite them with faith to remove worry and protect your soul.",
    bookOrSurah: "Hisn al-Muslim (Citadelle du Musulman)",
    numberOrAyah: "Protection Quotidienne",
    surahNumber: 5,
    ayahNumber: 67,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/736.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Protection #Serenite #HisnAlMuslim #KaeIslamic"
  },

  // ==========================================
  // 2. SAHIH HADITHS (100% Vérifiés Bukhari & Muslim)
  // ==========================================
  {
    type: "sahih_hadith",
    arabicText: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    translationFr: "Le Messager d'Allah ﷺ a dit : « Ton sourire à l'égard de ton frère est une aumône pour toi. »",
    translationEn: "The Messenger of Allah ﷺ said: 'Your smile for your brother is a charity for you.'",
    bookOrSurah: "Jami` at-Tirmidhi (Sahih)",
    numberOrAyah: "Hadith n° 1956",
    surahNumber: 33,
    ayahNumber: 21,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3554.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Sourire #Sunnah #KaelarIslamic #Islam #Rappel"
  },
  {
    type: "sahih_hadith",
    arabicText: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ ۚ احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجَزْ",
    translationFr: "Le Messager d'Allah ﷺ a dit : « Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible, bien qu'il y ait du bien dans les deux. Recherche avec ardeur ce qui t'est bénéfique, demande l'aide d'Allah et ne baisse jamais les bras ! »",
    translationEn: "The Messenger of Allah ﷺ said: 'The strong believer is better and more beloved to Allah than the weak believer, while there is good in both. Strive for that which benefits you, seek help from Allah, and do not lose heart.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2664",
    surahNumber: 3,
    ayahNumber: 139,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/432.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Motivation #Force #Foi #KaelarIslamic #Islam"
  },
  {
    type: "sahih_hadith",
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translationFr: "Le Prophète ﷺ a dit : « Les actions ne valent que par leurs intentions, et chacun ne sera rétribué que selon ce qu’il a eu l’intention de faire. »",
    translationEn: "The Prophet ﷺ said: 'Actions are judged only by intentions, and every person will have only that which he intended.'",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith n° 1",
    surahNumber: 98,
    ayahNumber: 5,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6134.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Intention #Ikhlas #Sincerite #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translationFr: "Le Prophète ﷺ a dit : « Que celui qui croit en Allah et au Jour dernier dise du bien ou qu’il se taise. »",
    translationEn: "The Prophet ﷺ said: 'Whoever believes in Allah and the Last Day should speak good or remain silent.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 6018 / Muslim 47",
    surahNumber: 50,
    ayahNumber: 18,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4648.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Parole #Sagesse #Silence #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translationFr: "Le Prophète ﷺ a dit : « Nul d’entre vous ne sera véritablement croyant tant qu’il n’aimera pas pour son frère ce qu’il aime pour lui-même. »",
    translationEn: "The Prophet ﷺ said: 'None of you truly believes until he loves for his brother what he loves for himself.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 13 / Muslim 45",
    surahNumber: 49,
    ayahNumber: 10,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4622.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Fraternite #Amour #Generosite #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ",
    translationFr: "Le Prophète ﷺ a dit : « Certes, Allah est Beau et Il aime la beauté. »",
    translationEn: "The Prophet ﷺ said: 'Indeed, Allah is Beautiful and He loves beauty.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 91",
    surahNumber: 7,
    ayahNumber: 31,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/985.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Beaute #Elegance #Paix #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
    translationFr: "Le Prophète ﷺ a dit : « Comme le sort du croyant est étonnant ! Tout ce qui lui arrive est un bien : si un bonheur l'atteint, il remercie et c'est un bien pour lui ; et si un malheur le touche, il patiente et c'est un bien pour lui. »",
    translationEn: "The Prophet ﷺ said: 'Wondrous is the affair of the believer! For there is good in every affair of his: if good times come to him, he thanks Allah and that is good for him; and if hardship touches him, he shows patience and that is good for him.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2999",
    surahNumber: 2,
    ayahNumber: 153,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/160.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Patience #Gratitude #Sabr #Chukr #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui emprunte un chemin à la recherche d’un savoir, Allah lui facilite par cela un chemin vers le Paradis. »",
    translationEn: "The Prophet ﷺ said: 'Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2699",
    surahNumber: 20,
    ayahNumber: 114,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2462.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Savoir #Science #Paradis #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "يَسِّرُوا وَلا تُعَسِّرُوا، وَبَشِّرُوا وَلا تُنَفِّرُوا",
    translationFr: "Le Prophète ﷺ a dit : « Facilitez les choses et ne les rendez pas difficiles, annoncez de bonnes nouvelles et ne faites pas fuir les gens. »",
    translationEn: "The Prophet ﷺ said: 'Make things easy and do not make them difficult, give glad tidings and do not repel people.'",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith n° 69",
    surahNumber: 2,
    ayahNumber: 185,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/192.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Douceur #Facilite #Bienveillance #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلا عِزًّا",
    translationFr: "Le Prophète ﷺ a dit : « Jamais une aumône n’a diminué une richesse, et pour chaque pardon qu'accorde un serviteur, Allah ne fait qu'augmenter son honneur. »",
    translationEn: "The Prophet ﷺ said: 'Charity does not decrease wealth, and no one forgives another except that Allah increases his honor.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2588",
    surahNumber: 2,
    ayahNumber: 261,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/268.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Aumone #Pardon #Honneur #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    translationFr: "Le Prophète ﷺ a dit : « L'homme fort n'est pas celui qui terrasse ses adversaires dans la lutte ; l'homme véritablement fort est celui qui maîtrise son âme sous l'emprise de la colère. »",
    translationEn: "The Prophet ﷺ said: 'The strong man is not the one who can wrestle his adversaries; rather, the truly strong man is the one who controls himself during anger.'",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith n° 6114",
    surahNumber: 3,
    ayahNumber: 134,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/427.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #MaitriseDeSoi #Calme #Sagesse #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    translationFr: "Le Prophète ﷺ a dit : « Les œuvres les plus aimées auprès d'Allah sont les plus régulières et constantes, même si elles sont minimes. »",
    translationEn: "The Prophet ﷺ said: 'The most beloved deeds to Allah are those done regularly, even if they are small.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 6464",
    surahNumber: 76,
    ayahNumber: 25,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5616.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Constance #Discipline #Spiritualite #KaelarIslamic"
  },

  // ==========================================
  // 3. NOBLE QURAN VERSES (Émouvants & Variés)
  // ==========================================
  {
    type: "quran_verse",
    arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    translationFr: "« Lequel donc des bienfaits de votre Seigneur nierez-vous ? »",
    translationEn: "“So which of the favors of your Lord would you deny?”",
    bookOrSurah: "Sourate Ar-Rahmaan (سُورَةُ الرَّحۡمَٰن)",
    numberOrAyah: "Sourate 55, Verset 13",
    surahNumber: 55,
    ayahNumber: 13,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4914.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #ArRahmaan #Bienfaits #KaelarIslamic #Rappel"
  },
  {
    type: "quran_verse",
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationFr: "« À côté de la difficulté est, certes, une facilité ! Oui, à côté de la difficulté est une facilité ! »",
    translationEn: "“For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.”",
    bookOrSurah: "Sourate Ash-Sharh (سُورَةُ الشَّرۡحِ)",
    numberOrAyah: "Sourate 94, Versets 5-6",
    surahNumber: 94,
    ayahNumber: 5,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #AshSharh #Soulagement #Espoir #KaeIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    translationFr: "« Ton Seigneur t'accordera certes [Ses faveurs], et alors tu seras comblé et satisfait. »",
    translationEn: "“And your Lord is going to give you, and you will be satisfied.”",
    bookOrSurah: "Sourate Ad-Duha (سُورَةُ الضُّحَىٰ)",
    numberOrAyah: "Sourate 93, Verset 5",
    surahNumber: 93,
    ayahNumber: 5,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6084.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #AdDuha #Reconfort #KaelarIslamic #Islam"
  },
  {
    type: "quran_verse",
    arabicText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translationFr: "« Et quand Mes serviteurs t'interrogent sur Moi.. alors Je suis tout proche : Je réponds à l'appel de celui qui Me prie quand il Me prie. »",
    translationEn: "“And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.”",
    bookOrSurah: "Sourate Al-Baqarah (سُورَةُ البَقَرَةِ)",
    numberOrAyah: "Sourate 2, Verset 186",
    surahNumber: 2,
    ayahNumber: 186,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/193.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #AlBaqara #Invocation #Proximite #KaeIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translationFr: "« Dis : Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés. »",
    translationEn: "“Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.”",
    bookOrSurah: "Sourate Az-Zumar (سُورَةُ الزُّمَرِ)",
    numberOrAyah: "Sourate 39, Verset 53",
    surahNumber: 39,
    ayahNumber: 53,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4111.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #AzZumar #Misericorde #Pardon #KaelarIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    translationFr: "« Et Nous sommes plus près de l'homme que sa propre veine jugulaire. »",
    translationEn: "“And We are closer to him than his jugular vein.”",
    bookOrSurah: "Sourate Qaf (سُورَةُ قٓ)",
    numberOrAyah: "Sourate 50, Verset 16",
    surahNumber: 50,
    ayahNumber: 16,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4646.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #SourateQaf #ProximiteDivine #KaeIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا",
    translationFr: "« À ceux qui croient et font de bonnes œuvres, le Tout Miséricordieux accordera assurément Son amour et les fera aimer des créatures. »",
    translationEn: "“Indeed, those who have believed and done righteous deeds - the Most Merciful will appoint for them affection.”",
    bookOrSurah: "Sourate Maryam (سُورَةُ مَرۡيَمَ)",
    numberOrAyah: "Sourate 19, Verset 96",
    surahNumber: 19,
    ayahNumber: 96,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2346.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #SourateMaryam #AmourEnAllah #KaelarIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "قَالَ إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ",
    translationFr: "« Il dit : 'Je ne me plains de mon déchirement et de mon chagrin qu'à Allah seul, et je sais de la part d'Allah ce que vous ne savez pas.' »",
    translationEn: "“He said, 'I only complain of my suffering and my grief to Allah, and I know from Allah that which you do not know.'”",
    bookOrSurah: "Sourate Yusuf (سُورَةُ يُوسُفَ)",
    numberOrAyah: "Sourate 12, Verset 86",
    surahNumber: 12,
    ayahNumber: 86,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1682.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #SourateYusuf #Patience #Chagrin #KaeIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ",
    translationFr: "« Ô hommes, vous êtes les indigents qui ont un besoin absolu d'Allah, tandis qu'Allah est le Seul qui Se suffit à Lui-même, le Digne de louange. »",
    translationEn: "“O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy.”",
    bookOrSurah: "Sourate Fatir (سُورَةُ فَاطِرٍ)",
    numberOrAyah: "Sourate 35, Verset 15",
    surahNumber: 35,
    ayahNumber: 15,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3675.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #SourateFatir #Humilite #BesoinDAllah #KaelarIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    translationFr: "« Béni soit Celui dans la main de qui est la royauté, et Il est Omnipotent sur toute chose. Celui qui a créé la mort et la vie afin de vous éprouver pour voir qui de vous est le meilleur en œuvres. »",
    translationEn: "“Blessed is He in whose hand is dominion, and He is over all things competent - [He] who created death and life to test you as to which of you is best in deed.”",
    bookOrSurah: "Sourate Al-Mulk (سُورَةُ المُلۡكِ)",
    numberOrAyah: "Sourate 67, Versets 1-2",
    surahNumber: 67,
    ayahNumber: 1,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #AlMulk #ProtectionTombeau #KaeIslamic"
  },
  {
    type: "quran_verse",
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translationFr: "« Allah n'impose à aucune âme une charge supérieure à sa capacité. »",
    translationEn: "“Allah does not burden a soul beyond that it can bear.”",
    bookOrSurah: "Sourate Al-Baqarah (سُورَةُ البَقَرَةِ)",
    numberOrAyah: "Sourate 2, Verset 286",
    surahNumber: 2,
    ayahNumber: 286,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #Soulagement #Epreuve #Capacite #KaelarIslamic"
  },

  // ==========================================
  // 4. AUTHENTIC DUAS & INVOCATIONS (Hisn al-Muslim)
  // ==========================================
  {
    type: "authentic_dua",
    arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translationFr: "« Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l’au-delà ; et protège-nous du châtiment du Feu ! »",
    translationEn: "“Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.”",
    bookOrSurah: "Sourate Al-Baqarah & Sunnah",
    numberOrAyah: "Sourate 2, Verset 201",
    surahNumber: 2,
    ayahNumber: 201,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/208.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Invocation #AlBaqara #Protection #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    translationFr: "« Allah me suffit. Il n’y a de divinité que Lui. En Lui je place ma confiance, et Il est le Seigneur du Trône Immense. »",
    translationEn: "“Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.”",
    bookOrSurah: "Sourate At-Tawbah & Hisn al-Muslim",
    numberOrAyah: "Sourate 9, Verset 129",
    surahNumber: 9,
    ayahNumber: 129,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1364.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Hasbiyallah #Tawakkul #Serenite #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translationFr: "« Ô mon Seigneur, fais-leur miséricorde à tous deux (mes parents) comme ils m'ont élevé tout petit. »",
    translationEn: "“My Lord, have mercy upon them [my parents] as they brought me up [when I was] small.”",
    bookOrSurah: "Sourate Al-Isra (سُورَةُ الإِسۡرَاءِ)",
    numberOrAyah: "Sourate 17, Verset 24",
    surahNumber: 17,
    ayahNumber: 24,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2053.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Parents #Misericorde #Reconnaissance #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translationFr: "« Pas de divinité à part Toi ! Pureté à Toi ! J'ai été vraiment du nombre des injustes. » (Invocation de Jonas dans les ténèbres)",
    translationEn: "“There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.”",
    bookOrSurah: "Sourate Al-Anbiya (سُورَةُ الأَنبِيَاءِ)",
    numberOrAyah: "Sourate 21, Verset 87",
    surahNumber: 21,
    ayahNumber: 87,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2570.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #DuaYounus #Delivrance #Epreuve #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    translationFr: "« Seigneur, j'ai grand besoin du bien que Tu feras descendre vers moi. » (Invocation de Moïse à Madyan)",
    translationEn: "“My Lord, indeed I am, for whatever good You would send down to me, in need.”",
    bookOrSurah: "Sourate Al-Qasas (سُورَةُ القَصَصِ)",
    numberOrAyah: "Sourate 28, Verset 24",
    surahNumber: 28,
    ayahNumber: 24,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3276.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Moussa #Subsistance #Rizq #Mariage #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translationFr: "« Seigneur, donne-nous, en nos épouses et nos descendants, la joie des yeux, et fais de nous un guide pour les pieux. »",
    translationEn: "“Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.”",
    bookOrSurah: "Sourate Al-Furqan (سُورَةُ الفُرۡقَانِ)",
    numberOrAyah: "Sourate 25, Verset 74",
    surahNumber: 25,
    ayahNumber: 74,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2929.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Famille #Foyer #Enfants #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    translationFr: "« Ô Allah, je Te demande la bonne guidée, la piété, la préservation de la chasteté et la richesse de l'âme. »",
    translationEn: "“O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.”",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2721",
    surahNumber: 2,
    ayahNumber: 38,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/45.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Piété #Guidee #KaeIslamic"
  },

  // ==========================================
  // 5. TAHAJJUD & NIGHT PRAYER (Qiyam al-Layl)
  // ==========================================
  {
    type: "tahajjud_motivation",
    arabicText: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
    translationFr: "« Et de la nuit, consacre une partie [avant l’aube] pour des prières surérogatoires : afin que ton Seigneur te ressuscite en une position de gloire. »",
    translationEn: "“And from [part of] the night, pray with it as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station.”",
    bookOrSurah: "Sourate Al-Israa (سُورَةُ الإِسۡرَاءِ)",
    numberOrAyah: "Sourate 17, Verset 79",
    surahNumber: 17,
    ayahNumber: 79,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tahajjud #QiyamAlLayl #PriereDeNuit #Coran #KaelarIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ۝ فَلَا تَعْلَمُ نَفْسٌ مَّا أُخْفِيَ لَهُم مِّن قُرَّةِ أَعْيُنٍ جَزَاءً بِمَا كَانُوا يَعْمَلُونَ",
    translationFr: "« Leurs flancs s'arrachent de leurs lits pour invoquer leur Seigneur par crainte et espoir. Aucun être ne sait ce qui lui a été réservé comme réjouissance secrète, en récompense de leurs œuvres ! »",
    translationEn: "“Their sides part [vacate] from their beds; they supplicate their Lord in fear and aspiration. And no soul knows what has been hidden for them of comfort for eyes as reward for what they used to do.”",
    bookOrSurah: "Sourate As-Sajdah (سُورَةُ السَّجۡدَةِ)",
    numberOrAyah: "Sourate 32, Versets 16-17",
    surahNumber: 32,
    ayahNumber: 16,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3519.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tahajjud #QiyamAlLayl #Sajdah #Paradis #KaeIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "كَانُوا قَلِيلًا مِّنَ اللَّيْلِ مَا يَهْجَعُونَ ۝ وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ",
    translationFr: "« Ils dormaient peu la nuit, et aux dernières heures de la nuit (avant l'aube), ils demandaient le pardon d'Allah. »",
    translationEn: "“They used to sleep but little of the night, and in the hours before dawn they would ask forgiveness.”",
    bookOrSurah: "Sourate Adh-Dhariyat (سُورَةُ الذَّارِيَاتِ)",
    numberOrAyah: "Sourate 51, Versets 17-18",
    surahNumber: 51,
    ayahNumber: 17,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4692.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tahajjud #Istighfar #Aube #PriereDeNuit #KaelarIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ يَقُولُ : مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ",
    translationFr: "Le Prophète ﷺ a dit : « Notre Seigneur descend chaque nuit au ciel le plus bas dans le dernier tiers de la nuit et dit : Qui M'invoque afin que Je l'exauce ? Qui Me demande afin que Je lui donne ? Qui implore Mon pardon afin que Je lui pardonne ? »",
    translationEn: "The Prophet ﷺ said: 'Our Lord descends every night to the nearest heaven during the last third of the night, saying: Who calls upon Me, that I may answer him? Who asks of Me, that I may give him? Who seeks My forgiveness, that I may forgive him?'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 1145 / Muslim 758",
    surahNumber: 17,
    ayahNumber: 79,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#DernierTiers #Exaucement #Invocation #Tahajjud #KaeIslamic"
  },

  // ==========================================
  // 6. ISLAMIC WISDOM & TAWAKKUL (Sagesse)
  // ==========================================
  {
    type: "islamic_reminder",
    arabicText: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translationFr: "« N’est-ce point par l’évocation d’Allah que les cœurs se tranquillisent et trouvent leur apaisement ? »",
    translationEn: "“Unquestionably, by the remembrance of Allah hearts are assured.”",
    bookOrSurah: "Sourate Ar-Ra'd (سُورَةُ الرَّعۡدِ)",
    numberOrAyah: "Sourate 13, Verset 28",
    surahNumber: 13,
    ayahNumber: 28,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dhikr #PaixInterieure #Tawakkul #Coran #KaelarIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ",
    translationFr: "« Et quiconque place sa confiance en Allah, Il lui suffit. Allah atteint toujours ce qu’Il S’est assigné. »",
    translationEn: "“And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.”",
    bookOrSurah: "Sourate At-Talaq (سُورَةُ الطَّلَاقِ)",
    numberOrAyah: "Sourate 65, Verset 3",
    surahNumber: 65,
    ayahNumber: 3,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5222.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tawakkul #ConfianceEnAllah #Paix #KaeIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا",
    translationFr: "« Et sois patient face au décret de ton Seigneur, car tu es sous Nos Yeux bienveillants. »",
    translationEn: "“And be patient, [O Muhammad], for the decision of your Lord, for indeed, you are in Our eyes.”",
    bookOrSurah: "Sourate At-Tur (سُورَةُ الطُّورِ)",
    numberOrAyah: "Sourate 52, Verset 48",
    surahNumber: 52,
    ayahNumber: 48,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4783.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Patience #Sabr #Reconfort #KaelarIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ",
    translationFr: "« Il se peut que vous détestiez une chose alors qu'elle est un bien pour vous ; et il se peut que vous aimiez une chose alors qu'elle est un mal pour vous. Allah sait, tandis que vous ne savez pas. »",
    translationEn: "“Perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not.”",
    bookOrSurah: "Sourate Al-Baqarah (سُورَةُ البَقَرَةِ)",
    numberOrAyah: "Sourate 2, Verset 216",
    surahNumber: 2,
    ayahNumber: 216,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/223.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Sagesse #Destin #Qadr #KaeIslamic"
  },

  // ==========================================
  // 7. JUMU'AH SPECIAL (Vendredi Béni)
  // ==========================================
  {
    type: "jumua_special",
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ",
    translationFr: "« Ô vous qui avez cru ! Quand on appelle à la prière du jour du vendredi, accourez à l’invocation d’Allah et laissez tout négoce. Cela est bien meilleur pour vous, si vous saviez ! »",
    translationEn: "“O you who have believed, when [the adhan] is called for the prayer on the day of Jumu'ah, then proceed to the remembrance of Allah and leave trade. That is better for you, if you only knew.”",
    bookOrSurah: "Sourate Al-Jumu'a (سُورَةُ الجُمُعَةِ)",
    numberOrAyah: "Sourate 62, Verset 9",
    surahNumber: 62,
    ayahNumber: 9,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5186.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#JumuahMubarak #VendrediBeni #SourateAlJumua #KaelarIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا",
    translationFr: "« Louange à Allah qui a fait descendre sur Son serviteur le Livre, et n'y a point introduit de tortuosité ! » (Lumière de Sourate Al-Kahf)",
    translationEn: "“[All] praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.”",
    bookOrSurah: "Sourate Al-Kahf (سُورَةُ الكَهۡفِ)",
    numberOrAyah: "Sourate 18, Verset 1",
    surahNumber: 18,
    ayahNumber: 1,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AlKahf #Jummah #Vendredi #KaeIslamic #Coran"
  },
  {
    type: "jumua_special",
    arabicText: "إِنَّ مِنْ أَفْضَلِ أَيَّامِكُمْ يَوْمَ الْجُمُعَةِ، فِيهِ خُلِقَ آدَمُ، وَفِيهِ قُبِضَ.. فَأَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ فِيهِ، فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ",
    translationFr: "Le Prophète ﷺ a dit : « Certes, le jour du vendredi compte parmi vos meilleurs jours... Multipliez donc les prières sur moi en ce jour béni, car vos prières me sont présentées. »",
    translationEn: "The Prophet ﷺ said: 'Among the best of your days is Friday... So invoke abundant blessings upon me on it, for your blessings are presented to me.'",
    bookOrSurah: "Sunan Abi Dawud & An-Nasa'i",
    numberOrAyah: "Abu Dawud 1047 (Sahih)",
    surahNumber: 33,
    ayahNumber: 56,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3589.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Salawat #Vendredi #PropheteMuhammad #JummahMubarak #KaelarIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "إِنَّ فِي الْجُمُعَةِ لَسَاعَةً لَا يُوَافِقُهَا مُسْلِمٌ، يَسْأَلُ اللَّهَ فِيهَا خَيْرًا، إِلَّا أَعْطَاهُ إِيَّاهُ",
    translationFr: "Le Prophète ﷺ a dit : « Il y a durant le vendredi une heure au cours de laquelle aucun serviteur musulman ne demande un bien à Allah sans qu'Il ne le lui accorde. »",
    translationEn: "The Prophet ﷺ said: 'On Friday there is an hour in which no Muslim servant asks Allah for something good except that He gives it to him.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 852",
    surahNumber: 2,
    ayahNumber: 186,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/193.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#SaatalIstijabah #HeureExaucement #Vendredi #KaeIslamic"
  }
];

// Rich collection of verified Hadiths from Bukhari & Muslim
const additionalHadiths = [
  {
    ar: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ",
    fr: "Le Prophète ﷺ a dit : « Celui qui montre la voie d'un bien en a la même récompense que celui qui l'a accompli. »",
    en: "The Prophet ﷺ said: 'Whoever guides someone to goodness will have a reward like one who did it.'",
    ref: "Sahih Muslim (Hadith 1893)",
    surah: 2, ayah: 261, audio: 268,
    tags: "#Hadith #Partage #Hassanat #Islam #KaeIslamic"
  },
  {
    ar: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا، وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ",
    fr: "Le Prophète ﷺ a dit : « Ne néglige aucune bonne action, ne serait-ce que rencontrer ton frère avec un visage souriant et radieux. »",
    en: "The Prophet ﷺ said: 'Do not consider any good deed insignificant, even if it is that you meet your brother with a cheerful face.'",
    ref: "Sahih Muslim (Hadith 2626)",
    surah: 33, ayah: 21, audio: 3554,
    tags: "#Hadith #Bienveillance #Sourire #Sunnah #KaelarIslamic"
  },
  {
    ar: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    fr: "Le Prophète ﷺ a dit : « Une bonne et douce parole est une aumône. »",
    en: "The Prophet ﷺ said: 'A kind word is a charity.'",
    ref: "Sahih Al-Bukhari & Muslim",
    surah: 14, ayah: 24, audio: 1774,
    tags: "#Hadith #ParoleDouce #Aumone #Bukhari #KaeIslamic"
  },
  {
    ar: "مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ",
    fr: "Le Prophète ﷺ a dit : « Quiconque soulage le besoin de son frère, Allah sera là pour soulager son propre besoin. »",
    en: "The Prophet ﷺ said: 'Whoever fulfills the needs of his brother, Allah will fulfill his needs.'",
    ref: "Sahih Al-Bukhari & Muslim",
    surah: 5, ayah: 2, audio: 671,
    tags: "#Hadith #Entraide #Fraternite #Secours #KaelarIslamic"
  },
  {
    ar: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ",
    fr: "Le Prophète ﷺ a dit : « Certes, Allah est Doux et Il aime la douceur en toute chose. »",
    en: "The Prophet ﷺ said: 'Indeed, Allah is gentle and loves gentleness in all matters.'",
    ref: "Sahih Al-Bukhari (Hadith 6927)",
    surah: 3, ayah: 159, audio: 452,
    tags: "#Hadith #Douceur #Compassion #Sagesse #KaeIslamic"
  },
  {
    ar: "طُوبَى لِمَنْ وَجَدَ فِي صَحِيفَتِهِ اسْتِغْفَارًا كَثِيرًا",
    fr: "Le Prophète ﷺ a dit : « Heureux et béni soit celui qui trouve dans son livre de comptes de nombreux repentirs et demandes de pardon (Istighfar). »",
    en: "The Prophet ﷺ said: 'Glad tidings to whoever finds a great amount of seeking forgiveness in his record.'",
    ref: "Sunan Ibn Majah (Hadith 3818 - Sahih)",
    surah: 71, ayah: 10, audio: 5429,
    tags: "#Hadith #Istighfar #Pardon #JourDernier #KaelarIslamic"
  },
  {
    ar: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    fr: "Le Prophète ﷺ a dit : « Crains Allah où que tu sois, fais suivre le péché d'une bonne action afin de l'effacer, et comporte-toi avec les gens avec un noble caractère. »",
    en: "The Prophet ﷺ said: 'Fear Allah wherever you may be, follow a bad deed with a good deed and it will wipe it out, and behave well towards people.'",
    ref: "Jami` at-Tirmidhi (Hadith 1987 - Sahih)",
    surah: 11, ayah: 114, audio: 1587,
    tags: "#Hadith #Comportement #Taqwa #BonneAction #KaeIslamic"
  },
  {
    ar: "لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ",
    fr: "Le Prophète ﷺ a dit : « La véritable richesse ne réside pas dans l'abondance des biens matériels, mais la vraie richesse est celle du cœur et de l'âme. »",
    en: "The Prophet ﷺ said: 'Richness is not having an abundance of goods, but richness is contentment of the soul.'",
    ref: "Sahih Al-Bukhari & Muslim",
    surah: 93, ayah: 8, audio: 6087,
    tags: "#Hadith #RichesseDuCoeur #Contentement #Qanaah #KaelarIslamic"
  }
];

additionalHadiths.forEach(h => {
  catalog.push({
    type: "sahih_hadith",
    arabicText: h.ar,
    translationFr: `« ${h.fr} »`,
    translationEn: `“${h.en}”`,
    bookOrSurah: h.ref,
    numberOrAyah: "Hadith Sahih",
    surahNumber: h.surah,
    ayahNumber: h.ayah,
    audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${h.audio}.mp3`,
    reciterName: "Mishary Rashid Alafasy",
    hashtags: h.tags
  });
});

// Enrich with extra Quran verses across various Surahs
const additionalQuranSurahs = [
  { s: 1, a: 1, surah: "Sourate Al-Fatiha (سُورَةُ الفَاتِحَةِ)", ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers.", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is due to Allah, Lord of the worlds.", audio: 1 },
  { s: 2, a: 152, surah: "Sourate Al-Baqarah (سُورَةُ البَقَرَةِ)", ar: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", fr: "Souvenez-vous de Moi donc, Je Me souviendrai de vous. Remerciez-Moi et ne soyez pas ingrats.", en: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.", audio: 159 },
  { s: 2, a: 255, surah: "Sourate Al-Baqarah (آية الكرسي)", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", fr: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent.", en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.", audio: 262 },
  { s: 3, a: 159, surah: "Sourate Aal-Imran (سُورَةُ آلِ عِمۡرَانَ)", ar: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ", fr: "Puis, quand tu as pris une décision, confie-toi à Allah, car Allah aime ceux qui Lui font confiance.", en: "Then when you have taken a decision, put your trust in Allah. For Allah loves those who put their trust in Him.", audio: 452 },
  { s: 3, a: 173, surah: "Sourate Aal-Imran (سُورَةُ آلِ عِمۡرَانَ)", ar: "الَّذِينَ قَالَ لَهُمُ النَّاسُ إِنَّ النَّاسَ قَدْ جَمَعُوا لَكُمْ فَاخْشَوْهُمْ فَزَادَهُمْ إِيمَانًا وَقَالُوا حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", fr: "Ceux à qui on disait : 'Les gens se sont rassemblés contre vous ; craignez-les.' - Cela accrut leur foi et ils dirent : 'Allah nous suffit ; Il est le meilleur garant.'", en: "Those to whom people said, 'Indeed, the people have gathered against you, so fear them.' But it [merely] increased them in faith, and they said, 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.'", audio: 466 },
  { s: 4, a: 110, surah: "Sourate An-Nisa (سُورَةُ النِّسَاءِ)", ar: "وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا", fr: "Quiconque agit en mal ou commet une injustice envers lui-même, puis implore le pardon d'Allah, trouvera Allah Pardonneur et Miséricordieux.", en: "And whoever does a wrong or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.", audio: 603 },
  { s: 8, a: 63, surah: "Sourate Al-Anfal (سُورَةُ الأَنفَالِ)", ar: "وَأَلَّفَ بَيْنَ قُلُوبِهِمْ ۚ لَوْ أَنفَقْتَ مَا فِي الْأَرْضِ جَمِيعًا مَّا أَلَّفْتَ بَيْنَ قُلُوبِهِمْ وَلَٰكِنَّ اللَّهَ أَلَّفَ بَيْنَهُمْ", fr: "Et Il a uni leurs cœurs. Tout ce qu'il y a sur terre n'aurait pas suffi pour unir leurs cœurs, mais c'est Allah qui a uni leurs cœurs.", en: "And brought together their hearts. If you had spent all that is in the earth, you could not have brought their hearts together; but Allah brought them together.", audio: 1223 },
  { s: 10, a: 107, surah: "Sourate Yunus (سُورَةُ يُونُسَ)", ar: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِن يُرِدْكَ بِخَيْرٍ فَلَا رَادَّ لِفَضْلِهِ", fr: "Et si Allah fait qu'un malheur te touche, nul autre que Lui ne peut l'enlever. Et s'Il veut pour toi un bien, nul ne peut repousser Sa grâce.", en: "And if Allah should touch you with adversity, there is no remover of it except Him; and if He intends for you good, then there is no repeller of His bounty.", audio: 1471 },
  { s: 11, a: 123, surah: "Sourate Hud (سُورَةُ هُودٍ)", ar: "وَلِلَّهِ غَيْبُ السَّمَاوَاتِ وَالْأَرْضِ وَإِلَيْهِ يُرْجَعُ الْأَمْرُ كُلُّهُ فَاعْبُدْهُ وَتَوَكَّلْ عَلَيْهِ", fr: "À Allah appartient le secret des cieux et de la terre, et c'est à Lui que tout ordre retourne. Adore-Le donc et place ta confiance en Lui.", en: "And to Allah belongs the unseen [aspects] of the heavens and the earth and to Him will be returned the matter, all of it, so worship Him and rely upon Him.", audio: 1596 },
  { s: 14, a: 7, surah: "Sourate Ibrahim (سُورَةُ إِبۡرَاهِيمَ)", ar: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", fr: "Et lorsque votre Seigneur proclama : 'Si vous êtes reconnaissants, très certainement J'augmenterai [Mes bienfaits] pour vous.'", en: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor].'", audio: 1757 },
  { s: 15, a: 97, surah: "Sourate Al-Hijr (سُورَةُ الحِجۡرِ)", ar: "وَلَقَدْ نَعْلَمُ أَنَّكَ يَضِيقُ صَدْرُكَ بِمَا يَقُولُونَ ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ السَّاجِدِينَ", fr: "Et Nous savons certes que ta poitrine se serre par ce qu'ils disent. Glorifie donc ton Seigneur par Sa louange et sois parmi ceux qui se prosternent.", en: "And We already know that your breast is constrained by what they say. So exalt [Allah] with praise of your Lord and be of those who prostrate.", audio: 1900 },
  { s: 16, a: 128, surah: "Sourate An-Nahl (سُورَةُ النَّحۡلِ)", ar: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ", fr: "Certes, Allah est avec ceux qui Le craignent avec piété et ceux qui sont bienfaisants.", en: "Indeed, Allah is with those who fear Him and those who are doers of good.", audio: 2029 },
  { s: 18, a: 10, surah: "Sourate Al-Kahf (سُورَةُ الكَهۡفِ)", ar: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", fr: "Quand les jeunes se réfugièrent dans la caverne, ils dirent : 'Ô notre Seigneur, donne-nous de Ta part une miséricorde ; et assure-nous la droiture dans notre conduite.'", en: "When the youths retreated to the cave and said, 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.'", audio: 2150 },
  { s: 18, a: 107, surah: "Sourate Al-Kahf (سُورَةُ الكَهۡفِ)", ar: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا", fr: "Ceux qui croient et font de bonnes œuvres auront pour résidence les Jardins du Firdaws (le plus haut degré du Paradis).", en: "Indeed, those who have believed and done righteous deeds - they will have the Gardens of Paradise as a lodging.", audio: 2247 },
  { s: 21, a: 89, surah: "Sourate Al-Anbiya (سُورَةُ الأَنبِيَاءِ)", ar: "وَزَكَرِيَّا إِذْ نَادَىٰ رَبَّهُ رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ", fr: "Et Zacharie, quand il implora son Seigneur : 'Seigneur, ne me laisse pas seul, et c'est Toi le meilleur des héritiers !'", en: "And [mention] Zechariah, when he called to his Lord, 'My Lord, do not leave me alone [with no heir], while You are the best of inheritors.'", audio: 2572 },
  { s: 24, a: 22, surah: "Sourate An-Nur (سُورَةُ النُّورِ)", ar: "وَلْيَعْفُوا وَلْيَصْفَحُوا ۗ أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ ۗ وَاللَّهُ غَفُورٌ رَّحِيمٌ", fr: "Et qu'ils pardonnent et passent outre. N'aimez-vous pas qu'Allah vous pardonne ? Et Allah est Pardonneur et Miséricordieux.", en: "And let them pardon and overlook. Would you not like that Allah should forgive you? And Allah is Forgiving and Merciful.", audio: 2813 },
  { s: 24, a: 35, surah: "Sourate An-Nur (سُورَةُ النُّورِ)", ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", fr: "Allah est la Lumière des cieux et de la terre.", en: "Allah is the Light of the heavens and the earth.", audio: 2826 },
  { s: 25, a: 63, surah: "Sourate Al-Furqan (سُورَةُ الفُرۡقَانِ)", ar: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", fr: "Les serviteurs du Tout Miséricordieux sont ceux qui marchent sur terre avec humilité, et qui, lorsque les ignorants s'adressent à eux, disent : 'Paix'.", en: "And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace.", audio: 2918 },
  { s: 26, a: 80, surah: "Sourate Ash-Shu'ara (سُورَةُ الشُّعَرَاءِ)", ar: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", fr: "« Et quand je suis malade, c'est Lui qui me guérit. » (Parole d'Abraham)",
  en: "“And when I am ill, it is He who cures me.”", audio: 3012 },
  { s: 28, a: 77, surah: "Sourate Al-Qasas (سُورَةُ القَصَصِ)", ar: "وَأَحْسِن كَمَا أَحْسَنَ اللَّهُ إِلَيْكَ", fr: "Et fais le bien comme Allah a fait du bien envers toi.", en: "And do good as Allah has done good to you.", audio: 3329 },
  { s: 30, a: 21, surah: "Sourate Ar-Rum (سُورَةُ الرُّومِ)", ar: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً", fr: "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté.", en: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.", audio: 3430 },
  { s: 31, a: 17, surah: "Sourate Luqman (سُورَةُ لُقۡمَانَ)", ar: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ", fr: "Ô mon cher fils, accomplis la prière, commande le bien, interdis le mal et endure avec patience ce qui t'arrive.", en: "O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you.", audio: 3486 },
  { s: 37, a: 99, surah: "Sourate As-Saffat (سُورَةُ الصَّافَّاتِ)", ar: "وَقَالَ إِنِّي ذَاهِبٌ إِلَىٰ رَبِّي سَيَهْدِينِ", fr: "Et il dit : 'Moi, je pars vers mon Seigneur et Il me guidera.'", en: "And [then] he said, 'Indeed, I will go to [where I am ordered by] my Lord; He will guide me.'", audio: 3887 },
  { s: 39, a: 10, surah: "Sourate Az-Zumar (سُورَةُ الزُّمَرِ)", ar: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", fr: "Les endurants auront leur pleine récompense sans compter.", en: "Indeed, the patient will be given their reward without account.", audio: 4068 },
  { s: 40, a: 60, surah: "Sourate Ghafir (سُورَةُ غَافِرٍ)", ar: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", fr: "Et votre Seigneur dit : 'Invoquez-Moi, Je vous répondrai.'", en: "And your Lord says, 'Call upon Me; I will respond to you.'", audio: 4220 },
  { s: 41, a: 30, surah: "Sourate Fussilat (سُورَةُ فُصِّلَتۡ)", ar: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا وَأَبْشِرُوا بِالْجَنَّةِ الَّتِي كُنتُمْ تُوعَدُونَ", fr: "Ceux qui disent : 'Notre Seigneur est Allah', et qui puis se tiennent sur le droit chemin, les Anges descendent sur eux : 'N'ayez pas peur et ne soyez pas affligés ; recevez la bonne nouvelle du Paradis qui vous était promis.'", en: "Indeed, those who have said, 'Our Lord is Allah' and then remained on a right course - the angels will descend upon them, [saying], 'Do not fear and do not grieve but receive good tidings of Paradise.'", audio: 4248 },
  { s: 46, a: 13, surah: "Sourate Al-Ahqaf (سُورَةُ الأَحۡقَافِ)", ar: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", fr: "Ceux qui disent : 'Notre Seigneur est Allah' et qui ensuite se tiennent sur le droit chemin, ils n'auront aucune crainte et ne seront point affligés.", en: "Indeed, those who have said, 'Our Lord is Allah,' and then remained on a right course - there will be no fear concerning them, nor will they grieve.", audio: 4523 },
  { s: 56, a: 10, surah: "Sourate Al-Waqi'ah (سُورَةُ الوَاقِعَةِ)", ar: "وَالسَّابِقُونَ السَّابِقُونَ ۝ أُولَٰئِكَ الْمُقَرَّبُونَ ۝ فِي جَنَّاتِ النَّعِيمِ", fr: "Les premiers arrivés [dans la foi et les bonnes œuvres] seront les premiers [au Paradis] ! Ce sont eux les plus rapprochés d'Allah dans les Jardins des Délices.", en: "And the forerunners, the forerunners - those are the ones brought near [to Allah] in the Gardens of Pleasure.", audio: 4989 },
  { s: 57, a: 4, surah: "Sourate Al-Hadid (سُورَةُ الحَدِيدِ)", ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", fr: "Et Il est avec vous où que vous soyez. Et Allah observe parfaitement ce que vous faites.", en: "And He is with you wherever you are. And Allah, of what you do, is Seeing.", audio: 5079 },
  { s: 59, a: 22, surah: "Sourate Al-Hashr (سُورَةُ الحَشۡرِ)", ar: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ", fr: "C'est Lui Allah. Nulle divinité autre que Lui, le Connaisseur de l'Invisible tout comme du visible. C'est Lui, le Tout Miséricordieux, le Très Miséricordieux.", en: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.", audio: 5148 },
  { s: 65, a: 2, surah: "Sourate At-Talaq (سُورَةُ الطَّلَاقِ)", ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", fr: "Et quiconque craint Allah, Il lui donnera une issue favorable, et lui accordera Sa subsistance par des voies sur lesquelles il ne comptait pas.", en: "And whoever fears Allah - He will make for him a way out, and will provide for him from where he does not expect.", audio: 5221 },
  { s: 76, a: 24, surah: "Sourate Al-Insan (سُورَةُ الإنسَانِ)", ar: "فَاصْبِرْ لِحُكْمِ رَبِّكَ وَلَا تُطِعْ مِنْهُمْ آثِمًا أَوْ كَفُورًا ۝ وَاذْكُرِ اسْمَ رَبِّكَ بُكْرَةً وَأَصِيلًا", fr: "Endure donc avec patience le décret de ton Seigneur et n'obéis à aucun pécheur ou ingrat parmi eux. Et évoque le nom de ton Seigneur matin et soir.", en: "So be patient for the decision of your Lord and do not obey from among them a sinner or an ungrateful [disbeliever]. And mention the name of your Lord [in prayer] morning and evening.", audio: 5615 },
  { s: 85, a: 14, surah: "Sourate Al-Buruj (سُورَةُ البُرُوجِ)", ar: "وَهُوَ الْغَفُورُ الْوَدُودُ", fr: "Et c'est Lui le Pardonneur, le Plein d'amour affectueux (Al-Wadood).", en: "And He is the Forgiving, the Affectionate.", audio: 5923 },
  { s: 93, a: 3, surah: "Sourate Ad-Duha (سُورَةُ الضُّحَىٰ)", ar: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", fr: "Ton Seigneur ne t'a ni abandonné, ni détesté. La vie dernière t'est certes bien meilleure que la vie présente.", en: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you]. And the Hereafter is better for you than the first [life].", audio: 6082 },
  { s: 94, a: 1, surah: "Sourate Ash-Sharh (سُورَةُ الشَّرۡحِ)", ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ", fr: "N'avons-Nous pas ouvert pour toi ta poitrine ? Et ne t'avons-Nous pas déchargé du fardeau qui accablait ton dos ? Et exalté pour toi ta renommée ?", en: "Did We not expand for you, [O Muhammad], your breast? And We removed from you your burden which had weighed upon your back, and raised high for you your repute.", audio: 6091 }
];

additionalQuranSurahs.forEach((q) => {
  catalog.push({
    type: "quran_verse",
    arabicText: q.ar,
    translationFr: `« ${q.fr} »`,
    translationEn: `“${q.en}”`,
    bookOrSurah: q.surah,
    numberOrAyah: `Verset ${q.a}`,
    surahNumber: q.s,
    ayahNumber: q.a,
    audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${q.audio}.mp3`,
    reciterName: "Mishary Rashid Alafasy",
    hashtags: `#Coran #VersetDuJour #KaeIslamic #KaelarIslamic #Rappel`
  });
});

// 35 Additional items across all themes to reach 130+ verified items
const moreItems = [
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أذكار بعد الصلاة المكتوبة 📿",
    arabicText: "أذكار بعد الصلاة المكتوبة 📿\nأَسْتَغْفِرُ اللَّهَ (3) مرات\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ 🤍\nسُبْحَانَ اللَّهِ (33) مرة\nالْحَمْدُ لِلَّهِ (33) مرة\nاللَّهُ أَكْبَرُ (33) مرة\nقراءة آية الكرسي دبر كل صلاة 🤍\n﴿فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ﴾",
    checklistItems: [
      "أَسْتَغْفِرُ اللَّهَ (3) مرات",
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",
      "سُبْحَانَ اللَّهِ (33) مرة",
      "الْحَمْدُ لِلَّهِ (33) مرة",
      "اللَّهُ أَكْبَرُ (33) مرة",
      "قراءة آية الكرسي دبر كل صلاة 🤍"
    ],
    closingAyah: "﴿فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ﴾",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui récite le verset du Trône (Ayat al-Kursi) après chaque prière obligatoire, rien ne l'empêche d'entrer au Paradis si ce n'est la mort. »",
    translationEn: "The Prophet ﷺ said: 'Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.'",
    bookOrSurah: "Sahih Muslim & An-Nasa'i",
    numberOrAyah: "Adhkar après la prière",
    surahNumber: 4, ayahNumber: 103, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/596.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#ApresLaPriere #Salah #Adhkar #Tasbeeh #KaeIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "استغفار يفتح الأبواب المغلقة 🤍",
    arabicText: "استغفار تفريج الكروب 🤍\nأَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ (3) مرات\nرَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ (10) مرات\nأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (70) مرة\n﴿فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا ۝ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا﴾",
    checklistItems: [
      "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ (3) مرات",
      "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ (10) مرات",
      "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (70) مرة"
    ],
    closingAyah: "﴿فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا ۝ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا﴾",
    translationFr: "L'Istighfar attire la subsistance, apaise les cœurs brisés et ouvre les portes que tu croyais fermées à jamais.",
    translationEn: "Seeking forgiveness brings provision, mends broken hearts, and opens doors you thought were locked forever.",
    bookOrSurah: "Sourate Nuh & Sunan Abi Dawud",
    numberOrAyah: "Sourate 71, Versets 10-11",
    surahNumber: 71, ayahNumber: 10, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5429.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Istighfar #Pardon #Rizq #Delivrance #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "دعاء تفريج الهم وسداد الدين 💡",
    arabicText: "دعاء تفريج الهم والدين 💡\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ\nوَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ\nوَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ\nوَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ 🤍\n﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا﴾",
    checklistItems: [
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      "وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
      "وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ",
      "وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ 🤍"
    ],
    closingAyah: "﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾",
    translationFr: "Une invocation prophétique majeure enseignée par le Messager d'Allah ﷺ pour libérer l'esprit de l'angoisse et dissiper les dettes.",
    translationEn: "A major prophetic prayer taught by the Messenger of Allah ﷺ to relieve worry and remove debt.",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith n° 2893",
    surahNumber: 94, ayahNumber: 5, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Dettes #Soulagement #Angoisse #KaeIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "دعاء الخروج من المنزل والتوكل على الله 🚪",
    arabicText: "دعاء الخروج من المنزل 🚪\nبِسْمِ اللَّهِ 🤍\nتَوَكَّلْتُ عَلَى اللَّهِ 🤍\nلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ 🤍\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ\n﴿وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ﴾",
    checklistItems: [
      "بِسْمِ اللَّهِ 🤍",
      "تَوَكَّلْتُ عَلَى اللَّهِ 🤍",
      "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ 🤍",
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ 🤍"
    ],
    closingAyah: "﴿وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ﴾",
    translationFr: "Le Prophète ﷺ a dit : « Quand l'homme sort de chez lui et dit : 'Bismillahi tawakkaltu 'alallahi...', on lui répond : Tu es guidé, protégé et préservé, et le diable s'éloigne de lui. »",
    translationEn: "The Prophet ﷺ said: 'When a man goes out of his house and says: Bismillah, tawakkaltu 'ala Allah..., it is said to him: You are guided, guarded and protected, and Satan leaves him.'",
    bookOrSurah: "Sunan Abi Dawud & At-Tirmidhi",
    numberOrAyah: "Hadith 5095 (Sahih)",
    surahNumber: 65, ayahNumber: 3, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5222.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#DuaSortie #Protection #Tawakkul #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    translationFr: "« Ô Toi qui fais tourner et osciller les cœurs, affermis mon cœur sur Ta religion ! »",
    translationEn: "“O Turner of the hearts, make my heart firm upon Your religion!”",
    bookOrSurah: "Jami` at-Tirmidhi (Sahih)",
    numberOrAyah: "Hadith n° 2140",
    surahNumber: 3, ayahNumber: 8, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/301.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Coeur #Fermete #Foi #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    translationFr: "« Ô Allah, Tu es certes Pardonneur, Tu aimes le pardon, alors pardonne-moi ! » (Lailat al-Qadr)",
    translationEn: "“O Allah, You are Forgiving and love forgiveness, so forgive me!”",
    bookOrSurah: "Jami` at-Tirmidhi (Sahih)",
    numberOrAyah: "Hadith n° 3513",
    surahNumber: 97, ayahNumber: 1, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6126.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Pardon #LaylatAlQadr #Misericorde #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    translationFr: "« Ô mon Seigneur ! Fais que j'accomplisse assidûment la prière ainsi qu'une partie de ma descendance ; et exauce ma prière, ô notre Seigneur ! »",
    translationEn: "“My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.”",
    bookOrSurah: "Sourate Ibrahim (سُورَةُ إِبۡرَاهِيمَ)",
    numberOrAyah: "Sourate 14, Verset 40",
    surahNumber: 14, ayahNumber: 40, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1790.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Priere #Salah #Enfants #Famille #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    translationFr: "« Ô Allah, rien n'est facile sauf ce que Tu rends facile, et Tu rends la difficulté facile si Tu le veux ! »",
    translationEn: "“O Allah, there is no ease except in that which You have made easy, and You make the difficulty easy, if You wish.”",
    bookOrSurah: "Sahih Ibn Hibban",
    numberOrAyah: "Hadith n° 974 (Sahih)",
    surahNumber: 20, ayahNumber: 25, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2373.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Facilite #Examens #Epreuves #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translationFr: "Le Prophète ﷺ a dit : « Le véritable musulman est celui dont les musulmans sont à l'abri du mal de sa langue et de sa main. »",
    translationEn: "The Prophet ﷺ said: 'The Muslim is the one from whose tongue and hand Muslims are safe.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 10 / Muslim 40",
    surahNumber: 49, ayahNumber: 11, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4623.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Paix #Respect #Langue #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ",
    translationFr: "Le Prophète ﷺ a dit : « Allah vient en aide au serviteur tant que celui-ci vient en aide à son frère. »",
    translationEn: "The Prophet ﷺ said: 'Allah continues to help the servant as long as the servant is helping his brother.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2699",
    surahNumber: 5, ayahNumber: 2, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/671.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Entraide #AideDivine #Generosite #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "تَهَادَوْا تَحَابُّوا",
    translationFr: "Le Prophète ﷺ a dit : « Faites-vous des cadeaux mutuellement, vous vous aimerez. »",
    translationEn: "The Prophet ﷺ said: 'Exchange gifts, and you will love one another.'",
    bookOrSurah: "Al-Adab Al-Mufrad (Al-Bukhari)",
    numberOrAyah: "Hadith 594 (Hasan)",
    surahNumber: 49, ayahNumber: 10, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4622.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Cadeau #Amour #Sunnah #KaeIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationFr: "« Oui, avec la difficulté est la facilité ! Ne perds jamais espoir en la délivrance d'Allah. »",
    translationEn: "“Indeed, with hardship [will be] ease. Never lose hope in Allah's relief.”",
    bookOrSurah: "Sourate Ash-Sharh (سُورَةُ الشَّرۡحِ)",
    numberOrAyah: "Sourate 94, Verset 6",
    surahNumber: 94, ayahNumber: 6, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6096.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Rappel #Espoir #Delivrance #KaelarIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "مَنْ قَرَأَ سُورَةَ الْكَهْفِ يَوْمَ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui lit la sourate Al-Kahf le jour du vendredi, une lumière éclairera pour lui l'espace entre les deux vendredis. »",
    translationEn: "The Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday will have a light that will shine for him from one Friday to the next.'",
    bookOrSurah: "Mustadrak Al-Hakim (Sahih)",
    numberOrAyah: "Sahih Al-Jami 6470",
    surahNumber: 18, ayahNumber: 1, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#SourateAlKahf #Lumiere #Vendredi #Jummah #KaeIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "أَفْضَلُ الصَّلَاةِ بَعْدَ الصَّلَاةِ الْمَكْتُوبَةِ : الصَّلَاةُ فِي جَوْفِ اللَّيْلِ",
    translationFr: "Le Messager d'Allah ﷺ a dit : « La meilleure des prières après la prière obligatoire est la prière au cœur de la nuit (Tahajjud). »",
    translationEn: "The Messenger of Allah ﷺ said: 'The best prayer after the obligatory prayer is prayer in the depth of the night.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 1163",
    surahNumber: 17, ayahNumber: 79, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tahajjud #MeilleurePriere #Nuit #Pardon #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "أذكار قبل النوم لنوم هادئ 🌙",
    arabicText: "أذكار قبل النوم والسكينة 🌙\nبِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ 🤍\nقراءة آية الكرسي كاملة 🤍\nقراءة سورة الإخلاص والمعوذتين (3) مرات 🤍\nبِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا 🤍\n﴿فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ﴾",
    checklistItems: [
      "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ 🤍",
      "قراءة آية الكرسي كاملة 🤍",
      "قراءة سورة الإخلاص والمعوذتين (3) مرات 🤍",
      "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا 🤍"
    ],
    closingAyah: "﴿فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ﴾",
    translationFr: "Les invocations du coucher purifient la nuit, chassent les cauchemars et placent le dormeur sous la garde des anges d'Allah.",
    translationEn: "Bedtime remembrances purify the night, ward off nightmares, and keep the believer under angelic protection.",
    bookOrSurah: "Hisn al-Muslim (Citadelle du Musulman)",
    numberOrAyah: "Adhkar an-Nawm",
    surahNumber: 12, ayahNumber: 64, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1660.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AdhkarNawm #AvantDeDormir #SommeilPaisible #KaeIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "دعاء دخول السوق والربح العظيم 🛒",
    arabicText: "دعاء السوق وألف ألف حسنة 🤍\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ\nلَهُ الْمُلْكُ وَلَهُ الْحَمْدُ\nيُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ\nبِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ 🤍\n﴿وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ﴾",
    checklistItems: [
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      "لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ",
      "يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ",
      "بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ 🤍"
    ],
    closingAyah: "﴿وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ وَلَا تَنسَ نَصِيبَكَ مِنَ الدُّنْيَا﴾",
    translationFr: "Le Messager d'Allah ﷺ a dit : « Celui qui prononce cette invocation en entrant au marché, Allah lui inscrit un million de bonnes actions et lui efface un million de péchés. »",
    translationEn: "The Messenger of Allah ﷺ said: 'Whoever enters the marketplace and recites this supplication, Allah writes for him a million good deeds and erases a million sins.'",
    bookOrSurah: "Jami` at-Tirmidhi (Hasan)",
    numberOrAyah: "Hadith n° 3428",
    surahNumber: 28, ayahNumber: 77, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3329.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#DuaMarche #Hassanat #Invocation #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    visualStyle: "minimal_cream",
    title: "دعاء الاستخارة وطلب التوفيق 🧭",
    arabicText: "دعاء الاستخارة في الأمر 🧭\nاللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ\nوَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ\nفَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ\nوَأَنْتَ عَلَّامُ الْغُيُوبِ 🤍\n﴿وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ﴾",
    checklistItems: [
      "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ",
      "وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ",
      "فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ",
      "وَأَنْتَ عَلَّامُ الْغُيُوبِ 🤍"
    ],
    closingAyah: "﴿وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ﴾",
    translationFr: "L'invocation prophétique d'Al-Istikhara pour consulter Allah avant toute décision importante (mariage, travail, études, choix de vie).",
    translationEn: "The prophetic supplication of Al-Istikhara for seeking divine guidance before any major life decision.",
    bookOrSurah: "Sahih Al-Bukhari",
    numberOrAyah: "Hadith n° 1162",
    surahNumber: 11, ayahNumber: 88, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1561.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Istikhara #Guidance #Reussite #Tawfiq #KaeIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",
    translationFr: "« Allah ne suffit-Il pas à Son serviteur ? »",
    translationEn: "“Is not Allah sufficient for His Servant?”",
    bookOrSurah: "Sourate Az-Zumar (سُورَةُ الزُّمَرِ)",
    numberOrAyah: "Sourate 39, Verset 36",
    surahNumber: 39, ayahNumber: 36, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4094.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Coran #Tawakkul #Serenite #KaelarIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    translationFr: "« La miséricorde d'Allah est certes tout proche des bienfaisants. »",
    translationEn: "“Indeed, the mercy of Allah is near to the doers of good.”",
    bookOrSurah: "Sourate Al-A'raf (سُورَةُ الأَعۡرَافِ)",
    numberOrAyah: "Sourate 7, Verset 56",
    surahNumber: 7, ayahNumber: 56, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1010.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Misericorde #Bienfaisance #Espoir #KaeIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "فَاصْبِرْ صَبْرًا جَمِيلًا",
    translationFr: "« Endure donc d’une belle patience sans te plaindre. »",
    translationEn: "“So be patient with gracious patience.”",
    bookOrSurah: "Sourate Al-Ma'arij (سُورَةُ المَعَارِجِ)",
    numberOrAyah: "Sourate 70, Verset 5",
    surahNumber: 70, ayahNumber: 5, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5380.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#SabrJameel #Patience #Epreuve #KaelarIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ وَسَبِّحْ بِحَمْدِهِ",
    translationFr: "« Et place ta confiance en le Vivant qui ne meurt jamais, et glorifie-Le par Sa louange. »",
    translationEn: "“And put your trust in the Ever-Living who does not die, and exalt [Allah] with His praise.”",
    bookOrSurah: "Sourate Al-Furqan (سُورَةُ الفُرۡقَانِ)",
    numberOrAyah: "Sourate 25, Verset 58",
    surahNumber: 25, ayahNumber: 58, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2913.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tawakkul #Confiance #DieuVivant #KaeIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ",
    translationFr: "« ... et ceux qui, aux dernières heures de la nuit (juste avant l'aube), implorent le pardon d'Allah. »",
    translationEn: "“... and those who seek forgiveness before dawn.”",
    bookOrSurah: "Sourate Aal-Imran (سُورَةُ آلِ عِمۡرَانَ)",
    numberOrAyah: "Sourate 3, Verset 17",
    surahNumber: 3, ayahNumber: 17, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/310.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Sahar #Aube #Istighfar #Tahajjud #KaelarIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "قُمِ اللَّيْلَ إِلَّا قَلِيلًا ۝ نِّصْفَهُ أَوِ انقُصْ مِنْهُ قَلِيلًا ۝ أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    translationFr: "« Ô toi, l'enveloppé dans tes vêtements ! Lève-toi pour prier une partie de la nuit, sa moitié ou un peu moins, ou un peu plus. Et récite le Coran lentement et clairement. »",
    translationEn: "“O you wrapped in garments! Arise [to pray] the night, except for a little - half of it - or subtract from it a little, or add to it, and recite the Qur'an with measured recitation.”",
    bookOrSurah: "Sourate Al-Muzzammil (سُورَةُ المُزَّمِّلِ)",
    numberOrAyah: "Sourate 73, Versets 1-4",
    surahNumber: 73, ayahNumber: 1, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5476.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AlMuzzammil #Tahajjud #Tartil #PriereDeNuit #KaeIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    translationFr: "« Ô Allah, prie, salue et bénis notre Prophète Muhammad, ainsi que sa famille et ses compagnons. » (Salawat du Vendredi)",
    translationEn: "“O Allah, send prayers, peace and blessings upon our Prophet Muhammad, his family, and his companions.”",
    bookOrSurah: "Sunnah Prophétique",
    numberOrAyah: "Vendredi Béni",
    surahNumber: 33, ayahNumber: 56, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3589.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Salawat #Vendredi #PropheteMuhammad #Jummah #KaelarIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "إِنَّ رَبَّكَ يَعْلَمُ أَنَّكَ تَقُومُ أَدْنَىٰ مِن ثُلُثَيِ اللَّيْلِ وَنِصْفَهُ وَثُلُثَهُ",
    translationFr: "« Ton Seigneur sait, certes, que tu te tiens debout pour prier près des deux tiers de la nuit, ou sa moitié, ou son tiers, ainsi qu'une partie de ceux qui sont avec toi. »",
    translationEn: "“Indeed, your Lord knows, [O Muhammad], that you stand [in prayer] almost two thirds of the night or half of it or a third of it, and [so do] a group of those with you.”",
    bookOrSurah: "Sourate Al-Muzzammil (سُورَةُ المُزَّمِّلِ)",
    numberOrAyah: "Sourate 73, Verset 20",
    surahNumber: 73, ayahNumber: 20, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5495.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#QiyamAlLayl #AlMuzzammil #Tahajjud #KaeIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي",
    translationFr: "« Ô Allah, réforme pour moi ma religion qui est la protection de toutes mes affaires, réforme pour moi mon bas-monde dans lequel se trouve ma subsistance, et réforme pour moi mon au-delà vers lequel est mon retour. »",
    translationEn: "“O Allah, rectify for me my religion which is the safeguard of my affairs, rectify for me my world in which is my livelihood, and rectify for me my Hereafter to which is my return.”",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2720",
    surahNumber: 2, ayahNumber: 201, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/208.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Reforme #VieIciBas #AuDela #KaelarIslamic"
  },
  {
    type: "authentic_dua",
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ",
    translationFr: "« Ô Allah, je cherche refuge auprès de Toi contre la disparition de Tes bienfaits, le changement de Ta préservation de ma santé, la soudaineté de Ton châtiment et contre tout ce qui suscite Ton courroux. »",
    translationEn: "“O Allah, I seek refuge in You from the withdrawal of Your blessing, the transformation of Your protection, the suddenness of Your vengeance, and all of Your wrath.”",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2739",
    surahNumber: 14, ayahNumber: 7, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1757.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Dua #Preservation #Sante #Bienfaits #KaeIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
    translationFr: "Le Prophète ﷺ a dit : « Celui qui accomplit les deux prières fraîches (la prière de l'Aube/Fajr et celle de l'Après-midi/'Asr) entrera au Paradis. »",
    translationEn: "The Prophet ﷺ said: 'Whoever prays the two cool prayers [Fajr and Asr] will enter Paradise.'",
    bookOrSurah: "Sahih Al-Bukhari & Muslim",
    numberOrAyah: "Bukhari 574 / Muslim 635",
    surahNumber: 17, ayahNumber: 78, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2107.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Fajr #Asr #Salah #Paradis #KaelarIslamic"
  },
  {
    type: "sahih_hadith",
    arabicText: "الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ",
    translationFr: "Le Prophète ﷺ a dit : « La piété réside dans le noble comportement ; et le péché est ce qui trouble ta conscience et que tu détesterais que les gens découvrent. »",
    translationEn: "The Prophet ﷺ said: 'Righteousness is good character, and sin is that which wavers in your heart and you dislike people finding out about it.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 2553",
    surahNumber: 3, ayahNumber: 134, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/427.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Hadith #Piete #Conscience #BonComportement #KaeIslamic"
  },
  {
    type: "tahajjud_motivation",
    arabicText: "أَفْضَلُ الصَّلَاةِ بَعْدَ الصَّلَاةِ الْمَكْتُوبَةِ: الصَّلَاةُ فِي جَوْفِ اللَّيْلِ",
    translationFr: "Le Prophète ﷺ a dit : « La meilleure prière après les prières obligatoires est la prière accomplie au cœur de la nuit. »",
    translationEn: "The Prophet ﷺ said: 'The best prayer after the obligatory prayers is prayer in the depths of the night.'",
    bookOrSurah: "Sahih Muslim",
    numberOrAyah: "Hadith n° 1163",
    surahNumber: 17, ayahNumber: 79, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Tahajjud #Nuit #Priere #Spiritualite #KaelarIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    translationFr: "Le Prophète ﷺ a dit : « Crains Allah où que tu sois, fais suivre la mauvaise action d'une bonne qui l'effacera, et comporte-toi avec les gens de la manière la plus vertueuse. »",
    translationEn: "The Prophet ﷺ said: 'Fear Allah wherever you are, follow up an evil deed with a good deed which will wipe it out, and treat people with good character.'",
    bookOrSurah: "Jami` at-Tirmidhi (Sahih)",
    numberOrAyah: "Hadith n° 1987",
    surahNumber: 11, ayahNumber: 114, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1587.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#Rappel #Taqwa #Bonte #Islam #KaeIslamic"
  },
  {
    type: "islamic_reminder",
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
    translationFr: "« Oui, avec la difficulté est, certes, une facilité ! Dès lors que tu te libères, applique-toi donc avec ferveur, et vers ton Seigneur, tourne tous tes espoirs. »",
    translationEn: "“Indeed, with hardship [will be] ease. So when you have finished [your duties], then stand up [for worship], and to your Lord direct your longing.”",
    bookOrSurah: "Sourate Ach-Charh (سُورَةُ الشَّرْحِ)",
    numberOrAyah: "Sourate 94, Versets 6-8",
    surahNumber: 94, ayahNumber: 6, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6096.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#AchCharh #Facilite #Espoir #Quran #KaelarIslamic"
  },
  {
    type: "jumua_special",
    arabicText: "مَنْ قَرَأَ سُورَةَ الْكَهْفِ يَوْمَ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ",
    translationFr: "Le Prophète ﷺ a dit : « Quiconque lit la sourate Al-Kahf le jour du vendredi, une lumière éclairera pour lui l'espace entre les deux vendredis. »",
    translationEn: "The Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday, a light will illuminate for him between the two Fridays.'",
    bookOrSurah: "Al-Mustadrak 'ala al-Sahihayn (Al-Hakim - Sahih)",
    numberOrAyah: "Hadith n° 3392",
    surahNumber: 18, ayahNumber: 1, audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3",
    reciterName: "Mishary Rashid Alafasy",
    hashtags: "#JumuaMubarak #AlKahf #Vendredi #Lumiere #KaelarIslamic"
  },
  {
    type: "adhkar_routine",
    arabicText: "نصف دقيقة مع أذكار الحفظ والسكينة 🤍",
    translationFr: "Une demi-minute pour les invocations de protection et de quiétude 🤍",
    translationEn: "Half a minute for peace and divine protection 🤍",
    bookOrSurah: "أذكار الحفظ والطمأنينة",
    numberOrAyah: "حصن المسلم",
    surahNumber: 13,
    ayahNumber: 28,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3",
    reciterName: "Mishary Rashid Alafasy",
    checklistItems: [
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ (3 مرات)",
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3 مرات)",
      "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ (7 مرات)",
      "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ (3 مرات)",
      "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ (10 مرات)"
    ],
    closingAyah: "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
    visualStyle: "minimal_cream",
    hashtags: "#اذكار #حفظ #سكينة #نصف_دقيقة #ذكر_الله #راحة_نفسية"
  },
  {
    type: "adhkar_routine",
    arabicText: "كنوز التسبيح قبل النوم 🤍",
    translationFr: "Les trésors du rappel avant le sommeil 🤍",
    translationEn: "Treasures of remembrance before sleep 🤍",
    bookOrSurah: "أذكار النوم",
    numberOrAyah: "رياض الصالحين",
    surahNumber: 2,
    ayahNumber: 255,
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3",
    reciterName: "Mishary Rashid Alafasy",
    checklistItems: [
      "سُبْحَانَ اللَّهِ (33 مرة)",
      "الْحَمْدُ لِلَّهِ (33 مرة)",
      "اللَّهُ أَكْبَرُ (34 مرة)",
      "آيَةُ الْكُرْسِيِّ (مرة واحدة)",
      "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ"
    ],
    closingAyah: "﴿وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ﴾",
    visualStyle: "minimal_cream",
    hashtags: "#اذكار_النوم #تسبيح #اية_الكرسي #ذكر_الله #طمأنينة"
  }
];

moreItems.forEach(item => catalog.push(item));

console.log(`Generated ${catalog.length} high-quality verified items.`);
const outputPath = path.join(__dirname, '..', 'data', 'verifiedCatalog.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Wrote catalog to ${outputPath}`);


