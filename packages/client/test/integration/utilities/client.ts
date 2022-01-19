import { createClientProxy, isRBOError } from "@client/index";
import { AccountDto } from "@client/models";
import { RBOClient, RBOClientRequester } from "@client/types";
import fetch from "node-fetch";
import { EOL } from "os";
import { getConfiguration } from "./configuration";

const getClient = () => {
  let authenticationToken: string | undefined = undefined;

  const requester: RBOClientRequester = ({ endpoint, method, body, defaultHeaders }) => {
    const { apiUrl } = getConfiguration();

    const headers = { ...defaultHeaders };

    if (authenticationToken) {
      headers.authorization = `Bearer ${authenticationToken}`;
    }

    return fetch(apiUrl + "/" + endpoint, { method, body, headers })
      .then((res) => res.json())
      .catch(() => undefined);
  };

  const client: RBOClient = createClientProxy([], requester) as RBOClient;

  const authenticate = async (account: AccountDto): Promise<void> => {
    const response = await client.auth.post(account);

    if (isRBOError(response)) {
      throw new Error(
        `Failed to authenticate using ${Object.values(account).join(", ")}` + EOL + response.message
      );
    }

    authenticationToken = response.token;
  };

  const unauthenticate = (): void => (authenticationToken = undefined);

  return { client, authenticate, unauthenticate };
};

export { getClient };
