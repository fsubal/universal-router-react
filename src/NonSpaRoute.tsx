import { RouteParams, Route } from "universal-router";
import { useEffect } from "react";
import { useRoute } from "./hooks";

export type SetupFunction<E> = (
  params: RouteParams,
  route: Route,
  extraArgs: E
) => void;

interface Props<E> {
  params: RouteParams;
  extraArgs: E;
  setup: SetupFunction<E>;
}

export function NonSpaRoute<E>({ params, setup, extraArgs }: Props<E>) {
  const { route } = useRoute();

  useEffect(() => {
    setup(params, route, extraArgs);
  }, [extraArgs, params, setup]);

  return null;
}

export default NonSpaRoute;
