import { getPerRequestContainer, setPerRequestContainer } from "@/web/common/utilities/container";
import { created, noContent, ok } from "@/web/common/utilities/http";
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
) => Promise<void | "next">;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, createRequestHelper(res))
      .then((x) => x === "next" && next())
      .catch((e) => next(e ?? new Error()));

export { RequestHelper, AsyncRequestHandler, handleAsync };
