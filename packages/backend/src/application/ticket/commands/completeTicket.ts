import {
  completingOtherTicket,
  completingTicketNotRequired,
  notFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object, string } from "yup";

const CompleteTicketRequest = object({
  ticketId: Id.required(),
  information: string().strict().required(),
}).concat(Request("completeTicketRequest"));

type CompleteTicketRequest = InferType<typeof CompleteTicketRequest>;

class CompleteTicketRequestValidator implements IRequestValidator<CompleteTicketRequest> {
  requestName = "completeTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(CompleteTicketRequest.isValidSync(request), new RBOError("validation"));

    const ticket = await this.ticketRepository.get(request.ticketId);

    ensure(!!ticket, new RBOError("missing", notFound(request.ticketId, "Ticket")));
  }
}

class CompleteTicketRequestAuthorizer extends RoleRequestAuthorizer<CompleteTicketRequest> {
  requestName = "completeTicketRequest" as const;
  requiredRoles = ["client"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: CompleteTicketRequest) {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.reviewed?.state === "Information Incomplete",
      new RBOError("authorization", completingTicketNotRequired)
    );

    ensure(
      ticket.created.by._id === currentUser._id,
      new RBOError("authorization", completingOtherTicket)
    );
  }
}

class ProvideNewInformationCommandHandler implements ICommandHandler<CompleteTicketRequest> {
  handles = "completeTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle(request: CompleteTicketRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ticket.information = request.information;
    ticket.reviewed = null;

    await this.ticketRepository.update(ticket);
  }
}

export {
  ProvideNewInformationCommandHandler,
  CompleteTicketRequest,
  CompleteTicketRequestAuthorizer,
  CompleteTicketRequestValidator,
};
