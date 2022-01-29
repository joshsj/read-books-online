import { userAlreadyExists } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Password } from "@backend/domain/common/constrainedTypes";
import { newId } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const CreateUserRequest = object({
  password: Password.required(),
})
  .concat(User.pick(["username", "email"]))
  .concat(Request("createUserRequest"));

type CreateUserRequest = InferType<typeof CreateUserRequest>;

class CreateUserCommandValidator implements IRequestValidator<CreateUserRequest> {
  requestName = "createUserRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async validate(request: unknown) {
    ensure(CreateUserRequest.isValidSync(request), new RBOError("validation"));

    const existingUser = await this.userRepository.getByUsername(request.username);

    ensure(!existingUser, new RBOError("validation", userAlreadyExists(request.username)));
  }
}

class CreateUserCommandHandler implements ICommandHandler<CreateUserRequest> {
  handles = "createUserRequest" as const;

  constructor(
    private readonly hashingService: IHashingService,
    private readonly userRepository: IUserRepository
  ) {}

  async handle({ username, password, email }: CreateUserRequest): Promise<void> {
    const passwordHash = await this.hashingService.hash(password, await this.hashingService.salt());

    const user: User = {
      _id: newId(),
      roles: ["client"],
      email,
      username,
      passwordHash,
    };

    await this.userRepository.insert(user);
  }
}

export { CreateUserRequest, CreateUserCommandValidator, CreateUserCommandHandler };
