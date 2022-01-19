const EnvArraySep = ",";

type Env<T extends string> = { [K in T]: string };

const getEnv = <TEnvKey extends string>(envKeys: ReadonlyArray<TEnvKey>, env: any): Env<TEnvKey> =>
  envKeys.reduce<Partial<Env<TEnvKey>>>(
    (obj, key) => Object.assign(obj, { [key]: env[key] }),
    {}
  ) as Env<TEnvKey>;

export { EnvArraySep, Env, getEnv };
