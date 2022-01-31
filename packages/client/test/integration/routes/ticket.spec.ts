import { isRBOError } from "@client/index";
import { CreateTicketRequest } from "@client/models";
import { getClient } from "@client/test/integration/utilities/client";
import { getConfiguration } from "@client/test/integration/utilities/configuration";
import { RBOErrorDto } from "@client/types";
import { expect } from "chai";

describe("Ticket", () => {
  const { clientUser, employeeUser } = getConfiguration();

  const createRequest = (information: string): CreateTicketRequest => ({
    requestName: "createTicketRequest",
    format: "book",
    information,
  });

  describe("POST", () => {
    it("Returns a valid response", async () => {
      const { client, authenticate } = getClient();
      await authenticate(clientUser);

      const response = client.ticket.create(createRequest("valid"));

      return expect(response).eventually.to.be.undefined;
    });

    it("Fails without authentication", () => {
      const { client } = getClient();

      const response = client.ticket.create(createRequest("no authentication"));
      const expected: Partial<RBOErrorDto> = { type: "authentication" };

      return expect(response).eventually.to.include(expected);
    });

    it("Fails without client role", async () => {
      const { client, authenticate } = getClient();
      await authenticate(employeeUser);

      const response = client.ticket.create(createRequest("wrong role"));
      const expected: Partial<RBOErrorDto> = { type: "authentication" };

      return expect(response).eventually.to.satisfy(isRBOError).include(expected);
    });

    it("Fails with an invalid request", async () => {
      const { client, authenticate } = getClient();
      await authenticate(clientUser);

      const request: CreateTicketRequest = {
        requestName: "createTicketRequest",
        format: "book",
        information: undefined as any,
      };

      const response = client.ticket.create(request);
      const expected: Partial<RBOErrorDto> = { type: "validation" };

      return expect(response).eventually.to.satisfy(isRBOError).and.include(expected);
    });
  });
});
