import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import {
  IRefreshTokenRepository,
  ITicketRepository,
  IUserRepository,
} from "@backend/application/common/interfaces/repository";
import { Dependency } from "@backend/application/dependency";
import { Ticket } from "@backend/domain/entities/ticket";
import { IdentityService } from "@backend/infrastructure/identityService";
import { HashingService } from "@backend/infrastructure/hashingService";
import { Logger } from "@backend/infrastructure/logger";
import { TicketModel } from "@backend/infrastructure/repository/models/ticket";
import { MongoRepository } from "@backend/infrastructure/repository/mongoRepository";
import { RefreshTokenRepository } from "@backend/infrastructure/repository/refreshTokenRepository";
import { UserRepository } from "@backend/infrastructure/repository/userRepository";
import { container } from "tsyringe";
import { IAuditService } from "@backend/application/common/interfaces/auditService";
import { AuditService } from "@backend/infrastructure/auditService";

const registerInfrastructureDependencies = () => {
  container.register<ILogger>(Dependency.logger, {
    useFactory: (c) =>
      new Logger(
        c.isRegistered(Dependency.httpContextService)
          ? c.resolve<IHttpContextService>(Dependency.httpContextService)
          : undefined
      ),
  });

  container.register<IIdentityService>(Dependency.identityService, {
    useFactory: (c) =>
      new IdentityService(
        c.resolve<IHttpContextService>(Dependency.httpContextService),
        c.resolve<IHashingService>(Dependency.hashingService),
        c.resolve<IConfiguration>(Dependency.configuration),
        c.resolve<IUserRepository>(Dependency.userRepository),
        c.resolve<IRefreshTokenRepository>(Dependency.refreshTokenRepository)
      ),
  });

  container.register<IHashingService>(Dependency.hashingService, {
    useFactory: (c) => new HashingService(c.resolve<IConfiguration>(Dependency.configuration)),
  });

  container.register<IAuditService>(Dependency.auditService, {
    useFactory: (c) => new AuditService(c.resolve(Dependency.identityService)),
  });

  container
    .register<IUserRepository>(Dependency.userRepository, { useValue: new UserRepository() })
    .register<IRefreshTokenRepository>(Dependency.refreshTokenRepository, {
      useValue: new RefreshTokenRepository(),
    })
    .register<ITicketRepository>(Dependency.ticketRepository, {
      useValue: new MongoRepository(Ticket, TicketModel),
    });
};

export { registerInfrastructureDependencies };
