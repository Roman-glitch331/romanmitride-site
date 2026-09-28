// Source unique de tous les faits et textes affichés sur le site.
// Règle : rien d'inventé. Une information non fournie par Roman reste un TODO visible.
// Sources : prompt-site-romanmitride_1.md + réponses de Roman (2026-09-25 et 2026-09-28).

export const TODO = (what: string) => `[À compléter : ${what}]`;

export const identite = {
  nom: 'Roman Mitride',
  metier: 'Rider professionnel de BMX Flatland',
  ville: 'Pau',
  zone: 'Basé à Pau, dans le Sud-Ouest, j’interviens dans toute la France.',
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
  'Le BMX Flatland, c’est l’art de faire tourner, pivoter et tenir en équilibre un vélo BMX sur un sol plat, sans rampe ni module. ' +
  'Chaque figure s’enchaîne comme une chorégraphie : un spectacle technique et fluide, lisible par tous les publics.';

export const tarifs = {
  showAPartirDe: 400,
  mentionDevis:
    'Chaque devis est construit en fonction de la prestation : il est donc discuté au téléphone avant sa rédaction.',
};

export const partenairesDuo = ['Kevin Meyer', 'Anatole Rahain', 'Maxime Luchetti'];

export const credits = {
  weidemann: 'Olivier Weidemann',
  // Photo de show avec le public : l'auteur n'est pas Stéphane Bar (correction de Roman, 2026-09-28).
  public: TODO('photographe de la photo de show avec le public'),
};

// Cartes de l'accueil (4 prestations, 3 pages dédiées).
export const cartes = [
  { titre: 'Show solo', href: '/show-bmx', video: 'hero-bmx-flatland-coucher-de-soleil',
    texte: 'Une démonstration de 5 à 15 minutes, plusieurs passages possibles dans la journée, avec animation au micro.' },
  { titre: 'Show duo', href: '/show-bmx#duo', video: 'show-bmx-flatland-public',
    texte: `30 à 40 minutes à deux riders pros : ${partenairesDuo.join(', ').replace(/, ([^,]*)$/, ' ou $1')}.` },
  { titre: 'Initiation BMX', href: '/initiation-bmx', video: 'initiation-bmx-gymnase',
    texte: 'Faire essayer le BMX à votre public, jusqu’à 8 vélos fournis.' },
  { titre: 'Tournages & images', href: '/tournage-bmx', video: 'demonstration-bmx-flatland-contest',
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

// Vitrine « Instagram » : vidéos hébergées sur le site (plan A, aucun cookie).
// TODO(Roman) : vérifier que chaque vidéo correspond bien au post lié (ordre supposé).
export const reels = [
  { video: 'reel-roman-mitride-1', post: 'https://www.instagram.com/reel/DJ6vlHuMd2u/' },
  { video: 'reel-roman-mitride-2', post: 'https://www.instagram.com/reel/DDH2P0vNPvK/' },
  { video: 'reel-roman-mitride-3', post: 'https://www.instagram.com/reel/DWW8KA3jKem/' },
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
    r: TODO('surface minimale et type de sol conseillés'), lien: '/show-bmx' },
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
