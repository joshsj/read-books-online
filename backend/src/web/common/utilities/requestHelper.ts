import { getToken, isAuthenticated, setAuthenticated, signToken, verifyToken } from "@/web/common/utilities/auth";
import { getPerRequestContainer, setPerRequestContainer } from "@/web/common/utilities/container";
import { created, noContent, ok } from "@/web/common/utilities/http";
import { Request, RequestHandler, Response } from "express";
import { DependencyContainer } from "tsyringe";

const createRequestHelper = (req: Request, res: Response) => ({
  verifyToken,
  signToken,
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

type AsyncRequestHandler = (
  ...args: [Parameters<RequestHandler>[0], Parameters<RequestHandler>[1], RequestHelper]
) => Promise<void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, createRequestHelper(req, res))
      .then(() => next())
      .catch((e) => next(e ?? new Error()));

export { RequestHelper, AsyncRequestHandler, handleAsync };
