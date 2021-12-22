type Dependencies<T extends string> = { [K in T]: symbol };

const toDependencies = <T extends string>(
  names: T[]
): Readonly<Dependencies<T>> =>
  Object.freeze(
    Object.assign({}, ...names.map((n) => ({ [n]: Symbol.for(n) })))
  );

type Guard = (condition: boolean, error?: string | Error) => asserts condition;

const guard: Guard = (
  condition: boolean,
  error?: string | Error
): asserts condition => {
  if (condition) {
    throw typeof error === "string" ? new Error(error) : error;
  }
};

export { Dependencies, toDependencies, guard, Guard };
