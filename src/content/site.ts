// Source unique de tous les faits et textes affichés sur le site.
// Règle : rien d'inventé. Une information non fournie par Roman reste un TODO visible.
// Sources : prompt-site-romanmitride_1.md + réponses de Roman (2026-09-25 et 2026-09-28).

export const TODO = (what: string) => `[À compléter : ${what}]`;

export const identite = {
  nom: 'Roman Mitride',
  metier: 'Rider professionnel de BMX Flatland',
  villes: 'Pau et Bordeaux',
  zone: 'Basé à Pau et à Bordeaux, j’interviens dans toute la France.',
  zoneCourte: 'Toute la France, depuis Pau et Bordeaux',
  telephone: '0628783455',
  email: 'romanmitridebmx@gmail.com',
  instagram: 'https://www.instagram.com/romanmitride/',
  tiktok: 'https://www.tiktok.com/@roman_mitride',
};

// Palmarès : uniquement du sourcé. « 17e mondial » serait trompeur (classement général 2025 : 28e sur 33).
export const palmares = [
  { rang: '17e', libelle: 'Coupe du monde UCI – FISE Montpellier', annee: 2025,
    source: 'https://www.uci.org/competition-details/2025/BFR/73825' },
  { rang: '6e', libelle: 'Championnats de France', annee: 2023,
    source: 'https://www.fatbmx.com/bmx-freestyle/item/58777-2023-french-national-flatland-championship-flatland-saint-quentin-en-yvelines-france' },
];

// Phrase factuelle reprise à l'identique partout (référencement IA).
export const phraseCitable =
  'Roman Mitride est un rider professionnel de BMX Flatland, 17e de la Coupe du monde UCI au FISE Montpellier 2025 ' +
  'et 6e aux Championnats de France 2023, qui propose des shows, des initiations et des tournages partout en France.';

export const flatlandEnDeuxPhrases =
  'Le BMX Flatland, c’est l’art de faire tourner, pivoter et tenir en équilibre un BMX sur un sol plat, sans rampe ni module. ' +
  'Chaque figure s’enchaîne comme une chorégraphie : un spectacle technique et fluide, lisible par tous les publics.';

export const tarifs = {
  showAPartirDe: 400,
  mentionDevis:
    'Chaque devis est construit en fonction de la prestation : il est donc discuté au téléphone avant sa rédaction.',
};

// Conditions techniques (confirmées par Roman le 2026-09-29).
export const technique = {
  surface: '40 m² minimum',
};

// Titre de la section « À propos » de l'accueil.
export const aPropos = {
  titre: 'Rider professionnel,',
  titreAccent: 'entre Pau et Bordeaux',
};

export const partenairesDuo = ['Kevin Meyer', 'Anatole Rahain', 'Maxime Luchetti'];

export const credits = {
  weidemann: 'Olivier Weidemann',
  // Photo de show avec le public : l'auteur n'est pas Stéphane Bar (correction de Roman, 2026-09-28).
  public: TODO('photographe de la photo de show avec le public'),
};

// Cartes de l'accueil (4 prestations, 3 pages dédiées).
export const cartes = [
  { titre: 'Show solo', href: '/show-bmx', video: 'demonstration-bmx-flatland-contest',
    texte: 'Une démonstration de 5 à 15 minutes, plusieurs passages possibles dans la journée, avec animation au micro.' },
  { titre: 'Show duo', href: '/show-bmx#duo', video: 'show-bmx-flatland-public',
    texte: `30 à 40 minutes à deux riders pros : ${partenairesDuo.join(', ').replace(/, ([^,]*)$/, ' ou $1')}.` },
  { titre: 'Initiation BMX', href: '/initiation-bmx', video: 'initiation-bmx-gymnase',
    texte: 'Faire essayer le BMX à votre public, jusqu’à 8 vélos fournis.' },
  { titre: 'Tournages & images', href: '/tournage-bmx', video: 'hero-bmx-flatland-coucher-de-soleil',
    texte: 'Vidéo, photo, publicité, clip, contenu de marque : un rider pour vos images.' },
];

export const publics = [
  { titre: 'Festivals', texte: 'Un temps fort visuel entre deux concerts ou en déambulation.' },
  { titre: 'Collectivités', texte: 'Fêtes de ville, marchés de Noël, journées sportives.' },
  { titre: 'Salons', texte: 'Attirer du monde sur un stand ou animer une allée.' },
  { titre: 'Entreprises', texte: 'Séminaires, soirées, inaugurations, journées d’équipe.' },
  { titre: 'Écoles', texte: 'Une démonstration pour découvrir une discipline spectaculaire du BMX.' },
  { titre: 'Marques et agences', texte: 'Contenus, tournages, activations événementielles.' },
];

// Vitrine « Instagram » : vidéos hébergées sur le site (aucun cookie), avec la bande-son de chaque publication.
// Correspondance vérifiée par corrélation d'images (2026-09-29). Pour changer : scripts/media.sh, section REELS.
export const reels = [
  { video: 'reel-roman-mitride-1', post: 'https://www.instagram.com/reel/DWW8KA3jKem/' },
  { video: 'reel-roman-mitride-2', post: 'https://www.instagram.com/reel/DJ6vlHuMd2u/' },
  { video: 'reel-roman-mitride-3', post: 'https://www.instagram.com/reel/DDH2P0vNPvK/' },
];

export const editeur = {
  association: 'BMX Flatland Pau',
  forme: 'Association loi 1901',
  siret: '932 184 278 00012',
  siege: '372 avenue Thiers, 33000 Bordeaux',
  directeurPublication: 'Roman Mitride',
};

export const hebergeur = {
  nom: 'OVH SAS',
  adresse: '2 rue Kellermann, 59100 Roubaix, France',
  telephone: '+33 9 72 10 10 07',
};

export const faq = [
  { q: 'Combien coûte un show de BMX Flatland ?',
    r: `Les shows commencent à ${tarifs.showAPartirDe} €. ${tarifs.mentionDevis}`, lien: '/show-bmx' },
  { q: 'Combien de temps dure un show ?',
    r: 'Un show solo dure entre 5 et 15 minutes, et plusieurs passages sont possibles dans la même journée. Un show duo dure entre 30 et 40 minutes.', lien: '/show-bmx' },
  { q: 'Qu’est-ce que le BMX Flatland ?', r: flatlandEnDeuxPhrases, lien: '/#a-propos' },
  { q: 'Faut-il une rampe ou une structure ?',
    r: 'Non. Le Flatland se pratique sur un sol plat : pas de rampe, pas de module à installer. C’est ce qui le rend facile à accueillir sur une place, dans une salle ou sur un stand.', lien: '/show-bmx' },
  { q: 'Quelle surface faut-il prévoir ?',
    r: `${technique.surface}, sur un sol plat et adhérent : pas de rampe ni de module à installer.`, lien: '/show-bmx' },
  { q: 'Vous déplacez-vous partout en France ?',
    r: identite.zone + ' Les frais de déplacement sont intégrés au devis.', lien: '/#devis' },
  { q: 'Combien de personnes peuvent participer à une initiation ?',
    r: 'Jusqu’à 8 vélos sont fournis pour l’initiation. Le déroulé est adapté à votre public lors de l’échange téléphonique.', lien: '/initiation-bmx' },
  { q: 'Le show peut-il être commenté au micro ?',
    r: 'Oui, le show solo peut être accompagné d’une animation au micro pour expliquer les figures au public.', lien: '/show-bmx' },
  { q: 'Avec qui se fait le show duo ?',
    r: `Avec un autre rider professionnel : ${partenairesDuo.join(', ').replace(/, ([^,]*)$/, ' ou $1')}, selon les disponibilités.`, lien: '/show-bmx#duo' },
  { q: 'Comment obtenir un devis ?',
    r: 'Par téléphone, par e-mail ou via le formulaire. Chaque devis est adapté à votre événement et discuté au téléphone avant d’être rédigé.', lien: '/#devis' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MÉDIAS : quelle photo / vidéo va où. Photos dans src/assets/photos/, vidéos dans public/media/
// (nom sans extension). Pour ajouter une vidéo : la déclarer dans scripts/media.sh puis lancer le script.
// ─────────────────────────────────────────────────────────────────────────────
export const medias = {
  hero: {
    ordinateur: 'hero-bmx-flatland-mur-raye.jpg',
    mobile: 'bmx-flatland-mur-raye-face.jpg',
    alt: 'Roman Mitride en figure de BMX Flatland, roue avant levée, devant un mur à rayures noires et blanches',
  },
  portrait: {
    photo: 'portrait-roman-mitride.webp',
    alt: 'Portrait de Roman Mitride, casquette noire, tenant son BMX devant un bâtiment moderne',
  },
  pages: {
    show: { photo: 'show-bmx-flatland-public.jpg', video: 'show-bmx-flatland-public',
      alt: 'Roman Mitride pendant un show de BMX Flatland, devant un public souriant' },
    // TODO(Roman) : vidéo d'initiation plus représentative à fournir (l'actuelle ne colle pas).
    initiation: { photo: 'bmx-flatland-manege-heure-doree.jpg', video: 'initiation-bmx-gymnase',
      alt: 'Roman Mitride en équilibre sur la roue avant de son BMX, sur un miroir d’eau à l’heure dorée' },
    tournage: { photo: 'bmx-flatland-eclaboussure.jpg', video: 'bmx-flatland-esplanade',
      alt: 'Roman Mitride en figure de BMX Flatland dans un miroir d’eau, gerbe d’éclaboussures sous un ciel d’orage' },
  },
  // Galerie de l'accueil : [fichier, texte alternatif (décrire la figure et le lieu), photographe]. Les 6 premières s'affichent sur mobile.
  galerie: [
    ['bmx-flatland-manege-heure-doree.jpg', 'Roman Mitride en équilibre sur la roue avant, sur un miroir d’eau devant un manège à l’heure dorée', credits.weidemann],
    ['show-bmx-flatland-public.jpg', 'Roman Mitride pendant un show de BMX Flatland, le public souriant derrière les barrières', credits.public],
    ['bmx-flatland-eclaboussure.jpg', 'Figure de BMX Flatland dans un miroir d’eau, gerbe d’éclaboussures sous un ciel d’orage', credits.weidemann],
    ['bmx-flatland-statue-vertical.jpg', 'Rotation du BMX au crépuscule, devant une statue et des grilles en fer forgé', credits.weidemann],
    ['bmx-flatland-vue-plongee-ombre.jpg', 'Vue en plongée d’une figure de BMX Flatland, l’ombre du rider projetée sur un sol rayé', credits.weidemann],
    ['bmx-flatland-mur-raye-dos.jpg', 'Roman Mitride de dos, pied levé, devant un mur à rayures noires et blanches', credits.weidemann],
    ['roman-mitride-reflet.jpg', 'Roman Mitride tenant son BMX, son reflet dans une vitre en ville', credits.weidemann],
    ['roman-mitride-marche-ombre.jpg', 'Roman Mitride marchant à côté de son BMX, longues ombres sur un sol rayé', credits.weidemann],
    ['bmx-flatland-tailwhip.webp', 'Roman Mitride fait tourner son BMX en appui sur une jambe, devant un escalier', undefined],
  ] as [string, string, string | undefined][],
};
