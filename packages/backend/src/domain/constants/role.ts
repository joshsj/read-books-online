import { mixed } from "yup";

const Roles = ["client", "employee", "authorizer"] as const;

type Role = typeof Roles[number];
const Role = mixed((x): x is Role => Roles.includes(x))
  .strict()
  .required();

export { Role, Roles };
