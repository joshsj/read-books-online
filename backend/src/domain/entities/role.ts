import { Union, Literal, Static } from "runtypes";

const Role = Union(
  Literal("client"),
  Literal("employee"),
  Literal("authoriser")
);
type Role = Static<typeof Role>;

export { Role };
