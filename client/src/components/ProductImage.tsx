import { useState } from 'react';
import { resolveProductImage } from '../utils/resolveProductImage';

type ProductImageProps = {
  image: string;
  productName: string;
  className: string;
};

export function ProductImage({ image, productName, className }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSource = hasError ? '/images/products/placeholder.svg' : resolveProductImage(image);

  return (
    <img
      src={imageSource}
      alt={productName}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
