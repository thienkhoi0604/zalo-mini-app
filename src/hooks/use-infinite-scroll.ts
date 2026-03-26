import { useEffect, useRef, useCallback } from 'react';

/**
 * Returns a ref to attach to a sentinel element at the bottom of a list.
 * When the sentinel enters the viewport, `onLoadMore` is called — but only
 * when `hasMore` is true and `loading` is false.
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
): React.RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stableLoad = useRef(onLoadMore);
  stableLoad.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stableLoad.current();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return sentinelRef;
}
