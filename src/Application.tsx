import React, { useState } from "react";
import type UniversalRouter from "universal-router";
import NonSpaRoute from "./NonSpaRoute";
import { NavLinkContext } from "./NavLink";

const ApplicationContext = React.createContext(null as any);

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

  const navigate = async (pathname: string) => {
    const next = await router.resolve(pathname);
    if (!React.isValidElement(next)) {
      throw new Error("not a valid route");
    }

    if (next.type === NonSpaRoute) {
      throw new Error("tried to navigate to NonSpaRoute");
    }

    setCurrentChildren(next);
    // history.pushState()
  };

  return (
    <ApplicationContext.Provider value={context}>
      <NavLinkContext.Provider value={navigate}>
        <>{currentChildren}</>
      </NavLinkContext.Provider>
    </ApplicationContext.Provider>
  );
}
