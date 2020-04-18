import React from "react";
import UniversalRouter from "universal-router";
import NonSpaRoute from "../src/NonSpaRoute";

export default new UniversalRouter([
  {
    path: "/",
    async action({ params, route }) {
      const { default: Component } = await import("./pages/index");
      const props = await Component.getInitialProps?.(params, route);

      return <Component {...props} />;
    },
  },

  {
    path: "/about",
    async action({ params }) {
      const { setup } = await import("./pages/about");

      return <NonSpaRoute params={params} setup={setup} />;
    },
  },

  {
    path: "/items/:id",
    async action({ params, route }) {
      const { default: Component } = await import("./pages/items/show");
      const props = await Component.getInitialProps?.(params, route);

      return <Component {...props} />;
    },
  },

  {
    path: "/users/me",
    async action({ params, route }) {
      const { default: Component } = await import("./pages/users/me");
      const props = await Component.getInitialProps?.(params, route);

      return <Component {...props} />;
    },
  },
]);
