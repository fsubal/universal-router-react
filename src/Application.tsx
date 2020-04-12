import React, { useState, useMemo } from "react";
import UniversalRouter, { Route } from "universal-router";
import generateUrls from "universal-router/generateUrls";
import NonSpaRoute from "./NonSpaRoute";
import { RouteResult } from "./resolveRoutes";

const ApplicationContext = React.createContext(null as any);

export interface RouteContextValue {
  route: Route;
  urlFor: ReturnType<typeof generateUrls>;
  navigate(pathname: string): void;
}

export const RouteContext = React.createContext<RouteContextValue>(null as any);

interface Props<C> {
  context: C;
  initialRoute: Route;
  router: UniversalRouter<RouteResult>;
  children: React.ReactNode;
}

export default function Application<C>({
  router,
  initialRoute,
  context,
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
      throw new Error("not a valid route");
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
    <ApplicationContext.Provider value={context}>
      <RouteContext.Provider value={{ route: currentRoute, urlFor, navigate }}>
        <>{currentChildren}</>
      </RouteContext.Provider>
    </ApplicationContext.Provider>
  );
}
