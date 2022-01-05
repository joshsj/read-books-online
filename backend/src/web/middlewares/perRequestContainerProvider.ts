import { ApiError } from "@/application/common/error/apiError";
import { invalidToken } from "@/application/common/error/messages";
import { ICurrentUserService } from "@/application/common/interfaces/currentUserService";
import { ILogger } from "@/application/common/interfaces/logger";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { JWTPayload } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import { container, DependencyContainer } from "tsyringe";

const configureContainer = async (container: DependencyContainer, { sub: id }: JWTPayload) => {
  const user = await container.resolve<IUserRepository>(Dependency.userRepository).getByUsername(id);
  ensure(!!user, new ApiError("missing", `User with username "${user?.username}"`));

  container.resolve<ILogger>(Dependency.logger)("prcp", `Providing current user ${user.username}`);

  container.register<ICurrentUserService>(Dependency.currentUserService, {
    useValue: { id, user },
  });
};

const perRequestContainerProvider: Handler = handleAsync(async ({}, {}, { getToken, setPerRequestContainer }) => {
  const token = getToken();
  ensure(!!token, new ApiError("authorization", invalidToken));

  const payload = jwt.decode(token);
  ensure(JWTPayload.guard(payload), new ApiError("authorization"));

  const requestContainer = container.createChildContainer();
  await configureContainer(requestContainer, payload);

  setPerRequestContainer(requestContainer);
});
export { perRequestContainerProvider };
