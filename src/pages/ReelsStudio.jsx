import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

const REELS = [
  { id: 1, title: "Lalibazar",    category: "Reels", videoUrl: "https://www.youtube.com/shorts/1aCempu0b30", poster: "https://tridentconcept.com/uploads/lalibazar.jpg" },
  { id: 2, title: "Bashanta",     category: "Reels", videoUrl: "https://www.youtube.com/shorts/BMwxjdRMesU", poster: "https://tridentconcept.com/uploads/bashanta.jpg" },
  { id: 3, title: "Aktor",        category: "Reels", videoUrl: "https://www.youtube.com/shorts/LlQKONeaJqE", poster: "https://tridentconcept.com/uploads/aktor.jpg" },
  { id: 4, title: "Aankha",       category: "Reels", videoUrl: "https://www.youtube.com/shorts/Ev1XMIebLU8", poster: "https://tridentconcept.com/uploads/aankha movie.jpg" },
  { id: 5, title: "Jante Bakhro", category: "Reels", videoUrl: "https://www.youtube.com/shorts/5oWEaKb-PJc", poster: "https://uat.tridentconcept.com/uploads/Jante-Bakhro-Poster-2-A4-scaled.jpg" },
  { id: 6, title: "Khusma",       category: "Reels", videoUrl: "https://www.youtube.com/shorts/l4S9Ay2kXKw", poster: "https://uat.tridentconcept.com/uploads/khusma.jpg" },
  { id: 7, title: "Jalaki",       category: "Reels", videoUrl: "https://www.youtube.com/shorts/zqAM4LiAV1I", poster: "https://uat.tridentconcept.com/uploads/jalaki-poster-scaled.jpeg" },
  { id: 8, title: "Zero Degree",  category: "Reels", videoUrl: "https://www.youtube.com/shorts/XvQ49ughHWg", poster: "https://uat.tridentconcept.com/uploads/zero-degree-trident-scaled.jpeg" },
  { id: 9, title: "Kumari",       category: "Reels", videoUrl: "https://www.youtube.com/shorts/_21_-RKdmro", poster: "https://uat.tridentconcept.com/uploads/Kumari-Poster-1-30X40-Trident-Concept-2025-1-scaled.jpg" },
];

/* ─── YouTube helpers ──────────────────────────────────────────────────────── */
const isYouTubeUrl    = (url) => url && (url.includes("youtube.com") || url.includes("youtu.be"));
const getYouTubeVideoId = (url) => {
  if (!url) return "";
  if (url.includes("shorts/")) return url.split("shorts/")[1]?.split(/[?&]/)[0];
  if (url.includes("v="))      return url.split("v=")[1]?.split("&")[0];
  if (url.includes("youtu.be/"))return url.split("youtu.be/")[1]?.split(/[?&]/)[0];
  return "";
};
const getYouTubeEmbedUrl = (url) => {
  const id = getYouTubeVideoId(url);
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;
};
const getYouTubeModalUrl = (url) => {
  const id = getYouTubeVideoId(url);
  return `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&playsinline=1`;
};
const getYouTubeThumbnail = (url) => `https://img.youtube.com/vi/${getYouTubeVideoId(url)}/hqdefault.jpg`;
const getPosterUrl = (reel) => {
  if (isYouTubeUrl(reel.videoUrl)) return getYouTubeThumbnail(reel.videoUrl);
  if (reel.poster && !reel.poster.includes("placeholder")) return reel.poster;
  return null;
};

/* ─── useBreakpoint hook ───────────────────────────────────────────────────── */
const useBreakpoint = () => {
  const [bp, setBp] = useState("lg");
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 400)  setBp("xs");
      else if (w < 640)  setBp("sm");
      else if (w < 768)  setBp("md");
      else if (w < 1024) setBp("lg");
      else               setBp("xl");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
};

/* slide dimensions per breakpoint */
const SLIDE_SIZES = {
  xs: { w: 130, h: 200 },
  sm: { w: 155, h: 235 },
  md: { w: 185, h: 275 },
  lg: { w: 220, h: 330 },
  xl: { w: 260, h: 390 },
};

/* coverflow params per breakpoint */
const COVERFLOW_PARAMS = {
  xs: { rotate: 12, depth: 80,  modifier: 1 },
  sm: { rotate: 15, depth: 110, modifier: 1 },
  md: { rotate: 18, depth: 140, modifier: 1 },
  lg: { rotate: 20, depth: 165, modifier: 1 },
  xl: { rotate: 20, depth: 180, modifier: 1 },
};

const TRIPLE_REELS = [...REELS, ...REELS, ...REELS];

/* ─── ReelsStudio ──────────────────────────────────────────────────────────── */
const ReelsStudio = () => {
  const [activeIndex, setActiveIndex]       = useState(13);
  const [activeModalReel, setActiveModalReel] = useState(null);
  const [hoveredReelIndex, setHoveredReelIndex] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const swiperRef       = useRef(null);
  const [titles, setTitles] = useState({});
  const bp = useBreakpoint();
  const isMobile = bp === "xs" || bp === "sm";

  /* fetch YT titles */
  useEffect(() => {
    const cached = (() => {
      try { return JSON.parse(localStorage.getItem("yt_reels_titles") || "{}"); }
      catch { return {}; }
    })();
    setTitles(cached);
    REELS.forEach((reel) => {
      if (!isYouTubeUrl(reel.videoUrl)) return;
      const id = getYouTubeVideoId(reel.videoUrl);
      if (!id || cached[id]) return;
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.title) setTitles((p) => {
            const u = { ...p, [id]: d.title };
            localStorage.setItem("yt_reels_titles", JSON.stringify(u));
            return u;
          });
        })
        .catch(() => {});
    });
  }, []);

  /* lock scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = activeModalReel ? "hidden" : "";
    if (swiperRef.current) {
      activeModalReel ? swiperRef.current.autoplay?.stop() : swiperRef.current.autoplay?.start();
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeModalReel]);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();
  const handleDotClick = (i) => swiperRef.current?.slideToLoop(i);
  const handleCardClick = (isActive, reel) => { if (isActive) setActiveModalReel(reel); };
  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredReelIndex(index), 300);
  };
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredReelIndex(null);
  };

  const { w: slideW, h: slideH } = SLIDE_SIZES[bp];
  const cfParams = COVERFLOW_PARAMS[bp];

  /* min-height for the carousel wrapper — slide height + perspective padding */
  const carouselMinH = slideH + 80;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-bg-section)",
        paddingTop:    isMobile ? "60px"  : "112px",
        paddingBottom: isMobile ? "48px"  : "112px",
      }}
    >
      {/* Swiper slide sizing injected as CSS vars so Swiper can read them */}
      <style>{`
        .reels-swiper .swiper-slide {
          width:   ${slideW}px !important;
          height:  ${slideH}px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.4;
          filter: grayscale(65%);
          transition: opacity 0.5s ease, filter 0.5s ease, visibility 0.5s ease;
        }
        .reels-swiper .swiper-slide-active       { opacity: 1;    filter: grayscale(0%);  }
        .reels-swiper .swiper-slide-prev,
        .reels-swiper .swiper-slide-next         { opacity: 0.75; filter: grayscale(20%); }

        /* hide slides ≥5 away from active */
        .reels-swiper .swiper-slide:has(~ .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide-active) {
          opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;
        }
        .reels-swiper .swiper-slide-active + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide,
        .reels-swiper .swiper-slide-active + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide ~ .swiper-slide {
          opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="absolute top-1/4 right-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#c9a84c] opacity-[0.02] blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0  w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#c9a84c] opacity-[0.02] blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />

      {/* ── Header ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="flex flex-col items-start text-left mb-8 sm:mb-10 md:mb-14 lg:mb-16">
          <h2
            className="font-black uppercase tracking-tight leading-[0.9] text-[var(--color-heading)] mb-2 sm:mb-4"
            style={{ fontSize: "clamp(28px, 6vw, 72px)" }}
          >
            Reels{" "}
            <span className="text-[var(--color-navy)]">Studio</span>
          </h2>
          <p className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[var(--color-heading)]/70 font-medium">
            Dynamic • Cinematic • Impactful Stories
          </p>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className="relative w-full flex flex-col items-center overflow-hidden">
        <div
          className="relative w-full flex items-center"
          style={{ minHeight: `${carouselMinH}px`, paddingBlock: "20px" }}
        >
          <Swiper
            onSwiper={(s) => { swiperRef.current = s; }}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            initialSlide={13}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop
            loopAdditionalSlides={4}
            slideToClickedSlide
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            coverflowEffect={{
              rotate:       cfParams.rotate,
              stretch:      0,
              depth:        cfParams.depth,
              modifier:     cfParams.modifier,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="reels-swiper w-full max-w-[1360px] mx-auto !overflow-visible"
          >
            {TRIPLE_REELS.map((reel, index) => {
              const isHovered = hoveredReelIndex === index;
              return (
                <SwiperSlide key={`${reel.id}-${index}`}>
                  {({ isActive }) => {
                    const shouldPlay = isHovered || (isActive && isMobile);
                    const boxShadow  = isActive
                      ? "0 35px 85px rgba(0,0,0,0.78)"
                      : "0 22px 55px rgba(0,0,0,0.55)";

                    return (
                      <div
                        onClick={() => handleCardClick(isActive, reel)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        className="relative w-full h-full cursor-pointer border border-white/10 select-none group"
                        style={{ borderRadius: "16px", boxShadow }}
                      >
                        {/* Media */}
                        <div className="absolute inset-0 bg-[#161410] pointer-events-none overflow-hidden" style={{ borderRadius: "16px" }}>
                          {shouldPlay ? (
                            isYouTubeUrl(reel.videoUrl) ? (
                              <iframe
                                src={getYouTubeEmbedUrl(reel.videoUrl)}
                                className="w-full h-full scale-[1.3] opacity-100"
                                title={reel.title}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                style={{ border: "none", pointerEvents: "none" }}
                              />
                            ) : (
                              <video src={reel.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                            )
                          ) : getPosterUrl(reel) ? (
                            <img
                              src={getPosterUrl(reel)}
                              alt={reel.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out"
                              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                            />
                          ) : (
                            <video
                              src={`${reel.videoUrl}#t=0.001`}
                              preload="metadata"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out"
                              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                            />
                          )}
                        </div>

                        {/* Dark gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" style={{ borderRadius: "16px" }} />

                        {/* Active gold border */}
                        {isActive && (
                          <div className="absolute inset-0 border-2 border-[#c9a84c]/50 pointer-events-none shadow-[inset_0_0_20px_rgba(201,168,76,0.2)] animate-pulse" style={{ borderRadius: "16px" }} />
                        )}

                        {/* Corner accents */}
                        {isActive && (
                          <>
                            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#c9a84c] pointer-events-none" style={{ borderTopLeftRadius: "16px" }} />
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#c9a84c] pointer-events-none" style={{ borderBottomRightRadius: "16px" }} />
                          </>
                        )}

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className={`rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#c9a84c]/20 group-hover:border-[#c9a84c]/40
                              ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}
                              ${isMobile ? "w-9 h-9" : "w-12 h-12 md:w-14 md:h-14"}`}
                          >
                            <FaPlay className={`text-[#c9a84c] translate-x-0.5 ${isMobile ? "text-[10px]" : "text-sm md:text-base"}`} />
                          </div>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ padding: isMobile ? "10px 10px 12px" : "14px 18px 18px" }}>
                          <span className="block font-bold uppercase tracking-wider text-[#c9a84c]" style={{ fontSize: isMobile ? "8px" : "10px" }}>
                            {reel.category}
                          </span>
                          <h3 className="font-bold text-white uppercase leading-tight mt-0.5 tracking-wide truncate" style={{ fontSize: isMobile ? "9px" : "11px" }}>
                            {titles[getYouTubeVideoId(reel.videoUrl)] || reel.title}
                          </h3>
                        </div>
                      </div>
                    );
                  }}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 px-4 relative z-20">
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 border border-white/10 hover:border-[#c9a84c]/40 flex items-center justify-center text-white hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 backdrop-blur-md transition-all duration-300 active:scale-95 flex-shrink-0"
            aria-label="Previous Reel"
          >
            <FaChevronLeft className="text-xs sm:text-sm" />
          </button>

          {/* Dots — wrap safely on narrow screens */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-[200px] sm:max-w-none">
            {REELS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex % REELS.length
                    ? "w-6 sm:w-8 bg-[#c9a84c]"
                    : "w-1.5 bg-[#4f4532]/25"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 border border-white/10 hover:border-[#c9a84c]/40 flex items-center justify-center text-white hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 backdrop-blur-md transition-all duration-300 active:scale-95 flex-shrink-0"
            aria-label="Next Reel"
          >
            <FaChevronRight className="text-xs sm:text-sm" />
          </button>
        </div>
      </div>

      {/* ── Cinematic Modal ── */}
      {activeModalReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-[16px]"
            onClick={() => setActiveModalReel(null)}
          />

          {/* Portrait card
              - xs/sm:  nearly full-screen (95vw wide, fill height)
              - md+:    fixed max-w-sm card centered
          */}
          <div
            className="relative z-10 flex flex-col bg-[#0c0a08] border border-[#c9a84c]/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(201,168,76,0.25)]"
            style={{
              width:     isMobile ? "min(95vw, 360px)" : "min(360px, 90vw)",
              /* keep a 9/16 portrait aspect ratio but never exceed viewport height */
              aspectRatio: "9/16",
              maxHeight: isMobile ? "92dvh" : "88dvh",
            }}
          >
            {/* Top bar */}
            <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex justify-between items-center z-20">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">
                  {activeModalReel.category}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                  {titles[getYouTubeVideoId(activeModalReel.videoUrl)] || activeModalReel.title}
                </span>
              </div>
              <button
                onClick={() => setActiveModalReel(null)}
                className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-white/20 hover:border-[#c9a84c]/50 flex items-center justify-center text-white hover:text-[#c9a84c] backdrop-blur-md transition-colors"
                aria-label="Close video player"
              >
                <FaTimes className="text-[10px] sm:text-xs" />
              </button>
            </div>

            {/* Video */}
            <div className="flex-1 w-full h-full relative">
              {isYouTubeUrl(activeModalReel.videoUrl) ? (
                <iframe
                  src={getYouTubeModalUrl(activeModalReel.videoUrl)}
                  className="w-full h-full"
                  title={activeModalReel.title}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "none" }}
                />
              ) : (
                <video
                  src={activeModalReel.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay controls playsInline loop
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReelsStudio;