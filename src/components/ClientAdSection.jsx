import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTNER_ADS = [
  {
    id: 1,
    client: "Cheers Nepal / 8848 Vodka",
    image: "/Work/world.png",
    link: "https://cheers.com.np",
    tag: "Brand Partner",
    description: "World's Purest Vodka — Featured collaboration with Cheers Nepal.",
  },
  {
    id: 2,
    client: "Himalayan TV",
    image: "/Work/himal.jpg",
    link: "#",
    tag: "Broadcast Partner",
    description: "Strategic television broadcasting partner since 2016.",
  },
  {
    id: 3,
    client: "Kantipur TV HD",
    image: "/Work/kantipur.jpg",
    link: "#",
    tag: "Media Partner",
    description: "Broadcasting direction & production specials.",
  },
];

const AUTOPLAY_DURATION = 5000;

/* ─── tiny breakpoint hook ─── */
function useBreakpoint() {
  const getBreakpoint = (w) => {
    if (w < 480) return 'xs';   // phone portrait
    if (w < 768) return 'sm';   // phone landscape / small tablet
    if (w < 1024) return 'md';  // tablet
    return 'lg';                // desktop
  };
  const [bp, setBp] = useState(() => getBreakpoint(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  ));
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setBp(getBreakpoint(e.contentRect.width)));
    obs.observe(document.documentElement);
    return () => obs.disconnect();
  }, []);
  return bp;
}

/* ─── inject scoped CSS for things inline styles can't do ─── */
const GLOBAL_CSS = `
  .cas-poster-img:hover { transform: scale(1.03) !important; }
  .cas-dot-btn:hover { background: rgba(79,69,50,0.5) !important; }
  @media (hover: none) { .cas-poster-img:hover { transform: none !important; } }
`;

const ClientAdSection = () => {
  const bp = useBreakpoint();
  const isMobile = bp === 'xs';
  const isSmall = bp === 'xs' || bp === 'sm';
  const isTablet = bp === 'md';

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progressKey, setProgressKey] = useState(0);
  const intervalRef = useRef(null);

  const advance = useCallback(() => {
    setDirection(1);
    setActiveIndex(prev => (prev + 1) % PARTNER_ADS.length);
    setProgressKey(k => k + 1);
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, AUTOPLAY_DURATION);
  }, [advance]);

  const stopAutoplay = useCallback(() => clearInterval(intervalRef.current), []);

  useEffect(() => { startAutoplay(); return stopAutoplay; }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (isHovered) { stopAutoplay(); }
    else { setProgressKey(k => k + 1); startAutoplay(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  const goTo = (idx) => {
    if (idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
    setProgressKey(k => k + 1);
    startAutoplay();
  };

  const ad = PARTNER_ADS[activeIndex];

  /* ── responsive tokens ── */
  const sectionPadding = isMobile ? '48px 0' : isSmall ? '60px 0' : '80px 0';
  const containerPad = isMobile ? '0 16px' : isSmall ? '0 20px' : '0 32px';
  const headerMarginBot = isMobile ? '28px' : isSmall ? '36px' : '48px';
  const headingSize = isMobile ? '1.6rem' : isSmall ? '2rem' : 'clamp(2rem,5vw,3.2rem)';
  const posterRatio = isMobile ? '4 / 3' : isSmall ? '16 / 9' : isTablet ? '16 / 8' : '16 / 7';
  const posterRadius = isMobile ? '16px' : '24px';
  const infoPadding = isMobile ? '28px 16px 18px' : isSmall ? '32px 20px 20px' : '40px 32px 28px';
  const clientFontSize = isMobile ? '0.95rem' : isSmall ? '1.1rem' : 'clamp(1rem,2.5vw,1.5rem)';
  const descFontSize = isMobile ? '0.65rem' : '0.72rem';
  const tagFontSize = isMobile ? '0.5rem' : '0.55rem';
  const badgeFontSize = isMobile ? '0.5rem' : '0.58rem';
  const dotMarginTop = isMobile ? '16px' : '24px';

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => { }}  /* keeps hover off on touch */
      style={{
        background: "var(--color-bg-section)",
        padding: sectionPadding,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* inject CSS once */}
      <style>{GLOBAL_CSS}</style>

      {/* Top seam */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(92%, 1200px)", height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)",
      }} />

      {/* Gold ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60%", height: "60%",
        background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: containerPad }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: headerMarginBot }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            marginBottom: isMobile ? "10px" : "14px",
          }}>
            <div style={{ width: "20px", height: "1px", background: "var(--color-navy)" }} />
            <span style={{
              fontSize: isMobile ? "0.5rem" : "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-navy)",
            }}>
              Brand Collaborations
            </span>
            <div style={{ width: "20px", height: "1px", background: "var(--color-navy)" }} />
          </div>

          <h2 style={{
            fontSize: headingSize,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--color-heading)",
            lineHeight: 1.05,
            margin: 0,
          }}>
            Valued
            <span style={{ color: "var(--color-navy)" }}> Collaborations</span>
          </h2>
        </div>

        {/* ── Poster card ── */}
        <div style={{
          position: "relative",
          width: "100%",
          borderRadius: posterRadius,
          overflow: "hidden",
          boxShadow: isMobile
            ? "rgba(79,69,50,0.2) 0px 16px 40px -8px, rgba(201,168,76,0.1) 0px 0px 0px 1px"
            : "rgba(79,69,50,0.25) 0px 30px 60px -10px, rgba(201,168,76,0.12) 0px 0px 0px 1px",
          background: "var(--color-heading)",
          aspectRatio: posterRatio,
        }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={ad.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * (isMobile ? 24 : 40) }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * (isMobile ? -24 : -40) }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "absolute", inset: 0,
                cursor: ad.link !== "#" ? "pointer" : "default",
              }}
              onClick={() => { if (ad.link !== "#") window.open(ad.link, "_blank"); }}
            >
              {/* Blurred BG */}
              <img src={ad.image} alt="" style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                filter: "blur(24px)",
                transform: "scale(1.1)",
                opacity: 0.35,
                pointerEvents: "none",
              }} />

              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: isMobile
                  ? "linear-gradient(to bottom, rgba(79,69,50,0.2) 0%, rgba(79,69,50,0.7) 100%)"
                  : "linear-gradient(to right, rgba(79,69,50,0.6) 0%, rgba(79,69,50,0.1) 50%, rgba(79,69,50,0.5) 100%)",
                zIndex: 1,
              }} />

              {/* Main image */}
              <img
                src={ad.image}
                alt={ad.client}
                className="cas-poster-img"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  padding: isMobile ? "12px" : isSmall ? "16px" : "24px",
                  zIndex: 2,
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Info strip */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: infoPadding,
                background: "linear-gradient(to top, rgba(79,69,50,0.9) 0%, transparent 100%)",
                zIndex: 3,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                justifyContent: "space-between",
                gap: isMobile ? "10px" : "16px",
              }}>
                <div>
                  <span style={{
                    display: "block", width: "fit-content",
                    padding: "3px 10px", borderRadius: "100px",
                    background: "rgba(201,168,76,0.2)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    fontSize: tagFontSize, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "#c9a84c", marginBottom: isMobile ? "5px" : "8px",
                  }}>
                    {ad.tag}
                  </span>
                  <div style={{
                    fontSize: clientFontSize, fontWeight: 800,
                    color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1,
                  }}>
                    {ad.client}
                  </div>
                  {/* Hide description on xs to save space */}
                  {!isMobile && (
                    <div style={{
                      fontSize: descFontSize,
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "4px", letterSpacing: "0.03em",
                    }}>
                      {ad.description}
                    </div>
                  )}
                </div>

                {ad.link !== "#" && (
                  <div
                    onClick={(e) => { e.stopPropagation(); window.open(ad.link, "_blank"); }}
                    style={{
                      flexShrink: 0,
                      alignSelf: isMobile ? "flex-start" : "auto",
                      padding: isMobile ? "7px 16px" : "9px 22px",
                      borderRadius: "10px",
                      background: "rgba(201,168,76,0.2)",
                      border: "1px solid rgba(201,168,76,0.4)",
                      fontSize: isMobile ? "0.6rem" : "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#c9a84c",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    }}>
                    Visit →
                  </div>
                )}
              </div>

              {/* Index badge */}
              <div style={{
                position: "absolute", top: isMobile ? "12px" : "20px",
                right: isMobile ? "12px" : "20px", zIndex: 3,
                fontSize: badgeFontSize,
                fontFamily: "monospace", letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.3)",
              }}>
                {String(activeIndex + 1).padStart(2, "0")} / {String(PARTNER_ADS.length).padStart(2, "0")}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: isMobile ? "2px" : "3px", zIndex: 10,
            background: "rgba(255,255,255,0.08)",
          }}>
            <motion.div
              key={progressKey}
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "0%" : "100%" }}
              transition={{
                duration: isHovered ? 0 : AUTOPLAY_DURATION / 1000,
                ease: "linear",
              }}
              style={{
                height: "100%",
                background: "linear-gradient(to right, #c9a84c, rgba(201,168,76,0.4))",
              }}
            />
          </div>
        </div>

        {/* ── Dots ── */}
        <div style={{
          display: "flex", justifyContent: "center",
          alignItems: "center", gap: isMobile ? "6px" : "8px",
          marginTop: dotMarginTop,
        }}>
          {PARTNER_ADS.map((_, i) => (
            <button
              key={i}
              className="cas-dot-btn"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                height: isMobile ? "5px" : "6px",
                width: i === activeIndex ? (isMobile ? "22px" : "28px") : (isMobile ? "5px" : "6px"),
                borderRadius: "3px",
                background: i === activeIndex
                  ? "var(--color-navy)"
                  : "rgba(79,69,50,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s ease",
                /* larger tap target on mobile */
                minWidth: isMobile ? "24px" : "auto",
                minHeight: isMobile ? "24px" : "auto",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {/* inner pip to keep visual size small while tap area is big */}
              {isMobile && (
                <span style={{
                  display: "block",
                  height: "5px",
                  width: i === activeIndex ? "22px" : "5px",
                  borderRadius: "3px",
                  background: i === activeIndex ? "var(--color-navy)" : "rgba(79,69,50,0.2)",
                  transition: "all 0.4s ease",
                }} />
              )}
            </button>
          ))}
        </div>

      </div>

      {/* Bottom seam */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(92%, 1200px)", height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)",
      }} />
    </section>
  );
};

export default ClientAdSection;