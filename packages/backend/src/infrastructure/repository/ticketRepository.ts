import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { TicketQuery } from "@backend/application/ticket/queries/ticketQuery";
import { Ticket } from "@backend/domain/entities/ticket";
import { TicketModel } from "./models/ticket";
import { MongoRepository } from "./mongoRepository";
import { FilterBuilder } from "./utilities";

class TicketRepository extends MongoRepository<Ticket> implements ITicketRepository {
  constructor() {
    super(Ticket, TicketModel);
  }

  private readonly UsernameFields = ["created.by", "allocated.to", "authorized.by"] as const;

  public async filtered({ filter }: TicketQuery) {
    const builder = new FilterBuilder<Ticket>();

    if (filter.information) {
      builder.add("string", "information", filter.information);
    }

    if (filter.userId) {
      builder.add({ $or: this.UsernameFields.map((f) => ({ [f]: filter.userId })) });
    }

    return this._filtered(builder.getFilter());
  }
}

export { TicketRepository };
