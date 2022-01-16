import { string, number, InferType, mixed } from "yup";
import { Algorithm } from "jsonwebtoken";

const PositiveNumber = number().strict().required().min(0);
type PositiveNumber = InferType<typeof PositiveNumber>;

const Username = string().strict().required().min(3);
type Username = InferType<typeof Username>;

const Password = string().strict().required().min(8);
type Password = InferType<typeof Password>;

// library offers no validation for algorithm values, length is the best we can do
const JWTAlgorithm = mixed(
  (x): x is Exclude<Algorithm, "none"> => typeof x === "string" && x.length === 5
)
  .strict()
  .required();
type JWTAlgorithm = InferType<typeof JWTAlgorithm>;

export { PositiveNumber, Username, Password, JWTAlgorithm };
