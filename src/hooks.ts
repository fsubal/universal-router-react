import { useContext } from "react";
import { RouteContext } from "./Application";

export function useRoute() {
  return useContext(RouteContext);
}
