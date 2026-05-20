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
        .hero-section *,
        .hero-section *::before,
        .hero-section *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ══════════════════════════════════════════════════════════════
         * DESKTOP / LANDSCAPE  — classic full-viewport cover
         * ══════════════════════════════════════════════════════════════ */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;           /* dynamic viewport — hides no pixels */
          min-height: 480px;
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
          /*
           * Anchor to top-center so the subject's face is
           * always visible even when the frame is cropped vertically.
           */
          object-position: center top;
          opacity: 0;
          will-change: opacity;
          transition: opacity 1.2s ease;
          pointer-events: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .hero-video.ready { opacity: 1; }

        /* ══════════════════════════════════════════════════════════════
         * PORTRAIT MOBILE — THE CORE FIX
         *
         * Problem: on a phone in portrait the video is typically 9:16.
         * Locking the section to 100dvh + object-fit:cover clips big
         * chunks off the top and bottom — exactly what you see.
         *
         * Fix strategy:
         *   1. Let the section HEIGHT be driven by the video's content.
         *   2. Switch the video out of position:absolute (fills parent)
         *      into normal document flow (position:relative / static).
         *   3. width:100% + height:auto → browser preserves the video's
         *      native aspect ratio → ZERO cropping ever.
         *   4. min-height:100dvh on the section ensures it still covers
         *      the screen even for short/landscape source video.
         * ══════════════════════════════════════════════════════════════ */
        @media (orientation: portrait) and (max-width: 768px) {

          .hero-section {
            height: auto;          /* let the video dictate the height */
            min-height: 100dvh;    /* always fill the screen at minimum */
            overflow: visible;     /* allow section to grow beyond viewport */
          }

          .hero-video {
            /* Take the video OUT of absolute positioning */
            position: relative;
            inset: unset;
            display: block;        /* removes inline baseline gap */
            width: 100%;
            height: auto;          /* natural aspect ratio — no crop */
            object-fit: unset;     /* not needed; size is now natural */
            min-height: 100dvh;    /* ensure it fills screen if video is short */
          }

          /* Overlay still needs to cover the full (taller) section */
          .hero-overlay {
            position: absolute;
            inset: 0;
            bottom: 0;
          }
        }

        /* Very short landscape phones (iPhone SE landscape, etc.) */
        @media (orientation: landscape) and (max-height: 500px) {
          .hero-section { min-height: 320px; }
          .hero-video   { object-position: center center; }
        }

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

        @media (prefers-reduced-motion: reduce) {
          .hero-video { transition: none; }
        }
      `}</style>

      <section className="hero-section" aria-label="Hero">

        {videoSrc && (
          <video
            ref={videoRef}
            className={`hero-video${videoReady ? ' ready' : ''}`}
            src={videoSrc}
            poster={posterSrc || undefined}
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            aria-hidden="true"
            onCanPlayThrough={() => setVideoReady(true)}
            onError={() => setHasError(true)}
            onEnded={(e) => e.currentTarget.pause()}
          />
        )}

        {hasError && (
          <div className="hero-error" role="alert">
            Video could not be loaded.
          </div>
        )}

        <div className="hero-overlay" aria-hidden="true" />
      </section>
    </>
  );
};

export default Hero;