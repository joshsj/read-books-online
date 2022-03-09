import { model, Schema } from ".";
import { EntitySchema } from "./entity";
import { Message } from "@backend/domain/entities/message";
import { UserModel } from "./user";
import { TicketModel } from "./ticket";

const MessageSchema: Schema<Message> = {
  ...EntitySchema,
  ticket: { type: String, ref: TicketModel, autopopulate: true },
  from: { type: String, ref: UserModel, autopopulate: true },
  at: { type: Date },
  content: { type: String },
};

const MessageModel = model<Message>("Message", Message, MessageSchema, true);

export { MessageSchema, MessageModel };
