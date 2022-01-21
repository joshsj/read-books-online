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
    const builder = new FilterBuilder<Ticket>();

    if (filter.information) {
      builder.add({ information: { $regex: new RegExp(filter.information), $options: "i" } });
    }

    if (filter.createdAt.from) {
      builder.add({ createdAt: { $gte: filter.createdAt.from } });
    }

    if (filter.createdAt.to) {
      builder.add({ createdAt: { $lte: filter.createdAt.to } });
    }

    if (filter.createdBy?.length) {
      builder.add({ createdBy: { $in: filter.createdBy } });
    }

    return this._filtered(builder.getFilter());
  }
}

export { TicketRepository };
