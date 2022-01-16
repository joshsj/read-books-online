import { authorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { validatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import {
  createLogger,
  createTestAuthorizer,
  createTestValidator,
} from "@backend/test/unit/utilities";
import { CQRS } from "@core/cqrs";
import { createTestRequest, createTestRequestHandler, TestRequest } from "@core/utilities/test";
import { expect } from "chai";
import { container } from "tsyringe";

describe("Behaviors", () => {
  beforeEach(() => {
    container.clearInstances();

    container.register<ILogger>(Dependency.logger, { useValue: createLogger() });
  });

  describe("Authorizer", () => {
    it("Passes for valid requests", () => {
      const authorizer = createTestAuthorizer("passes");
      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, {
        useValue: authorizer,
      });

      const result = new CQRS([createTestRequestHandler()], [authorizerBehavior]).send(
        createTestRequest()
      );

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const authorizer = createTestAuthorizer("fails");
      container.register<IRequestAuthorizer<TestRequest>>(Dependency.requestAuthorizer, {
        useValue: authorizer,
      });

      const result = new CQRS([createTestRequestHandler()], [authorizerBehavior]).send(
        createTestRequest()
      );

      return expect(result).to.be.rejected;
    });
  });

  describe("Validator", () => {
    it("Passes for valid requests", () => {
      const validator = createTestValidator("passes");
      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, {
        useValue: validator,
      });
      const result = new CQRS([createTestRequestHandler()], [validatorBehavior]).send(
        createTestRequest()
      );

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const validator = createTestValidator("fails");
      container.register<IRequestValidator<TestRequest>>(Dependency.requestValidator, {
        useValue: validator,
      });

      const result = new CQRS([createTestRequestHandler()], [validatorBehavior]).send(
        createTestRequest()
      );

      return expect(result).to.be.rejected;
    });
  });
});
