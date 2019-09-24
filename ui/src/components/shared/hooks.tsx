import React, { useEffect, useRef, useState } from "react";

export const useIsInView = (_ref, margin = "0px") => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = _ref;

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
