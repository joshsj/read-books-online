import { toDependencies } from "./utilities";

const Dependency = toDependencies(["logger", "env"]);

type ILogger<T extends string> = (
  context: T,
  data: any,
  ...rest: any[]
) => void;

export { Dependency, ILogger };
