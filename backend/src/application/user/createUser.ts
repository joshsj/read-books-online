import { RBOError } from "@/application/common/error/rboError";
import { ICommandHandler, IRequestValidator } from "@/application/common/interfaces/cqrs";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Request } from "@/application/common/models/request";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { Password } from "@/domain/common/constrainedTypes";
import { newId } from "@/domain/common/id";
import { User } from "@/domain/entities/user";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { Record, Static } from "runtypes";
import { container } from "tsyringe";

const CreateUserRequest = Request("createUserRequest")
  .And(User.pick("username"))
  .And(Record({ password: Password }));
type CreateUserRequest = Static<typeof CreateUserRequest>;

const createUserRequestValidator: IRequestValidator<CreateUserRequest> = {
  requestName: "createUserRequest",
  validate: async (request) => {
    ensure(CreateUserRequest.guard(request), new RBOError("validation"));

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
