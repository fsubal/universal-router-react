import { useEffect } from "react";
import { createBrowserHistory } from "history";

const scrollHistory: Record<string, [number, number]> = {};

export const restoreScroll = (key: string) => {
  const scroll = scrollHistory[key];
  if (!scroll) {
    return;
  }

  let [scrollX, scrollY] = scroll;

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      scrollY = window.pageYOffset + target.getBoundingClientRect().top;
    }
  }

  window.scrollTo(scrollX, scrollY);
};

export const useRestoreScroll = (
  browserHistory?: ReturnType<typeof createBrowserHistory>
) => {
  // Switch off the native scroll restoration behavior and handle it manually
  // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  useEffect(() => {
    if (window.history?.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const unlisten = browserHistory?.listen(({ key }, action) => {
      if (action === "PUSH") {
        delete scrollHistory[key!];
      }

      restoreScroll(key!);
    });

    return () => unlisten?.();
  }, [browserHistory]);
};
