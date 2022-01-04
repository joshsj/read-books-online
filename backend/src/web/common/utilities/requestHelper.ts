import { Request, RequestHandler, Response } from "express";
import { created, noContent, ok } from "@/web/common/utilities/http";
import { getToken, isAuthenticated, setAuthenticated } from "@/web/common/utilities/auth";
import { DependencyContainer } from "tsyringe";
import { getPerRequestContainer, setPerRequestContainer } from "@/web/common/utilities/container";

const createRequestHelper = (req: Request, res: Response) => ({
  getToken: () => getToken(req),

  isAuthenticated: () => isAuthenticated(res),
  setAuthenticated: () => setAuthenticated(res),

  getPerRequestContainer: () => getPerRequestContainer(res),
  setPerRequestContainer: (container: DependencyContainer) => setPerRequestContainer(res, container),

  ok: (result?: object) => ok(res, result),
  created: () => created(res),
  noContent: () => noContent(res),
});

type RequestHelper = ReturnType<typeof createRequestHelper>;
type AsyncRequestHandler = (..._: [...Parameters<RequestHandler>, RequestHelper]) => Promise<void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next, createRequestHelper(req, res)).catch(next);

export { RequestHelper, AsyncRequestHandler, handleAsync };
