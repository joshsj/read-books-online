import { RequestHandler, Response } from "express-serve-static-core";

type AsyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next).catch(next);

const ok = (res: Response, result: any) => res.status(200).send(result);

export { handleAsync, ok };
