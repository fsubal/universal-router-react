import { useEffect } from "react";

const scrollHistory: Record<string, [number, number]> = {};

export const restoreScroll = (pathname: string) => {
  const scroll = scrollHistory[pathname];
  if (!scroll) {
    return;
  }

  let [scrollX, scrollY] = scroll;

  const targetHash = location.hash.substr(1);
  if (targetHash) {
    const target = document.getElementById(targetHash);
    if (target) {
      scrollY = window.pageYOffset + target.getBoundingClientRect().top;
    }
  }

  window.scrollTo(scrollX, scrollY);
};

export const useRestoreScroll = (pathname: string) => {
  // Switch off the native scroll restoration behavior and handle it manually
  // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  useEffect(() => {
    if (window.history?.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    restoreScroll(pathname);
  }, [pathname]);
};
