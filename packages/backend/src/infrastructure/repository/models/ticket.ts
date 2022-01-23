import { Ticket } from "@backend/domain/entities/ticket";
import { AuditableSchema } from "@backend/infrastructure/repository/models/auditable";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { model, Schema } from ".";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  ...AuditableSchema("created"),
  ...AuditableSchema("allocated"),
  information: { type: String },
};

const TicketModel = model("Ticket", Ticket, TicketSchema, true);

export { TicketSchema, TicketModel };
