/**
 * OmniPulse AI - Initial Mock Data & Templates
 * Provides realistic preloaded posts, social accounts, templates, and media assets.
 */

import type { ScheduledPost, SocialAccount, CampaignTemplate, MediaAsset } from '../types/content';
import type { AISettings } from '../types/ai';

export const INITIAL_SETTINGS: AISettings = {
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  imagenApiKey: '',
  videoApiEndpoint: 'https://api.runwayml.com/v1/generate',
  videoApiKey: '',
  useLiveApi: false,
  defaultLanguage: 'fr',
};

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: '6a8f4dcfccaf649a672158cf',
    platform: 'tiktok',
    username: '@kaelar.islamic',
    displayName: 'kaelarislamic (TikTok)',
    avatarUrl: 'https://buffer-channel-avatars-bucket.s3.amazonaws.com/6a8f4dcfccaf649a672158cf_1787776464391',
    connected: true,
    followerCount: 1240,
    lastSync: new Date().toISOString(),
    accountType: 'buffer'
  },
  {
    id: '6a8f4ce9ccaf649a672154f6',
    platform: 'instagram',
    username: '@kae.islamic',
    displayName: 'kae.islamic (Instagram)',
    avatarUrl: 'https://buffer-channel-avatars-bucket.s3.amazonaws.com/6a8f4ce9ccaf649a672154f6_1787776234221',
    connected: true,
    followerCount: 3580,
    lastSync: new Date().toISOString(),
    accountType: 'buffer'
  },
  {
    id: '6a999279065799be467f1f35',
    platform: 'youtube',
    username: '@kaelar.islamics',
    displayName: 'kaelar.islamics (YouTube Shorts)',
    avatarUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followerCount: 0,
    lastSync: new Date().toISOString(),
    accountType: 'buffer'
  },
  {
    id: 'acc-x-1',
    platform: 'x',
    username: '@omnipulse_app',
    displayName: 'OmniPulse Studio ⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followerCount: 15200,
    lastSync: '2026-08-25T18:10:00Z',
  },
  {
    id: 'acc-linkedin-1',
    platform: 'linkedin',
    username: 'omnipulse-technologies',
    displayName: 'OmniPulse Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followerCount: 9350,
    lastSync: '2026-08-25T12:00:00Z',
  },
  {
    id: 'acc-fb-1',
    platform: 'facebook',
    username: 'OmniPulseOfficial',
    displayName: 'OmniPulse Community',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followerCount: 5120,
    lastSync: '2026-08-20T09:00:00Z',
  },
];

export const INITIAL_MEDIA_LIBRARY: MediaAsset[] = [
  {
    id: 'med-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    promptUsed: 'Futuristic AI hologram neural interface glowing in neon purple and cyan 8k render',
    aspectRatio: '1:1',
    createdAt: '2026-08-24T10:00:00Z',
    engine: 'imagen3',
  },
  {
    id: 'med-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    promptUsed: 'Sleek luxury workspace with neon accents, dark mode glowing screens, modern minimalist aesthetic',
    aspectRatio: '16:9',
    createdAt: '2026-08-24T12:30:00Z',
    engine: 'imagen3',
  },
  {
    id: 'med-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    promptUsed: 'Cyberpunk glass sphere with glowing network data particles, vertical portrait view',
    aspectRatio: '9:16',
    createdAt: '2026-08-25T08:15:00Z',
    engine: 'imagen3',
  },
  {
    id: 'med-4',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    promptUsed: 'Dynamic hyperlapse zoom into digital neural brain pulsing with electrical light nodes',
    aspectRatio: '9:16',
    durationSeconds: 10,
    createdAt: '2026-08-25T15:20:00Z',
    engine: 'video_ai',
  },
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'post-101',
    title: 'Lancement du nouveau moteur d’automatisation IA',
    originalIdea: 'Annoncer la sortie de notre plateforme tout-en-un qui crée et programme des contenus sur 5 réseaux en 30 secondes.',
    platforms: ['tiktok', 'instagram', 'linkedin', 'x'],
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // dans 4h
    status: 'scheduled',
    campaignTag: 'Lancement V2',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-25T10:00:00Z',
    media: INITIAL_MEDIA_LIBRARY[0],
    platformContent: {
      tiktok: {
        hook: 'Arrête de perdre 4h par jour sur tes réseaux sociaux ! 🛑',
        videoScript: '[Écran 1] Montre l’écran de création vide.\n[Écran 2] Tape un mot-clé.\n[Écran 3] Boom : Gemini + Imagen génèrent 5 posts + visuels en 1 clic.\n[Call to action] Commente "PULSE" pour tester !',
        text: 'Le futur de la création de contenu est là. 5 réseaux en 1 clic grâce à l’IA. 🚀 #automation #contentcreator #ia #tech #marketingdigital',
        hashtags: ['#automation', '#contentcreator', '#ia', '#tech', '#growth'],
        audioTrackSuggestion: 'Tech Ambient Synthwave (Trending)',
      },
      instagram: {
        hook: 'Et si tu pouvais planifier 1 mois de contenu en 15 minutes chrono ? ⏳✨',
        text: 'La vraie force d’un créateur ou d’une marque, ce n’est pas de passer sa vie à rédiger, c’est d’avoir un système fluide.\n\nDécouvrez comment nous combinons Gemini Flash pour le texte et Imagen 3 pour les visuels afin de propulser votre présence sur tous vos réseaux.\n\n👇 Enregistre ce post pour booster ta stratégie !',
        callToAction: 'Lien en bio pour démarrer gratuitement.',
        hashtags: ['#socialmediamanager', '#automatisation', '#intelligenceartificielle', '#creativite', '#productivite'],
      },
      linkedin: {
        hook: 'L’automatisation des réseaux sociaux en 2026 n’est plus un luxe, c’est un impératif stratégique.',
        text: 'J’ai vu trop d’équipes marketing épuisées à reformater le même post pour TikTok, LinkedIn et X.\n\n💡 Voici notre nouvelle approche :\n• Un moteur textuel multimodal (Gemini Flash) qui comprend la tonalité B2B\n• Une génération visuelle chirurgicale (Imagen 3)\n• Une distribution automatisée et synchronisée\n\nRésultat : +320% de productivité éditoriale dès la première semaine.\n\nComment gérez-vous votre cross-posting aujourd’hui ? Débattons-en en commentaires.',
        callToAction: 'Partagez votre avis ou demandez une démonstration.',
        hashtags: ['#IA', '#MarketingStrategy', '#Productivite', '#Innovation', '#SocialMedia'],
      },
      x: {
        hook: 'Comment créer et programmer du contenu sur 5 réseaux en 30s chrono 🧵👇',
        text: 'Comment créer et programmer du contenu sur 5 réseaux en 30s chrono 🧵👇\n\n1/ Fini le copier-coller sans fin.\n2/ Gemini Flash adapte le format instantanément.\n3/ Imagen 3 génère des visuels sur mesure.\n\nLe résultat en vidéo ci-dessous ⚡ #IA #Productivity',
        hashtags: ['#IA', '#Productivity', '#BuildInPublic', '#Tech'],
      },
      facebook: {
        hook: 'Prêt à automatiser vos réseaux sociaux sans perdre en authenticité ?',
        text: 'Prêt à automatiser vos réseaux sociaux sans perdre en authenticité ?\n\nDécouvrez notre nouvel outil IA tout-en-un conçu pour les créateurs, freelances et agences modernes.',
        callToAction: 'Cliquez ci-dessous pour découvrir la démo.',
        hashtags: ['#entrepreneuriat', '#marketing', '#socialmedia'],
      },
    },
  },
  {
    id: 'post-102',
    title: '5 conseils pour exploser son taux d’engagement',
    originalIdea: 'Partager 5 astuces concrètes d’optimisation du taux d’engagement avec un carrousel et une vidéo courte.',
    platforms: ['tiktok', 'instagram', 'x'],
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(), // demain
    status: 'scheduled',
    campaignTag: 'Croissance',
    createdAt: '2026-08-25T11:20:00Z',
    updatedAt: '2026-08-25T11:20:00Z',
    media: INITIAL_MEDIA_LIBRARY[2],
    platformContent: {
      tiktok: {
        hook: '90% des créateurs font cette erreur sur leurs hooks TikTok ! ⚠️',
        videoScript: 'Les 3 premières secondes décident de tout. Voici la formule magique : Problème + Curiosité + Solution immédiate.',
        text: 'La formule ultime pour retenir l’attention jusqu’à la dernière seconde ! 🔥 #tiktoktips #growth #engagement #astuces',
        hashtags: ['#tiktoktips', '#growth', '#engagement', '#viralvideo'],
        audioTrackSuggestion: 'Deep Bass Viral Beat',
      },
      instagram: {
        hook: '5 règles d’or pour doubler ton engagement dès cette semaine 📈',
        text: 'Swipe vers la droite pour découvrir les 5 piliers de la rétention d’audience en 2026 :\n\n1. Hook visuel dans la 1ère seconde\n2. Sauts de ligne pour la lisibilité\n3. Micro-appels à l’action\n4. Répondre aux commentaires dans les 30 min\n5. Utiliser des visuels percutants créés par Imagen 3\n\nLequel appliques-tu déjà ?',
        callToAction: 'Enregistre ce post pour ton prochain calendrier.',
        hashtags: ['#conseilsmarketing', '#growthhacking', '#instagramgrowth', '#createur'],
      },
      facebook: {
        text: '5 conseils simples mais redoutables pour booster votre audience.',
        hashtags: ['#marketingtips', '#reseauxsociaux'],
      },
      linkedin: {
        text: 'L’engagement organique n’est pas mort. Voici 5 méthodes validées par la data.',
        hashtags: ['#SocialMediaB2B', '#ContentMarketing'],
      },
      x: {
        hook: '5 règles d’or pour doubler votre engagement sur les réseaux :',
        text: '5 règles d’or pour doubler votre engagement sur les réseaux :\n\n1. Hook tranchant\n2. Rythme rapide\n3. Clarté maximale\n4. Débat en réponse\n5. Régularité algorithmique\n\nQuel est votre meilleur levier ? 💬',
        hashtags: ['#Growth', '#Engagement', '#SocialMedia'],
      },
    },
  },
  {
    id: 'post-103',
    title: 'Coulisses & Storytelling : Comment nous avons conçu OmniPulse Studio',
    originalIdea: 'Raconter l’histoire derrière le développement de la plateforme avec Gemini et Imagen.',
    platforms: ['linkedin', 'x'],
    scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // publié il y a 12h
    status: 'published',
    campaignTag: 'Storytelling',
    createdAt: '2026-08-24T09:00:00Z',
    updatedAt: '2026-08-25T01:00:00Z',
    media: INITIAL_MEDIA_LIBRARY[1],
    engagementStats: {
      views: 14850,
      likes: 890,
      shares: 142,
      comments: 67,
    },
    platformContent: {
      tiktok: { text: '', hashtags: [] },
      instagram: { text: '', hashtags: [] },
      facebook: { text: '', hashtags: [] },
      linkedin: {
        hook: 'Il y a 6 mois, nous avons pris un pari fou : automatiser 100% de notre pipeline de création sans sacrifier la qualité.',
        text: 'Il y a 6 mois, nous avons pris un pari fou : automatiser 100% de notre pipeline de création sans sacrifier la qualité.\n\nEn couplant les capacités de raisonnement ultra-rapides de Gemini Flash avec le photoréalisme d’Imagen 3, nous avons réussi à éliminer 80% des tâches répétitives.\n\nRésultat : Plus de temps pour la stratégie, l’interaction humaine et l’innovation.\n\nMerci à toute l’équipe pour ce jalon ! 🥂',
        callToAction: 'Laissez un mot d’encouragement à l’équipe.',
        hashtags: ['#Innovation', '#GenerativeAI', '#TechStory', '#Leadership'],
      },
      x: {
        hook: 'Pourquoi nous avons parié sur Gemini Flash + Imagen 3 pour automatiser nos réseaux 🧵',
        text: 'Pourquoi nous avons parié sur Gemini Flash + Imagen 3 pour automatiser nos réseaux 🧵\n\n• Vitesse d’inférence imbattable (<1s)\n• Adaptation stylistique native par plateforme\n• Respect strict des formats d’images\n\nLa suite dans le thread 👇',
        hashtags: ['#Gemini', '#Imagen3', '#AIStudio'],
      },
    },
  },
];

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'camp-sprint-7',
    name: 'Sprint de Contenu 7 Jours (Omniprésence)',
    description: 'Crée automatiquement 7 posts stratégiques distribués sur la semaine (Lundi Hook, Mercredi Valeur, Vendredi Storytelling, Dimanche Récap).',
    days: 7,
    targetAudience: 'Créateurs, Entrepreneurs, Agences',
    tone: 'viral',
    postsPerDay: 1,
  },
  {
    id: 'camp-product-launch',
    name: 'Campagne de Lancement Produit (Teaser -> Révélation -> Vente)',
    description: 'Séquence en 5 phases pour maximiser la curiosité, l’engagement et les conversions lors d’une sortie officielle.',
    days: 5,
    targetAudience: 'Clients cibles & Communauté',
    tone: 'inspiring',
    postsPerDay: 1,
  },
  {
    id: 'camp-thought-leadership',
    name: 'B2B Thought Leadership & Expertise (LinkedIn & X)',
    description: '10 publications axées sur l’analyse sectorielle, études de cas et prises de position fortes.',
    days: 10,
    targetAudience: 'Professionnels, Décideurs, Recruteurs',
    tone: 'professional',
    postsPerDay: 1,
  },
];

export const PROMPT_INSPIRATIONS = [
  {
    category: '🚀 Lancement & Produit',
    title: 'Lancement d’une nouvelle fonctionnalité IA',
    prompt: 'Présenter le nouveau mode d’automatisation vidéo IA qui transforme un script en vidéo TikTok et Reel en 10 secondes.',
    tone: 'viral',
  },
  {
    category: '💡 Éducatif & Valeur',
    title: '3 erreurs courantes en Social Media',
    prompt: 'Expliquer pourquoi poster sans stratégie de rétention ruine votre portée sur TikTok et Instagram en 2026.',
    tone: 'educational',
  },
  {
    category: '📖 Storytelling & Coulisses',
    title: 'Comment j’ai gagné 10 000 abonnés en 30 jours',
    prompt: 'Raconter l’histoire d’une marque qui est passée de 0 à 10k abonnés en publiant 2 fois par jour avec un calendrier IA optimisé.',
    tone: 'storytelling',
  },
  {
    category: '🔥 Débat & Opinion Tranchée',
    title: 'L’IA va-t-elle remplacer les community managers ?',
    prompt: 'Donner un avis nuancé mais percutant sur la symbiose entre la créativité humaine et les assistants IA comme Gemini Flash.',
    tone: 'professional',
  },
];
