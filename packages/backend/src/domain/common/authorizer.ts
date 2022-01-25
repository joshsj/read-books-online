import { mixed } from "yup";
import { User } from "../entities/user";

type Authorizer = User | "system";
const Authorizer = mixed<Authorizer>((x: any): x is Authorizer =>
  x ? x === "system" || User.isType(x) : true
);

export { Authorizer };
