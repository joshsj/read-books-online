import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { newId } from "@backend/domain/common/id";
import { Ticket } from "@backend/domain/entities/ticket";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object, string } from "yup";

const CreateTicketRequest = object({
  information: string().strict().required(),
}).concat(Request("createTicketRequest"));

type CreateTicketRequest = InferType<typeof CreateTicketRequest>;

class CreateTicketCommandValidator implements IRequestValidator<CreateTicketRequest> {
  requestName = "createTicketRequest" as const;

  async validate(request: unknown) {
    ensure(await CreateTicketRequest.isValid(request), new RBOError("validation"));
  }
}

class CreateTicketCommandAuthorizer extends RoleRequestAuthorizer<CreateTicketRequest> {
  requestName = "createTicketRequest" as const;
  requiredRoles = ["client"] as const;
}

class CreateTicketCommandHandler implements ICommandHandler<CreateTicketRequest> {
  handles = "createTicketRequest" as const;

  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService
  ) {}

  async handle({ information }: CreateTicketRequest) {
    const currentUser = await this.identityService.getCurrentUser();

    const ticket: Ticket = {
      _id: newId(),
      information,
      created: {
        at: new Date(),
        by: currentUser,
      },
      allocated: null,
      reviewed: null,
      priced: null,
      authorized: null,
    };

    await this.ticketRepository.insert(ticket);
  }
}

export {
  CreateTicketRequest,
  CreateTicketCommandValidator,
  CreateTicketCommandAuthorizer,
  CreateTicketCommandHandler,
};
