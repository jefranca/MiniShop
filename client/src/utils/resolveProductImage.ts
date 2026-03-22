export function resolveProductImage(image: string) {
  const normalizedImage = image.trim();

  if (/^https?:\/\//.test(normalizedImage) || normalizedImage.startsWith('/')) {
    return normalizedImage;
  }

  return '/images/products/placeholder.svg';
}
