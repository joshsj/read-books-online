import { requiresRoles } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { newId } from "@backend/domain/common/id";
import { Role } from "@backend/domain/constants/role";
import { Ticket } from "@backend/domain/entities/ticket";
import { ICommandHandler, IRequest } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { object, ObjectSchema, string } from "yup";

type CreateTicketRequest = IRequest<"createTicketRequest"> & {
  information: string;
};

const CreateTicketRequest: ObjectSchema<CreateTicketRequest> = object({
  information: string().strict().required(),
}).concat(Request("createTicketRequest"));

class CreateTicketValidator implements IRequestValidator<CreateTicketRequest> {
  requestName = "createTicketRequest" as const;

  constructor(private readonly identityService: IIdentityService) {}

  async validate(request: unknown) {
    ensure(await CreateTicketRequest.isValid(request), new RBOError("validation"));

    const requiredRole: Role = "client";
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      currentUser.roles.includes(requiredRole),
      new RBOError("validation", requiresRoles(requiredRole))
    );
  }
}

class CreateTicketHandler implements ICommandHandler<CreateTicketRequest> {
  handles = "createTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ information }: CreateTicketRequest) {
    const ticket: Ticket = { _id: newId(), information };

    await this.ticketRepository.insert(ticket);
  }
}

export { CreateTicketRequest, CreateTicketValidator, CreateTicketHandler };
