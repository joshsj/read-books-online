import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { PositiveNumber } from "../common/constrainedTypes";
import { TicketFormat } from "../constants/ticketFormat";
import { AuthorizationState, ReviewState, TicketState } from "../constants/ticketStates";
import { User } from "./user";

const RequiredFields = object({
  format: TicketFormat.required(),
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

const Ticket = Entity.concat(RequiredFields).concat(AdditionalFields);

type Ticket = InferType<typeof Ticket>;

const getTicketStates = (ticket: Ticket): TicketState[] => {
  const states: TicketState[] = ["Unallocated"];

  if (ticket.allocated) {
    states.push("Pending Review");
  }

  if (ticket.reviewed) {
    states.push(ticket.reviewed.state);

    if (ticket.reviewed.state === "Information Complete") {
      states.push("Pending Pricing");
    }
  }

  if (ticket.priced) {
    states.push("Pending Authorization");
  }

  if (ticket.authorized) {
    states.push(ticket.authorized.state);
  }

  return states;
};

export { Ticket, getTicketStates };
