import { Id, newId } from "@backend/domain/common/id";
import { createClientProxy, IRBOClientConfig, RBOMethod } from "@client/index";
import { Endpoint, EndpointName } from "@client/types";
import { expect } from "chai";
import { spy } from "sinon";

const config: IRBOClientConfig = {
  callback: () => Promise.resolve(),
  baseUrl: "http://client.unit.test.com",
};

const callbackSpy = spy(config, "callback");

const newSut = <T>(c: Partial<IRBOClientConfig> = {}): T =>
  createClientProxy([], { ...config, ...c });

const getResult = (call = 0) => callbackSpy.getCall(call).args[0];

describe("Client", () => {
  beforeEach(() => callbackSpy.resetHistory());

  describe("Configuration", () => {
    it("Uses the configured callback", async () => {
      const sut = newSut<{ test: Endpoint<"get"> }>();

      await sut.test.get();

      const result = getResult();

      expect(result).not.to.be.null;
    });
  });

  describe("URL", () => {
    it("Composes the correct endpoint", async () => {
      const sut = newSut<{ deep: { nested: { endpoint: Endpoint<"create"> } } }>();

      await sut.deep.nested.endpoint.create();

      const result = getResult();
      const expected = `${config.baseUrl}\/deep\/nested\/endpoint`;

      expect(result.url).to.equal(expected);
    });

    it("Composes URL parameters", async () => {
      const id = newId();
      const sut = newSut<{ test: Endpoint<"get", Id> }>();

      await sut.test.get(id);

      const result = getResult();
      const expected = `${config.baseUrl}/test/${id}`;

      expect(result.url).to.equal(expected);
    });

    it("Composes query parameters for GET requests", async () => {
      type Query = { pageSize: number };

      const sut = newSut<{ test: Endpoint<"get", Query> }>();

      await sut.test.get({ pageSize: 20 });

      const result = getResult();
      const expected = `${config.baseUrl}/test?pageSize=20`;

      expect(result.url).to.equal(expected);
    });
  });

  describe("Body", () => {
    it("Provides a body for non-GET requests", async () => {
      type Body = { name: string };

      const sut = newSut<{ test: Endpoint<"update", Body> }>();
      const body: Body = { name: "poppy" };

      await sut.test.update(body);

      const result = getResult();

      expect(result.body).not.to.be.undefined;
      expect(JSON.parse(result.body as string)).to.eql(body);
    });

    it("Omits a body for GET requests", async () => {
      type Body = { name: string };

      const sut = newSut<{ test: Endpoint<"get", Body> }>();
      const body: Body = { name: "poppy" };

      await sut.test.get(body);

      const result = getResult();

      expect(result).not.to.be.undefined;
      expect(result.body).to.be.undefined;
    });
  });

  describe("Verb", () => {
    const runs: { [K in EndpointName]: RBOMethod } = {
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

        const result = getResult();

        expect(result).not.to.be.undefined;
        expect(result.method).to.equal(method);
      })
    );
  });
});
