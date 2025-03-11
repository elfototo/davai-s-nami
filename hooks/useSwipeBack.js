// 'use client';

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export function useSwipeBack() {
//   const router = useRouter();
//   const [touchStartX, setTouchStartX] = useState(0);
//   const [touchEndX, setTouchEndX] = useState(0);

//   useEffect(() => {
//     const handleTouchStart = (e) => {
//       setTouchStartX(e.touches[0].clientX);
//     };

//     const handleTouchEnd = (e) => {
//       setTouchEndX(e.changedTouches[0].clientX);

//       if (touchStartX - touchEndX > 50) {
//         router.back();
//       }
//     };

//     document.addEventListener("touchstart", handleTouchStart);
//     document.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       document.removeEventListener("touchstart", handleTouchStart);
//       document.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [touchStartX, touchEndX, router]);
// }


// 'use client';

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export function useSwipeBack() {
//   const router = useRouter();
//   let touchStartX = 0;

//   useEffect(() => {
//     const handleTouchStart = (e) => {
//       touchStartX = e.touches[0].clientX;
//     };

//     const handleTouchEnd = (e) => {
//       const touchEndX = e.changedTouches[0].clientX;
//       const swipeDistance = touchEndX - touchStartX;

//       // Проверяем, что свайп был справа налево (отрицательный) и больше 50px
//       if (swipeDistance > 50) {
//         router.back();
//       }
//     };

//     document.addEventListener("touchstart", handleTouchStart);
//     document.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       document.removeEventListener("touchstart", handleTouchStart);
//       document.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [router]);
// }
