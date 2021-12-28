import { Runtype } from "runtypes";

const Length = <T extends { length: number }>(
  type: Runtype<T>,
  { min, max }: { min?: number; max?: number }
): Runtype<T> => {
  let value = type;

  typeof min !== "undefined" &&
    (value = value.withConstraint((x) => x.length > min));
  typeof max !== "undefined" &&
    (value = value.withConstraint((x) => x.length < max));

  return value;
};

export { Length };
