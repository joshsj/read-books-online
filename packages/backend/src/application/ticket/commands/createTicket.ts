import { requiresRoles } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { newId } from "@backend/domain/common/id";
import { Role } from "@backend/domain/constants/role";
import { Ticket } from "@backend/domain/entities/ticket";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object, string } from "yup";

const CreateTicketRequest = object({
  information: string().strict().required(),
}).concat(Request("createTicketRequest"));

type CreateTicketRequest = InferType<typeof CreateTicketRequest>;

class CreateTicketRequestValidator implements IRequestValidator<CreateTicketRequest> {
  requestName = "createTicketRequest" as const;

  async validate(request: unknown) {
    ensure(await CreateTicketRequest.isValid(request), new RBOError("validation"));
  }
}

class CreateTicketRequestAuthorizer implements IRequestAuthorizer<CreateTicketRequest> {
  requestName = "createTicketRequest" as const;

  constructor(private readonly identityService: IIdentityService) {}

  async authorize() {
    const requiredRole: Role = "client";
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      currentUser.roles.includes(requiredRole),
      new RBOError("authentication", requiresRoles(requiredRole))
    );
  }
}

class CreateTicketRequestHandler implements ICommandHandler<CreateTicketRequest> {
  handles = "createTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ information }: CreateTicketRequest) {
    const ticket: Ticket = { _id: newId(), information };

    await this.ticketRepository.insert(ticket);
  }
}

export {
  CreateTicketRequest,
  CreateTicketRequestValidator,
  CreateTicketRequestAuthorizer,
  CreateTicketRequestHandler,
};
