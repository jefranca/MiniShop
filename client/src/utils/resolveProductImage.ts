const placeholderImageMap: Record<string, string> = {
  '[jacket]': '/images/products/jacket.svg',
  '[headphones]': '/images/products/headphones.svg',
  '[lamp]': '/images/products/lamp.svg',
  '[backpack]': '/images/products/backpack.svg',
  '[speaker]': '/images/products/speaker.svg',
  '[vase]': '/images/products/vase.svg',
  chair: '/images/products/chair.svg',
  'headphones-max': '/images/products/headphones-max.svg',
};

export function resolveProductImage(image: string) {
  const normalizedImage = image.trim().toLowerCase();

  if (placeholderImageMap[normalizedImage]) {
    return placeholderImageMap[normalizedImage];
  }

  if (/^https?:\/\//.test(image) || image.startsWith('/')) {
    return image;
  }

  if (!normalizedImage.includes('.')) {
    return `/images/products/${normalizedImage}.svg`;
  }

  return image;
}
