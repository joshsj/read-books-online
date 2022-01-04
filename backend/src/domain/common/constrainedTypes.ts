import { Runtype, String } from "runtypes";

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

const Username = Length(String, { min: 3 });
const Password = Length(String, { min: 8 });

export { Length, Username, Password };
