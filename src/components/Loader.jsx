import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const noop = () => {};

const Loader = ({ onComplete = noop }) => {
  const [count,   setCount]   = useState(3);
  const [opening, setOpening] = useState(false);
  const [gone,    setGone]    = useState(false);

  /*
   * FIX: wrap onComplete in a ref so the effect below never needs it as a
   * dep (avoids stale-closure restarts if the parent re-renders mid-load).
   */
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  /* Lock body scroll while loader is visible */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Countdown 3 → 2 → 1 → open */
  useEffect(() => {
    if (count <= 0) {
      setOpening(true);
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [count]);

  /*
   * FIX: de-couple the three steps so they don't all fire synchronously:
   *   1. opening = true  → panels animate out (framer handles this)
   *   2. After panel animation (880ms) → restore scroll & call onComplete
   *   3. One rAF later → setGone(true) unmounts DOM
   *
   * Previously overflow restore + onComplete + setGone all fired in one
   * setTimeout callback, causing a big synchronous React + layout flush
   * that janked the page.
   */
  useEffect(() => {
    if (!opening) return;

    // Step 2: wait for panel slide-out (matches transition duration 0.88s)
    const t = setTimeout(() => {
      document.body.style.overflow = '';

      // Step 3: signal parent FIRST, then unmount on next frame
      onCompleteRef.current();

      requestAnimationFrame(() => {
        setGone(true);
      });
    }, 900); // 900ms ≈ panel transition (880ms) + tiny buffer

    return () => clearTimeout(t);
  }, [opening]);

  if (gone) return null;

  const progress     = (3 - Math.max(count, 1)) / 3;
  const panelPointer = opening ? 'none' : 'auto';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');

        .ldr-corner {
          position: absolute;
          width: clamp(12px, 3vw, 20px);
          height: clamp(12px, 3vw, 20px);
          pointer-events: none;
        }

        .ldr-label {
          font-family: 'Nunito', system-ui, sans-serif;
          font-size: clamp(7px, 1.4vw, 11px);
          font-weight: 700;
          color: rgba(209,196,175,0.35);
          letter-spacing: 0.38em;
          text-transform: uppercase;
        }

        .ldr-label-wrap {
          position: absolute;
          bottom: clamp(56px, calc(50% - 60px), 88px);
          left: clamp(14px, 4vw, 28px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }

        .ldr-number {
          font-family: 'Nunito', system-ui, sans-serif;
          font-size: clamp(64px, 20vw, 140px);
          font-weight: 900;
          color: #d1c4af;
          line-height: 1;
          letter-spacing: -0.04em;
          text-shadow: 0 0 60px rgba(201,168,76,0.4);
          user-select: none;
          display: block;
          /*
           * FIX: promote number to its own GPU layer so the large
           * font re-render doesn't cause a composite stall on slower devices.
           */
          will-change: transform, opacity;
        }

        @media (max-width: 400px) {
          .ldr-ring { transform: translateY(-50%) scale(0.65) !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <motion.div
        animate={opening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: '50%', zIndex: 9998,
          background: '#4f4532',
          overflow: 'hidden',
          pointerEvents: panelPointer,
          /*
           * FIX: will-change + transform3d forces GPU compositing so the
           * slide-out is handled entirely on the compositor thread — no
           * main-thread jank.
           */
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <CrosshairHalf side="left" />
        <CornerMark pos={{ top: 'clamp(12px,3vw,24px)', left: 'clamp(12px,3vw,24px)' }} t l />
        <CornerMark pos={{ bottom: 'clamp(12px,3vw,24px)', left: 'clamp(12px,3vw,24px)' }} b l />
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed', top: 0, bottom: 0, right: 0,
          width: '50%', zIndex: 9998,
          background: '#4f4532',
          overflow: 'hidden',
          pointerEvents: panelPointer,
          willChange: 'transform',     // FIX: GPU compositing
          transform: 'translateZ(0)',  // FIX: force layer promotion
        }}
      >
        <CrosshairHalf side="right" />
        <CornerMark pos={{ top: 'clamp(12px,3vw,24px)', right: 'clamp(12px,3vw,24px)' }} t r />
        <CornerMark pos={{ bottom: 'clamp(12px,3vw,24px)', right: 'clamp(12px,3vw,24px)' }} b r />

        {!opening && (
          <div className="ldr-label-wrap">
            <motion.div
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 0.65, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }}
            />
          </div>
        )}
      </motion.div>

      {/* Decorative seam lines */}
      <div style={{
        position: 'fixed', top: '15%', bottom: '15%', left: '50%',
        width: '1px', transform: 'translateX(-50%)',
        background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.55), transparent)',
        zIndex: 9999, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: 0, right: 0,
        height: '1px', transform: 'translateY(-50%)',
        background: 'rgba(201,168,76,0.18)',
        zIndex: 9999, pointerEvents: 'none',
      }} />

      {/* NUMBER */}
      <AnimatePresence>
        {!opening && count > 0 && (
          <motion.div
            key="number-wrap"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className="ldr-number"
                initial={{ scale: 2.4, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.65, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

/* ─── Crosshair rings ─────────────────────────────────────────────────────── */
const CrosshairHalf = ({ side }) => {
  const isLeft = side === 'left';
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[200, 120, 64].map((s, i) => (
        <div
          key={i}
          className="ldr-ring"
          style={{
            position: 'absolute',
            top: '50%',
            [isLeft ? 'right' : 'left']: `-${s / 2}px`,
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(201,168,76,${0.08 + i * 0.07})`,
            transform: 'translateY(-50%)',
          }}
        />
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: '1px', background: 'rgba(201,168,76,0.10)',
        transform: 'translateY(-50%)',
      }} />
    </div>
  );
};

/* ─── L-shaped corner mark ───────────────────────────────────────────────── */
const CornerMark = ({ pos, t, b, l, r }) => (
  <div className="ldr-corner" style={{
    ...pos,
    borderTop:    t ? '1px solid rgba(201,168,76,0.4)' : 'none',
    borderBottom: b ? '1px solid rgba(201,168,76,0.4)' : 'none',
    borderLeft:   l ? '1px solid rgba(201,168,76,0.4)' : 'none',
    borderRight:  r ? '1px solid rgba(201,168,76,0.4)' : 'none',
  }} />
);

export default Loader;