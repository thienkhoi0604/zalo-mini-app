import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sheet as ZmpSheet } from 'zmp-ui';
import { ActionSheetProps } from 'zmp-ui/sheet';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SheetProps {
  visible: boolean;
  onClose?: () => void;
  /** Initial height as a percentage of the viewport (0–100). Default: 60 */
  height?: number;
  children?: React.ReactNode;
  unmountOnClose?: boolean;
  swipeToClose?: boolean;
  style?: React.CSSProperties;
  // absorb any extra zmp-ui props without breaking callers
  [key: string]: unknown;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const MAX_HEIGHT_PCT = 96;
const CLOSE_VELOCITY_THRESHOLD = 0.4; // px/ms — flick velocity to close

// ─── Sheet ─────────────────────────────────────────────────────────────────────

export const Sheet: FC<SheetProps> = ({
  visible,
  onClose,
  height: initialPct = 60,
  children,
  unmountOnClose = false,
  swipeToClose = true,
  style,
}) => {
  const [heightPct, setHeightPct] = useState(initialPct);
  const [mounted, setMounted]     = useState(false);
  const [isOpen, setIsOpen]       = useState(false);
  const [dragging, setDragging]   = useState(false);

  const startY       = useRef(0);
  const startHeight  = useRef(initialPct);
  const lastY        = useRef(0);
  const lastTime     = useRef(0);
  const velocity     = useRef(0);

  // ── Open / close lifecycle ──
  useEffect(() => {
    if (visible) {
      setMounted(true);
      setHeightPct(initialPct);
      // Two rAFs: first lets the DOM paint at translateY(100%), second triggers the slide-in
      requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
      return () => {};
    }

    setIsOpen(false);
    if (!unmountOnClose) return () => {};
    const t = setTimeout(() => setMounted(false), 340);
    return () => clearTimeout(t);
  }, [visible]);

  // ── Drag handlers ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current    = e.touches[0].clientY;
    startHeight.current = heightPct;
    lastY.current     = e.touches[0].clientY;
    lastTime.current  = Date.now();
    velocity.current  = 0;
    setDragging(true);
  }, [heightPct]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const y   = e.touches[0].clientY;
    const now = Date.now();
    const dt  = now - lastTime.current;
    if (dt > 0) velocity.current = (lastY.current - y) / dt; // + = up
    lastY.current   = y;
    lastTime.current = now;

    const deltaPct = ((startY.current - y) / window.innerHeight) * 100;
    const next = Math.max(10, Math.min(MAX_HEIGHT_PCT, startHeight.current + deltaPct));
    setHeightPct(next);
  }, []);

  const onTouchEnd = useCallback(() => {
    setDragging(false);
    const closePct = initialPct * 0.55;

    // Drag below close threshold or quick flick down → close
    if (swipeToClose && (heightPct < closePct || velocity.current < -CLOSE_VELOCITY_THRESHOLD)) {
      onClose?.();
      setHeightPct(initialPct);
      return;
    }

    // Quick flick up → snap to max
    if (velocity.current > CLOSE_VELOCITY_THRESHOLD) {
      setHeightPct(MAX_HEIGHT_PCT);
      return;
    }

    // Snap: past midpoint between initial and max → expand, otherwise restore
    const mid = (initialPct + MAX_HEIGHT_PCT) / 2;
    setHeightPct(heightPct > mid ? MAX_HEIGHT_PCT : initialPct);
  }, [heightPct, initialPct, swipeToClose, onClose]);

  if (!mounted) return null;

  const transition = dragging
    ? 'none'
    : 'transform 0.32s cubic-bezier(0.32,0.72,0,1), height 0.22s cubic-bezier(0.32,0.72,0,1)';

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0,0,0,0.48)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${heightPct}%`,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          zIndex: 9999,
          transform: isOpen ? 'translateY(0)' : 'translateY(102%)',
          transition,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
          ...style,
        }}
      >
        {/* Drag handle */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            flexShrink: 0,
            padding: '10px 0 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'ns-resize',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: '#D1D5DB',
            }}
          />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};

// ─── ActionSheet (still delegates to zmp-ui) ───────────────────────────────────

export const ActionSheet: FC<Omit<ActionSheetProps, 'ref'>> = (props) => {
  return createPortal(<ZmpSheet.Actions {...props} />, document.body);
};
