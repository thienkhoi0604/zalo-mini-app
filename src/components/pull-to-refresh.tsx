import React, { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';

const THRESHOLD = 62;
const MAX_PULL = 82;
const RESISTANCE = 0.42;
const SNAP_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SNAP_DURATION = '0.45s';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const PullToRefresh: FC<PullToRefreshProps> = ({ onRefresh, children, className, style }) => {
  const [pullY, setPullY] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'pulling' | 'refreshing'>('idle');
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: TouchEvent) => {
      if (phase === 'refreshing') return;
      if (el.scrollTop > 2) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) return;
      e.preventDefault();
      isPullingRef.current = true;
      setPhase('pulling');
      setPullY(Math.min(delta * RESISTANCE, MAX_PULL));
    };

    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, [phase]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    isPullingRef.current = false;
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    setPullY((current) => {
      if (current >= THRESHOLD) {
        setTimeout(async () => {
          setPhase('refreshing');
          setPullY(THRESHOLD);
          try {
            await onRefresh();
            if (containerRef.current) containerRef.current.scrollTop = 0;
          } finally {
            setPhase('idle');
            setPullY(0);
          }
        }, 0);
        return THRESHOLD;
      }
      setPhase('idle');
      return 0;
    });
  };

  const isAnimating = phase !== 'pulling';
  const isRefreshing = phase === 'refreshing';
  const progress = Math.min(pullY / THRESHOLD, 1);
  const translateY = isRefreshing ? THRESHOLD : pullY;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, overflow: 'auto', position: 'relative' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Indicator – sits behind the content, revealed as content translates down */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: THRESHOLD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <div
          className={isRefreshing ? 'animate-spin' : ''}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2.5px solid #E5E7EB',
            borderTopColor: '#288F4E',
            flexShrink: 0,
            transform: isRefreshing ? undefined : `rotate(${progress * 280}deg)`,
            opacity: Math.min(progress * 1.8, 1),
            transition: isAnimating ? `opacity 0.2s, transform ${SNAP_DURATION} ${SNAP_EASING}` : 'none',
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: '#6B7280',
            fontWeight: 500,
            opacity: Math.min(progress * 1.8, 1),
            transition: isAnimating ? `opacity 0.2s` : 'none',
          }}
        >
          {isRefreshing ? 'Đang tải lại...' : progress >= 1 ? 'Thả để tải lại' : 'Kéo để tải lại'}
        </span>
      </div>

      {/* Content – translates down to reveal the indicator above */}
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isAnimating ? `transform ${SNAP_DURATION} ${SNAP_EASING}` : 'none',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
