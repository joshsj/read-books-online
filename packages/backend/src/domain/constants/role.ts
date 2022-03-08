import { mixed } from "yup";

const Roles = ["client", "employee", "authorizer"] as const;

type Role = typeof Roles[number];
const Role = mixed((x): x is Role => (x ? Roles.includes(x) : true));

export { Role, Roles };
