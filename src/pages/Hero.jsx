import React, { useEffect, useRef, useState } from 'react';

const Hero = ({
  videoSrc  = '',
  posterSrc = '',
  canPlay   = false,
}) => {
  const videoRef                    = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [hasError,   setHasError]   = useState(false);

  /* ── Play only after loader signals canPlay ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !canPlay || !videoSrc) return;

    const tryPlay = () => {
      vid.play().catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Hero] video.play() rejected:', err.message);
        }
      });
    };

    if (vid.readyState >= 1) {
      tryPlay();
    } else {
      vid.addEventListener('loadedmetadata', tryPlay, { once: true });
      return () => vid.removeEventListener('loadedmetadata', tryPlay);
    }
  }, [canPlay, videoSrc]);

  return (
    <>
      <style>{`
        .hero-section,
        .hero-section *,
        .hero-section *::before,
        .hero-section *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ─────────────────────────────────────────────────────────────
         * BASE — desktop, laptop, tablet, mobile (portrait + landscape)
         * Section is locked to ONE viewport. Video fills it via cover.
         * ──────────────────────────────────────────────────────────── */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;            /* fallback */
          height: 100svh;           /* stable on mobile (no URL-bar jump) */
          min-height: 480px;
          max-height: 100dvh;       /* never exceed dynamic viewport */
          overflow: hidden;
          background: #4f4532;
          isolation: isolate;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top; /* keep top of frame / face visible */
          opacity: 0;
          will-change: opacity;
          transition: opacity 1.2s ease;
          pointer-events: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .hero-video.ready { opacity: 1; }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(79, 69, 50, 0.30);
          pointer-events: none;
        }

        .hero-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(209,196,175,0.5);
          font-family: system-ui, sans-serif;
          font-size: 14px;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 1rem;
        }

        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }

        /* ─────────────────────────────────────────────────────────────
         * PORTRAIT & NARROW SCREEN RESPONSIVENESS — show entire video in proper portion
         * Prevents cropping of text/content in video by scaling the section
         * to match the video's 16:9 native aspect ratio.
         * ──────────────────────────────────────────────────────────── */
        @media (max-aspect-ratio: 16/9) {
          .hero-section {
            margin-top: 90px; /* pull the video down below the fixed nav bar */
            height: auto;
            min-height: unset;
            max-height: unset;
            aspect-ratio: 16 / 9;
          }
          .hero-video {
            position: relative;
            width: 100%;
            height: auto;
            object-fit: contain;
          }
        }

        /* Short landscape phones */
        @media (orientation: landscape) and (max-height: 500px) {
          .hero-section { min-height: 320px; }
          .hero-video   { object-position: center center; }
        }

        /* Ultra-wide / large desktop */
        @media (min-width: 1600px) {
          .hero-video { object-position: center 25%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-video { transition: none; }
        }
      `}</style>

      <section className="hero-section" aria-label="Hero video">
        {videoSrc && (
          <video
            ref={videoRef}
            className={`hero-video ${videoReady ? 'ready' : ''}`}
            src={videoSrc}
            poster={posterSrc}
            muted
            playsInline
            autoPlay
            preload="metadata"
            onLoadedData={() => setVideoReady(true)}
            onError={() => setHasError(true)}
            onEnded={(e) => e.currentTarget.pause()}
          />
        )}

        {hasError && (
          <div className="hero-error">Video could not be loaded.</div>
        )}

        <div className="hero-overlay" />
        <span className="sr-only">Hero background video</span>
      </section>
    </>
  );
};

export default Hero;
