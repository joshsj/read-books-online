import { authorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { validatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import {
  IBehavior,
  IRequestAuthorizer,
  IRequestHandler,
  IRequestValidator,
} from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { CQRS } from "@backend/infrastructure/cqrs";
import {
  createLogger,
  createTestAuthorizer,
  createTestRequest,
  createTestRequestHandler,
  createTestValidator,
  TestRequest,
} from "@backend/test/unit/utilities/mocks";
import { expect } from "chai";
import { container } from "tsyringe";

describe("Behaviors", () => {
  beforeEach(() => {
    container.clearInstances();

    container
      .register<IRequestHandler>(Dependency.requestHandler, {
        useValue: createTestRequestHandler(),
      })
      .register<ILogger>(Dependency.logger, { useValue: createLogger() });
  });

  describe("Authorizer", () => {
    beforeEach(() =>
      container.register<IBehavior>(Dependency.requestBehavior, {
        useValue: authorizerBehavior,
      })
    );

    it("Passes for valid requests", () => {
      const authorizer = createTestAuthorizer("passes");
      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, {
        useValue: authorizer,
      });

      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const authorizer = createTestAuthorizer("fails");
      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, {
        useValue: authorizer,
      });

      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.rejected;
    });
  });

  describe("Validator", () => {
    beforeEach(() =>
      container.register<IBehavior>(Dependency.requestBehavior, {
        useValue: validatorBehavior,
      })
    );

    it("Passes for valid requests", () => {
      const validator = createTestValidator("passes");
      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, {
        useValue: validator,
      });
      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const validator = createTestValidator("fails");
      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, {
        useValue: validator,
      });

      const result = new CQRS().send(createTestRequest());

      return expect(result).to.be.rejected;
    });
  });
});
