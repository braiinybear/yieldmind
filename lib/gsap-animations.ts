import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade in animation with slide up
 */
export const fadeInUp = (element: HTMLElement | string, delay = 0) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 60,
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
        }
    );
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (elements: HTMLElement[] | string, staggerDelay = 0.1) => {
    return gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: 40,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: staggerDelay,
            ease: "power2.out",
        }
    );
};

/**
 * Text reveal animation (split text)
 */
export const textReveal = (element: HTMLElement | string) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 100,
        },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
        }
    );
};

/**
 * Counter animation for numbers
 */
export const animateCounter = (
    element: HTMLElement,
    endValue: number,
    duration = 2
) => {
    const obj = { value: 0 };
    return gsap.to(obj, {
        value: endValue,
        duration,
        ease: "power2.out",
        onUpdate: () => {
            element.textContent = Math.floor(obj.value).toLocaleString();
        },
    });
};

/**
 * Scroll-triggered animation
 */
export const scrollAnimation = (
    element: HTMLElement | string,
    options?: gsap.TweenVars
) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 80,
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            ...options,
        }
    );
};

/**
 * Parallax effect
 */
export const parallax = (element: HTMLElement | string, speed = 0.5) => {
    return gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
    });
};

/**
 * Scale on hover
 */
export const hoverScale = (element: HTMLElement, scale = 1.05) => {
    element.addEventListener("mouseenter", () => {
        gsap.to(element, {
            scale,
            duration: 0.3,
            ease: "power2.out",
        });
    });

    element.addEventListener("mouseleave", () => {
        gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    });
};

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (target: string | HTMLElement) => {
    return gsap.to(window, {
        duration: 1,
        scrollTo: target,
        ease: "power3.inOut",
    });
};

/**
 * Initialize scroll animations for a container
 */
export const initScrollAnimations = (container: HTMLElement | string) => {
    const elements = document.querySelectorAll(`${container} [data-animate]`);

    elements.forEach((element, index) => {
        scrollAnimation(element as HTMLElement, {
            delay: index * 0.1,
        });
    });
};
