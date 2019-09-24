import React, { useEffect, useRef, useState } from "react";

export const useIsInView = (ref, margin = "0px") => {
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            { rootMargin: margin },
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.unobserve(ref.current);
        };
    }, []);

    return [ref, isIntersecting];
};
