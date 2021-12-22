import { toDependencies } from "@/common/utilities";
import { Dependency as _Dependency } from "@/common/dependency";

const Dependency = {
  ..._Dependency,
  ...toDependencies(["handler", "behavior", "requestSender", "validator"]),
};

export { Dependency };
