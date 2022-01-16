type ILoggerContext =
  | "general"
  | "init"
  | "server"
  | "authentication"
  | "authorization"
  | "prcp"
  | "cqrs";

type ILogger = {
  log: (context: ILoggerContext, data: any, ...rest: any[]) => void;
};

export { ILogger, ILoggerContext };
