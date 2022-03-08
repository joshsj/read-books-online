import { mixed } from "yup";

const AuthorizationStates = ["Purchase Approved", "Purchase Denied"] as const;

type AuthorizationState = typeof AuthorizationStates[number];
const AuthorizationState = mixed((x: any): x is AuthorizationState =>
  x ? AuthorizationStates.includes(x) : true
);

const ReviewStates = ["Information Incomplete", "Information Complete"] as const;

type ReviewState = typeof ReviewStates[number];
const ReviewState = mixed((x: any): x is ReviewState => ReviewStates.includes(x));

const TicketStates = [
  "Unallocated",

  "Pending Review",
  ...ReviewStates,

  "Pending Pricing",

  "Pending Authorization",
  ...AuthorizationStates,
] as const;

type TicketState = typeof TicketStates[number];
const TicketState = mixed((x: any): x is TicketState => TicketStates.includes(x));

export {
  AuthorizationStates,
  AuthorizationState,
  ReviewStates,
  ReviewState,
  TicketStates,
  TicketState,
};
