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
  }
];

const LightboxModal = ({ item, onClose, onNext, onPrev }) => {
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#0c0a08]/96 backdrop-blur-md"
      style={{
        animation: "fadeIn 0.3s ease-out forwards"
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* LEFT NAV BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-55 p-3 rounded-full bg-white/5 hover:bg-[#c9a84c]/20 hover:scale-110 text-white/70 hover:text-[#c9a84c] transition-all border border-white/10 backdrop-blur-md shadow-lg cursor-pointer"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* RIGHT NAV BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-55 p-3 rounded-full bg-white/5 hover:bg-[#c9a84c]/20 hover:scale-110 text-white/70 hover:text-[#c9a84c] transition-all border border-white/10 backdrop-blur-md shadow-lg cursor-pointer"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full flex flex-col items-center px-4"
        style={{
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
        }}
      >
        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Header / Info bar */}
        <div className="w-full flex items-center justify-between mb-4 text-[#f5f0e8] px-1">
          <div className="flex flex-col">
            <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase font-bold">
              {item.category} ({item.year})
            </span>
            <h4 className="text-xl font-bold uppercase tracking-wide mt-1">
              {item.title}
            </h4>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 group p-2 text-white/50 hover:text-[#c9a84c] transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-xs tracking-widest uppercase">Close</span>
            <span className="text-2xl font-black">✕</span>
          </button>
        </div>

        {/* Image Frame */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black flex justify-center max-h-[75vh]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto object-contain max-h-[75vh] transition-all duration-300"
            key={item.id} // key forces remount to trigger image load transition
            style={{
              animation: "imageFadeIn 0.4s ease-out forwards"
            }}
          />
          <style>{`
            @keyframes imageFadeIn {
              from { opacity: 0; transform: scale(0.98); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [showSection, setShowSection] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSection(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (!activeItem) return;
    const currentIndex = GALLERY_ITEMS.findIndex(item => item.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
    setActiveItem(GALLERY_ITEMS[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeItem) return;
    const currentIndex = GALLERY_ITEMS.findIndex(item => item.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setActiveItem(GALLERY_ITEMS[prevIndex]);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="min-h-screen py-28 px-6 overflow-hidden mt-12"
        style={{ backgroundColor: "var(--color-bg-section)" }}
      >
        {/* Soft background ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#c9a84c] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#8b6d5c] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${showSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] uppercase tracking-[0.4em] text-xs font-bold">
                Visual Retrospective
              </span>
              <div className="h-px w-8 bg-[#c9a84c]" />
            </div>

            <h2
              className="text-[clamp(38px,7vw,80px)] font-black uppercase tracking-tight text-[#4f4532] leading-none mb-6"
            >
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e6d38e]">
                Gallery
              </span>
            </h2>
          </div>

          {/* Pinterest Masonry Layout */}
          <div
            className={`columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 transition-all duration-1000 ${showSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
          >
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="break-inside-avoid mb-6 relative rounded-2xl overflow-hidden border border-[#4f4532]/12 shadow-[0_4px_20px_rgba(79,69,50,0.06)] bg-transparent hover:shadow-[0_16px_36px_rgba(79,69,50,0.14)] hover:-translate-y-1 transition-all duration-300 ease-out cursor-zoom-in group"
              >
                {/* Photo */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />

                {/* Subtle dark layout shading */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/35 transition-colors duration-300 z-10" />

                {/* Golden corner brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#c9a84c]/0 group-hover:border-[#c9a84c]/85 rounded-tl-md transition-all duration-300 pointer-events-none z-20" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#c9a84c]/0 group-hover:border-[#c9a84c]/85 rounded-br-md transition-all duration-300 pointer-events-none z-20" />

                {/* Details appearing bottom overlay on hover */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-end">
                  <span className="text-[#c9a84c] text-[9px] tracking-[0.25em] uppercase font-extrabold mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-[#f5f0e8] text-base font-extrabold uppercase tracking-wide leading-tight">
                    {item.title} <span className="text-white/40 text-xs font-normal">({item.year})</span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Zoom Overlay */}
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
