import { Runtype } from "runtypes";

const Length = <T extends { length: number }>(
  type: Runtype<T>,
  { min, max }: { min?: number; max?: number }
): Runtype<T> => {
  typeof min !== "undefined" &&
    (type = type.withConstraint((x) => x.length >= min));
  typeof max !== "undefined" &&
    (type = type.withConstraint((x) => x.length <= max));

  return type;
};

export { Length };
