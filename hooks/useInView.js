import { useState, useEffect, useRef } from 'react';

/**
 * Hook om te detecteren wanneer een element in het viewport is
 * en optioneel een animatie te triggeren
 * 
 * @param {Object} options - Configuratie opties
 * @param {number} options.threshold - Het percentage van het element dat zichtbaar moet zijn (0-1)
 * @param {number} options.delay - Optionele vertraging voordat de inView status verandert (ms)
 * @param {boolean} options.triggerOnce - Als true, wordt de observer losgekoppeld na eerste trigger
 * @param {string} options.rootMargin - Marge rond de root (bijv. '50px 0px')
 * @returns {Array} [ref, inView, entry] - ref om aan element te koppelen, boolean of element in view is, IntersectionObserverEntry
 */
const useInView = ({
    threshold = 0.1,
    delay = 0,
    triggerOnce = false,
    rootMargin = '0px',
} = {}) => {
    const [inView, setInView] = useState(false);
    const [entry, setEntry] = useState(null);
    const ref = useRef(null);
    const timeoutRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        // Maak schoon als er een timeout loopt
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (observerRef.current && ref.current) {
                observerRef.current.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Callback voor Intersection Observer
        const handleIntersect = (entries, observer) => {
            const entry = entries[0];
            setEntry(entry);

            // Ruim oude timeout op als die bestaat
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (entry.isIntersecting) {
                if (delay) {
                    timeoutRef.current = setTimeout(() => {
                        setInView(true);

                        if (triggerOnce) {
                            observer.unobserve(element);
                        }
                    }, delay);
                } else {
                    setInView(true);

                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                }
            } else {
                if (!triggerOnce) {
                    setInView(false);
                }
            }
        };

        // Maak en configureer de IntersectionObserver
        const options = {
            root: null, // viewport gebruiken als root
            rootMargin,
            threshold,
        };

        const observer = new IntersectionObserver(handleIntersect, options);
        observerRef.current = observer;
        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, delay, triggerOnce, rootMargin]);

    return [ref, inView, entry];
};

export default useInView;