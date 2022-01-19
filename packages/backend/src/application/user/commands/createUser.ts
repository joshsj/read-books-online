import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Password, Username } from "@backend/domain/common/constrainedTypes";
import { newId } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { ICommandHandler, IRequest } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { object, ObjectSchema } from "yup";

type CreateUserRequest = IRequest<"createUserRequest"> & {
  username: string;
  password: string;
};

const CreateUserRequest: ObjectSchema<CreateUserRequest> = object({
  username: Username,
  password: Password,
}).concat(Request("createUserRequest"));

class CreateUserRequestValidator implements IRequestValidator<CreateUserRequest> {
  requestName = "createUserRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async validate(request: unknown) {
    ensure(CreateUserRequest.isValidSync(request), new RBOError("validation"));

    const currentUser = await this.userRepository.getByUsername(request.username);

    ensure(
      typeof currentUser === "undefined",
      new RBOError("validation", `User already exists with username ${request.username}`)
    );
  }
}

class CreateUserRequestHandler implements ICommandHandler<CreateUserRequest> {
  handles = "createUserRequest" as const;

  constructor(
    private readonly hashingService: IHashingService,
    private readonly userRepository: IUserRepository
  ) {}

  async handle({ username, password }: CreateUserRequest): Promise<void> {
    const passwordHash = await this.hashingService.hash(password, await this.hashingService.salt());

    const user: User = {
      _id: newId(),
      roles: ["client"],
      username,
      passwordHash,
    };

    await this.userRepository.insert(user);
  }
}

export { CreateUserRequest, CreateUserRequestValidator, CreateUserRequestHandler };
