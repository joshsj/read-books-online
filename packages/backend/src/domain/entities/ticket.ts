import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { Authorizer } from "../common/authorizer";
import { AuthorizationState } from "../constants/authorizationState";
import { CompletionState } from "../constants/completionState";
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

  reviewed: object({
    at: date().strict().required(),
    state: CompletionState.required(),
  }).nullable(),

  authorized: object({
    at: date().strict().required(),
    by: Authorizer.required().nullable(),
    state: AuthorizationState.required(),
  }).nullable(),
});

const Ticket = Entity.concat(InitialFields).concat(AdditionalFields);

type Ticket = InferType<typeof Ticket>;

const getTicketStates = (ticket: Ticket): TicketState[] => {
  const states: TicketState[] = ["unallocated"];

  ticket.allocated && states.push("allocated");
  ticket.reviewed && states.push(ticket.reviewed.state);
  ticket.authorized && states.push(ticket.authorized.state);

  return states;
};

export { Ticket, getTicketStates };
