import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const REELS = [
  {
    id: 1,
    title: "Lalibazar",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/1aCempu0b30",
    poster: "https://tridentconcept.com/uploads/lalibazar.jpg"
  },
  {
    id: 2,
    title: "Bashanta",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/BMwxjdRMesU",
    poster: "https://tridentconcept.com/uploads/bashanta.jpg"
  },
  {
    id: 3,
    title: "Aktor",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/LlQKONeaJqE",
    poster: "https://tridentconcept.com/uploads/aktor.jpg"
  },
  {
    id: 4,
    title: "Aankha",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/Ev1XMIebLU8",
    poster: "https://tridentconcept.com/uploads/aankha movie.jpg"
  },
  {
    id: 5,
    title: "Jante Bakhro",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/5oWEaKb-PJc",
    poster: "https://uat.tridentconcept.com/uploads/Jante-Bakhro-Poster-2-A4-scaled.jpg"
  },
  {
    id: 6,
    title: "Khusma",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/l4S9Ay2kXKw",
    poster: "https://uat.tridentconcept.com/uploads/khusma.jpg"
  },
  {
    id: 7,
    title: "Jalaki",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/zqAM4LiAV1I",
    poster: "https://uat.tridentconcept.com/uploads/jalaki-poster-scaled.jpeg"
  },
  {
    id: 8,
    title: "Zero Degree",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/XvQ49ughHWg",
    poster: "https://uat.tridentconcept.com/uploads/zero-degree-trident-scaled.jpeg"
  },
  {
    id: 9,
    title: "Kumari",
    category: "Reels",
    videoUrl: "https://www.youtube.com/shorts/_21_-RKdmro",
    poster: "https://uat.tridentconcept.com/uploads/Kumari-Poster-1-30X40-Trident-Concept-2025-1-scaled.jpg"
  }
];

const isYouTubeUrl = (url) => {
  return url && (url.includes("youtube.com") || url.includes("youtu.be"));
};

const getYouTubeVideoId = (url) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1]?.split("?")[0]?.split("&")[0];
  } else if (url.includes("v=")) {
    videoId = url.split("v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
  }
  return videoId;
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
};

const getYouTubeModalUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1`;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const getPosterUrl = (reel) => {
  if (isYouTubeUrl(reel.videoUrl)) {
    return getYouTubeThumbnail(reel.videoUrl);
  }
  if (reel.poster && !reel.poster.includes("placeholder")) {
    return reel.poster;
  }
  return null;
};

const ReelsStudio = () => {
  const TRIPLE_REELS = [...REELS, ...REELS, ...REELS];
  const [activeIndex, setActiveIndex] = useState(13); // Start in the middle of the triple array (index 13 corresponds to Jante Bakhro)
  const [activeModalReel, setActiveModalReel] = useState(null);
  const [hoveredReelIndex, setHoveredReelIndex] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const swiperRef = useRef(null);
  const [titles, setTitles] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile sized to enable automatic preview on center slide
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch YouTube Shorts / video titles dynamically from oEmbed API and cache them in localStorage
  useEffect(() => {
    const cached = localStorage.getItem("yt_reels_titles");
    let cachedTitles = {};
    if (cached) {
      try {
        cachedTitles = JSON.parse(cached);
        setTitles(cachedTitles);
      } catch (e) {
        console.error("Error parsing cached titles", e);
      }
    }

    REELS.forEach((reel) => {
      if (isYouTubeUrl(reel.videoUrl)) {
        const videoId = getYouTubeVideoId(reel.videoUrl);
        if (videoId && !cachedTitles[videoId]) {
          const fetchUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
          fetch(fetchUrl)
            .then((res) => res.json())
            .then((data) => {
              if (data && data.title) {
                setTitles((prev) => {
                  const updated = { ...prev, [videoId]: data.title };
                  localStorage.setItem("yt_reels_titles", JSON.stringify(updated));
                  return updated;
                });
              }
            })
            .catch((err) => console.error(`Error fetching title for ${videoId}:`, err));
        }
      }
    });
  }, []);

  // Sync page scroll and autoplay status with modal opening/closing
  useEffect(() => {
    if (activeModalReel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    if (swiperRef.current) {
      if (activeModalReel) {
        swiperRef.current.autoplay?.stop();
      } else {
        swiperRef.current.autoplay?.start();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModalReel]);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleCardClick = (isActive, reel) => {
    if (isActive) {
      setActiveModalReel(reel);
    }
  };

  const handleDotClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  // Video hover preview handlers (mute and play on hover, with a slight delay)
  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredReelIndex(index);
    }, 300); // 300ms delay to make scrolling/moving sweep smooth
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredReelIndex(null);
  };

  return (
    <section className="relative w-full py-28 overflow-hidden" style={{ background: "var(--color-bg-section)" }}>
      {/* Dynamic CSS variables and Swiper overrides for high-fidelity Swiper Coverflow replication */}
      <style>{`
        .reels-slider-container {
          --slide-width: 260px;
          --slide-height: 380px;
          --slide-gap: 32px;
        }
        @media (max-width: 1024px) {
          .reels-slider-container {
            --slide-width: 220px;
            --slide-height: 320px;
            --slide-gap: 24px;
          }
        }
        @media (max-width: 768px) {
          .reels-slider-container {
            --slide-width: 180px;
            --slide-height: 260px;
            --slide-gap: 16px;
          }
        }
        @media (max-width: 480px) {
          .reels-slider-container {
            --slide-width: 150px;
            --slide-height: 220px;
            --slide-gap: 12px;
          }
        }

        /* Swiper Overrides for 3D Perspective and Looping */
        .mySwiper {
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 20px 0 40px;
        }
        .mySwiper .swiper-slide {
          width: var(--slide-width) !important;
          height: var(--slide-height) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.4;
          filter: grayscale(65%);
          transition: opacity 0.5s ease, filter 0.5s ease, visibility 0.5s ease;
        }
        .mySwiper .swiper-slide-active {
          opacity: 1;
          filter: grayscale(0%);
        }
        .mySwiper .swiper-slide-prev,
        .mySwiper .swiper-slide-next {
          opacity: 0.75;
          filter: grayscale(20%);
        }

        /* Hide slides that are 5 or more positions to the left of the active slide (exactly 4 visible on left) */
        .mySwiper .swiper-slide:has(~ .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide-active) {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        /* Hide slides that are 5 or more positions to the right of the active slide (exactly 4 visible on right) */
        .mySwiper .swiper-slide-active + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide,
        .mySwiper .swiper-slide-active + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide + .swiper-slide ~ .swiper-slide {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* Background ambient accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#c9a84c] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#c9a84c] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-16">

          <h2 className="text-[clamp(36px,6vw,72px)] font-black uppercase tracking-tight leading-[0.9] text-[var(--color-heading)] mb-4">
            Reels{" "}
            <span className="text-[var(--color-navy)]">
              Studio
            </span>
          </h2>
          <p className="text-sm tracking-[0.18em] uppercase text-[var(--color-heading)]/70 font-medium">
            Dynamic • Cinematic • Impactful Stories
          </p>
        </div>
      </div>

      {/* Swiper Carousel Container (Full-screen width wrapper for perfect symmetric looping) */}
      <div className="relative w-full flex flex-col items-center reels-slider-container overflow-hidden">
        <div className="relative w-full py-8 min-h-[280px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[460px] flex items-center">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            initialSlide={13}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            loopAdditionalSlides={4} // Pre-clone 5 extra slides on left/right for perfect screen symmetry
            slideToClickedSlide={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 180,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="mySwiper !overflow-visible"
          >
            {TRIPLE_REELS.map((reel, index) => {
              const isHovered = hoveredReelIndex === index;

              return (
                <SwiperSlide key={`${reel.id}-${index}`}>
                  {({ isActive }) => {
                    const shouldPlay = isHovered || (isActive && isMobile);
                    let boxShadow = "0 12px 30px rgba(0,0,0,0.3)";
                    if (isActive) {
                      boxShadow = "0 35px 85px rgba(0,0,0,0.78)";
                    } else {
                      boxShadow = "0 22px 55px rgba(0,0,0,0.55)";
                    }

                    return (
                      <div
                        onClick={() => handleCardClick(isActive, reel)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        className="relative w-full h-full cursor-pointer border border-white/10 select-none group"
                        style={{
                          borderRadius: "18px",
                          boxShadow: boxShadow,
                        }}
                      >
                        {/* Media container */}
                        <div className="absolute inset-0 w-full h-full bg-[#161410] pointer-events-none rounded-[18px] overflow-hidden">
                          {shouldPlay ? (
                            isYouTubeUrl(reel.videoUrl) ? (
                              <iframe
                                src={getYouTubeEmbedUrl(reel.videoUrl)}
                                className="w-full h-full scale-[1.3] transition-opacity duration-500 opacity-100"
                                title={reel.title}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                style={{
                                  border: "none",
                                  pointerEvents: "none",
                                }}
                              />
                            ) : (
                              <video
                                src={reel.videoUrl}
                                className="w-full h-full object-cover transition-opacity duration-500 opacity-100"
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            )
                          ) : (
                            getPosterUrl(reel) ? (
                              <img
                                src={getPosterUrl(reel)}
                                alt={reel.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                style={{
                                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                                }}
                              />
                            ) : (
                              <video
                                src={`${reel.videoUrl}#t=0.001`}
                                preload="metadata"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                style={{
                                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                                }}
                              />
                            )
                          )}
                        </div>

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none rounded-[18px]" />

                        {/* Glowing gold border sweep for active card */}
                        {isActive && (
                          <div className="absolute inset-0 border-[2px] border-[#c9a84c]/50 rounded-[18px] pointer-events-none shadow-[inset_0_0_20px_rgba(201,168,76,0.2)] animate-pulse" />
                        )}

                        {/* Corner accent decorations for active card */}
                        {isActive && (
                          <>
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a84c] rounded-tl-[18px] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a84c] rounded-br-[18px] pointer-events-none" />
                          </>
                        )}

                        {/* Play button overlay in middle */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
                              } group-hover:bg-[#c9a84c]/20 group-hover:border-[#c9a84c]/40`}
                          >
                            <FaPlay className="text-[#c9a84c] text-sm md:text-lg translate-x-0.5" />
                          </div>
                        </div>

                        {/* Title and Category info overlay at bottom */}
                        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-left pointer-events-none transition-transform duration-300">
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#c9a84c]">
                            {reel.category}
                          </span>
                          <h3 className="text-xs md:text-sm font-bold text-white uppercase leading-tight mt-1 tracking-wide">
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

        {/* Glassmorphic Swiper Next/Prev Controls */}
        <div className="flex items-center gap-6 mt-8 relative z-20">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-black/40 border border-white/10 hover:border-[#c9a84c]/40 flex items-center justify-center text-white hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 backdrop-blur-md transition-all duration-300 active:scale-95"
            aria-label="Previous Reel"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <div className="flex items-center gap-2">
            {REELS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === (activeIndex % REELS.length) ? "w-8 bg-[#c9a84c]" : "w-1.5 bg-[#4f4532]/25"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-black/40 border border-white/10 hover:border-[#c9a84c]/40 flex items-center justify-center text-white hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 backdrop-blur-md transition-all duration-300 active:scale-95"
            aria-label="Next Reel"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Cinematic Modal Player */}
      {activeModalReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with extreme glass blur */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-[16px] transition-opacity duration-500"
            onClick={() => setActiveModalReel(null)}
          />

          {/* Portrait Container */}
          <div className="relative w-full max-w-sm aspect-[9/16] bg-[#0c0a08] border border-[#c9a84c]/30 rounded-3xl overflow-hidden z-10 shadow-[0_0_50px_rgba(201,168,76,0.25)] flex flex-col transform animate-in fade-in zoom-in-95 duration-300">
            {/* Top Bar controls */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">
                  {activeModalReel.category}
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider max-w-[220px] truncate">
                  {titles[getYouTubeVideoId(activeModalReel.videoUrl)] || activeModalReel.title}
                </span>
              </div>
              <button
                onClick={() => setActiveModalReel(null)}
                className="w-8 h-8 rounded-full bg-black/50 border border-white/20 hover:border-[#c9a84c]/50 flex items-center justify-center text-white hover:text-[#c9a84c] backdrop-blur-md transition-colors"
                aria-label="Close video player"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Video container */}
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
                  autoPlay
                  controls
                  playsInline
                  loop
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
