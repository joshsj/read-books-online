import { createClientProxy, isRBOError } from "@client/index";
import { RBOClient, RBOClientRequester } from "@client/types";
import { store } from "@frontend/store";

const requester: RBOClientRequester = ({ endpoint, body, method }) => {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (store.authenticationToken) {
    headers["authentication"] = `Bearer ${store.authenticationToken}`;
  }

  return fetch((store.apiUrl ?? "") + "/" + endpoint, { method, body, headers }).then((res) =>
    res.json()
  );
};

const client: RBOClient = createClientProxy([], requester) as RBOClient;

export { client, isRBOError };
