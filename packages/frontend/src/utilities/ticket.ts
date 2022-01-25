import {
  CompleteTicketRequest,
  TicketState,
  CompletionState,
  AuthorizationState,
} from "@client/models";
import { capitalize } from "@core/utilities/string";
import { InferType } from "yup";

const PendingVariant = "info" as const;

const prettyTicketState = (state: TicketState) => capitalize(state);

const ticketStateVariants: { [K in CompletionState | AuthorizationState]: string } = {
  complete: "success",
  approved: "success",

  incomplete: "danger",
  denied: "danger",
};

const ticketProgressState = {
  displayText: (state?: CompletionState | AuthorizationState): string =>
    state ? prettyTicketState(state) : "Pending",

  variant: (state?: CompletionState | AuthorizationState): string =>
    state ? ticketStateVariants[state] : "info",
};

const TicketInformationModel = CompleteTicketRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

export { ticketProgressState, prettyTicketState, PendingVariant, TicketInformationModel };
