import { useEffect, useRef } from "react";

export default function VideoScrollTrigger({ onIntersect, disabled }) {
    const triggerRef = useRef(null);

    useEffect(() => {
        if (disabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onIntersect();
                }
            },
            { rootMargin: "100px" }
        );

        const el = triggerRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [onIntersect, disabled]);

    return <div ref={triggerRef} style={{ height: "1px" }} />;
}