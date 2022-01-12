import { Id, newId } from "@/domain/common/id";
import { createClientProxy, IRBOClientConfig, RBOMethod } from "@/web/client";
import { Endpoint, EndpointName } from "@/web/client/types";
import { expect } from "chai";
import { spy } from "sinon";

const config: IRBOClientConfig = {
  baseUrl: "http://client.unit.test.com",
  fetch: () => Promise.resolve({ json: () => Promise.resolve() } as Response),
  authenticationToken: undefined,
};

const fetchSpy = spy(config, "fetch");
const newSut = <T>(c: Partial<IRBOClientConfig> = {}): T => createClientProxy([], { ...config, ...c });
const getResult = (call = 0) => {
  const [url, init] = fetchSpy.getCall(call).args;

  return { url, init };
};

describe("Client", () => {
  beforeEach(() => fetchSpy.resetHistory());

  describe("Configuration", () => {
    it("Uses the configured fetch", async () => {
      const sut = newSut<{ test: Endpoint<"get"> }>();

      await sut.test.get();

      const result = getResult();

      expect(result).not.to.be.null;
    });

    it("Uses the configured authentication token", async () => {
      const authenticationToken = "token";

      const sut = newSut<{ test: Endpoint<"get"> }>({ authenticationToken });

      await sut.test.get();

      const result = getResult();
      const expected = { authentication: `Bearer ${authenticationToken}` };

      expect(result.init?.headers).to.include(expected);
    });

    it("Omits authentication without a token", async () => {
      const sut = newSut<{ test: Endpoint<"get"> }>();

      await sut.test.get();

      const result = getResult();

      expect(result.init).not.to.be.undefined;
      expect(result.init?.headers).to.be.undefined;
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

      expect(result.init?.body).not.to.be.undefined;
      expect(JSON.parse(result.init?.body as string)).to.eql(body);
    });

    it("Omits a body for GET requests", async () => {
      type Body = { name: string };

      const sut = newSut<{ test: Endpoint<"get", Body> }>();
      const body: Body = { name: "poppy" };

      await sut.test.get(body);

      const result = getResult();

      expect(result.init).not.to.be.undefined;
      expect(result.init?.body).to.be.undefined;
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

        expect(result.init).not.to.be.undefined;
        expect(result.init?.method).to.equal(method);
      })
    );
  });
});
