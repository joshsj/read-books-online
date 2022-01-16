import { mixed } from "yup";

const Modes = ["development", "production"] as const;

type Mode = typeof Modes[number];

const Mode = mixed((x): x is Mode => Modes.includes(x))
  .strict()
  .required();

export { Mode };
