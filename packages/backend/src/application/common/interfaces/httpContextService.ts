import { Request, Response } from "express";

type IHttpContext = Readonly<{ id: number; req: Request; res: Response }>;

type IHttpContextService = { getCurrent(): IHttpContext };

export { IHttpContextService, IHttpContext };
