import React, { useEffect, useRef } from "react";

const ScrollAnimation = ({ children, delay = 0 }) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("animate-topUp");
                            observer.unobserve(entry.target); // Stop observing after animation
                        }, delay);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    return (
        <div ref={elementRef} className="scroll-animation">
            {children}
        </div>
    );
};

export default ScrollAnimation;