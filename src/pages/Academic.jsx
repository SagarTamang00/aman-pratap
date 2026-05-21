import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SpotLight, Float } from "@react-three/drei";
import * as THREE from "three";

const educationData = [
  {
    level: "Chapter I — Schooling",
    title: "Saint Xavier's School",
    school: "Saint Xavier's School",
    year: "1980 – 1990",
    meta: { label: "School", value: "Schooling" },
    description:
      "Foundation years mastering core disciplines — science, mathematics, and humanities.",
    bg: "/xavier.jpeg",
  },
  {
    level: "Chapter II — Higher Secondary",
    title: "+2 Management",
    school: "Sainik Awasiya Mahavidhalaya",
    year: "2000",
    meta: { label: "Stream", value: "Management" },
    description: "The turning point — where storytelling met technical curiosity.",
    bg: "/Sainik.jpeg",
  },
  {
    level: "Chapter III — Bachelor's",
    title: "Bachelors in Arts",
    school: "University of Delhi",
    year: "1995",
    meta: { label: "Subject", value: "Arts" },
    description:
      "Where vision met craft through cinematic theory and production.",
    bg: "/unidelhi.jpeg",
  },
  {
    level: "Chapter IV — Master's",
    title: "Master in Sociology",
    school: "Tribhuvan University",
    year: "1998",
    meta: { label: "Subject", value: "Sociology" },
    description:
      "Where vision met craft through cinematic theory and production.",
    bg: "/tu.jpeg",
  },
  {
    level: "Chapter V — Master's",
    title: "Master in Arts",
    school: "Edinburgh University",
    year: "2006",
    meta: { label: "Subject", value: "Arts" },
    description:
      "Where vision met craft through cinematic theory and production.",
    bg: "/edin.jpeg",
  },
];

const audioUnlocked = { value: false };

function playReelClick() {
  if (!audioUnlocked.value) return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    const click = (t, freq, dur) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, t + dur);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    };

    click(now, 800, 0.04);
    click(now + 0.07, 600, 0.04);
    click(now + 0.12, 900, 0.03);

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const d = buf.getChannelData(0);

    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.1, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(ng);
    ng.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.12);

    setTimeout(() => ctx.close(), 600);
  } catch (_) { }
}

const MetaItem = ({ label, value, light = true }) => (
  <div className="flex flex-col min-w-[88px] flex-1 sm:flex-none">
    <p className={`${light ? 'text-[#c9a84c]' : 'text-[var(--color-accent)]'} text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold mb-1`}>
      {label}
    </p>
    <p className={`${light ? 'text-white' : 'text-[var(--color-primary)]'} text-xs sm:text-sm font-bold break-words`}>
      {value}
    </p>
  </div>
);

const FilmReel = ({ color = "#A1A1AA" }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 0.7, 0, Math.PI * 2, false);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const hole = new THREE.Path();
      hole.absarc(
        Math.cos(angle) * 0.45,
        Math.sin(angle) * 0.45,
        0.16,
        0,
        Math.PI * 2,
        true
      );
      s.holes.push(hole);
    }

    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 0.1, 0, Math.PI * 2, true);
    s.holes.push(centerHole);

    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    }),
    []
  );

  return (
    <group>
      <mesh position={[0, 0, 0.04]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
};

const reelSpinSignal = { active: false };

const ProjectorModel = () => {
  const reel1Ref = useRef(null);
  const reel2Ref = useRef(null);
  const burstSpeed = useRef(0);
  const { viewport } = useThree();

  const isMobile = viewport.width < 5;
  const isTablet = viewport.width >= 5 && viewport.width < 8;

  const projScale = isMobile ? 0.32 : isTablet ? 0.46 : 0.6;
  const projX = isMobile ? 0 : isTablet ? 2.45 : 3.5;
  const projY = isMobile ? 5.8 : isTablet ? 2.3 : 0.8;
  const targetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(isMobile ? 0 : -15, isMobile ? -5 : 0, 0);
    return obj;
  }, [isMobile]);

  useFrame((_, delta) => {
    if (reelSpinSignal.active) {
      burstSpeed.current = 18;
      reelSpinSignal.active = false;
    }

    burstSpeed.current = Math.max(0, burstSpeed.current - delta * 28);

    const speed = 1.5 + burstSpeed.current;

    if (reel1Ref.current) reel1Ref.current.rotation.z -= delta * speed;
    if (reel2Ref.current) reel2Ref.current.rotation.z -= delta * speed;
  });

  return (
    <group
      position={[projX, projY, 0]}
      rotation={[0, -Math.PI / 3, 0]}
      scale={projScale}
    >
      <mesh position={[0, -1.0, 0]}>
        <boxGeometry args={[1.3, 0.2, 1.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.5} />
      </mesh>

      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
      </mesh>

      <mesh position={[0, -1.95, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      <group
        rotation={[0, Math.PI / 4, 0]}>
        {[0, (Math.PI * 2) / 3, (-Math.PI * 2) / 3].map((ry, i) => (
          <group key={i} position={[0, -2.0, 0]} rotation={[0, ry, 0]}>
            <group rotation={[0.4, 0, 0]}>
              <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[0.06, 0.03, 3.0, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.8, 1.0]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.4} />
      </mesh>

      <mesh position={[0, 0, 0.52]}>
        <boxGeometry args={[1.2, 1.0, 0.1]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0, -0.52]}>
        <boxGeometry args={[1.2, 1.0, 0.1]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.5} />
      </mesh>

      {[-0.3, 0.3].map((x, i) =>
        [-0.2, 0.2].map((y, j) => (
          <mesh
            key={`k-${i}-${j}`}
            position={[x, y, 0.58]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
          </mesh>
        ))
      )}

      <mesh position={[-0.8, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[-1.25, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[-1.36, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 32]} />
        <meshBasicMaterial color="#c9a84c" />
      </mesh>

      <primitive object={targetObj} />

      <SpotLight
        position={[-1.36, 0.2, 0]}
        target={targetObj}
        penumbra={0.2}
        radiusTop={0.2}
        radiusBottom={isMobile ? 20 : 40}
        distance={50}
        angle={1.1}
        attenuation={4}
        anglePower={2}
        intensity={25}
        color="#c9a84c"
        opacity={1}
      />

      <group position={[-0.3, 1.3, 0.25]} ref={reel1Ref}>
        <FilmReel color="#64748b" />
      </group>

      <group position={[0.6, 0.9, 0.25]} ref={reel2Ref}>
        <FilmReel color="#64748b" />
      </group>
    </group>
  );
};

const ProjectorScene = () => (
  <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[5, 5, 5]} intensity={2.0} />
    <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#ffffff" />
    <directionalLight position={[0, 0, 10]} intensity={1.5} color="#ffffff" />

    <Float speed={1.5} rotationIntensity={0.03} floatIntensity={0.05}>
      <ProjectorModel />
    </Float>
  </>
);

const Academic = () => {
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const isAnimating = useRef(false);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const total = educationData.length;

  useEffect(() => {
    setIsDetailsExpanded(false);
  }, [activeIndex]);

  const animateToIndex = useCallback(
    (nextIndex) => {
      if (isAnimating.current) return;

      isAnimating.current = true;

      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".edu-card");
        const direction = nextIndex > activeIndex ? 1 : -1;

        cards.forEach((card, idx) => {
          if (idx === nextIndex) {
            gsap.fromTo(
              card,
              { autoAlpha: 0, x: 100 * direction, scale: 0.95 },
              {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                zIndex: 10,
                onComplete: () => {
                  isAnimating.current = false;
                },
              }
            );
          } else {
            gsap.to(card, {
              autoAlpha: 0,
              x: -100 * direction,
              scale: 0.95,
              duration: 0.6,
              ease: "power2.in",
              zIndex: 0,
            });
          }
        });
      }, containerRef);

      setActiveIndex(nextIndex);
      return () => ctx.revert();
    },
    [activeIndex]
  );

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % total;
        playReelClick();
        reelSpinSignal.active = true;
        return next;
      });
    }, 4000);
  }, [total]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".edu-card");

      cards.forEach((card, idx) => {
        if (idx === activeIndex) {
          gsap.fromTo(
            card,
            { autoAlpha: 0, x: 100, scale: 0.95 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              zIndex: 10,
            }
          );
        } else {
          gsap.to(card, {
            autoAlpha: 0,
            x: -100,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.in",
            zIndex: 0,
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const goTo = useCallback(
    (idx) => {
      if (idx === activeIndex || isAnimating.current) return;

      audioUnlocked.value = true;

      playReelClick();
      reelSpinSignal.active = true;

      animateToIndex(idx);
      resetTimer();
    },
    [activeIndex, animateToIndex, resetTimer]
  );

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + total) % total);
  }, [activeIndex, total, goTo]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % total);
  }, [activeIndex, total, goTo]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(dx) < 40) return;

    audioUnlocked.value = true;
    dx < 0 ? goNext() : goPrev();
  };
  const onMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    audioUnlocked.value = true;
  };

  const onMouseUp = async (e) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const dx = e.clientX - dragStartX.current;

    isDragging.current = false;
    dragStartX.current = null;

    if (Math.abs(dx) < 60) return;

    try {
      const AudioCtx =
        window.AudioContext || window.webkitAudioContext;

      if (AudioCtx) {
        const ctx = new AudioCtx();

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        ctx.close();
      }
    } catch (_) { }

    playReelClick();
    reelSpinSignal.active = true;

    if (dx < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      className="w-full bg-transparent overflow-hidden"
      style={{ isolation: "isolate" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 relative z-20">


        <h2
          className="font-black text-(--color-primary) leading-tight"
          style={{ fontSize: "clamp(32px, 9vw, 72px)" }}
        >
          Academic <span className="text-(--color-accent)">Journey</span>
        </h2>

      </div>

      <div className="stack-wrapper relative w-full bg-transparent
          min-h-[700px]
          sm:min-h-[740px]
          md:min-h-[720px]
          lg:min-h-[760px]
          xl:min-h-[780px]
        overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <ProjectorScene />
          </Canvas>
        </div>

        {educationData.map((item, index) => (
          <div
            key={index}
            className="edu-card absolute inset-0 flex items-start md:items-center justify-center md:justify-start px-4 sm:px-6 md:pl-16 lg:pl-24 xl:pl-32 pt-24 sm:pt-28 md:pt-0 pb-24 sm:pb-28 md:pb-24 w-full md:w-[62%] lg:w-[52%] xl:w-[48%]"
            style={{
              opacity: 0,
              pointerEvents: index === activeIndex ? "auto" : "none",
            }}
          >
            <div
              className="w-full max-w-140 md:max-w-155 will-change-transform"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <div 
                onClick={() => setIsDetailsExpanded(prev => !prev)}
                className="card-shell group cursor-pointer overflow-hidden rounded-2xl sm:rounded-[2rem] border border-[#c9a84c]/20 bg-[#12110e] shadow-[0_15px_40px_rgba(201,168,76,0.15)] relative w-full h-[400px] sm:h-[440px] md:h-[460px] lg:h-[480px]"
              >
                {/* Whole Card Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.bg}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${isDetailsExpanded ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                  {/* Subtle dark overlay that is 0% opacity by default, and fades in ONLY on hover/expanded */}
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 z-0 pointer-events-none ${isDetailsExpanded ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`} />
                </div>

                {/* Details Panel (Slides up from the bottom on hover/expanded) */}
                <div className={`card-content absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 bg-black/70 backdrop-blur-md border-t border-[#c9a84c]/25 transition-all duration-700 ease-out z-10 flex flex-col justify-end ${isDetailsExpanded ? 'translate-y-0' : 'translate-y-full lg:group-hover:translate-y-0'}`}>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {/* Header Part */}
                    <div className="flex flex-col justify-end">
                      <p className="text-[9px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-[#c9a84c] mb-1 sm:mb-2 font-bold">
                        {item.level}
                      </p>

                      <h2
                        className="font-black text-white leading-tight"
                        style={{ fontSize: "clamp(20px, 5vw, 32px)" }}
                      >
                        {item.title}
                      </h2>
                    </div>

                    {/* Expandable Part */}
                    <div className="flex flex-col gap-4 sm:gap-5">
                      <div className="w-12 h-[2px] bg-[#c9a84c]" />

                      <p className="text-[#d1c4af] text-sm leading-relaxed max-w-xl">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-x-5 sm:gap-x-8 gap-y-4 pt-4 border-t border-[#c9a84c]/20">
                        <MetaItem label="Institution" value={item.school} />
                        <MetaItem label="Year" value={item.year} />
                        <MetaItem label={item.meta.label} value={item.meta.value} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+2rem)] sm:bottom-8 left-0 w-full md:w-[62%] lg:w-[52%] xl:w-[48%] flex items-center justify-center gap-5 sm:gap-6 z-30 px-4">
          <button
            onClick={goPrev}
            className="w-10 h-10 shrink-0 rounded-full border-2 border-(--color-accent)/50 flex items-center justify-center text-(--color-accent) hover:bg-(--color-accent)/10 transition-all"
            aria-label="Previous"
          >
            ←
          </button>

          <div className="flex gap-2 items-center">
            {educationData.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === activeIndex ? 26 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i === activeIndex ? "var(--color-accent)" : "#22D3EE22",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-10 h-10 shrink-0 rounded-full border-2 border-(--color-accent)/50 flex items-center justify-center text-(--color-accent) hover:bg-(--color-accent)/10 transition-all"
            aria-label="Next"
          >
            →
          </button>
        </div>

        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-4 left-0 w-full md:w-[62%] lg:w-[52%] xl:w-[48%] px-4 z-30">
          <div
            className="w-full h-0.5 rounded-full overflow-hidden"
            style={{ background: "#22D3EE11" }}
          >
            <div
              key={`pb-${activeIndex}`}
              style={{
                height: "100%",
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                animation: "pbFill 4s linear forwards",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pbFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Academic;