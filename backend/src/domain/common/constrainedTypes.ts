import { Static, String } from "runtypes";

const NonZeroLengthString = String.withConstraint((s) => s.length > 0);
type NonZeroLengthString = Static<typeof NonZeroLengthString>;

export { NonZeroLengthString };
