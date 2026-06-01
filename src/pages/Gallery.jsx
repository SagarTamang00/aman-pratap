import React, { useState, useEffect, useRef } from "react";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Aman Pratap Adhikary",
    category: "Director Portrait",
    image: "Gallery/aman.jpg",
    year: "2024",
  },
  {
    id: 2,
    title: "On the Set: Himalayan Roadies",
    category: "Reality Directing",
    image: "/rodies.jpeg",
    year: "2019",
  },
  {
    id: 3,
    title: "Behind the Lens: The Poet Idol",
    category: "Production Design",
    image: "/poet.jpeg",
    year: "2023",
  },
  {
    id: 4,
    title: "Guest Lecturer",
    category: "Travel & Inspiration",
    image: "Gallery/2.jpg",
    year: "2018",
  },
  {
    id: 5,
    title: "In Conversation: Kantipur",
    category: "Media Appearance",
    image: "Gallery/3.jpg",
    year: "2025",
  },
  {
    id: 6,
    title: "Visual Storytelling: Legacy & Tone",
    category: "Cinematography",
    image: "/legacy.jpeg",
    year: "2022",
  },
  {
    id: 7,
    title: "Tribhuvan University Campus",
    category: "Alma Mater",
    image: "/tu.jpeg",
    year: "2015",
  },
  {
    id: 8,
    title: "St. Xavier's College Recollections",
    category: "Education",
    image: "/xavier.jpeg",
    year: "2012",
  },
];

/* ─── Lightbox ─────────────────────────────────────────────────────────────── */
const LightboxModal = ({ item, onClose, onNext, onPrev }) => {
  // Touch / swipe state
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? onNext() : onPrev();
    }
  };

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-[#0c0a08]/96 backdrop-blur-md"
      style={{ animation: "lbFadeIn 0.3s ease-out forwards" }}
    >
      <style>{`
        @keyframes lbFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes lbImgIn   { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* ── Left nav ── */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10
                   p-2 sm:p-3 rounded-full bg-white/5 hover:bg-[#c9a84c]/20
                   hover:scale-110 text-white/70 hover:text-[#c9a84c]
                   transition-all border border-white/10 backdrop-blur-md shadow-lg cursor-pointer"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── Right nav ── */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10
                   p-2 sm:p-3 rounded-full bg-white/5 hover:bg-[#c9a84c]/20
                   hover:scale-110 text-white/70 hover:text-[#c9a84c]
                   transition-all border border-white/10 backdrop-blur-md shadow-lg cursor-pointer"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Modal card ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl
                   flex flex-col items-center px-10 sm:px-14 md:px-6"
        style={{ animation: "lbScaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* Info bar */}
        <div className="w-full flex items-start justify-between mb-3 sm:mb-4 text-[#f5f0e8] px-1 gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[#c9a84c] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold truncate">
              {item.category} ({item.year})
            </span>
            <h4 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-wide mt-0.5 leading-tight">
              {item.title}
            </h4>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2
                       text-white/50 hover:text-[#c9a84c] transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-[10px] tracking-widest uppercase">Close</span>
            <span className="text-xl sm:text-2xl font-black leading-none">✕</span>
          </button>
        </div>

        {/* Image frame */}
        <div
          className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl
                     border border-white/10 shadow-2xl bg-black flex justify-center"
          style={{ maxHeight: "65vh" }}
        >
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            className="w-full h-auto object-contain"
            style={{
              maxHeight: "65vh",
              animation: "lbImgIn 0.4s ease-out forwards",
            }}
          />
        </div>

        {/* Mobile swipe hint */}
        <p className="mt-3 text-white/25 text-[10px] tracking-widest uppercase sm:hidden select-none">
          Swipe to navigate
        </p>
      </div>
    </div>
  );
};

/* ─── Gallery ───────────────────────────────────────────────────────────────── */
const Gallery = () => {
  const [showSection, setShowSection] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSection(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (!activeItem) return;
    const idx = GALLERY_ITEMS.findIndex((i) => i.id === activeItem.id);
    setActiveItem(GALLERY_ITEMS[(idx + 1) % GALLERY_ITEMS.length]);
  };

  const handlePrev = () => {
    if (!activeItem) return;
    const idx = GALLERY_ITEMS.findIndex((i) => i.id === activeItem.id);
    setActiveItem(GALLERY_ITEMS[(idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length]);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen py-16 sm:py-20 md:py-28
                   px-4 sm:px-6 lg:px-8 overflow-hidden mt-6 sm:mt-12"
        style={{ backgroundColor: "var(--color-bg-section)" }}
      >
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#c9a84c] opacity-[0.02] blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#8b6d5c] opacity-[0.02] blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div
            className={`text-center mb-10 sm:mb-14 md:mb-16 transition-all duration-1000
                        ${showSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="flex justify-center items-center gap-3 mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold">
                Visual Retrospective
              </span>
              <div className="h-px w-6 sm:w-8 bg-[#c9a84c]" />
            </div>

            <h2
              className="font-black uppercase tracking-tight text-[#4f4532] leading-none mb-4 sm:mb-6"
              style={{ fontSize: "clamp(32px, 7vw, 80px)" }}
            >
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e6d38e]">
                Gallery
              </span>
            </h2>
          </div>

          {/* ── Masonry grid ── */}
          {/*
            Tailwind's `columns-*` utilities handle masonry natively.
            xs: 1 col  |  sm (≥640): 2 cols  |  lg (≥1024): 3 cols
          */}
          <div
            className={`columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 lg:gap-6
                        transition-all duration-1000
                        ${showSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
          >
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="break-inside-avoid mb-4 sm:mb-5 lg:mb-6
                           relative rounded-xl sm:rounded-2xl overflow-hidden
                           border border-[#4f4532]/12
                           shadow-[0_4px_20px_rgba(79,69,50,0.06)]
                           hover:shadow-[0_16px_36px_rgba(79,69,50,0.14)]
                           hover:-translate-y-1
                           transition-all duration-300 ease-out cursor-zoom-in group"
              >
                {/* Photo */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-auto object-cover
                             group-hover:scale-[1.03]
                             transition-transform duration-500 ease-out"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/35 transition-colors duration-300 z-10" />

                {/* Golden corner brackets */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-5 sm:w-6 h-5 sm:h-6
                                border-t border-l border-[#c9a84c]/0 group-hover:border-[#c9a84c]/85
                                rounded-tl-md transition-all duration-300 pointer-events-none z-20" />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-5 sm:w-6 h-5 sm:h-6
                                border-b border-r border-[#c9a84c]/0 group-hover:border-[#c9a84c]/85
                                rounded-br-md transition-all duration-300 pointer-events-none z-20" />

                {/* Bottom hover overlay */}
                <div
                  className="absolute bottom-0 left-0 w-full p-4 sm:p-5 md:p-6
                             bg-gradient-to-t from-black/80 to-transparent
                             opacity-0 group-hover:opacity-100
                             transition-opacity duration-300 z-20 flex flex-col justify-end"
                >
                  <span className="text-[#c9a84c] text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-extrabold mb-0.5 sm:mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-[#f5f0e8] text-sm sm:text-base font-extrabold uppercase tracking-wide leading-tight">
                    {item.title}{" "}
                    <span className="text-white/40 text-[11px] font-normal">({item.year})</span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {activeItem && (
        <LightboxModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
};

export default Gallery;