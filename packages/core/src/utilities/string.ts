const plural = (condition: boolean, s: string, replacement?: string) =>
  condition ? (replacement ? replacement : s + "s") : s;

export { plural };
