import { notFound, reviewingOwnTicket } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const AllocateTicketRequest = object({ ticketId: Id }).concat(Request("allocateTicketRequest"));
type AllocateTicketRequest = InferType<typeof AllocateTicketRequest>;

class AllocateTicketRequestAuthorizer extends RoleRequestAuthorizer<AllocateTicketRequest> {
  requestName = "allocateTicketRequest" as const;
  requiredRoles = ["employee"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: AllocateTicketRequest): Promise<void> {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.created.by._id !== currentUser._id,
      new RBOError("authorization", reviewingOwnTicket("allocate"))
    );
  }
}

class AllocateTicketRequestValidator implements IRequestValidator<AllocateTicketRequest> {
  requestName = "allocateTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(AllocateTicketRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("missing", notFound(request.ticketId, "Ticket"))
    );
  }
}

class AllocateTicketCommandHandler implements ICommandHandler<AllocateTicketRequest> {
  handles = "allocateTicketRequest" as const;

  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService
  ) {}

  async handle(request: AllocateTicketRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ticket.allocated = { at: new Date(), by: currentUser };

    await this.ticketRepository.update(ticket);
  }
}

export {
  AllocateTicketRequest,
  AllocateTicketRequestAuthorizer,
  AllocateTicketRequestValidator,
  AllocateTicketCommandHandler,
};
