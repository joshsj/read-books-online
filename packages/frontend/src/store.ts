import { Id, Role } from "@client/models";
import { reactive, UnwrapNestedRefs, watch } from "vue";
import { socket } from "./socket";

type UserStore = Readonly<{
  authenticationToken: string;
  _id: Id;
  username: string;
  roles: Role[];
}>;

type Store = {
  pageLoading: boolean;
  pageLoad: <T>(p: Promise<T>) => Promise<T>;

  apiUrl: string | undefined;

  user: UserStore | undefined;
};

const store: UnwrapNestedRefs<Store> = reactive<Store>({
  pageLoading: false,
  pageLoad: (p) => {
    store.pageLoading = true;

    return p.finally(() => (store.pageLoading = false));
  },

  apiUrl: undefined,
  user: undefined,
});

watch(
  () => store.user,
  (x) => socket[x ? "open" : "close"]()
);

export { store, Store, UserStore };
