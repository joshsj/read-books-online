import {
  getPerRequestContainer,
  setPerRequestContainer,
} from "@backend/api/common/utilities/container";
import { created, noContent, ok } from "@backend/api/common/utilities/http";
import { RequestHandler, Response } from "express";
import { DependencyContainer } from "tsyringe";

const createRequestHelper = (res: Response) => ({
  getPerRequestContainer: () => getPerRequestContainer(res),
  setPerRequestContainer: (container: DependencyContainer) =>
    setPerRequestContainer(res, container),

  ok: (result?: object) => ok(res, result),
  created: () => created(res),
  noContent: () => noContent(res),
});

type RequestHelper = ReturnType<typeof createRequestHelper>;

type AsyncRequestHandler = (
  ...args: [Parameters<RequestHandler>[0], Parameters<RequestHandler>[1], RequestHelper]
) => Promise<"next" | void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, createRequestHelper(res))
      .then((x) => (x === "next" ? next() : res.end()))
      .catch((e) => next(e ?? new Error()));

export { RequestHelper, AsyncRequestHandler, handleAsync };
