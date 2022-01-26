import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { PositiveNumber } from "../common/constrainedTypes";
import { AuthorizationState } from "../constants/authorizationState";
import { ReviewState } from "../constants/reviewState";
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
    state: ReviewState.required(),
  }).nullable(),

  priced: object({
    at: date().strict().required(),
    value: PositiveNumber.required(),
  }).nullable(),

  authorized: object({
    at: date().strict().required(),
    by: User.nullable(),
    state: AuthorizationState.required(),
  }).nullable(),
});

const Ticket = Entity.concat(InitialFields).concat(AdditionalFields);

type Ticket = InferType<typeof Ticket>;

const getTicketStates = (ticket: Ticket): TicketState[] => {
  const states: TicketState[] = ["unallocated"];

  ticket.allocated && states.push("allocated");
  ticket.reviewed && states.push(ticket.reviewed.state);
  ticket.priced && states.push("priced");
  ticket.authorized && states.push(ticket.authorized.state);

  return states;
};

export { Ticket, getTicketStates };
