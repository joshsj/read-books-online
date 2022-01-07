import { Request, Response } from "express";

type IHttpContext = Readonly<{ req: Request; res: Response }>;

type IHttpContextService = { getCurrent(): IHttpContext };

export { IHttpContextService, IHttpContext };
