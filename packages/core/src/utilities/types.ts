type Class<T, TParam extends any[]> = {
  new (...params: TParam): T;
};

type Some<T> = T | T[];

export { Class, Some };
