import React, { useEffect, useState, useRef } from "react";

const Counter = ({ target, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    const duration = 2000;
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

  return <>{count}{suffix}</>;
};

const AboutMe = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center py-24 overflow-hidden mt-4"
      style={{ background: "var(--color-bg-section)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-[#c9a84c] opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2" />

      <div className="container mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ================= IMAGE ================= */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[1354/2288]">
              <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src="/pro1.jpeg"
                  alt="Aman"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a84c]/80 rounded-tl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a84c]/80 rounded-br-xl pointer-events-none" />
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div
            ref={contentRef}
            className="w-full lg:w-7/12"
          >
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
                <span className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold">
                  The Vision
                </span>
              </div>

              {/* Title */}
              {/* ✅ Fixed: was `var(--color-heading)` as a class (invalid) → moved to style prop */}
              <h2
                className="text-[clamp(36px,6vw,72px)] font-black uppercase mb-8 leading-[0.9]"
                style={{ color: "var(--color-heading)" }}
              >
                Crafting{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e6d38e]">
                  Stories
                </span>
              </h2>

              {/* Text */}
              {/* ✅ Fixed: same invalid class usage → moved to style prop */}
              <div
                className="space-y-6 text-base leading-relaxed max-w-2xl"
                style={{ color: "var(--color-body)" }}
              >
                <p>
                  Cinema is not just storytelling — it is controlled emotion, rhythm, and silence.
                </p>
                <p>
                  Every frame I design is a balance between realism and cinematic abstraction.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-[#c9a84c]/20">
                <div>
                  <h3 className="text-4xl font-bold text-[#c9a84c]">
                    <Counter target={28} isVisible={isVisible} suffix="+" />
                  </h3>
                  {/* ✅ Fixed: same invalid class usage → moved to style prop */}
                  <p
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--color-body)" }}
                  >
                    Years Experience
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-bold text-[#c9a84c]">
                    <Counter target={20} isVisible={isVisible} suffix="+" />
                  </h3>
                  <p
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--color-body)" }}
                  >
                    Projects
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutMe;