import {
  AuthorizationState,
  CompleteTicketRequest,
  ReviewState,
  TicketState,
} from "@client/models";
import { capitalize } from "@core/utilities/string";
import { InferType } from "yup";
import { PendingVariant as DefaultVariant } from "./constants";

const prettyTicketState = (state: TicketState) => capitalize(state);

type ProgressState = ReviewState | AuthorizationState;

const StateVariants: { [K in TicketState]: string } = {
  unallocated: DefaultVariant,
  allocated: DefaultVariant,

  incomplete: "danger",
  complete: "success",

  priced: DefaultVariant,

  denied: "danger",
  approved: "success",
};

const ProgressStateVariants: {
  [K in ProgressState]: string;
} = {
  complete: "success",
  approved: "success",

  incomplete: "danger",
  denied: "danger",
};

const ProgressState = {
  variant: (state?: ProgressState) => (state ? ProgressStateVariants[state] : "info"),
  text: (state?: ProgressState) => (state ? prettyTicketState(state) : "Pending"),
};

export { prettyTicketState, StateVariants, ProgressStateVariants, ProgressState };
