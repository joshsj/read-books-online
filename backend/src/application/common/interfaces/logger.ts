type ILoggerContext =
  | "general"
  | "init"
  | "server"
  | "authentication"
  | "authorization"
  | "prcp"
  | "cqrs"
  | "validation";

type ILogger = (context: ILoggerContext, data: any, ...rest: any[]) => void;

export { ILogger, ILoggerContext };
