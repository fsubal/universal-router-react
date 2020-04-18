import { SetupFunction } from "../src/NonSpaRoute";

declare global {
  type SpaComponent<E = {}, P = {}> = React.ComponentType<P> & {
    getInitialProps?: (...args: Parameters<SetupFunction<E>>) => P | Promise<P>;
  };
}
