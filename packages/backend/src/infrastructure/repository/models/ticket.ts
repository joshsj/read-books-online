import { Ticket } from "@backend/domain/entities/ticket";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { AuditableSchema } from "@backend/infrastructure/repository/models/auditable";
import { model, Schema } from ".";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  ...AuditableSchema("created"),
  information: { type: String },
};

const TicketModel = model("Ticket", Ticket, TicketSchema);

export { TicketSchema, TicketModel };
