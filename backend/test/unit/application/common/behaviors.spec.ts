import { authorizerBehavior } from "@/application/common/behaviors/authorizerBehavior";
import { validatorBehavior } from "@/application/common/behaviors/validatorBehavior";
import {
  IBehavior,
  IRequestAuthorizer,
  IRequestHandler,
  IRequestValidator,
} from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { CQRS } from "@/infrastructure/cqrs";
import {
  createLogger,
  createTestAuthorizer,
  createTestHandler,
  createTestRequest,
  createTestValidator,
  TestRequest,
} from "@/test/utilities/mocks";
import { expect } from "chai";
import { container } from "tsyringe";

describe("Behaviors", () => {
  beforeEach(() => {
    container.clearInstances();

    container
      .register<IRequestHandler>(Dependency.requestHandler, {
        useValue: createTestHandler(),
      })
      .register<ILogger>(Dependency.logger, { useValue: createLogger() });
  });

  describe("Authorizer", () => {
    beforeEach(() =>
      container.register<IBehavior>(Dependency.requestBehavior, {
        useValue: authorizerBehavior,
      })
    );

    it("Passes for valid requests", async () => {
      const authorizer = createTestAuthorizer("passes");

      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, { useValue: authorizer });

      return expect(new CQRS().send(createTestRequest())).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const authorizer = createTestAuthorizer("fails");

      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, { useValue: authorizer });

      return expect(new CQRS().send(createTestRequest())).to.be.rejected;
    });
  });

  describe("Validator", () => {
    beforeEach(() =>
      container.register<IBehavior>(Dependency.requestBehavior, {
        useValue: validatorBehavior,
      })
    );

    it("Passes for valid requests", async () => {
      const validator = createTestValidator("passes");

      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, { useValue: validator });

      return expect(new CQRS().send(createTestRequest())).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const validator = createTestValidator("fails");

      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, { useValue: validator });

      return expect(new CQRS().send(createTestRequest())).to.be.rejected;
    });
  });
});
