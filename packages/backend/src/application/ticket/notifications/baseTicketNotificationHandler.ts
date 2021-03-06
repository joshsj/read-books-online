import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Id } from "@backend/domain/common/id";
import { TicketState } from "@backend/domain/constants/ticketStates";
import { createTransport } from "nodemailer";

abstract class BaseTicketNotificationHandler {
  constructor(
    private readonly configuration: IConfiguration,
    private readonly ticketRepository: ITicketRepository
  ) {}

  async notify(ticketId: Id, state: TicketState, ...messages: string[]) {
    const { email } = (await this.ticketRepository.get(ticketId))!.created.by;

    if (!email) {
      return;
    }

    const {
      appUrl,
      mode,
      email: { host, port, from },
    } = this.configuration;

    const transporter = createTransport({
      host,
      port,
      secure: mode !== "development",
    });

    const subject = `Ticket ${state}`;
    const ticketLink = `${appUrl}/tickets/${ticketId}`;
    const body = `${messages.join(" ")} View it <a href='${ticketLink}'>here</a>.`;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: body,
    });
  }
}

export { BaseTicketNotificationHandler };
