import { RBOError } from "@backend/application/common/error/rboError";
import {
  ICommandHandler,
  IRequest,
  IRequestValidator,
} from "@backend/application/common/interfaces/cqrs";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { Dependency } from "@backend/application/dependency";
import { ensure } from "@core/utilities";
import { Password, Username } from "@backend/domain/common/constrainedTypes";
import { newId } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { UserRepository } from "@backend/infrastructure/repository/userRepository";
import { container } from "tsyringe";
import { mixed, object, ObjectSchema } from "yup";

type CreateUserRequest = IRequest<"createUserRequest"> & {
  username: string;
  password: string;
};

const CreateUserRequest: ObjectSchema<CreateUserRequest> = object({
  requestName: mixed((x): x is "createUserRequest" => x === "createUserRequest")
    .strict()
    .required(),
  username: Username,
  password: Password,
});

const createUserRequestValidator: IRequestValidator<CreateUserRequest> = {
  requestName: "createUserRequest",
  validate: async (request) => {
    ensure(!!CreateUserRequest, new RBOError("validation"));

    const userRepository = container.resolve<IUserRepository>(Dependency.userRepository);
    const currentUser = await userRepository.getByUsername(request.username);

    ensure(
      typeof currentUser === "undefined",
      new RBOError("validation", `User already exists with username ${request.username}`)
    );
  },
};

const createUserRequestHandler: ICommandHandler<CreateUserRequest> = {
  handles: "createUserRequest",
  handle: async ({ username, password }) => {
    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const userRepository = container.resolve<UserRepository>(Dependency.userRepository);

    const passwordHash = await hashingService.hash(password, await hashingService.salt());

    const user: User = {
      id: newId(),
      roles: ["client"],
      username,
      passwordHash,
    };

    await userRepository.insert(user);
  },
};

export { CreateUserRequest, createUserRequestValidator, createUserRequestHandler };
