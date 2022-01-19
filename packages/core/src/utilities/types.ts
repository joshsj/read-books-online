type Class<T, TParam extends any[]> = {
  new (...params: TParam): T;
};

export { Class };
