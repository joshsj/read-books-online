import {
  CompleteTicketRequest,
  TicketState,
  ReviewState,
  AuthorizationState,
} from "@client/models";
import { capitalize } from "@core/utilities/string";
import { InferType } from "yup";

const PendingVariant = "info" as const;

const prettyTicketState = (state: TicketState) => capitalize(state);

const ticketStateVariants: { [K in ReviewState | AuthorizationState]: string } = {
  complete: "success",
  approved: "success",

  incomplete: "danger",
  denied: "danger",
};

const ticketProgressState = {
  displayText: (state?: ReviewState | AuthorizationState): string =>
    state ? prettyTicketState(state) : "Pending",

  variant: (state?: ReviewState | AuthorizationState): string =>
    state ? ticketStateVariants[state] : "info",
};

const TicketInformationModel = CompleteTicketRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

export { ticketProgressState, prettyTicketState, PendingVariant, TicketInformationModel };
