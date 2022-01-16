import { reactive } from "vue";

type Store = {
  pageLoading: boolean;
};

const store = reactive<Store>({ pageLoading: false });

export { store };
