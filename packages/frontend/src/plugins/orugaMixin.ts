import { getCurrentInstance } from "vue";

const useOrugaMixin = () => {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("getCurrentInstance() did not return a value");
  }

  return { oruga: vm.appContext.config.globalProperties["$oruga"] };
};

export { useOrugaMixin };
