type Dependencies<T extends string> = { [K in T]: symbol };

const toDependencies = <T extends string>(names: T[]): Readonly<Dependencies<T>> =>
  Object.freeze(Object.assign({}, ...names.map((n) => ({ [n]: Symbol.for(n) }))));

type Ensure = (condition: boolean, error?: any) => asserts condition;

const ensure: Ensure = (condition: boolean, error?: any): asserts condition => {
  if (!condition) {
    throw error;
  }
};

type Class<T, TParam = any> = {
  new (...params: TParam[]): T;
};

export { Dependencies, toDependencies, ensure, Ensure, Class };
