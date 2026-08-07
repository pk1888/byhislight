import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  isDark: boolean;
  reducedMotion: boolean;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  isDark,
  reducedMotion
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      })}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed right-4 bottom-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 sm:right-6 sm:bottom-6 ${
        isDark
          ? 'border-[#D4AF37]/35 bg-[#211e1a]/85 text-[#D4AF37] hover:border-[#D4AF37]/65 hover:bg-[#2a251f] focus-visible:ring-offset-[#121110]'
          : 'border-[#B8A77D]/45 bg-[#FDFCF5]/90 text-[#8A6F32] hover:border-[#8A6F32]/65 hover:bg-[#FFFEFA] focus-visible:ring-offset-[#FDFCF5]'
      }`}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
};
