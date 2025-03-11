'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useSwipeBack() {
  const router = useRouter();
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
      setTouchEndX(e.changedTouches[0].clientX);

      if (touchStartX - touchEndX > 50) {
        router.back();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStartX, touchEndX, router]);
}
