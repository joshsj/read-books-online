import { reactive } from "vue";

type UserStore = Readonly<{
  authenticationToken: string;
  username: string;
}>;

type Store = {
  pageLoading: boolean;
  apiUrl: string | undefined;

  user: UserStore | undefined;
};

const store = reactive<Store>({
  pageLoading: false,
  apiUrl: undefined,
  user: undefined,
});

export { store, Store, UserStore };
