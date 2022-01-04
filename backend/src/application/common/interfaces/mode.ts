import { Literal, Static, Union } from "runtypes";

const Mode = Union(Literal("development"), Literal("production"));
type Mode = Static<typeof Mode>;

export { Mode };
