import React, { FC, useEffect } from 'react';
import { useLocation } from 'react-router';

const scrollPositions: Record<string, number> = {};

function findScrollableElement(root: Element = document.body): Element | null {
  if (root.scrollHeight > root.clientHeight) return root;
  for (let i = 0; i < root.children.length; i++) {
    const found = findScrollableElement(root.children[i]);
    if (found) return found;
  }
  return null;
}

export const ScrollRestoration: FC = () => {
  const location = useLocation();

  useEffect(() => {
    const el = findScrollableElement();
    if (!el) return;

    const key = `${location.pathname}${location.search}`;
    if (scrollPositions[key]) {
      el.scrollTo(0, scrollPositions[key]);
    }

    const onScroll = () => {
      scrollPositions[key] = el.scrollTop;
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [location]);

  return null;
};
