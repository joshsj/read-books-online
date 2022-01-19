type Dependencies<T extends string> = { [K in T]: symbol };

const toDependencies = <T extends string>(names: T[]): Readonly<Dependencies<T>> =>
  Object.freeze(Object.assign({}, ...names.map((n) => ({ [n]: Symbol.for(n) }))));

export { Dependencies, toDependencies };
