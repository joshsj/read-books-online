const plural = (condition: boolean, s: string, replacement?: string) =>
  condition ? (replacement ? replacement : s + "s") : s;

const capitalize = (s: string): string => (s ? s[0]!.toLocaleUpperCase() + s.slice(1) : "");

const truncate = (s: string, length: number, trail = "..."): string =>
  s.length > length ? s.slice(0, length - trail.length) + trail : s;

export { plural, capitalize, truncate };
