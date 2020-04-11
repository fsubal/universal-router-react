import React, { useState, useMemo } from "react";
import type UniversalRouter from "universal-router";
import generateUrls from "universal-router/generateUrls";
import NonSpaRoute from "./NonSpaRoute";
import { NavLinkContext } from "./NavLink";

const ApplicationContext = React.createContext(null as any);

export interface RouteContextValue {
  urlFor: ReturnType<typeof generateUrls>;
}

export const RouteContext = React.createContext<RouteContextValue>(null as any);

interface Props<C> {
  context: C;
  router: UniversalRouter;
  children: React.ReactNode;
}

export default function Application<C>({
  router,
  context,
  children,
}: Props<C>) {
  const [currentChildren, setCurrentChildren] = useState(children);

  const urlFor = useMemo(() => generateUrls(router), [router]);

  const navigate = async (pathname: string) => {
    const next = await router.resolve(pathname);
    if (!React.isValidElement(next)) {
      throw new Error("not a valid route");
    }

    if (next.type === NonSpaRoute) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Tried to navigate to <NonSpaRoute>. Maybe be you should use normal <a> element for ${pathname} instead.`
        );
      }

      location.href = pathname;
      return;
    }

    setCurrentChildren(next);
    // history.pushState()
  };

  return (
    <ApplicationContext.Provider value={context}>
      <RouteContext.Provider value={{ urlFor }}>
        <NavLinkContext.Provider value={navigate}>
          <>{currentChildren}</>
        </NavLinkContext.Provider>
      </RouteContext.Provider>
    </ApplicationContext.Provider>
  );
}
