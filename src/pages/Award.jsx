import { useEffect, useRef, useState } from "react";
import { Award, Trophy, MapPin, Calendar, Sparkles } from "lucide-react";

const awardsData = [
  {
    year: "2024",
    title: "Best Director",
    festival: "Kathmandu International Mountain Film Festival",
    film: "Echoes of the Himalayas",
    location: "Kathmandu, Nepal",
    type: "Winner",
  },
  {
    year: "2024",
    title: "Special Jury Prize",
    festival: "South Asian Film Festival",
    film: "The Silent Valley",
    location: "Mumbai, India",
    type: "Winner",
  },
  {
    year: "2023",
    title: "Best Cinematography",
    festival: "Dharamshala International Film Festival",
    film: "Echoes of the Himalayas",
    location: "Dharamshala, India",
    type: "Winner",
  },
  {
    year: "2023",
    title: "Best Feature Film",
    festival: "Nepal Film Award",
    film: "The Silent Valley",
    location: "Kathmandu, Nepal",
    type: "Nominee",
  },
  {
    year: "2022",
    title: "Grand Jury Award",
    festival: "Busan International Film Festival",
    film: "Before the Monsoon",
    location: "Busan, South Korea",
    type: "Winner",
  },
  {
    year: "2021",
    title: "Best Short Film",
    festival: "DIFF — Durban International Film Festival",
    film: "Red Clay",
    location: "Durban, South Africa",
    type: "Winner",
  },
];

const Awards = () => {
  const [activeIndex,   setActiveIndex]   = useState(null);
  const [isVisible,     setIsVisible]     = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setRevealedCount(count);
            if (count >= awardsData.length) clearInterval(interval);
          }, 140);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  const winners = awardsData.filter((a) => a.type === "Winner").length;

  return (
    <section
      ref={sectionRef}
      id="awards"
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

      {/* Ghost watermark */}
      <div className="absolute top-12 -right-4 pointer-events-none select-none">
        <span
          className="font-black uppercase leading-none tracking-[-0.06em]"
          style={{ fontSize: "clamp(5rem, 14vw, 12rem)", color: "rgba(79,69,50,0.04)" }}
        >
          Honours
        </span>
      </div>

      {/* Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto">

        {/* ── Header ── */}
        <div
          className="mb-16 transition-all duration-[900ms] ease-out"
          style={{
            opacity:   isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[var(--color-navy)]" />
            <Sparkles size={14} color="var(--color-navy)" strokeWidth={1.5} />
            <span className="text-[0.75rem] uppercase tracking-[0.22em] font-extrabold text-[var(--color-heading)]">
              Recognition
            </span>
          </div>

          {/* Title row */}
          <div className="flex justify-between items-end gap-8 flex-wrap">
            <h2
              className="m-0 font-black leading-[0.95] tracking-[-0.05em] text-[var(--color-heading)]"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              Awards &amp;{" "}
              <span className="text-[var(--color-navy)] italic">Honours</span>
            </h2>

            {/* Stats pill */}
            <div className="flex items-center gap-6 px-5 py-4 rounded-full bg-white/20 border border-[rgba(79,69,50,0.08)] backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex flex-col gap-1">
                <span className="text-[1.8rem] font-black leading-none text-[var(--color-navy)]">
                  {String(revealedCount).padStart(2, "0")}
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-[rgba(79,69,50,0.7)]">
                  / {String(awardsData.length).padStart(2, "0")} Total
                </span>
              </div>
              <div className="w-px h-10 bg-[rgba(79,69,50,0.1)]" />
              <div className="flex flex-col gap-1">
                <span className="text-[1.8rem] font-black leading-none text-[var(--color-heading)]">
                  {String(winners).padStart(2, "0")}
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-[rgba(79,69,50,0.7)]">
                  Wins
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

        {/* ── Award rows ── */}
        <ul className="flex flex-col gap-4 m-0 p-0 list-none">
          {awardsData.map((award, i) => {
            const isActive = activeIndex === i;
            const isWinner = award.type === "Winner";

            return (
              <li
                key={`${award.year}-${award.title}-${i}`}
                className="relative overflow-hidden rounded-[2rem] border bg-white/20 backdrop-blur-md cursor-default transition-[border-color,box-shadow,transform] duration-[450ms] ease-out"
                style={{
                  borderColor: isActive ? "rgba(201,168,76,0.3)" : "rgba(79,69,50,0.08)",
                  boxShadow:   isActive ? "0 12px 30px rgba(79,69,50,0.08), 0 2px 10px rgba(201,168,76,0.08)" : "none",
                  transform:   isActive ? "translateY(-4px)" : "translateY(0)",
                  opacity:     i < revealedCount ? 1 : 0,
                  transition:  `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s, border-color 0.45s ease, box-shadow 0.45s ease`,
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Hover gradient fill */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
                  style={{
                    opacity:    isActive ? 1 : 0,
                    background: "linear-gradient(135deg, rgba(201,168,76,0.08), transparent)",
                  }}
                />

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-1/2 w-1 rounded-full pointer-events-none transition-[opacity,transform] duration-[450ms]"
                  style={{
                    height:     "70%",
                    background: "linear-gradient(to bottom, var(--color-navy), var(--color-primary))",
                    opacity:    isActive ? 1 : 0,
                    transform:  `translateY(-50%) scaleY(${isActive ? 1 : 0.4})`,
                  }}
                />

                {/* Row grid — 4 cols on xl, 3 on md, 1 on mobile */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-[110px_130px_1fr] xl:grid-cols-[120px_140px_1fr_320px] items-center gap-4 p-6 md:p-8">

                  {/* Year */}
                  <div className="flex items-center gap-3 text-[0.95rem] font-extrabold tracking-[0.05em] text-[var(--color-heading)]">
                    <span className="w-8 h-8 rounded-full grid place-items-center bg-[rgba(201,168,76,0.14)] shrink-0">
                      <Calendar size={14} strokeWidth={1.5} />
                    </span>
                    {award.year}
                  </div>

                  {/* Badge */}
                  <div>
                    <span
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[0.72rem] font-extrabold uppercase tracking-[0.12em] transition-colors duration-[450ms]"
                      style={
                        isWinner
                          ? isActive
                            ? { background: "var(--color-navy)", color: "#fff", border: "1px solid transparent" }
                            : { background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.18)", color: "var(--color-heading)" }
                          : { background: "rgba(79,69,50,0.08)", border: "1px solid rgba(79,69,50,0.08)", color: "var(--color-heading)" }
                      }
                    >
                      {isWinner ? <Trophy size={10} strokeWidth={2} /> : <Award size={10} strokeWidth={2} />}
                      {award.type}
                    </span>
                  </div>

                  {/* Title + film */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="m-0 text-[1.2rem] md:text-[1.35rem] font-black leading-[1.1] tracking-[-0.03em] text-[var(--color-heading)]">
                      {award.title}
                    </h3>
                    <p className="m-0 text-[0.92rem] italic text-[rgba(79,69,50,0.7)]">
                      {award.film}
                    </p>
                  </div>

                  {/* Festival + location — full width on < xl */}
                  <div
                    className="flex flex-col gap-1.5 xl:items-end md:col-span-3 xl:col-span-1 transition-[opacity,transform] duration-[350ms]"
                    style={{
                      opacity:   isActive ? 1 : 0.55,
                      transform: `translateX(${isActive ? 0 : 6}px)`,
                    }}
                  >
                    <p className="m-0 text-[0.95rem] font-extrabold text-[var(--color-heading)] xl:text-right">
                      {award.festival}
                    </p>
                    <p className="m-0 flex items-center gap-1.5 text-[0.82rem] text-[rgba(79,69,50,0.65)]">
                      <MapPin size={12} strokeWidth={1.5} />
                      {award.location}
                    </p>
                  </div>

                </div>
              </li>
            );
          })}
        </ul>

        {/* ── Footer ── */}
        <div
          className="mt-16 pt-8 border-t border-[rgba(79,69,50,0.08)] flex flex-wrap justify-between items-center gap-4 transition-opacity duration-[1000ms] delay-[1000ms]"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <p className="m-0 text-[0.82rem] tracking-[0.15em] uppercase font-bold text-[rgba(79,69,50,0.65)]">
            International Recognition · 2021 — Present
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-px bg-(--color-navy)" />
            <p className="m-0 text-[0.82rem] tracking-[0.15em] uppercase font-bold text-[rgba(79,69,50,0.65)]">
              Aman Pratap Adhikary
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Awards;