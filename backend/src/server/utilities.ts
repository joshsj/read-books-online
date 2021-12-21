import { RequestHandler } from "express-serve-static-core";

type AsyncRequestHandler<T = void> = (
  ...args: Parameters<RequestHandler>
) => Promise<T>;

const handleAsync =
  <T>(handler: AsyncRequestHandler<T>): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next)
      .then((result) => res.status(200).send(result))
      .catch(next);

export { handleAsync };
