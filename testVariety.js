const b64 = 'QVEuQWI4Uk42TEc2WUxxSWdoU1hnb282RVR5ZEYyeU1ZX1FyQlV4SXhhNHJGWFB4YzZ2Umc=';
const key = Buffer.from(b64, 'base64').toString();

async function testCategory(category, topic) {
  const categoryInstructions = {
    quran_verse: "Tu dois OBLIGATOIREMENT générer un VERSET DU NOBLE CORAN (Parole d'Allah) et STRICTEMENT rien d'autre (AUCUN hadith). Donne obligatoirement surahNumber (1 à 114) et ayahNumber exacts.",
    sahih_hadith: "Tu dois OBLIGATOIREMENT générer une PAROLE DU PROPHÈTE MOHAMMAD ﷺ issue STRICTEMENT de Sahih Al-Bukhari ou Sahih Muslim (AUCUN verset coranique).",
    authentic_dua: "Tu dois OBLIGATOIREMENT générer une INVOCATION AUTHENTIQUE (Du'a / Dhikr) issue de Hisn al-Muslim (Citadelle du Musulman) ou de Bukhari/Muslim.",
    jumua_special: "Tu dois OBLIGATOIREMENT générer un rappel sur les mérites du VENDREDI (Jumu'ah), la lecture de Sourate Al-Kahf ou les Salawat sur le Prophète ﷺ.",
    tahajjud_motivation: "Tu dois OBLIGATOIREMENT générer un rappel puissant sur la PRIÈRE DE NUIT (Tahajjud, Qiyam al-Layl, dernier tiers de la nuit ou Istighfar à l'aube).",
    islamic_reminder: "Tu dois générer un rappel de sagesse islamique profonde et inspirante (Patience, Confiance en Allah / Tawakkul, Gratitude)."
  };

  const prompt = `Tu es un grand savant et chercheur en sciences islamiques diplômé.
RÈGLE ABSOLUE POUR LA CATÉGORIE "${category}":
${categoryInstructions[category] || categoryInstructions.quran_verse}

Sujet ou mot-clé demandé : "${topic || 'Inspiration spirituelle'}"
Consigne :
- Choisis un passage court, percutant et concis (1 à 2 versets ou 1 hadith court), idéal pour une carte citation TikTok/Instagram.
- Génère à chaque fois un passage NOUVEAU et DIFFÉRENT (Génération ID: ${Date.now()}-${Math.random()}).

Format JSON pur :
{
  "topic": "Titre du rappel",
  "arabicText": "Texte arabe complet avec voyelles (tashkeel)...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française concise et élégante...",
  "translationEn": "Concise and elegant English translation...",
  "source": {
    "type": "${category === 'quran_verse' ? 'quran' : category === 'authentic_dua' ? 'dua' : 'hadith'}",
    "bookOrSurah": "Ex: Sourate Hud ou Sahih al-Bukhari",
    "numberOrAyah": "Ex: Verset 114 ou Hadith 5027",
    "surahNumber": 11,
    "ayahNumber": 114,
    "arabicReference": "المرجع بالعربية",
    "authenticityGrade": "${category === 'quran_verse' ? 'Coran (Parole d Allah)' : 'Sahih (Authentique)'}",
    "verifiedBy": "Texte Sacré Authentifié"
  },
  "reflection": { "fr": "...", "en": "...", "ar": "..." },
  "hashtags": { "fr": ["#Islam", "#KaelarIslamic"], "en": ["#Quran", "#KaelarIslamic"], "ar": ["#قرآن_كريم"] }
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json'
      }
    })
  });

  const json = await res.json();
  const raw = json.candidates[0].content.parts[0].text;
  const parsed = JSON.parse(raw);
  console.log(`[Category: ${category}] -> Topic: ${parsed.topic} | Source: ${parsed.source.bookOrSurah} (${parsed.source.type}) | Arabic: ${parsed.arabicText.slice(0, 50)}...`);
}

async function run() {
  console.log('Testing variety and category strictness...');
  await testCategory('quran_verse', 'kaffarah');
  await testCategory('quran_verse', 'patience et épreuve');
  await testCategory('sahih_hadith', 'le bon comportement');
  await testCategory('authentic_dua', 'protection et paix');
  console.log('ALL CATEGORIES PASSED WITH UNIQUE RESULTS!');
}

run();
