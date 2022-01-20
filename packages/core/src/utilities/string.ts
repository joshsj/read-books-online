const plural = (condition: boolean, s: string, replacement?: string) =>
  condition ? (replacement ? replacement : s + "s") : s;

const capitalize = (s: string): string => (s ? s[0]!.toLocaleUpperCase() + s.slice(1) : "");

export { plural, capitalize };
