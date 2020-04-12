import React from "react";
import URLParse from "url-parse";
import { useRoute } from "./hooks";
import { Route } from "universal-router";

type Props = React.HTMLProps<HTMLAnchorElement> & {
  onBeforeNavigate?: (nextPathname: string, currentRoute: Route) => void;
};

const NavLink: React.FC<Props> = ({
  href,
  children,
  rel,
  target,
  onBeforeNavigate,
  ...props
}) => {
  const { navigate, route } = useRoute();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented) {
      return;
    }

    const anchor = e.currentTarget;

    /**
     * NOTICE: HTMLAnchorElement.prototype.href is always absolute url.
     * So use getAttribute here instead,
     */
    const href = anchor.getAttribute("href")!;
    const url = new URLParse(href, {});

    onBeforeNavigate?.(url.pathname, route);

    const isRelative = url.host === "";
    if (!isRelative) {
      // Do nothing when absolute URL (Then it should work as normal <a> element)
      return;
    }

    const isLeftClick = e.button === 0;
    if (isLeftClick) {
      return;
    }

    const isModified = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
    const newWindowOrTab = anchor.target === "_blank";
    if (isModified || newWindowOrTab) {
      // Do nothing when new window or tab (Then it should work as normal <a> element)
      return;
    }

    e.preventDefault();
    navigate(url.pathname);
  }

  return (
    <a
      href={href}
      onClick={onClick}
      rel={rel ?? target === "_blank" ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default NavLink;
