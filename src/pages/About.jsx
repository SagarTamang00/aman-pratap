  import React, { useEffect, useState, useRef } from "react";
  import gsap from "gsap";

  const AboutMe = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const glowRef = useRef(null);
    const contentRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);

    // Scroll reveal
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.2 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }, []);

    // ================= MAGNETIC + LIGHT EFFECT =================
    useEffect(() => {
      const img = imageRef.current;
      const glow = glowRef.current;

      if (!img) return;

      let bounds;

      const move = (e) => {
        bounds = img.getBoundingClientRect();

        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const moveX = (x - bounds.width / 2) * 0.08;
        const moveY = (y - bounds.height / 2) * 0.08;

        // Image magnetic movement
        gsap.to(img, {
          x: moveX,
          y: moveY,
          scale: 1.03,
          duration: 0.6,
          ease: "power2.out",
        });

        // Light sweep follow
        if (glow) {
          gsap.to(glow, {
            x: x - 100,
            y: y - 100,
            opacity: 0.6,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const leave = () => {
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.to(glow, {
          opacity: 0,
          duration: 0.5,
        });
      };

      img.addEventListener("mousemove", move);
      img.addEventListener("mouseleave", leave);

      return () => {
        img.removeEventListener("mousemove", move);
        img.removeEventListener("mouseleave", leave);
      };
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
              <div className="relative w-full max-w-md aspect-3/4 overflow-hidden rounded-xl">

                {/* Glow follow layer */}
                <div
                  ref={glowRef}
                  className="absolute w-40 h-40 bg-[#c9a84c] blur-[80px] opacity-0 pointer-events-none"
                />

                {/* Depth border */}
                <div className="absolute inset-0 border border-[#c9a84c]/30 translate-x-4 translate-y-4" />

                {/* Image */}
                <img
                  ref={imageRef}
                  src="/pro.jpeg"
                  alt="Aman"
                  className="w-full h-full object-cover grayscale opacity-80 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
                />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a84c]/60" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a84c]/60" />
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div
              ref={contentRef}
              className="w-full lg:w-7/12"
            >

              <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

                {/* label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-12 bg-linear-to-r from-transparent to-[#c9a84c]" />
                  <span className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold magnetic">
                    The Vision
                  </span>
                </div>

  {/* title */}
  <h2 className="text-[clamp(36px,6vw,72px)] font-black uppercase mb-8 leading-[0.9] var(--color-heading) magnetic">
    Crafting{" "}
    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9a84c] to-[#e6d38e]">
      Stories
    </span>
  </h2>
      
                {/* text */}
                <div className="space-y-6 var(--color-heading) text-base leading-relaxed max-w-2xl">
                  <p>
                    Cinema is not just storytelling — it is controlled emotion, rhythm, and silence.
                  </p>
                  <p>
                    Every frame I design is a balance between realism and cinematic abstraction.
                  </p>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-[#c9a84c]/20">
                  <div className="magnetic">
                    <h3 className="text-4xl font-bold text-[#c9a84c]">10+</h3>
                    <p className="text-xs tracking-[0.2em] var(--color-heading) uppercase">
                      Years Experience
                    </p>
                  </div>

                  <div className="magnetic">
                    <h3 className="text-4xl font-bold text-[#c9a84c]">25+</h3>
                    <p className="text-xs tracking-[0.2em] var(--color-heading) uppercase">
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