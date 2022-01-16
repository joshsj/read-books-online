import {
  IHttpContext,
  IHttpContextService,
} from "@backend/application/common/interfaces/httpContextService";

class HttpContextService implements IHttpContextService {
  constructor(private readonly httpContext: IHttpContext) {}

  getCurrent(): IHttpContext {
    return this.httpContext;
  }
}

export { HttpContextService };
