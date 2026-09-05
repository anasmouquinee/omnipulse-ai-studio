const b64 = 'QVEuQWI4Uk42TEc2WUxxSWdoU1hnb282RVR5ZEYyeU1ZX1FyQlV4SXhhNHJGWFB4YzZ2Umc=';
const key = Buffer.from(b64, 'base64').toString();

const prompt = `Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kae.islamic & @kaelar.islamic).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim, Tirmidhi, Abu Dawud) ou des invocations authentiques de Hisn al-Muslim (Citadelle du Musulman).
- Si le sujet demandé est "kafarah", trouve le verset coranique, hadith ou invocation le plus pertinent pour ce thème précis (ex: expiation des péchés).
- Format de réponse OBLIGATOIRE en JSON pur (sans markdown) :
{
  "topic": "L'expiation des péchés (Kaffarah)",
  "arabicText": "Texte arabe...",
  "phonetic": "Transcription...",
  "translationFr": "Traduction...",
  "translationEn": "Translation...",
  "source": {
    "type": "hadith",
    "bookOrSurah": "Sahih Muslim",
    "numberOrAyah": "Hadith 233",
    "arabicReference": "صحيح مسلم",
    "authenticityGrade": "Sahih",
    "verifiedBy": "Muslim"
  },
  "reflection": { "fr": "...", "en": "...", "ar": "..." },
  "hashtags": { "fr": [], "en": [], "ar": [] }
}`;

async function run() {
  const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash'];
  for (const m of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
            responseMimeType: 'application/json'
          }
        })
      });
      console.log(m, 'status:', res.status);
      if (res.ok) {
        const json = await res.json();
        console.log(m, 'result:', json.candidates[0].content.parts[0].text.slice(0, 300));
        return;
      } else {
        console.log(m, 'error:', await res.text());
      }
    } catch (e) {
      console.log(m, 'catch:', e.message);
    }
  }
}

run();
