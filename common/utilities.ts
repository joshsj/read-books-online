type Dependencies<T extends string> = { [K in T]: symbol };

const toDependencies = <T extends string>(
  names: T[]
): Readonly<Dependencies<T>> =>
  Object.freeze(
    Object.assign({}, ...names.map((n) => ({ [n]: Symbol.for(n) })))
  );

type Ensure = (condition: boolean, error?: string | Error) => asserts condition;

const ensure: Ensure = (
  condition: boolean,
  error?: string | Error
): asserts condition => {
  if (!condition) {
    throw typeof error === "string" ? new Error(error) : error;
  }
};

type Class<T, TParam = any> = {
  new (...params: TParam[]): T;
};

export { Dependencies, toDependencies, ensure, Ensure, Class };
