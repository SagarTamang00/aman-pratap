import React, { useEffect, useRef, useState } from 'react';

const Hero = ({
  videoSrc = '',
  posterSrc = '',
  canPlay = false,
}) => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Force muted properties programmatically on every render/update to prevent iOS WebKit/Safari from desynchronizing and pausing the video
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.volume = 0;
    }
  });

  /* ── Play only after loader signals canPlay ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !canPlay || !videoSrc) return;

    const tryPlay = () => {
      // Re-assert muted status right before playback attempts to bypass WKWebView restrictions
      vid.muted = true;
      vid.defaultMuted = true;
      vid.volume = 0;

      vid.play().catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Hero] video.play() rejected:', err.message);
        }
      });
    };

    // readyState >= 3 (HAVE_FUTURE_DATA) ensures enough video frames are loaded to start playback without immediate stalling
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
      return () => vid.removeEventListener('canplay', tryPlay);
    }
  }, [canPlay, videoSrc]);

  return (
    <>

      <section className="hero-section" aria-label="Hero video">
        {videoSrc && (
          <video
            ref={videoRef}
            className={`hero-video ${videoReady ? 'ready' : ''}`}
            src={videoSrc}
            poster={posterSrc}
            muted={true}
            playsInline={true}
            autoPlay={true}
            preload="auto"
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
