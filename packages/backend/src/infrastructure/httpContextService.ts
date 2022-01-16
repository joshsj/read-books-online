import {
  IHttpContext,
  IHttpContextService,
} from "@/application/common/interfaces/httpContextService";

class HttpContextService implements IHttpContextService {
  constructor(private readonly httpContext: IHttpContext) {}

  getCurrent(): IHttpContext {
    return this.httpContext;
  }
}

export { HttpContextService };
