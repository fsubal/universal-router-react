import type React from "react";
import type { ResolveRoute, Route } from "universal-router";

export interface RouteResult {
  route: Route;
  component: React.ReactElement;
}

export const resolveRoute: ResolveRoute = (
  context,
  params
): RouteResult | undefined => {
  if (!context.route.action) {
    return undefined;
  }

  return {
    route: context.route,
    component: context.route.action(context, params),
  };
};
