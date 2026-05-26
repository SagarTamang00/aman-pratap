import { useEffect, useRef, useState } from "react";
import { Tv, Clock, Sparkles, Film, Globe, Briefcase, Play } from "lucide-react";

const workData = [
  {
    role: "Director",
    company: "WorldLink Communications",
    project: "Beat the Speed",
    preview: "/Work/world.png",
    badge: "WorldLink Communications",
    startDate: "JUN-26, 2024",
    endDate: "Ongoing",
    duration: "1 Year - Ongoing",
  },
  {
    role: "Director",
    company: "MoonLight Motion Pictures",
    project: "Kathghara Season-1",
    preview: "/Work/kathghara.jpg",
    badge: "MoonLight Motion Pictures",
    startDate: "DEC-21, 2025",
    endDate: "APR, 2026",
    duration: "5 Months",
  },
  {
    role: "Director",
    company: "Himalayan TV",
    project: "The Poet Idol (Season 1/2)",
    preview: "/Work/poet.jpg",
    badge: "Himalayan TV",
    startDate: "2023",
    endDate: "Ongoing",
    duration: "Ongoing",
  },
  {
    role: "Chief Executive Producer",
    company: "AP1 TV",
    project: "Shows",
    preview: "/Work/api.jpg",
    badge: "AP1 TV",
    startDate: "JAN-8, 2023",
    endDate: "MAY, 2023",
    duration: "4 Month",
  },
  {
    role: "Director / Station Manager",
    company: "Prime Television",
    project: "Shows",
    preview: "/Work/prime.jpg",
    badge: "Prime TV HD",
    startDate: "SEP-17, 2021",
    endDate: "JULY, 2022",
    duration: "9 Month",
  },
  {
    role: "Director",
    company: "Break Station",
    project: "Break Bars Rap Battle",
    preview: "/Work/break.jpg",
    badge: "Break Station",
    startDate: "SEP-15, 2021",
    endDate: "NOV, 2021",
    duration: "2 Month",
  },
  {
    role: "Director",
    company: "Aaina",
    project: "Aaina - Reflection of Truth",
    preview: "/Work/ainaa.jpg",
    badge: "Kantipur TV HD",
    startDate: "AUG-17, 2020",
    endDate: "JUL-21, 2021",
    duration: "11 Month",
  },
  {
    role: "Chief Executive Producer",
    company: "Prime TV",
    project: "2018 World Cup Special Program",
    preview: "/Work/prime.jpg",
    badge: "Prime TV HD",
    startDate: "JUN-19, 2020",
    endDate: "AUG-10, 2020",
    duration: "3 Month",
  },
  {
    role: "Executive Producer / Director",
    company: "Himalaya Television",
    project: "Himalayan Roadies",
    preview: "/Work/himal.jpg",
    badge: "Himalayan TV",
    startDate: "AUG-14, 2019",
    endDate: "2020",
    duration: "4 Months",
  },
  {
    role: "Director / Executive Producer",
    company: "Himalayan Tv",
    project: "KO BANCHA CROREPATI (KBC NEPAL)",
    preview: "/Work/himal.jpg",
    badge: "Himalayan Tv",
    startDate: "OCT-31, 2018",
    endDate: "JUN-3, 2019",
    duration: "7 Month",
  },
  {
    role: "Presenter / Analyst",
    company: "Kantipur TV HD",
    project: "2018 World Cup Special Program",
    preview: "/Work/kantipur.jpg",
    badge: "Kantipur TV HD",
    startDate: "JUN-14, 2018",
    endDate: "JUL-15, 2018",
    duration: "1 Month",
  },
  {
    role: "Executive Producer / Director",
    company: "Himalaya Television",
    project: "Himalayan Roadies",
    preview: "/Work/himal.jpg",
    badge: "Himalayan TV",
    startDate: "2017",
    endDate: "AUG - 2018",
    duration: "1 Years 7 Months",
  },
  {
    role: "Executive Producer",
    company: "Himalaya Television",
    project: "Shows",
    preview: "/Work/himal.jpg",
    badge: "Himalayan TV",
    startDate: "JAN-1, 2016",
    endDate: "APR-13, 2018",
    duration: "2 Years 3 Months",
  },
  {
    role: "Director",
    company: "Kripa Unplugged",
    project: "Kripa Unplugged Show",
    preview: "/Work/kripa.jpg",
    badge: "Kripa TV",
    startDate: "2015",
    endDate: "2017",
    duration: "2 Years",
  },
  {
    role: "Producer / Presenter",
    company: "Nepal Television (NTV)",
    project: "Show",
    preview: "/Work/ntv.jpg",
    companyInitials: "NTV",
    badge: "NTV Sports",
    startDate: "1998",
    endDate: "2004",
    duration: "6 Years",
  },
];

const Counter = ({ target, isVisible }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) { setCount(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isVisible, target]);
  return <>{String(count).padStart(2, "0")}</>;
};

const getIcon = (item, size = 12) => {
  const t = (item.company + item.badge).toLowerCase();
  if (t.includes("worldlink")) return <Globe size={size} strokeWidth={1.8} />;
  if (t.includes("motion") || t.includes("unplugged") || t.includes("idol"))
    return <Film size={size} strokeWidth={1.8} />;
  if (t.includes("tv") || t.includes("television") || t.includes("station"))
    return <Tv size={size} strokeWidth={1.8} />;
  return <Briefcase size={size} strokeWidth={1.8} />;
};

const Work = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [prevIndex, setPrevIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);

  const active = workData[activeIndex];
  const prev = workData[prevIndex];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.unobserve(node);
  }, []);

  const handleSelect = (i, shouldScroll = false) => {
    if (i === activeIndex) {
      if (shouldScroll && window.innerWidth < 1024 && previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setPrevIndex(activeIndex);
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(i);
      setTransitioning(false);
      
      if (shouldScroll && window.innerWidth < 1024 && previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 220);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden py-16 px-4 sm:px-6 md:px-8 lg:py-24"
      style={{
        background: "var(--color-bg-section)",
      }}
    >
      {/* Top seam */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(92%,1400px)", height: "1px",
        background: "linear-gradient(to right,transparent,rgba(201,168,76,0.35),transparent)",
        pointerEvents: "none",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Sparkles size={12} color="var(--color-navy)" strokeWidth={1.5} />
              <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-heading)" }}>
                Career Timeline
              </span>
              <div style={{ width: "36px", height: "1px", background: "var(--color-navy)" }} />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
              color: "var(--color-heading)",
            }}>
              Work
            </h2>
          </div>

          <div className="flex gap-4 pb-1 self-start md:self-auto">
            {[
              { val: <Counter target={workData.length} isVisible={isVisible} />, lbl: "Roles" },
              { val: "28+", lbl: "Years" },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="flex flex-col items-center py-2 px-5 sm:py-3.5 sm:px-6 rounded-full border border-[rgba(79,69,50,0.1)] bg-[rgba(255,255,255,0.15)]">
                <span style={{ fontSize: "clamp(1.2rem, 4vw, 1.7rem)", fontWeight: 900, lineHeight: 1, color: "var(--color-navy)" }}>{val}</span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(79,69,50,0.5)", marginTop: "3px" }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Split layout ── */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >

          {/* LEFT — Sticky feature panel */}
          <div ref={previewRef} className="lg:sticky lg:top-10">
            {/* Image frame */}
            <div 
              className="relative w-full overflow-hidden rounded-[24px] aspect-[16/10] sm:aspect-video lg:aspect-[1/1.1]"
              style={{
                background: "var(--color-navy)",
              }}
            >
              {/* BG image — fades between entries */}
              <div style={{
                position: "absolute", inset: 0,
                opacity: transitioning ? 0 : 1,
                transition: "opacity 0.22s ease",
              }}>
                {active.preview ? (
                  <img
                    src={active.preview}
                    alt={active.company}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #1e1a14, #2e2720)",
                    color: "#c9a84c",
                    fontSize: "3rem", fontWeight: 900, letterSpacing: "0.1em",
                  }}>
                    {active.companyInitials}
                  </div>
                )}
              </div>

              {/* Dark cinematic overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,12,8,0.92) 0%, rgba(15,12,8,0.45) 45%, rgba(15,12,8,0.1) 100%)",
              }} />

              {/* Top-left index badge */}
              <div style={{
                position: "absolute", top: "20px", left: "20px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 900,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {String(activeIndex + 1).padStart(2, "0")} / {String(workData.length).padStart(2, "0")}
                </span>
              </div>

              {/* Top-right: badge */}
              <div style={{
                position: "absolute", top: "20px", right: "20px",
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "100px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "0.62rem", fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.14em",
                opacity: transitioning ? 0 : 1,
                transition: "opacity 0.22s ease",
              }}>
                {getIcon(active, 10)}
                {active.badge}
              </div>

              {/* Bottom content */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-8"
                style={{
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? "translateY(8px)" : "translateY(0)",
                  transition: "opacity 0.22s ease, transform 0.22s ease",
                }}
              >
                {/* Project chip */}
                {active.project && (
                  <div 
                    className="inline-flex items-center gap-1.5 mb-2 sm:mb-3 lg:mb-4 px-2.5 py-1 rounded"
                    style={{
                      background: "rgba(201,168,76,0.25)",
                      border: "1px solid rgba(201,168,76,0.35)",
                      fontSize: "0.62rem", fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: "0.12em",
                      color: "#e8c96e",
                    }}
                  >
                    <Play size={9} strokeWidth={2.5} fill="#e8c96e" />
                    {active.project}
                  </div>
                )}

                <h3 style={{
                  margin: "0 0 4px 0",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.9rem)",
                  fontWeight: 900, lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                }}>
                  {active.role}
                </h3>

                <p style={{
                  margin: "0 0 8px 0",
                  fontSize: "0.82rem", fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {active.company}
                </p>

                {/* Date strip */}
                <div 
                  className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-6 pt-3 sm:pt-4 border-t border-white/10"
                >
                  {[
                    { lbl: "From", val: active.startDate },
                    { lbl: "Until", val: active.endDate },
                    { lbl: "Duration", val: active.duration },
                  ].map(({ lbl, val }) => (
                    <div key={lbl}>
                      <div style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>{lbl}</div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Scrollable list */}
          <div ref={listRef} className="flex flex-col w-full">
            {workData.map((item, i) => {
              const isActive = activeIndex === i;
              const delay = i * 0.035;

              return (
                <div
                  key={`${item.company}-${i}`}
                  onMouseEnter={() => handleSelect(i, false)}
                  onClick={() => handleSelect(i, true)}
                  className="relative cursor-pointer group"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(20px)",
                    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
                  }}
                >
                  {/* Separator */}
                  {i > 0 && (
                    <div style={{ height: "1px", background: isActive ? "rgba(201,168,76,0.2)" : "rgba(79,69,50,0.08)", transition: "background 0.3s ease" }} />
                  )}

                  <div 
                    className="grid grid-cols-[44px_1fr_auto] gap-3 sm:gap-4 items-center p-3.5 sm:p-4 rounded-xl"
                    style={{
                      background: isActive
                        ? "linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))"
                        : "transparent",
                      transition: "background 0.35s ease",
                    }}
                  >

                    {/* Thumbnail */}
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: isActive ? "2px solid rgba(201,168,76,0.5)" : "1px solid rgba(79,69,50,0.1)",
                      flexShrink: 0,
                      transition: "border 0.3s ease, transform 0.3s ease",
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                    }}>
                      {item.preview ? (
                        <img src={item.preview} alt={item.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "var(--color-navy)", color: "#c9a84c",
                          fontSize: "0.55rem", fontWeight: 900,
                        }}>{item.companyInitials}</div>
                      )}
                    </div>

                    {/* Text */}
                    <div>
                      <div style={{
                        fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: isActive ? "var(--color-heading)" : "rgba(79,69,50,0.7)",
                        lineHeight: 1.2,
                        transition: "color 0.3s ease",
                      }}>
                        {item.role}
                      </div>
                      <div style={{
                        fontSize: "clamp(0.62rem, 2vw, 0.7rem)", fontWeight: 600,
                        textTransform: "uppercase", letterSpacing: "0.07em",
                        color: isActive ? "rgba(79,69,50,0.55)" : "rgba(79,69,50,0.35)",
                        marginTop: "2px",
                        transition: "color 0.3s ease",
                      }}>
                        {item.company}
                      </div>
                    </div>

                    {/* Right: index + duration */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span style={{
                        fontSize: "0.6rem", fontWeight: 900,
                        letterSpacing: "0.18em",
                        color: isActive ? "var(--color-navy)" : "rgba(79,69,50,0.25)",
                        fontVariantNumeric: "tabular-nums",
                        transition: "color 0.3s ease",
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        fontSize: "0.62rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.1em",
                        color: isActive ? "rgba(79,69,50,0.5)" : "rgba(79,69,50,0.25)",
                        transition: "color 0.3s ease",
                      }}>
                        <Clock size={9} strokeWidth={2.5} />
                        {item.duration}
                      </span>
                    </div>

                    {/* Active left pip */}
                    <div style={{
                      position: "absolute",
                      left: 0, top: "20%", bottom: "20%",
                      width: "3px", borderRadius: "0 2px 2px 0",
                      background: "linear-gradient(to bottom, var(--color-navy), #c9a84c)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scaleY(1)" : "scaleY(0.3)",
                      transformOrigin: "center",
                      transition: "opacity 0.35s ease, transform 0.35s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom seam */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(92%,1400px)", height: "1px",
        background: "linear-gradient(to right,transparent,rgba(201,168,76,0.35),transparent)",
        pointerEvents: "none",
      }} />
    </section>
  );
};

export default Work;