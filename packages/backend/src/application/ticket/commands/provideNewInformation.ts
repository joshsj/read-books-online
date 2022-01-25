import {
  notFound,
  providingNewInformationNotRequired,
  providingNewInformationOtherTicket,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object, string } from "yup";

const ProvideNewInformationRequest = object({
  ticketId: Id,
  information: string().strict().required(),
}).concat(Request("provideNewInformationRequest"));

type ProvideNewInformationRequest = InferType<typeof ProvideNewInformationRequest>;

class ProvideNewInformationRequestValidator
  implements IRequestValidator<ProvideNewInformationRequest>
{
  requestName = "provideNewInformationRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(ProvideNewInformationRequest.isValidSync(request), new RBOError("validation"));

    const ticket = await this.ticketRepository.get(request.ticketId);

    ensure(!!ticket, new RBOError("missing", notFound(request.ticketId, "Ticket")));
  }
}

class ProvideNewInformationRequestAuthorizer extends RoleRequestAuthorizer<ProvideNewInformationRequest> {
  requestName = "provideNewInformationRequest" as const;
  requiredRoles = ["client"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: ProvideNewInformationRequest) {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.approved?.state === "requiresNewInformation",
      new RBOError("authorization", providingNewInformationNotRequired)
    );

    ensure(
      ticket.created.by._id === currentUser._id,
      new RBOError("authorization", providingNewInformationOtherTicket)
    );
  }
}

class ProvideNewInformationCommandHandler implements ICommandHandler<ProvideNewInformationRequest> {
  handles = "provideNewInformationRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle(request: ProvideNewInformationRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ticket.information = request.information;
    ticket.approved = null;

    await this.ticketRepository.update(ticket);
  }
}

export {
  ProvideNewInformationCommandHandler,
  ProvideNewInformationRequest,
  ProvideNewInformationRequestAuthorizer,
  ProvideNewInformationRequestValidator,
};
