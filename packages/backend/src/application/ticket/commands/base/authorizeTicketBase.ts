import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { DelayedDependency } from "@backend/application/common/utilities/cqrs";
import { AuthorizationState } from "@backend/domain/constants/ticketStates";
import { Ticket } from "@backend/domain/entities/ticket";
import { User } from "@backend/domain/entities/user";
import { ICQRS } from "@core/cqrs/types/service";
import { AuthorizeTicketNotification } from "@backend/application/ticket/notifications/authorizedTicket";
import { Id } from "@backend/domain/common/id";

abstract class AuthorizeTicketBase {
  constructor(
    protected readonly ticketRepository: ITicketRepository,
    protected readonly cqrs: DelayedDependency<ICQRS>
  ) {}

  async authorize(ticketId: Id, state: AuthorizationState, by: User | null): Promise<Ticket> {
    const ticket = (await this.ticketRepository.get(ticketId))!;

    ticket.authorized = {
      at: new Date(),
      by,
      state,
    };

    await this.ticketRepository.update(ticket);

    const notification: AuthorizeTicketNotification = {
      notificationName: "authorizeTicketNotification",
      ticketId: ticket._id,
      state,
    };

    await this.cqrs().publish(notification);

    return ticket;
  }
}

export { AuthorizeTicketBase };
