// Résout un nom de fichier de src/assets/photos/ en image optimisable par Astro.
const toutes = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*', { eager: true });
export function photo(fichier: string): ImageMetadata {
  const img = toutes[`../assets/photos/${fichier}`]?.default;
  if (!img) throw new Error(`Photo introuvable dans src/assets/photos/ : ${fichier}`);
  return img;
}
