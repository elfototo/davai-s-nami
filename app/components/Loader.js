import '../globals.css';
// components/Loader.js
import { useEffect } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
    useEffect(() => {
        const cat = document.querySelector('.cat');
        const body = document.querySelector('.body');
        const head = document.querySelector('.head');
        const eyes = document.querySelectorAll('.eyes circle');
        const eyel = document.querySelectorAll('.eyes-l');
        const eyer = document.querySelectorAll('.eyes-r');
        const ears = document.querySelectorAll('.ears');
        const earsl = document.querySelector('.ears-l');
        const earsr = document.querySelector('.ears-r');
        const tail = document.querySelector('.tail');
        const backlegs = document.querySelector('.backlegs');
        const frontlegs = document.querySelector('.frontlegs');
        const frontlegs1 = document.querySelector('.frontlegs1');
        const backcircle = document.querySelector('.body-backcircle');
        const frontcircle = document.querySelector('.body-frontcircle');
        const bodybetween = document.querySelector('.body-between');
        const logo = document.querySelector('.logoani');
        const logofix = document.querySelector('.logo');
        const resetbutton = document.querySelector('.restart');
        const ani = document.querySelector('.animation-wrapper');
        const layout = document.querySelector('.layout');

        function initAni() {
            const tl = gsap.timeline({ delay: 0.5, onComplete: logoVisible });
            const tl_eye = gsap.timeline({ delay: 1.5, repeat: 3, repeatDelay: 1 });

            resetit();
            logonotVisible();
            tl.to([head, eyes, ears], { duration: 0.2, y: 45, x: 30 })
                .addLabel("twink")
                .to(eyel, { duration: 0.1, scaleY: 1, y: 45 }, "twink-=0.1")
                .to(eyel, { duration: 0.1, scaleY: 0.1, y: 55 }, "twink")
                .to(eyel, { duration: 0.1, scaleY: 1, y: 45 }, "twink +=0.1")
                .to(eyer, { duration: 0.1, scaleY: 0.1, y: 55 }, "twink")
                .to(eyer, { duration: 0.1, scaleY: 1, y: 45 }, "twink +=0.1")
                .to(earsl, { duration: 0.1, y: 8, x: -5, rotation: -20 }, "twink +=0.1")
                .to(earsr, { duration: 0.1, y: 16, x: -15, rotation: -60 }, "twink +=0.1")
                .set(frontlegs, { opacity: 1 }, "+=0.5")
                .to(frontlegs1, { duration: 0.1, y: 35, x: 15, rotation: -60 })
                .to(logo, { duration: 0.1, x: 5 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 5, rotation: -60 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 15, rotation: -60 })
                .to(logo, { duration: 0.3, x: 10 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 25, rotation: -60 }, "+=0.5")
                .to(logo, { duration: 0.1, x: 12 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 5, rotation: -60 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 25, rotation: -60 })
                .to(logo, { duration: 0.3, x: 17 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: 35, rotation: -60 })
                .to(logo, { duration: 0.1, x: 20 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: -5, rotation: -60 })
                .to(frontlegs1, { duration: 0.1, y: 30, x: 30, rotation: -60, scaleY: 1.2 })
                .to(logo, { duration: 0.5, x: 30 })
                .to(logo, { duration: 0.1, rotation: 10 })
                .to(frontlegs1, { duration: 0.1, y: 35, x: -15, rotation: -60, scaleY: 1 })
                .addLabel("wiggle")
                .to([head, eyes, ears], { duration: 0.1, y: 48 }, "wiggle")
                .to(earsl, { duration: 0.1, y: 10, x: -5, rotation: -20 }, "wiggle")
                .to(earsr, { duration: 0.1, y: 18, x: -15, rotation: -60 }, "wiggle")
                .to(backcircle, { duration: 0.1, y: 30, x: 40 }, "wiggle =-0.2")
                .to(backcircle, { duration: 0.1, y: 30, x: 37 }, "wiggle =-0.1")
                .to(backcircle, { duration: 0.1, y: 35, x: 40 }, "wiggle")
                .to(backcircle, { duration: 0.1, y: 30, x: 40 })
                .to(backcircle, { duration: 0.1, y: 30, x: 37 })
                .to(backcircle, { duration: 0.1, y: 35, x: 40 })
                .to(backcircle, { duration: 0.1, y: 30, x: 40 })
                .to(backcircle, { duration: 0.1, y: 30, x: 37 })
                .to(backcircle, { duration: 0.1, y: 35, x: 40 })
                .addLabel("logowiggle")
                .to(frontlegs1, { duration: 0.1, y: 35, x: 30, rotation: -60, scaleY: 1.25 }, "logowiggle-=0.1")
                .to(logo, { duration: 0.1, rotation: 60, x: 70 }, "logowiggle")
                .to(logo, { duration: 0.5, y: 50 }, "logowiggle+=0.1")
                .to(logo, { duration: 0.1, rotation: 120 }, "logowiggle+=0.1")
                .to(logo, { duration: 0.1, rotation: 270 }, "logowiggle+=0.2")
                .to(logo, { duration: 0.5, y: 550, x: 90 }, "logowiggle+=0.2")
                .to(logo, { duration: 0.5, opacity: 0 }, "logowiggle")
                .to(frontlegs1, { duration: 0.1, y: 35, x: -15, rotation: -60, scaleY: 1 })
                .addLabel("jump")
                .to([head, eyes, ears], { duration: 0.1, y: 5 }, "jump")
                .to(frontcircle, { duration: 0.1, y: 15, x: 5 }, "jump")
                .to(bodybetween, { duration: 0.1, rotation: -25, x: 25, y: 38 }, "jump")
                .to(frontlegs1, { duration: 0.1, y: 0, x: 0, rotation: 0 }, "jump")
                .to(tail, { duration: 0.2, rotation: 130, x: -55, y: 60 }, "jump+=0.2");
        }

        function resetit() {
            gsap.set(logo, { opacity: 1 });
            gsap.set(cat, { rotation: 0 });
            gsap.set([tail, body, backlegs, frontlegs, head, ears, eyes], { opacity: 1, scale: 1 });
            gsap.set(logo, { opacity: 1 });
        }

        function logoVisible() {
            gsap.set(logo, { opacity: 1 });
        }

        function logonotVisible() {
            gsap.set(logo, { opacity: 0 });
        }

        resetbutton.addEventListener('click', initAni);
        initAni();

    }, []);

    return (
        
        <div className="wrapper-no7">
            <div className="animation-wrapper flex justify-center items-center w-full h-screen">
                <svg
                    className="cat"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 207.68 163.77"
                    preserveAspectRatio="none"
                >
                    <title>cat</title>

                    {/* Body section */}
                    <g className="body">
                        <circle className="body-backcircle" cx="76.86" cy="83.31" r="45.5" />
                        <circle className="body-frontcircle" cx="150.86" cy="83.31" r="45.5" />
                        <rect className="body-between" x="74.65" y="37.89" width="83.04" height="90.61" />
                    </g>

                    {/* Head section */}
                    <circle className="head" cx="161.76" cy="52.75" r="45.92" />

                    {/* Eyes */}
                    <g className="eyes">
                        <circle className="eyes-l" cx="153.51" cy="46.5" r="8.25" />
                        <circle className="eyes-r" cx="185.76" cy="46.5" r="8.25" />
                    </g>

                    {/* Ears */}
                    <g className="ears">
                        <polygon className="ears-l" points="132.76 19 132.76 0 149.55 8.81 132.76 19" />
                        <polygon className="ears-r" points="179.44 11.2 197 4.06 195.16 22.9 179.44 11.2" />
                    </g>

                    {/* Tail */}
                    <rect
                        className="tail"
                        x="-11"
                        y="32.87"
                        width="107"
                        height="20"
                        rx="9.58"
                        ry="9.58"
                        transform="translate(41.19 -18.41) rotate(45)"
                    />

                    {/* Back Legs */}
                    <g className="backlegs">
                        <path
                            className="backlegs1"
                            d="M74,124.85a6,6,0,0,0-4.7-7.07l-4.41-.89a6,6,0,0,0-7.07,4.7l-6.31,31.35a8.25,8.25,0,1,0,15.64,5,5.94,5.94,0,0,0,.44-1.33Z"
                            transform="translate(-1.58 -0.92)"
                        />
                        <path
                            className="backlegs2"
                            d="M88.22,125.86a6,6,0,0,0-4.38-7.27l-4.37-1.08a6,6,0,0,0-7.27,4.38l-7.69,31a8.25,8.25,0,1,0,15.41,5.72,5.94,5.94,0,0,0,.5-1.31Z"
                            transform="translate(-1.58 -0.92)"
                        />
                    </g>

                    {/* Front Legs */}
                    <g className="frontlegs">
                        <path
                            className="frontlegs1"
                            d="M162.89,120.91a6,6,0,0,0-7.65-3.68L151,118.72a6,6,0,0,0-3.68,7.65l10.57,30.18a8.25,8.25,0,1,0,16-3.65,5.94,5.94,0,0,0-.3-1.37Z"
                            transform="translate(-1.58 -0.92)"
                        />
                        <path
                            className="frontlegs2"
                            d="M175.77,120.08a6,6,0,0,0-7.48-4l-4.31,1.3a6,6,0,0,0-4,7.48l9.22,30.62a8.25,8.25,0,1,0,16.17-2.94,5.94,5.94,0,0,0-.24-1.38Z"
                            transform="translate(-1.58 -0.92)"
                        />
                    </g>
                </svg>
            </div>
            <div class="logoani">я пойду</div>
            <button className="restart absolute bottom-0 left-0 p-2 bg-blue-500 text-white rounded">Reset</button>
        </div>
    );
};

export default Loader;
