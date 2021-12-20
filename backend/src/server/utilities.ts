import { RequestHandler } from "express-serve-static-core";

type AsyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next).catch(next);

export { handleAsync, AsyncRequestHandler };
