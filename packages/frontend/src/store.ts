import { reactive } from "vue";

type Store = {
  pageLoading: boolean;
  apiUrl: string | undefined;
  authenticationToken: string | undefined;
};

const store = reactive<Store>({
  pageLoading: false,
  apiUrl: undefined,
  authenticationToken: undefined,
});

export { store };
