import { mixed } from "yup";

const AuthorizationStates = ["approved", "denied"] as const;

type AuthorizationState = typeof AuthorizationStates[number];

const AuthorizationState = mixed((x: any): x is AuthorizationState =>
  AuthorizationStates.includes(x)
);

export { AuthorizationState, AuthorizationStates };
