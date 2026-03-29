import React, { FC, ReactNode, useRef, useState, useEffect, CSSProperties } from 'react';

const THRESHOLD = 65;
const MAX_PULL = 90;

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const PullToRefresh: FC<PullToRefreshProps> = ({ onRefresh, children, className, style }) => {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const refreshingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use native listener with passive:false so we can call preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      if (el.scrollTop > 2) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) return;
      e.preventDefault();
      isPullingRef.current = true;
      setPullY(Math.min(delta * 0.45, MAX_PULL));
    };

    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    isPullingRef.current = false;
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    setPullY((current) => {
      if (current >= THRESHOLD) {
        // Trigger async refresh outside of state update
        setTimeout(async () => {
          refreshingRef.current = true;
          setRefreshing(true);
          setPullY(THRESHOLD);
          try {
            await onRefresh();
          } finally {
            refreshingRef.current = false;
            setRefreshing(false);
            setPullY(0);
          }
        }, 0);
        return THRESHOLD;
      }
      return 0;
    });
  };

  const isAnimating = !isPullingRef.current;
  const progress = Math.min(pullY / THRESHOLD, 1);
  const indicatorH = refreshing ? THRESHOLD : pullY;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, overflow: 'auto' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        style={{
          height: indicatorH,
          transition: isAnimating ? 'height 0.28s ease' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {(pullY > 4 || refreshing) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: Math.min(progress * 2, 1) }}>
            <div
              className={refreshing ? 'animate-spin' : ''}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2.5px solid #E5E7EB',
                borderTopColor: '#288F4E',
                transform: refreshing ? undefined : `rotate(${progress * 270}deg)`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
              {refreshing ? 'Đang tải lại...' : progress >= 1 ? 'Thả để tải lại' : 'Kéo để tải lại'}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PullToRefresh;
