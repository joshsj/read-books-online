import { getCurrentInstance } from "vue";
import { useOrugaMixin } from "./orugaMixin";

type NotifyVariant = "info" | "success" | "danger";
type NotifyDuration = keyof typeof durations;

// @oruga-ui\oruga-next\src\utils\NoticeMixin.ts
const defaultConfig = {
  position: "top",
  queue: true,
  closable: true,
};

const durations = { short: 1500, long: 3500 };

const useNotifier = () => {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("getCurrentInstance() did not return a value");
  }

  const { oruga } = useOrugaMixin();

  const notify = (
    message: string,
    variant: NotifyVariant = "info",
    duration: NotifyDuration = "long"
  ) => {
    oruga.notification.open({
      ...defaultConfig,
      duration: durations[duration],
      variant,
      message,
    });
  };

  return { notify };
};

export { useNotifier, NotifyVariant };
