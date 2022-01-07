import { IHttpContext, IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { Request, Response } from "express";

class HttpContextService implements IHttpContextService {
  current: Readonly<IHttpContext>;

  constructor(req: Request, res: Response) {
    this.current = { req, res };
  }

  getCurrent(): IHttpContext {
    return this.current;
  }
}

export { HttpContextService };
