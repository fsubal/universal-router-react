import React, { useContext } from "react";
import URLParse from "url-parse";

export type NavigateFunction = (pathname: string) => void;

export const NavLinkContext = React.createContext<NavigateFunction>(() => {
  throw new Error("<NavLink> tried to navigate without NavLinkContext");
});

type Props = React.HTMLProps<HTMLAnchorElement> & {
  onNavigate?: (pathname: string) => void;
};

const NavLink: React.FC<Props> = ({
  href,
  children,
  rel,
  target,
  onNavigate,
  ...props
}) => {
  const navigate = useContext(NavLinkContext);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const anchor = e.currentTarget;

    /**
     * NOTICE: HTMLAnchorElement.prototype.href is always absolute url.
     * So use getAttribute here instead,
     */
    const href = anchor.getAttribute("href")!;
    const url = new URLParse(href, {});

    onNavigate?.(url.pathname);

    const isRelative = url.host === "";
    if (!isRelative) {
      // Do nothing when absolute URL (Then it should work as normal <a> element)
      return;
    }

    const newWindowOrTab =
      e.ctrlKey || e.shiftKey || anchor.target === "_blank";
    if (newWindowOrTab) {
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
