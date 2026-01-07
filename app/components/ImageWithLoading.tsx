// app/components/ImageWithLoading.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ImageWithLoading({
  src,
  alt,
  width = 500,
  height = 500,
  className = "",
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {/* Skeleton که موقع loading نشون داده میشه */}
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse rounded-three" />
      )}
      
      {/* تصویر اصلی */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}