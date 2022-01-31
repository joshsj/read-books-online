import { Ticket } from "@backend/domain/entities/ticket";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { model, Schema } from ".";
import { UserModel } from "./user";

const TicketSchema: Schema<Ticket> = {
  ...EntitySchema,
  format: { type: String },
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

  priced: {
    at: { type: Date },
    value: { type: Number },
  },

  authorized: {
    at: { type: Date },
    by: { type: String, ref: UserModel, autopopulate: true },
    state: { type: String },
  },
};

const TicketModel = model("Ticket", Ticket, TicketSchema, true);

export { TicketSchema, TicketModel };
