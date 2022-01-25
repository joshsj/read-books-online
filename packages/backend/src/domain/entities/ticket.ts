import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { ApprovalState } from "../constants/approvalState";
import { TicketState } from "../constants/ticketState";
import { User } from "./user";

const InitialFields = object({
  information: string().strict().required(),

  created: object({
    at: date().strict().required(),
    by: User.required(),
  }),
});

const AdditionalFields = object({
  allocated: object({
    at: date().strict().required(),
    to: User.required(),
  }).nullable(),

  approved: object({
    at: date().strict().required(),
    state: ApprovalState.required(),
  }).nullable(),
});

const Ticket = Entity.concat(InitialFields).concat(AdditionalFields);

type Ticket = InferType<typeof Ticket>;

const getTicketStates = (ticket: Ticket): TicketState[] => {
  const states: TicketState[] = ["unallocated"];

  ticket.allocated && states.push("allocated");

  ticket.approved && states.push(ticket.approved.state);

  return states;
};

export { Ticket, getTicketStates };
