import { Id, newId } from "@backend/domain/common/id";
import { createClientProxy } from "@client/index";
import { RBOClientMethod, RBOClientRequester } from "@client/types";
import { Endpoint, EndpointName } from "@client/types";
import { expect } from "chai";
import { spy } from "sinon";

type TestResult = { value: string };
const TestResult = { value: "result" };

const requester = spy<RBOClientRequester>(() => Promise.resolve(TestResult));

const newSut = <T>(): T => createClientProxy([], requester) as T;

const getRequesterInvocation = (call = 0) => requester.getCall(call).args[0];

describe("Client", () => {
  beforeEach(() => requester.resetHistory());

  describe("Configuration", () => {
    it("Uses the configured callback", async () => {
      const sut = newSut<{ test: Endpoint<"get", void, TestResult> }>();

      const clientResult = await sut.test.get();
      const invocation = getRequesterInvocation();

      expect(invocation).not.to.be.null;
      expect(clientResult).to.eql(TestResult);
    });
  });

  describe("URL", () => {
    it("Composes the correct endpoint", async () => {
      const sut = newSut<{ deep: { nested: { endpoint: Endpoint<"create"> } } }>();

      await sut.deep.nested.endpoint.create();

      const invocation = getRequesterInvocation();
      const expected = "deep/nested/endpoint";

      expect(invocation.endpoint).to.equal(expected);
    });

    it("Composes URL parameters", async () => {
      const id = newId();
      const sut = newSut<{ test: Endpoint<"get", Id> }>();

      await sut.test.get(id);

      const invocation = getRequesterInvocation();
      const expected = `test/${id}`;

      expect(invocation.endpoint).to.equal(expected);
    });

    it("Composes query parameters for GET requests", async () => {
      type Query = { pageSize: number };

      const sut = newSut<{ test: Endpoint<"get", Query> }>();

      await sut.test.get({ pageSize: 20 });

      const invocation = getRequesterInvocation();
      const expected = "test?pageSize=20";

      expect(invocation.endpoint).to.equal(expected);
    });
  });

  describe("Body", () => {
    it("Provides a body for non-GET requests", async () => {
      type Body = { name: string };

      const sut = newSut<{ test: Endpoint<"update", Body> }>();
      const body: Body = { name: "poppy" };

      await sut.test.update(body);

      const invocation = getRequesterInvocation();

      expect(invocation.body).not.to.be.undefined;
      expect(JSON.parse(invocation.body as string)).to.eql(body);
    });

    it("Omits a body for GET requests", async () => {
      type Body = { name: string };

      const sut = newSut<{ test: Endpoint<"get", Body> }>();
      const body: Body = { name: "poppy" };

      await sut.test.get(body);

      const invocation = getRequesterInvocation();

      expect(invocation).not.to.be.undefined;
      expect(invocation.body).to.be.undefined;
    });
  });

  describe("Verb", () => {
    const runs: { [K in EndpointName]: RBOClientMethod } = {
      get: "GET",
      post: "POST",
      create: "POST",
      put: "PUT",
      update: "PUT",
      delete: "DELETE",
    };

    Object.entries(runs).forEach(([endpointName, method]) =>
      it(`Resolves the correct HTTP verb for '${endpointName}'`, async () => {
        const sut = newSut<{ test: Endpoint<EndpointName> }>();

        await sut.test[endpointName as EndpointName]();

        const invocation = getRequesterInvocation();

        expect(invocation).not.to.be.undefined;
        expect(invocation.method).to.equal(method);
      })
    );
  });
});
