import { Ticket } from "@backend/domain/entities/ticket";
import { AuditableSchema } from "@backend/infrastructure/repository/models/auditable";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { model, Schema } from ".";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  information: { type: String },
  reviewState: { type: String },
  ...AuditableSchema("created"),
  ...AuditableSchema("allocated"),
  ...AuditableSchema("reviewed"),
};

const TicketModel = model("Ticket", Ticket, TicketSchema, true);

export { TicketSchema, TicketModel };
