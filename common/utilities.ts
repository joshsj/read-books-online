type Dependencies<T extends string> = { [K in T]: symbol };

const toDependencies = <T extends string>(names: T[]): Readonly<Dependencies<T>> =>
  Object.freeze(Object.assign({}, ...names.map((n) => ({ [n]: Symbol.for(n) }))));

type Ensure = (condition: boolean, error: Error | undefined) => asserts condition;

const ensure: Ensure = (condition: boolean, error: Error | undefined): asserts condition => {
  if (!condition) {
    throw error ?? new Error();
  }
};

type Class<T, TParam = any> = {
  new (...params: TParam[]): T;
};

type Env<T extends string> = { [K in T]: string };

const getEnv = <TEnvKey extends string>(envKeys: ReadonlyArray<TEnvKey>, env?: any): Env<TEnvKey> =>
  envKeys.reduce<Partial<Env<TEnvKey>>>(
    (obj, key) => Object.assign(obj, { [key]: env[key] }),
    {}
  ) as Env<TEnvKey>;

export { Dependencies, toDependencies, ensure, Ensure, Class, Env, getEnv };
