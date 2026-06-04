import { useState, useEffect, useRef, useCallback } from "react";
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
const PANEL_WIDTH = 220;

const StickyPromo = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [adIndex, setAdIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback((i, dir = 1) => {
    setDirection(dir);
    setAdIndex(i);
    setProgressKey((k) => k + 1);
  }, []);

  const nextAd = useCallback(
    () => goTo((adIndex + 1) % PARTNER_ADS.length, 1),
    [adIndex, goTo]
  );

  const startCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextAd, AD_DURATION);
  }, [nextAd]);

  const stopCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (visible && open && !hovered) startCycle();
    else stopCycle();
    return stopCycle;
  }, [visible, open, hovered, startCycle, stopCycle]);

  const ad = PARTNER_ADS[adIndex];

  const slideVariants = {
    enter: (d) => ({ opacity: 0, x: d * 16 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.25, 1, 0.25, 1] },
    },
    exit: (d) => ({
      opacity: 0,
      x: d * -16,
      transition: { duration: 0.25, ease: "easeIn" },
    }),
  };

  const S = {
    // using your global CSS variables
    bg: "var(--bg)",                          // #d1c4af
    bgSoft: "rgba(209, 196, 175, 0.6)",
    text: "var(--text)",                      // #4f4532
    textMuted: "rgba(79, 69, 50, 0.55)",
    accent: "var(--accent)",                  // #c9a84c
    accentBg: "var(--accent-bg)",             // rgba(201,168,76,0.12)
    accentBorder: "var(--accent-border)",     // rgba(201,168,76,0.35)
    border: "var(--border)",                  // rgba(230,211,142,0.18)
    borderStrong: "rgba(201, 168, 76, 0.28)",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: "110%" }}
          animate={{ x: 0 }}
          exit={{ x: "110%" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed top-1/2 -translate-y-1/2 right-0 flex items-center"
          style={{ zIndex: 9999, fontFamily: "var(--sans)" }}
        >
          <style>{`
            @keyframes sp-progress {
              from { width: 0%; }
              to { width: 100%; }
            }
            @keyframes sp-blink {
              0%,100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .sp-nav-btn:hover {
              border-color: var(--accent) !important;
              color: var(--accent) !important;
            }
            .sp-cta:hover {
              background: var(--accent-bg) !important;
              box-shadow: 0 0 16px rgba(201,168,76,0.2) !important;
            }
            .sp-tab:hover {
              background: rgba(209,196,175,0.85) !important;
            }
          `}</style>

          {/* TAB */}
          <button
            className="sp-tab"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close partners" : "View partners"}
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              background: S.bg,
              border: `1px solid ${S.borderStrong}`,
              borderRight: "none",
              borderRadius: "8px 0 0 8px",
              padding: "14px 7px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              minHeight: 90,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: S.accent,
                animation: open ? "none" : "sp-blink 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: S.textMuted,
              }}
            >
              {open ? "Close" : "Partners"}
            </span>
            <motion.span
              animate={{ rotate: open ? 90 : -90 }}
              transition={{ duration: 0.22 }}
              style={{ fontSize: 14, color: S.accent, lineHeight: 1 }}
            >
              ›
            </motion.span>
          </button>

          {/* PANEL */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: PANEL_WIDTH, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: S.bg,
                  border: `1px solid ${S.borderStrong}`,
                  borderRight: "none",
                  borderRadius: "10px 0 0 10px",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: PANEL_WIDTH }}>

                  {/* HEADER */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: `1px solid ${S.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {/* small radio-wave icon using accent color */}
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <circle cx="5.5" cy="5.5" r="2" fill={S.accent} />
                        <circle cx="5.5" cy="5.5" r="4.5" stroke={S.accent} strokeWidth="0.75" fill="none" opacity="0.4" />
                      </svg>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: S.textMuted,
                        }}
                      >
                        Our Partners
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--mono)",
                        color: S.textMuted,
                      }}
                    >
                      {String(adIndex + 1).padStart(2, "0")}/
                      {String(PARTNER_ADS.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* IMAGE */}
                  <div
                    style={{
                      position: "relative",
                      height: 130,
                      overflow: "hidden",
                      background: "rgba(79,69,50,0.08)",
                    }}
                  >
                    <AnimatePresence custom={direction} mode="wait">
                      <motion.div
                        key={ad.id}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <img
                          src={ad.image}
                          alt={ad.client}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        {/* bottom vignette */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(79,69,50,0.65) 0%, transparent 55%)",
                            pointerEvents: "none",
                          }}
                        />
                        {/* tag badge */}
                        <span
                          style={{
                            position: "absolute",
                            top: 9,
                            left: 9,
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: S.accent,
                            background: "rgba(79,69,50,0.72)",
                            border: `1px solid ${S.accentBorder}`,
                            padding: "3px 8px",
                            borderRadius: 100,
                          }}
                        >
                          {ad.tag}
                        </span>
                      </motion.div>
                    </AnimatePresence>

                    {/* NAV ARROWS */}
                    {[
                      { dir: -1, label: "‹", side: "left" },
                      { dir: 1, label: "›", side: "right" },
                    ].map(({ dir, label, side }) => (
                      <button
                        key={dir}
                        className="sp-nav-btn"
                        onClick={() =>
                          goTo(
                            (adIndex + dir + PARTNER_ADS.length) % PARTNER_ADS.length,
                            dir
                          )
                        }
                        aria-label={dir === -1 ? "Previous" : "Next"}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          [side]: 8,
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: "rgba(79,69,50,0.55)",
                          border: `1px solid ${S.accentBorder}`,
                          color: "#d1c4af",
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          lineHeight: 1,
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    style={{
                      height: 2,
                      background: S.accentBg,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      key={progressKey}
                      style={{
                        height: "100%",
                        background: S.accent,
                        animation: hovered
                          ? "none"
                          : `sp-progress ${AD_DURATION}ms linear forwards`,
                        width: hovered ? "0%" : undefined,
                      }}
                    />
                  </div>

                  {/* BODY */}
                  <div
                    style={{
                      padding: "12px 14px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--text)",
                            margin: 0,
                            lineHeight: 1.25,
                            fontFamily: "var(--heading)",
                          }}
                        >
                          {ad.client}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: S.textMuted,
                            margin: "3px 0 0",
                          }}
                        >
                          {ad.subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* DOTS */}
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {PARTNER_ADS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i, i > adIndex ? 1 : -1)}
                          aria-label={`Partner ${i + 1}`}
                          style={{
                            height: 2,
                            width: i === adIndex ? 18 : 6,
                            borderRadius: 2,
                            background: i === adIndex ? S.accent : S.accentBorder,
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            transition: "width 0.3s, background 0.3s",
                          }}
                        />
                      ))}
                    </div>

                    {/* CTA */}
                    {ad.link !== "#" && (
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sp-cta"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: S.accent,
                          background: S.accentBg,
                          border: `1px solid ${S.accentBorder}`,
                          borderRadius: 6,
                          padding: "7px 12px",
                          textDecoration: "none",
                          alignSelf: "flex-start",
                          transition: "background 0.15s, box-shadow 0.15s",
                        }}
                      >
                        Visit site
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyPromo;