import { AuthorizationState, ReviewState, TicketState } from "@client/models";
import { PendingVariant as DefaultVariant } from "./constants";

type ProgressState = ReviewState | AuthorizationState;

type StateVariants = { [K in TicketState]: string };
const StateVariants: StateVariants = {
  Unallocated: DefaultVariant,
  "Pending Review": DefaultVariant,

  "Information Incomplete": "danger",
  "Information Complete": "success",

  "Pending Pricing": DefaultVariant,
  "Pending Authorization": DefaultVariant,

  "Purchase Denied": "danger",
  "Purchase Approved": "success",
};

const ProgressState = {
  variant: (state?: ProgressState): string => (state ? StateVariants[state] : "info"),
  text: (state?: ProgressState): string => (state ? state : "Pending"),
};

export { StateVariants, ProgressState };
