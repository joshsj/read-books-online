import { createClientProxy, isRBOError } from "@client/index";
import { RBOClient, RBOClientRequester } from "@client/types";
import { store } from "@frontend/store";

const ApiDateFormatPattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

const reviver: Parameters<typeof JSON.parse>[1] = ({}, value) =>
  ApiDateFormatPattern.test(value) ? new Date(value) : value;

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
    .then((res) => res.text())
    .then((text) => JSON.parse(text, reviver))
    .catch(() => undefined);
};

const client: RBOClient = createClientProxy([], requester) as RBOClient;

export { client, isRBOError };
