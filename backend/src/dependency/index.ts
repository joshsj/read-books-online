const Dependency = Object.freeze({ logger: Symbol(), env: Symbol() } as const);

type LoggerContext = "general" | "server";
type Logger = (context: LoggerContext, data: any, ...rest: any[]) => void;

export { Dependency, Logger };
