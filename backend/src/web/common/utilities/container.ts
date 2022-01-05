import { ensure } from "@/common/utilities";
import { Response } from "express";
import { DependencyContainer } from "tsyringe";

const containerKey = "container";

const setPerRequestContainer = (res: Response, container: DependencyContainer) =>
  (res.locals[containerKey] = container);

const getPerRequestContainer = (res: Response) => {
  const container = res.locals[containerKey];
  ensure(!!container, undefined);
  return container;
};

export { getPerRequestContainer, setPerRequestContainer };
