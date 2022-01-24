import {
  cancelAllocatedTicket,
  cancelOtherTicket,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const CancelTicketRequest = object({ ticketId: Id }).concat(Request("cancelTicketRequest"));
type CancelTicketRequest = InferType<typeof CancelTicketRequest>;

class CancelTicketRequestValidator implements IRequestValidator<CancelTicketRequest> {
  requestName = "cancelTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(CancelTicketRequest.isValidSync(request), new RBOError("validation"));

    ensure(await this.ticketRepository.exists(request.ticketId), new RBOError("missing"));
  }
}

class CancelTicketRequestAuthorizer extends RoleRequestAuthorizer<CancelTicketRequest> {
  requestName = "cancelTicketRequest" as const;
  requiredRoles = ["client"] as const;

  constructor(
    protected readonly identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: CancelTicketRequest): Promise<void> {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ensure(!ticket.allocated, new RBOError("authorization", cancelAllocatedTicket));

    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.created.by._id === currentUser._id,
      new RBOError("authorization", cancelOtherTicket)
    );
  }
}

class CancelTicketCommandHandler implements ICommandHandler<CancelTicketRequest> {
  handles = "cancelTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ ticketId }: CancelTicketRequest) {
    await this.ticketRepository.delete(ticketId);
  }
}

export {
  CancelTicketRequest,
  CancelTicketRequestAuthorizer,
  CancelTicketCommandHandler,
  CancelTicketRequestValidator,
};
