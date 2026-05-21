import { useEffect, useRef, useState } from "react";
import { Tv, Clock, Sparkles, Film, Globe, Briefcase } from "lucide-react";

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
    role: "Executive Producer/ Director",
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
    role: "Presenter/ Analyst",
    company: "Kantipur TV HD",
    project: "2018 World Cup Special Program",
    preview: "/Work/kantipur.jpg",
    badge: "Kantipur TV HD",
    startDate: "JUN-14, 2018",
    endDate: "JUL-15, 2018",
    duration: "1 Month",
  },
  {
    role: "Executive Producer/ Director",
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

const Counter = ({ target, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, target]);

  return <>{String(count).padStart(2, "0")}{suffix}</>;
};

const Work = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden pt-12 pb-32 md:py-32 px-6 bg-[var(--color-bg-section)]"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(201,168,76,0.12), transparent 40%)" }}
      />

      {/* Top / bottom seam lines */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px pointer-events-none"
        style={{ width: "min(92%, 1400px)", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px pointer-events-none"
        style={{ width: "min(92%, 1400px)", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }}
      />

      {/* Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto">

        {/* ── Header ── */}
        <div
          className="mb-16 transition-all duration-[900ms] ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[var(--color-navy)]" />
            <Sparkles size={14} color="var(--color-navy)" strokeWidth={1.5} />
            <span className="text-[0.75rem] uppercase tracking-[0.22em] font-extrabold text-[var(--color-heading)]">
              Timeline
            </span>
          </div>

          {/* Title row */}
          <div className="flex justify-between items-end gap-8 flex-wrap">
            <h2
              className="m-0 font-black leading-[0.95] tracking-[-0.05em] text-[var(--color-heading)]"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              Work
            </h2>

            {/* Stats pill */}
            <div className="flex items-center gap-6 px-5 py-4 rounded-full bg-white/20 border border-[rgba(79,69,50,0.08)] backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex flex-col gap-1">
                <span className="text-[1.8rem] font-black leading-none text-[var(--color-navy)]">
                  <Counter target={workData.length} isVisible={isVisible} />
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-[rgba(79,69,50,0.7)]">
                  / {String(workData.length).padStart(2, "0")} Roles
                </span>
              </div>
              <div className="w-px h-10 bg-[rgba(79,69,50,0.1)]" />
              <div className="flex flex-col gap-1">
                <span className="text-[1.8rem] font-black leading-none text-[var(--color-heading)]">
                  28+
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-[rgba(79,69,50,0.7)]">
                  Years Exp
                </span>
              </div>
            </div>
          </div>

          {/* Expanding rule */}
          <div
            className="mt-8 h-px transition-[width] duration-[1200ms] ease-out"
            style={{
              width: isVisible ? "100%" : "0%",
              background: "linear-gradient(to right, var(--color-navy), rgba(79,69,50,0.08))",
            }}
          />
        </div>

        {/* ── Work rows ── */}
        <ul className="flex flex-col gap-5 m-0 p-0 list-none">
          {workData.map((item, i) => {
            const isActive = activeIndex === i;

            return (
              <li
                key={`${item.company}-${item.role}-${i}`}
                className="relative overflow-hidden rounded-[2rem] border bg-white/20 backdrop-blur-md cursor-default transition-[border-color,box-shadow,transform] duration-[450ms] ease-out"
                style={{
                  borderColor: isActive ? "rgba(201,168,76,0.35)" : "rgba(79,69,50,0.08)",
                  boxShadow: isActive ? "0 12px 30px rgba(79,69,50,0.08), 0 2px 10px rgba(201,168,76,0.08)" : "none",
                  transform: isActive ? "translateY(-4px)" : isVisible ? "translateY(0)" : "translateY(20px)",
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s, border-color 0.45s ease, box-shadow 0.45s ease`,
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Hover gradient fill */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    background: "linear-gradient(135deg, rgba(201,168,76,0.08), transparent)",
                  }}
                />

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-1/2 w-1 rounded-full pointer-events-none transition-[opacity,transform] duration-[450ms]"
                  style={{
                    height: "70%",
                    background: "linear-gradient(to bottom, var(--color-navy), var(--color-primary))",
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(-50%) scaleY(${isActive ? 1 : 0.4})`,
                  }}
                />

                {/* Row Grid Layout - Fixed grid on desktop to ensure perfect vertical alignment, zero zigzag */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-[96px_280px_1fr_220px] items-start md:items-center gap-6 p-6 md:p-8">

                  {/* Column 1: Viewfinder Logo Container */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-[rgba(79,69,50,0.12)] bg-white/40 shadow-sm relative group">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.company}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2e2a22] to-[#1e1c17] text-[#c9a84c]">
                        {/* Viewfinder crosshairs representing the 'X' inside square */}
                        <svg className="absolute inset-0 w-full h-full opacity-35 stroke-current" strokeWidth="0.75" fill="none">
                          <line x1="0" y1="0" x2="100%" y2="100%" />
                          <line x1="100%" y1="0" x2="0" y2="100%" />
                          <circle cx="50%" cy="50%" r="20%" strokeDasharray="3,3" />
                        </svg>
                        <span className="relative z-10 text-[0.8rem] tracking-[0.2em] font-extrabold uppercase opacity-85">{item.companyInitials}</span>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Pill Badge */}
                  <div className="flex items-center justify-start w-full">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.7rem] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap border transition-all duration-[450ms] ${isActive
                      ? "bg-[var(--color-navy)] text-white border-transparent"
                      : "bg-white/50 border-[rgba(79,69,50,0.12)] text-[var(--color-heading)]"
                      }`}>
                      {(() => {
                        const iconClass = isActive ? "text-white" : "text-[#c9a84c]";
                        const iconSize = 11;
                        const text = (item.company + " " + item.badge).toLowerCase();

                        if (text.includes("worldlink")) {
                          return <Globe size={iconSize} strokeWidth={2.5} className={iconClass} />;
                        }
                        if (text.includes("motion pictures") || text.includes("unplugged") || text.includes("kripa") || text.includes("idol")) {
                          return <Film size={iconSize} strokeWidth={2.5} className={iconClass} />;
                        }
                        if (text.includes("tv") || text.includes("television") || text.includes("station")) {
                          return <Tv size={iconSize} strokeWidth={2.5} className={iconClass} />;
                        }
                        return <Briefcase size={iconSize} strokeWidth={2.5} className={iconClass} />;
                      })()}
                      {item.badge}
                    </span>
                  </div>

                  {/* Column 3: Center Group: Title and Description */}
                  <div className="w-full text-left mt-2 md:mt-0 md:pr-4">
                    <h3 className="m-0 text-[1.4rem] md:text-[1.65rem] font-black leading-tight tracking-[-0.03em] text-[var(--color-heading)]">
                      {item.role}
                    </h3>
                    <p className="mt-1 mb-0 text-[0.92rem] font-semibold text-[rgba(79,69,50,0.65)] uppercase tracking-[0.06em]">
                      {item.company}
                    </p>
                    {item.project && (
                      <span className="inline-block mt-2.5 text-[0.72rem] px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] text-[#8b6d5c] font-black uppercase tracking-[0.08em]">
                        {item.project}
                      </span>
                    )}
                  </div>

                  {/* Column 4: Right Group: Date Range and Duration */}
                  <div className="flex flex-col items-start md:items-end text-left md:text-right w-full pt-4 md:pt-0 border-t border-[rgba(79,69,50,0.06)] md:border-0 mt-4 md:mt-0">
                    <div className="text-[0.88rem] md:text-[0.98rem] font-extrabold tracking-[0.08em] text-[var(--color-heading)] leading-snug">
                      <div>{item.startDate} —</div>
                      <div className="md:mt-0.5">{item.endDate}</div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[0.75rem] md:text-[0.8rem] uppercase font-black tracking-[0.14em] text-[#8b6d5c] mt-2.5 bg-white/40 px-3 py-1 rounded-full border border-[rgba(79,69,50,0.06)]">
                      <Clock size={11} strokeWidth={2.5} />
                      {item.duration}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
};

export default Work;
