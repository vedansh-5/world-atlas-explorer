"use client";

import { Heart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useCompareTray } from "@/lib/hooks/use-compare-tray";
import { cn } from "@/lib/utils";

export function CountryActions({ cca3 }: { cca3: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, isFull } = useCompareTray();
  const favorite = isFavorite(cca3);
  const comparing = isComparing(cca3);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={favorite ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFavorite(cca3)}
        aria-pressed={favorite}
      >
        <Heart className={cn("size-4", favorite && "fill-current")} />
        {favorite ? "Saved" : "Save"}
      </Button>
      <Button
        variant={comparing ? "default" : "outline"}
        size="sm"
        onClick={() => toggleCompare(cca3)}
        disabled={!comparing && isFull}
        aria-pressed={comparing}
      >
        <Scale className="size-4" />
        {comparing ? "Comparing" : "Compare"}
      </Button>
    </div>
  );
}
