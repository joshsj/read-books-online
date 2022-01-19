import { AuthorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { ValidatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import {
  createLogger,
  createTestAuthorizer,
  createTestValidator,
} from "@backend/test/unit/utilities";
import { CQRS } from "@core/cqrs";
import { createTestRequest, createTestRequestHandler } from "@core/utilities/test";
import { expect } from "chai";

describe("Behaviors", () => {
  describe("Authorizer", () => {
    const newSut = (authorizers: IRequestAuthorizer<any>[]) =>
      new AuthorizerBehavior(createLogger(), authorizers);

    it("Passes for valid requests", () => {
      const authorizer = createTestAuthorizer("passes");

      const sut = newSut([authorizer]);

      const result = new CQRS([createTestRequestHandler()], [sut]).send(createTestRequest());

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const authorizer = createTestAuthorizer("fails");

      const sut = newSut([authorizer]);

      const result = new CQRS([createTestRequestHandler()], [sut]).send(createTestRequest());

      return expect(result).to.be.rejected;
    });
  });

  describe("Validator", () => {
    const newSut = (validators: IRequestValidator<any>[]) =>
      new ValidatorBehavior(createLogger(), validators);

    it("Passes for valid requests", () => {
      const validator = createTestValidator("passes");

      const sut = newSut([validator]);

      const result = new CQRS([createTestRequestHandler()], [sut]).send(createTestRequest());

      return expect(result).to.be.fulfilled;
    });

    it("Fails for invalid requests", () => {
      const validator = createTestValidator("fails");

      const sut = newSut([validator]);

      const result = new CQRS([createTestRequestHandler()], [sut]).send(createTestRequest());

      return expect(result).to.be.rejected;
    });
  });
});
