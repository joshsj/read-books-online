import { Number, Runtype, String } from "runtypes";
import { Algorithm } from "jsonwebtoken";

const Length = <T extends { length: number }>(
  type: Runtype<T>,
  { min, max }: { min?: number; max?: number }
): Runtype<T> => {
  typeof min !== "undefined" && (type = type.withConstraint((x) => x.length >= min));
  typeof max !== "undefined" && (type = type.withConstraint((x) => x.length <= max));

  return type;
};

const PositiveNumber = Number.withConstraint((x) => x > 0);

const Username = Length(String, { min: 3 });
const Password = Length(String, { min: 8 });

// library offers no validation for algorithm values, length is the best we can do
const JWTAlgorithm = String.withConstraint<Algorithm>((x) => x.length === 5);

export { Length, Username, Password, PositiveNumber, JWTAlgorithm };
