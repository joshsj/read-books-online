import { string, number, InferType, mixed } from "yup";
import { Algorithm } from "jsonwebtoken";

const PositiveNumber = number().strict().min(0);
type PositiveNumber = InferType<typeof PositiveNumber>;

const UsernamePattern = /^[\w]+$/;
const Username = string()
  .strict()
  .min(3)
  .test({
    test: (s) => (s ? UsernamePattern.test(s) : true),
    message: "username can only contain letters, numbers, and underscores",
  });
type Username = InferType<typeof Username>;

const Password = string().strict().min(8);
type Password = InferType<typeof Password>;

// library offers no validation for algorithm values, length is the best we can do
const JWTAlgorithm = mixed(
  (x): x is Exclude<Algorithm, "none"> => typeof x === "string" && x.length === 5
)
  .strict()
  .required();
type JWTAlgorithm = InferType<typeof JWTAlgorithm>;

export { PositiveNumber, Username, Password, JWTAlgorithm };
