"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountryImages } from "@/lib/hooks/use-country-images";

export function ImageGallery({ commonName }: { commonName: string }) {
  const { data: images, isLoading } = useCountryImages(commonName);
  const [selected, setSelected] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No gallery images available for this country yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.url}
            onClick={() => setSelected(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-muted"
          >
            <Image
              src={image.url}
              alt={image.description ?? `${commonName} photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && images[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs the image's natural size, which next/image can't give us without knowing dimensions up front */}
              <img
                src={images[selected].url}
                alt={images[selected].description ?? commonName}
                className="max-h-[75vh] rounded-lg object-contain"
              />
              {images[selected].description && (
                <p className="mt-3 text-center text-sm text-white/70">
                  {images[selected].description}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
