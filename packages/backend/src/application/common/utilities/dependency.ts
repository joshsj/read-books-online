import { DependencyContainer, InjectionToken } from "tsyringe";

const resolveAny = <T = unknown>(c: DependencyContainer, token: InjectionToken): T[] =>
  c.isRegistered<T>(token, true) ? c.resolveAll<T>(token) : [];

export { resolveAny };
