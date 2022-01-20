import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { getConfiguration } from "@backend/configuration";
import { container } from "tsyringe";

const registerInitDependencies = () => {
  const configuration = getConfiguration();

  container.register<IConfiguration>(Dependency.configuration, { useValue: configuration });

  container
    .resolve<ILogger>(Dependency.logger)
    .log("init", "Configuration", ...Object.entries(configuration));
};

export { registerInitDependencies };
