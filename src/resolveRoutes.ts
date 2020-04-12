import type React from "react";
import type { Route, RouteContext, RouteParams } from "universal-router";

export interface RouteResult<C extends Record<string, any>> {
  route: Route;
  shared: C;
  component: React.ReactElement;
}

export function resolveRoute<C extends Record<string, any>>(
  context: RouteContext,
  routeParams: RouteParams
): RouteResult<C> | undefined {
  const {
    route,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    router,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    baseUrl,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    path,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pathname,

    ...rest
  } = context;

  if (!route.action) {
    return undefined;
  }

  return {
    route,
    shared: rest as C,
    component: route.action(context, routeParams),
  };
}
