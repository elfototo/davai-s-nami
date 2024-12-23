// import '../globals.css';
// // components/Loader.js
// import { useEffect } from 'react';
// import { gsap } from 'gsap';

// const Loader = () => {
//     useEffect(() => {
//         const cat = document.querySelector('.cat');
//         const body = document.querySelector('.body');
//         const head = document.querySelector('.head');
//         const eyes = document.querySelectorAll('.eyes circle');
//         const eyel = document.querySelectorAll('.eyes-l');
//         const eyer = document.querySelectorAll('.eyes-r');
//         const ears = document.querySelectorAll('.ears');
//         const earsl = document.querySelector('.ears-l');
//         const earsr = document.querySelector('.ears-r');
//         const tail = document.querySelector('.tail');
//         const backlegs = document.querySelector('.backlegs');
//         const frontlegs = document.querySelector('.frontlegs');
//         const frontlegs1 = document.querySelector('.frontlegs1');
//         const backcircle = document.querySelector('.body-backcircle');
//         const frontcircle = document.querySelector('.body-frontcircle');
//         const bodybetween = document.querySelector('.body-between');
//         const logo = document.querySelector('.logoani');
//         const logofix = document.querySelector('.logo');
//         const resetbutton = document.querySelector('.restart');
//         const ani = document.querySelector('.animation-wrapper');
//         const layout = document.querySelector('.layout');

//         function initAni() {
//             const tl = gsap.timeline({ delay: 0.5, onComplete: logoVisible });
//             const tl_eye = gsap.timeline({ delay: 1.5, repeat: 3, repeatDelay: 1 });
//             resetit();
//             logonotVisible();
//             tl.to([head, eyes, ears], { duration: 0.2, y: 45, x: 30 })
//                 .addLabel("twink")
//                 .to(eyel, { duration: 0.1, scaleY: 1, y: 45 }, "twink-=0.1")
//                 .to(eyel, { duration: 0.1, scaleY: 0.1, y: 55 }, "twink")
//                 .to(eyel, { duration: 0.1, scaleY: 1, y: 45 }, "twink +=0.1")
//                 .to(eyer, { duration: 0.1, scaleY: 0.1, y: 55 }, "twink")
//                 .to(eyer, { duration: 0.1, scaleY: 1, y: 45 }, "twink +=0.1")
//                 .to(earsl, { duration: 0.1, y: 8, x: -5, rotation: -20 }, "twink +=0.1")
//                 .to(earsr, { duration: 0.1, y: 16, x: -15, rotation: -60 }, "twink +=0.1")
//                 .set(frontlegs, { opacity: 1 }, "+=0.5")
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 15, rotation: -60 })
//                 .to(logo, { duration: 0.1, x: 5 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 5, rotation: -60 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 15, rotation: -60 })
//                 .to(logo, { duration: 0.3, x: 10 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 25, rotation: -60 }, "+=0.5")
//                 .to(logo, { duration: 0.1, x: 12 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 5, rotation: -60 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 25, rotation: -60 })
//                 .to(logo, { duration: 0.1, x: 17 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 35, rotation: -60 })
//                 .to(logo, { duration: 0.1, x: 20 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
//                 .to(frontlegs1, { duration: 0.1, y: 30, x: 30, rotation: -60, scaleY: 1.2 })
//                 .to(logo, { duration: 0.5, x: 30 })
//                 .to(logo, { duration: 0.1, rotation: 10 })
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: -15, rotation: -60, scaleY: 1 })
//                 .addLabel("wiggle")
//                 .to([head, eyes, ears], { duration: 0.1, y: 48 }, "wiggle")
//                 .to(earsl, { duration: 0.1, y: 10, x: -5, rotation: -20 }, "wiggle")
//                 .to(earsr, { duration: 0.1, y: 18, x: -15, rotation: -60 }, "wiggle")
//                 .to(backcircle, { duration: 0.1, y: 30, x: 40 }, "wiggle =-0.2")
//                 .to(backcircle, { duration: 0.1, y: 30, x: 37 }, "wiggle =-0.1")
//                 .to(backcircle, { duration: 0.1, y: 35, x: 40 }, "wiggle")
//                 .to(backcircle, { duration: 0.1, y: 30, x: 40 })
//                 .to(backcircle, { duration: 0.1, y: 30, x: 37 })
//                 .to(backcircle, { duration: 0.1, y: 35, x: 40 })
//                 .to(backcircle, { duration: 0.1, y: 30, x: 40 })
//                 .to(backcircle, { duration: 0.1, y: 30, x: 37 })
//                 .to(backcircle, { duration: 0.1, y: 35, x: 40 })
//                 .addLabel("logowiggle")
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: 30, rotation: -60, scaleY: 1.25 }, "logowiggle-=0.1")
//                 .to(logo, { duration: 0.1, rotation: 60, x: 70 }, "logowiggle")
//                 .to(logo, { duration: 0.5, y: 50 }, "logowiggle+=0.1")
//                 .to(logo, { duration: 0.1, rotation: 120 }, "logowiggle+=0.1")
//                 .to(logo, { duration: 0.1, rotation: 270 }, "logowiggle+=0.2")
//                 .to(logo, { duration: 0.5, y: 550, x: 90 }, "logowiggle+=0.2")
//                 .to(logo, { duration: 0.5, opacity: 0 }, "logowiggle")
//                 .to(frontlegs1, { duration: 0.1, y: 35, x: -15, rotation: -60, scaleY: 1 })
//                 .addLabel("jump")
//                 .to([head, eyes, ears], { duration: 0.1, y: 5 }, "jump")
//                 .to(frontcircle, { duration: 0.1, y: 15, x: 5 }, "jump")
//                 .to(bodybetween, { duration: 0.1, rotation: -25, x: 25, y: 38 }, "jump")
//                 .to(frontlegs1, { duration: 0.1, y: 0, x: 0, rotation: 0 }, "jump")
//                 .to(tail, { duration: 0.1, y: 115, x: 20, rotation: -10 }, "jump")
//                 .to(frontlegs, { duration: 0.1, y: -20 }, "jump+=0.1")

//                 .to([head, eyes, ears, frontcircle], { duration: 0.1, x: 75, y: 5 }, "jump+=0.2")
//                 .to(frontcircle, { duration: 0.1, x: 55, y: 5 }, "jump+=0.2")
//                 .to(bodybetween, { duration: 0.1, scaleX: 1, x: 45, y: 25, rotation: -15 }, "jump+=0.2")
//                 .to(backcircle, { duration: 0.1, x: 50, y: 25 }, "jump+=0.2")
//                 .to(backlegs, { duration: 0.1, x: 70 }, "jump+=0.2")

//                 .to(frontlegs, { duration: 0.1, x: 250, y: 5, rotation: -45 }, "jump+=0.3")
//                 .to(frontcircle, { duration: 0.1, x: 250 }, "jump+=0.3")
//                 .to(backcircle, { duration: 0.1, y: 0, x: 250 }, "jump+=0.3")
//                 .to(bodybetween, { duration: 0.1, y: 0, x: 255, scaleX: 1, rotation: 4 }, "jump+=0.3")
//                 .to([head, eyes, ears], { duration: 0.1, x: 275 }, "jump+=0.3")
//                 .to(tail, { duration: 0.1, y: 25, x: 230, rotation: 15 }, "jump+=0.3")
//                 .to(backlegs, { duration: 0.1, rotation: 45, x: 250, y: -25 }, "jump+=0.3")

//                 .to(frontlegs, { duration: 0.1, x: 340, y: 105, rotation: -15 }, "jump+=0.4")
//                 .to(frontcircle, { duration: 0.1, x: 340, y: 105 }, "jump+=0.4")
//                 .to(backcircle, { duration: 0.1, y: 60, x: 350 }, "jump+=0.4")
//                 .to(bodybetween, { duration: 0.1, y: 70, x: 380, scaleX: 1, rotation: 35 }, "jump+=0.4")
//                 .to([head, eyes, ears], { duration: 0.1, x: 385, y: 125 }, "jump+=0.4")
//                 .to(tail, { duration: 0.1, y: 50, x: 370, rotation: 35 }, "jump+=0.4")
//                 .to(backlegs, { duration: 0.1, rotation: 95, x: 350, y: 5 }, "jump+=0.4")

//                 .to(frontlegs, { duration: 0.1, x: 420, y: 205, rotation: -15 }, "jump+=0.5")
//                 .to(frontcircle, { duration: 0.1, x: 420, y: 205 }, "jump+=0.5")
//                 .to(backcircle, { duration: 0.1, y: 160, x: 430 }, "jump+=0.5")
//                 .to(bodybetween, { duration: 0.1, y: 170, x: 460, scaleX: 1, rotation: 35 }, "jump+=0.5")
//                 .to([head, eyes, ears], { duration: 0.1, x: 465, y: 225 }, "jump+=0.5")
//                 .to(tail, { duration: 0.1, y: 150, x: 450, rotation: 35 }, "jump+=0.5")
//                 .to(backlegs, { duration: 0.1, rotation: 95, x: 430, y: 95 }, "jump+=0.5")

//                 .to(cat, { duration: 0.5, opacity: 0 }, "jump+=0.3");
//             //cat blinking
//             tl_eye.addLabel("twinkall")
//                 .to(eyel, { duration: 0.1, scaleY: 0.1, y: 55 }, "twinkall")
//                 .to(eyel, { duration: 0.1, scaleY: 1, y: 45 }, "twinkall +=0.1")
//                 .to(eyer, { duration: 0.1, scaleY: 0.1, y: 55 }, "twinkall")
//                 .to(eyer, { duration: 0.1, scaleY: 1, y: 45 }, "twinkall +=0.1");
//         }

//         function logoVisible() {
//             ani.classList.add("notvisible");
//         }
//         function logonotVisible() {
//             ani.classList.remove("notvisible");
//         }

//         function resetit() {
//             gsap.set([head, eyes, ears], { y: 20, x: 30 });
//             gsap.set(backcircle, { y: 35, x: 40 });
//             gsap.set(cat, { opacity: 1 });
//             gsap.set(bodybetween, { scaleX: 0.5, y: 35, x: 45, rotation: 0 });
//             gsap.set(frontcircle, { y: 35, x: 10 });
//             gsap.set(head, { y: 20 });
//             gsap.set(eyel, { scaleY: 1 });
//             gsap.set(eyer, { scaleY: 1 });
//             gsap.set(ears, { y: 20 });
//             gsap.set(tail, { y: 110, x: 30, rotation: 0 });
//             gsap.set(backlegs, { rotation: -100, y: 55, x: 50 });
//             gsap.set(frontlegs, { y: 0, x: 0, rotation: 0 });
//             gsap.set(logo, { opacity: 1, x: 0, y: 0, rotation: 0 });
//             gsap.set(earsl, { x: 0, y: 0, rotation: 0 });
//             gsap.set(earsr, { x: 0, y: 0, rotation: 0 });
//         }
//         initAni();

//     }, []);

//     return (
//         <div className='h-screen font-cursive text-center  bg-[#fff] z-20 fixed inset-0 loader-wrapper transform transition-all duration-300'>
//             <div className=''>
//                 <div className="wrapper-no7">
//                     <div className="logo">LOGO</div>
//                     <div className="animation-wrapper">
//                         <div className="cat-wrapper">
//                             <svg className="cat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.68 163.77" preserveAspectRatio="none">
//                                 <title>cat</title>
//                                 <g className="body">
//                                     <circle className="body-backcircle" cx="76.86" cy="83.31" r="45.5" />
//                                     <circle className="body-frontcircle" cx="150.86" cy="83.31" r="45.5" />
//                                     <rect className="body-between" x="74.65" y="37.89" width="83.04" height="90.61" />
//                                 </g>
//                                 <circle className="head" cx="161.76" cy="52.75" r="45.92" />
//                                 <g className="eyes">
//                                     <circle className="eyes-l" cx="153.51" cy="46.5" r="8.25" />
//                                     <circle className="eyes-r" cx="185.76" cy="46.5" r="8.25" />
//                                 </g>
//                                 <g className="ears">
//                                     <polygon className="ears-l" points="132.76 19 132.76 0 149.55 8.81 132.76 19" />
//                                     <polygon className="ears-r" points="179.44 11.2 197 4.06 195.16 22.9 179.44 11.2" />
//                                 </g>
//                                 <rect className="tail" x="-11" y="32.87" width="107" height="20" rx="9.58" ry="9.58" transform="translate(41.19 -18.41) rotate(45)" />
//                                 <g className="backlegs">
//                                     <path className="backlegs1" d="M74,124.85a6,6,0,0,0-4.7-7.07l-4.41-.89a6,6,0,0,0-7.07,4.7l-6.31,31.35a8.25,8.25,0,1,0,15.64,5,5.94,5.94,0,0,0,.44-1.33Z" transform="translate(-1.58 -0.92)" />
//                                     <path className="backlegs2" d="M88.22,125.86a6,6,0,0,0-4.38-7.27l-4.37-1.08a6,6,0,0,0-7.27,4.38l-7.69,31a8.25,8.25,0,1,0,15.41,5.72,5.94,5.94,0,0,0,.5-1.31Z" transform="translate(-1.58 -0.92)" />
//                                 </g>
//                                 <g className="frontlegs">
//                                     <path className="frontlegs1" d="M162.89,120.91a6,6,0,0,0-7.65-3.68L151,118.72a6,6,0,0,0-3.68,7.65l10.57,30.18a8.25,8.25,0,1,0,16-3.65,5.94,5.94,0,0,0-.3-1.37Z" transform="translate(-1.58 -0.92)" />
//                                     <path className="frontlegs2" d="M175.77,120.08a6,6,0,0,0-7.48-4l-4.31,1.3a6,6,0,0,0-4,7.48l9.22,30.62a8.25,8.25,0,1,0,16.17-2.94,5.94,5.94,0,0,0-.24-1.38Z" transform="translate(-1.58 -0.92)" />
//                                 </g>
//                             </svg>
//                         </div>
//                         <div className="logoani">Давай с нами!</div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default Loader;
