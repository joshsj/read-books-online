import { ICQRS } from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { container } from "tsyringe";
import { CQRS } from "./cqrs";

const registerInfrastructureDependencies = () => {
  container.register<ICQRS>(Dependency.requestSender, {
    useFactory: (c) => new CQRS(c),
  });
};

export { Dependency, registerInfrastructureDependencies };
