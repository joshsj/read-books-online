import { container } from "tsyringe";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { getConfiguration } from "@backend/configuration";
import { HashingService } from "@backend/infrastructure/hashingService";

const registerInitDependencies = () => {
  const configuration = getConfiguration();

  container
    .register<IHashingService>(Dependency.hashingService, {
      useFactory: (c) => new HashingService(c.resolve<IConfiguration>(Dependency.configuration)),
    })
    .register<IConfiguration>(Dependency.configuration, { useValue: configuration });

  container
    .resolve<ILogger>(Dependency.logger)
    .log("init", "Configuration", ...Object.entries(configuration));
};

export { registerInitDependencies };
