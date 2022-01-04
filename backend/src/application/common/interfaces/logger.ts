type ILoggerContext = "general" | "init" | "server" | "cqrs";
type ILogger = (context: ILoggerContext, data: any, ...rest: any[]) => void;

export { ILogger, ILoggerContext };
