import { ensure } from "@core/utilities";
import { Response } from "express";
import { DependencyContainer } from "tsyringe";

const containerKey = "perRequestContainer";

const setPerRequestContainer = (res: Response, container: DependencyContainer): void => {
  res.locals[containerKey] = container;
};

const getPerRequestContainer = (res: Response): DependencyContainer => {
  const container = res.locals[containerKey];
  ensure(!!container, undefined);
  return container;
};

export { getPerRequestContainer, setPerRequestContainer };
