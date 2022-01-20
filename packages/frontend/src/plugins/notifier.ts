import { getCurrentInstance } from "vue";
import { useOrugaMixin } from "./orugaMixin";

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

  const { oruga } = useOrugaMixin();

  const notify = (message: string, variant: NotifyVariant = "info") => {
    oruga.notification.open({
      ...defaultConfig,
      variant,
      message,
    });
  };

  return { notify };
};

export { useNotifier, NotifyVariant };
