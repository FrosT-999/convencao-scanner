import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollReveal = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseScrollRevealOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

// Component wrapper for scroll reveal
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "flip" | "slide-up";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const ScrollReveal = ({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    };

    const hiddenStyles: Record<string, React.CSSProperties> = {
      "fade-up": { opacity: 0, transform: "translateY(40px)" },
      "fade-down": { opacity: 0, transform: "translateY(-40px)" },
      "fade-left": { opacity: 0, transform: "translateX(40px)" },
      "fade-right": { opacity: 0, transform: "translateX(-40px)" },
      "zoom-in": { opacity: 0, transform: "scale(0.8)" },
      "flip": { opacity: 0, transform: "rotateX(90deg)" },
      "slide-up": { opacity: 0, transform: "translateY(100px)" },
    };

    const visibleStyles: React.CSSProperties = {
      opacity: 1,
      transform: "translateY(0) translateX(0) scale(1) rotateX(0)",
    };

    return {
      ...baseStyles,
      ...(isVisible ? visibleStyles : hiddenStyles[animation]),
    };
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
};
