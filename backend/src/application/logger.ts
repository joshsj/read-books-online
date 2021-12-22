import { ILogger } from "@/application/interfaces";

const logger: ILogger = (context, data: any, ...rest: any[]) =>
  console.log(`[${context}] ${data} ${rest}`);

export { logger };
