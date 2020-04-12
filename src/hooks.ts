import { useContext } from "react";
import { RouteContext, RouteContextValue } from "./Application";

export function useRoute<C extends Record<string, any>>() {
  return useContext(RouteContext) as RouteContextValue<C>;
}
