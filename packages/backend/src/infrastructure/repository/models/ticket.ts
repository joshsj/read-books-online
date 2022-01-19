import { Ticket } from "@backend/domain/entities/ticket";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { model, Schema } from ".";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  information: { type: String },
};

const TicketModel = model("Ticket", Ticket, TicketSchema);

export { TicketSchema, TicketModel };
