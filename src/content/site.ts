// Source unique de tous les faits affichés sur le site.
// Règle : rien d'inventé. Une information non fournie par Roman reste un TODO visible.
// Source : prompt-site-romanmitride_1.md + réponses de Roman du 2026-09-25.

export const TODO = (what: string) => `[À compléter : ${what}]`;

export const identite = {
  nom: 'Roman Mitride',
  metier: 'Rider professionnel de BMX Flatland',
  ville: 'Pau',
  zone: 'Basé à Pau (Sud-Ouest), intervient dans toute la France',
  telephone: '0628783455',
  telephoneIntl: '+33628783455',
  email: 'romanmitridebmx@gmail.com',
  instagram: 'https://www.instagram.com/romanmitride/',
  tiktok: 'https://www.tiktok.com/@roman_mitride',
};

// Palmarès : n'afficher que du sourcé (fatbmx.com, vérifié le 2026-09-25).
// Le « 17e / 25e mondial » n'est pas sourcé : en attente de validation de Roman.
export const palmares = [
  { rang: '6e', libelle: 'Championnats de France', annee: 2023,
    source: 'https://www.fatbmx.com/bmx-freestyle/item/58777-2023-french-national-flatland-championship-flatland-saint-quentin-en-yvelines-france' },
  // TODO(Roman) : valider « 28e de la Coupe du monde UCI 2025 » ou fournir la source du classement mondial.
];

// Phrase factuelle reprise à l'identique partout (GEO, section 9 du prompt).
// TODO(Roman) : compléter avec le classement mondial une fois sourcé.
export const phraseCitable =
  'Roman Mitride est un rider professionnel de BMX Flatland, 6e aux Championnats de France 2023, ' +
  'qui propose des shows, des initiations et des tournages partout en France.';

export const tarifs = {
  showAPartirDe: 400,
  mentionDevis:
    'Chaque devis est construit en fonction de la prestation : il est donc discuté au téléphone avant sa rédaction.',
};

export const prestations = [
  {
    slug: 'show-bmx',
    titre: 'Show solo',
    resume: 'Démonstration de BMX Flatland, avec animation au micro possible.',
    duree: TODO('durée du show solo'),
  },
  {
    slug: 'show-bmx',
    titre: 'Show duo',
    resume: 'Show à deux riders pros, avec Kevin Meyer, Anatole Rahain ou Maxime Luchetti.',
    partenaires: ['Kevin Meyer', 'Anatole Rahain', 'Maxime Luchetti'],
    duree: TODO('durée du show duo'),
  },
  {
    slug: 'initiation-bmx',
    titre: 'Initiation BMX',
    resume: "Découverte du BMX encadrée, jusqu'à 8 vélos fournis.",
    velosFournis: 8,
  },
  {
    slug: 'tournage-bmx',
    titre: 'Tournages & images',
    resume: 'Vidéo, photo, publicité, clip, contenu de marque.',
    // Décision de Roman : aucune référence de tournage citée, jamais le mot « cascadeur ».
  },
] as const;

export const publics = [
  'Festivals', 'Collectivités', 'Salons', 'Entreprises', 'Écoles', 'Marques et agences',
];

export const editeur = {
  association: 'BMX Flatland Pau',
  forme: 'Association loi 1901',
  siret: '932 184 278 00012',
  siege: TODO('adresse exacte du siège à Bordeaux (372 avenue Thiers, 33000 Bordeaux ?)'),
  directeurPublication: 'Roman Mitride',
};

export const hebergeur = {
  nom: 'OVH SAS',
  adresse: '2 rue Kellermann, 59100 Roubaix, France',
  telephone: '+33 9 72 10 10 07',
};
