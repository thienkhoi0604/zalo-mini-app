import React from "react";
import { FC, useEffect } from "react";
import { useLocation } from "react-router";

const scrollPositions = {};

function findElementWithScrollbar(rootElement: Element = document.body) {
  if (rootElement.scrollHeight > rootElement.clientHeight) {
    return rootElement;
  }

  for (let i = 0; i < rootElement.children.length; i++) {
    const childElement = rootElement.children[i];
    const elementWithScrollbar = findElementWithScrollbar(childElement);
    if (elementWithScrollbar) {
      return elementWithScrollbar;
    }
  }

  return null;
}

export const ScrollRestoration: FC = () => {
  const location = useLocation();

  useEffect(() => {
    const content = findElementWithScrollbar();
    if (content) {
      const key = `${location.pathname}${location.search}`;
      if (scrollPositions[key]) {
        content.scrollTo(0, scrollPositions[key]);
      }
      const saveScrollPosition = (e: Event) => {
        scrollPositions[key] = content.scrollTop;
      };
      content.addEventListener("scroll", saveScrollPosition);
      return () => content.removeEventListener("scroll", saveScrollPosition);
    }
    return () => {};
  }, [location]);

  return <></>;
};
