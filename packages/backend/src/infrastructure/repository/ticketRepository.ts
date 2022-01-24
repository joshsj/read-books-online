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

  public async filtered({ filter }: TicketQuery) {
    if (!filter) {
      return this.get();
    }

    const builder = new FilterBuilder<Ticket>();

    if (filter.information) {
      builder.add("string", "information", filter.information);
    }

    if (filter.created?.at) {
      builder.add({
        "created.at": {
          $gte: filter.created.at.from,
          $lte: filter.created.at.to,
        },
      });
    }

    if (filter.created?.by?.length) {
      builder.add({ "created.by": { $in: filter.created.by } });
    }

    return this._filtered(builder.getFilter());
  }
}

export { TicketRepository };
