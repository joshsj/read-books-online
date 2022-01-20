import { createClientProxy, isRBOError } from "@client/index";
import { RBOClient, RBOClientRequester } from "@client/types";
import { store } from "@frontend/store";

const requester: RBOClientRequester = ({ endpoint, body, method }) => {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (store.user) {
    headers.authorization = `Bearer ${store.user.authenticationToken}`;
  }

  return fetch((store.apiUrl ?? "") + "/" + endpoint, {
    method,
    body,
    headers,
    credentials: "include",
  })
    .then((res) => res.json())
    .catch(() => undefined);
};

const client: RBOClient = createClientProxy([], requester) as RBOClient;

export { client, isRBOError };
