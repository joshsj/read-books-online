import {
  getPerRequestContainer,
  setPerRequestContainer,
} from "@backend/api/common/utilities/container";
import { RequestHandler, Response } from "express";
import { DependencyContainer } from "tsyringe";

const createRequestHelper = (res: Response) => ({
  getPerRequestContainer: () => getPerRequestContainer(res),
  setPerRequestContainer: (container: DependencyContainer) =>
    setPerRequestContainer(res, container),
});

type AsyncRequestHandlerResult =
  | { state: "next" | "created" | "noContent" }
  | { state: "ok"; value: object | undefined };

type AsyncRequestHandler = (
  ...args: [
    Parameters<RequestHandler>[0],
    Parameters<RequestHandler>[1],
    ReturnType<typeof createRequestHelper>
  ]
) => Promise<AsyncRequestHandlerResult>;

const resultStatusMap: { [K in Exclude<AsyncRequestHandlerResult["state"], "next">]: number } = {
  ok: 200,
  created: 201,
  noContent: 204,
};

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, createRequestHelper(res))
      .then((result) => {
        if (result.state === "next") {
          return next();
        }

        res.status(resultStatusMap[result.state]);
        result.state === "ok" && res.json(result.value);
        res.end();
      })
      .catch((e) => next(e ?? new Error()));

export { AsyncRequestHandler, handleAsync };
