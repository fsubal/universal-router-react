import React, { useState, useMemo } from "react";
import UniversalRouter, { Route } from "universal-router";
import generateUrls from "universal-router/generateUrls";
import NonSpaRoute from "./NonSpaRoute";
import { RouteResult } from "./resolveRoutes";

export interface RouteContextValue {
  route: Route;
  urlFor: ReturnType<typeof generateUrls>;
  navigate(pathname: string): void;
}

export const RouteContext = React.createContext<RouteContextValue>(null as any);

interface Props<C extends Record<string, any>> {
  initialRoute: Route;
  router: UniversalRouter<RouteResult<C>>;
  children: React.ReactNode;
}

export default function Application<C extends Record<string, any>>({
  router,
  initialRoute,
  children,
}: Props<C>) {
  const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);
  const [currentChildren, setCurrentChildren] = useState(children);

  const urlFor = useMemo(() => generateUrls(router), [router]);

  const navigate = async (pathname: string) => {
    const next = await router.resolve(pathname);
    if (!next) {
      throw new Error("Not found");
    }

    const { component, route } = next;
    if (!React.isValidElement(component)) {
      throw new Error("Returned value of route should be a React Component");
    }

    if (component.type === NonSpaRoute) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Tried to navigate to <NonSpaRoute>. Maybe be you should use normal <a> element for ${pathname} instead.`
        );
      }

      location.href = pathname;
      return;
    }

    setCurrentChildren(next);
    setCurrentRoute(route);
    // history.pushState()
  };

  return (
    <RouteContext.Provider value={{ route: currentRoute, urlFor, navigate }}>
      {currentChildren}
    </RouteContext.Provider>
  );
}
