import { Ticket } from "@backend/domain/entities/ticket";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { model, Schema } from ".";
import { UserModel } from "./user";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  information: { type: String },

  created: {
    at: { type: Date },
    by: { type: String, ref: UserModel, autopopulate: true },
  },

  allocated: {
    at: { type: Date },
    to: { type: String, ref: UserModel, autopopulate: true },
  },

  reviewed: {
    at: { type: Date },
    state: { type: String },
  },

  authorized: {
    at: { type: Date },
    by: { type: String, ref: UserModel, autopopulate: true },
    state: { type: String },
  },
};

const TicketModel = model("Ticket", Ticket, TicketSchema, true);

export { TicketSchema, TicketModel };
