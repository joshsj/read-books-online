import { ICurrentUserService } from "@/application/common/interfaces/currentUserService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { JWTPayload } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import { container, DependencyContainer } from "tsyringe";

const configureContainer = async (container: DependencyContainer, { sub: id }: JWTPayload) => {
  const currentUser = await container.resolve<IUserRepository>(Dependency.userRepository).getByUsername(id);
  ensure(!!currentUser);

  container.register<ICurrentUserService>(Dependency.currentUserService, {
    useValue: { id, user: currentUser },
  });
};

const perRequestContainerProvider: Handler = handleAsync(async ({}, {}, next, { getToken, setPerRequestContainer }) => {
  const token = getToken();
  ensure(!!token);

  const payload = jwt.decode(token);
  ensure(JWTPayload.guard(payload));

  const requestContainer = container.createChildContainer();
  await configureContainer(requestContainer, payload);

  setPerRequestContainer(requestContainer);

  next();
});
export { perRequestContainerProvider };
