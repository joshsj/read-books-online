import { getCurrentInstance } from "vue";

type NotifyVariant = "info" | "success" | "danger";

// @oruga-ui\oruga-next\src\utils\NoticeMixin.ts
const defaultConfig = {
  duration: 4000,
  position: "top",
  queue: true,
  closable: true,
};

const useNotifier = () => {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("getCurrentInstance() did not return a value");
  }

  const notify = (message: string, variant: NotifyVariant = "info") => {
    vm.appContext.config.globalProperties["$oruga"].notification.open({
      ...defaultConfig,
      variant,
      message,
    });
  };

  return { notify };
};

export { useNotifier, NotifyVariant };
