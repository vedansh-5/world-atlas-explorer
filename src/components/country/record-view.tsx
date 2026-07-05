"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";

export function RecordView({ cca3 }: { cca3: string }) {
  const { recordView } = useRecentlyViewed();

  useEffect(() => {
    recordView(cca3);
    // Only record once per mount — recordView identity changes across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cca3]);

  return null;
}
