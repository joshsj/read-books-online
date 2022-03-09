import {
  getPerRequestContainer,
  setPerRequestContainer,
} from "@backend/web/api/common/utilities/container";
import { fromUrlParams } from "@core/utilities/http";
import { Request, RequestHandler, Response } from "express";
import { DependencyContainer } from "tsyringe";

const createRequestHelper = (req: Request, res: Response) => ({
  getPerRequestContainer: () => getPerRequestContainer(res),
  setPerRequestContainer: (container: DependencyContainer) =>
    setPerRequestContainer(res, container),

  // remove leading ?
  getParsedQuery: () => {
    const query = req.originalUrl.split("?")[1];

    return query ? fromUrlParams(query) : {};
  },

  setRefreshTokenCookie: (key: string, value: string, expires: Date): void => {
    res.cookie(key, value, {
      httpOnly: true,
      sameSite: false, // allows CORS
      secure: true,
      signed: true,
      expires,
    });
  },
});

type AsyncRequestHandlerResult =
  | { state: "next" | "created" | "noContent" }
  | { state: "ok"; value: object | void | undefined };

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
    handler(req, res, createRequestHelper(req, res))
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
