const b64 = 'QVEuQWI4Uk42TEc2WUxxSWdoU1hnb282RVR5ZEYyeU1ZX1FyQlV4SXhhNHJGWFB4YzZ2Umc=';
const key = Buffer.from(b64, 'base64').toString();
const topic = 'kaffarah';
const category = 'quran_verse';

const prompt = `Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim) ou des invocations authentiques de Hisn al-Muslim.
- Fournis TOUJOURS la référence exacte.
- Si le sujet est "${topic}", trouve le verset coranique ou hadith sahih le plus pertinent (ex: l'expiation des fautes par les bonnes actions, Sourate Hud 114, ou hadith des 5 prières).
- Si c'est un verset du Coran, donne le numéro exact de la sourate (1 à 114) et le numéro du verset.
- Génère le contenu en 3 langues : Arabe (avec tashkeel complet), Français et Anglais.

Sujet demandé : "${topic}" (Catégorie : "${category}")

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "L'expiation des péchés (Kaffarah)",
  "arabicText": "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ ۚ ذَٰلِكَ ذِكْرَىٰ لِلذَّاكِرِينَ",
  "phonetic": "Innal-hasanati yudh-hibnas-sayyi-at, dhalika dhikra lidh-dhakirin",
  "translationFr": "Les bonnes œuvres dissipent les mauvaises. Cela est une exhortation pour ceux qui réfléchissent.",
  "translationEn": "Indeed, good deeds do away with misdeeds. That is a reminder for those who remember.",
  "source": {
    "type": "quran",
    "bookOrSurah": "Sourate Hud",
    "numberOrAyah": "Sourate 11, Verset 114",
    "surahNumber": 11,
    "ayahNumber": 114,
    "arabicReference": "سورة هود ١١٤",
    "authenticityGrade": "Coran (Parole d'Allah)",
    "verifiedBy": "Texte Sacré Authentifié"
  },
  "reflection": {
    "fr": "Chaque bonne action, chaque prière sincère et chaque aumône efface nos erreurs passées.",
    "en": "Every good deed, sincere prayer, and act of charity erases past shortcomings.",
    "ar": "الحسنات تمحو السيئات، وباب التوبة والاستغفار مفتوح دائماً."
  },
  "hashtags": {
    "fr": ["#Islam", "#Kaffarah", "#Coran", "#Pardon"],
    "en": ["#Quran", "#Forgiveness", "#GoodDeeds", "#IslamQuotes"],
    "ar": ["#قرآن_كريم", "#كفارة", "#توبة", "#استغفار"]
  }
}`;

async function test() {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest', 'gemini-3.6-flash'];
  for (const m of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
            responseMimeType: 'application/json'
          }
        })
      });
      console.log(`Model ${m}: Status ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Result text:', data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 300));
        return;
      } else {
        console.log('Error text:', await res.text());
      }
    } catch (e) {
      console.log(`Model ${m} fetch error:`, e.message);
    }
  }
}

test();
