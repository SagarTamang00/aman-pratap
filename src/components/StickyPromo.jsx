import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTNER_ADS = [
  {
    id: 1,
    client: "Cheers Nepal",
    subtitle: "8848 Vodka",
    image: "/Work/world.png",
    link: "https://cheers.com.np",
    tag: "Brand Partner",
  },
  {
    id: 2,
    client: "Himalayan TV",
    subtitle: "Broadcast Partner",
    image: "/Work/himal.jpg",
    link: "#",
    tag: "Broadcast Partner",
  },
  {
    id: 3,
    client: "Kantipur TV HD",
    subtitle: "Media Partner",
    image: "/Work/kantipur.jpg",
    link: "#",
    tag: "Media Partner",
  },
];

const AD_DURATION = 6000;

const StickyPromo = ({ reelsSectionRef }) => {
  const [visible, setVisible]         = useState(false);
  const [open, setOpen]               = useState(false);
  const [dismissed, setDismissed]     = useState(false);
  const [adIndex, setAdIndex]         = useState(0);
  const [direction, setDirection]     = useState(1);
  const [hovered, setHovered]         = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const target = reelsSectionRef?.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !dismissed) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [reelsSectionRef, dismissed]);

  useEffect(() => {
    try { if (sessionStorage.getItem("promo_dismissed") === "1") setDismissed(true); }
    catch (_) {}
  }, []);

  const goTo = useCallback((i, dir = 1) => {
    setDirection(dir);
    setAdIndex(i);
    setProgressKey((k) => k + 1);
  }, []);

  const nextAd = useCallback(() =>
    goTo((adIndex + 1) % PARTNER_ADS.length, 1),
  [adIndex, goTo]);

  const startCycle = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(nextAd, AD_DURATION);
  }, [nextAd]);

  const stopCycle = useCallback(() => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (visible && !dismissed && open) startCycle();
    return stopCycle;
  }, [visible, dismissed, open, startCycle, stopCycle]);

  useEffect(() => {
    if (hovered) stopCycle();
    else if (visible && !dismissed && open) { setProgressKey((k) => k + 1); startCycle(); }
  }, [hovered, visible, dismissed, open, startCycle, stopCycle]);

  const handleDismiss = () => {
    setDismissed(true); setVisible(false); stopCycle();
    try { sessionStorage.setItem("promo_dismissed", "1"); } catch (_) {}
  };

  const ad = PARTNER_ADS[adIndex];

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d * 12 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
    exit:   (d) => ({ opacity: 0, x: d * -12, transition: { duration: 0.25, ease: "easeIn" } }),
  };

  if (dismissed) return null;

  const PANEL_W = 240;

  return (
    <>
      <style>{`
        .sp-btn:hover { opacity: 0.75 !important; }
        .sp-arrow:hover { border-color: #c9a84c !important; color: #c9a84c !important; }
        .sp-cta:hover { background: rgba(201,168,76,0.28) !important; }
        @keyframes sp-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "fixed",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              fontFamily: "'Montserrat', 'Inter', sans-serif",
            }}
          >
            {/* ── TAB ── */}
            <button
              className="sp-btn"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close partner ads" : "View partner ads"}
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                background: "#0e0d0b",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRight: "none",
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                color: "#c9a84c",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "16px 7px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                transition: "opacity .2s",
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "#c9a84c", flexShrink: 0,
                animation: open ? "none" : "sp-pulse 2s ease-in-out infinite",
              }} />
              {open ? "Close" : "Partners"}
              <motion.span
                animate={{ rotate: open ? 90 : -90 }}
                transition={{ duration: 0.22 }}
                style={{ fontSize: "10px", lineHeight: 1 }}
              >›</motion.span>
            </button>

            {/* ── PANEL ── */}
            <motion.div
              initial={false}
              animate={{ width: open ? PANEL_W : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", flexShrink: 0 }}
            >
              <div style={{
                width: PANEL_W,
                background: "#0e0d0b",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRight: "none",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                overflow: "hidden",
              }}>

                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 10px 9px 14px",
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                }}>
                  <span style={{
                    fontSize: "8px", fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    color: "rgba(201,168,76,0.55)",
                  }}>Our Partners</span>
                  <button
                    className="sp-btn"
                    onClick={handleDismiss}
                    aria-label="Dismiss"
                    style={{
                      width: "18px", height: "18px", borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.5)", fontSize: "11px",
                      cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      transition: "opacity .18s", lineHeight: 1,
                      padding: 0,
                    }}
                  >×</button>
                </div>

                {/* Image */}
                <div style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  background: "#141210",
                }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={ad.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                      style={{ position: "absolute", inset: 0 }}
                    >
                      {/* blurred bg */}
                      <img src={ad.image} alt="" aria-hidden="true" style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%",
                        objectFit: "cover", filter: "blur(20px) brightness(0.4)",
                        transform: "scale(1.15)",
                      }} />
                      {/* main */}
                      <img src={ad.image} alt={ad.client} style={{
                        position: "relative", zIndex: 1,
                        width: "100%", height: "100%",
                        objectFit: "contain", padding: "18px",
                      }} />
                      {/* counter */}
                      <span style={{
                        position: "absolute", top: "9px", left: "11px", zIndex: 2,
                        fontSize: "8px", fontFamily: "monospace",
                        color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em",
                      }}>
                        {String(adIndex + 1).padStart(2, "0")} / {String(PARTNER_ADS.length).padStart(2, "0")}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  {/* Arrows */}
                  {[{ dir: -1, label: "‹", side: "left" }, { dir: 1, label: "›", side: "right" }].map(({ dir, label, side }) => (
                    <button
                      key={side}
                      className="sp-arrow"
                      onClick={() => { goTo((adIndex + dir + PARTNER_ADS.length) % PARTNER_ADS.length, dir); startCycle(); }}
                      aria-label={dir === -1 ? "Previous" : "Next"}
                      style={{
                        position: "absolute", [side]: "8px", top: "50%",
                        transform: "translateY(-50%)", zIndex: 10,
                        width: "22px", height: "22px", borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.7)", fontSize: "14px",
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        transition: "border-color .18s, color .18s",
                        lineHeight: 1, padding: 0,
                      }}
                    >{label}</button>
                  ))}

                  {/* Gold bottom line progress */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "2px", background: "rgba(255,255,255,0.05)", zIndex: 5,
                  }}>
                    <motion.div
                      key={progressKey}
                      initial={{ width: "0%" }}
                      animate={{ width: hovered || !open ? "0%" : "100%" }}
                      transition={{ duration: hovered || !open ? 0 : AD_DURATION / 1000, ease: "linear" }}
                      style={{ height: "100%", background: "#c9a84c" }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "12px 14px 14px" }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={ad.id + "-t"}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                    >
                      {/* tag pill */}
                      <span style={{
                        display: "inline-block",
                        padding: "2px 9px", borderRadius: "100px",
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.28)",
                        fontSize: "7px", fontWeight: 700,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "#c9a84c", marginBottom: "7px",
                      }}>{ad.tag}</span>

                      {/* name */}
                      <p style={{
                        fontSize: "13px", fontWeight: 700,
                        color: "#f0ebe0", margin: "0 0 2px",
                        letterSpacing: "-0.01em", lineHeight: 1.25,
                      }}>{ad.client}</p>

                      {/* subtitle */}
                      <p style={{
                        fontSize: "10px", fontWeight: 500,
                        color: "rgba(240,235,224,0.38)",
                        margin: "0 0 12px", letterSpacing: "0.04em",
                      }}>{ad.subtitle}</p>
                    </motion.div>
                  </AnimatePresence>

                  {/* dots */}
                  <div style={{
                    display: "flex", gap: "5px",
                    alignItems: "center", marginBottom: ad.link !== "#" ? "11px" : 0,
                  }}>
                    {PARTNER_ADS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { goTo(i, i > adIndex ? 1 : -1); startCycle(); }}
                        aria-label={`Partner ${i + 1}`}
                        style={{
                          height: "3px",
                          width: i === adIndex ? "20px" : "5px",
                          borderRadius: "2px",
                          background: i === adIndex ? "#c9a84c" : "rgba(201,168,76,0.18)",
                          border: "none", cursor: "pointer", padding: 0,
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>

                  {/* CTA */}
                  {ad.link !== "#" && (
                    
                      < a href={ad.link} target="_blank" rel="noopener noreferrer"
                      className="sp-cta"
                      style={{
                        display: "block", textAlign: "center",
                        padding: "7px 0", borderRadius: "6px",
                        background: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.3)",
                        fontSize: "8px", fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "#c9a84c", textDecoration: "none",
                        transition: "background .18s",
                      }}
                    >Visit Site →</a>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyPromo;