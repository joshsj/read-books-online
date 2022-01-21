import { isRBOError } from "@client/index";
import { RBOErrorDto } from "@client/types";
import { getCurrentInstance } from "vue";
import { useOrugaMixin } from "./orugaMixin";

type NotifyVariant = "info" | "success" | "danger";
type NotifyDuration = keyof typeof durations;
type NotifyOptions = {
  message: string;
  variant: NotifyVariant;
  duration: NotifyDuration;
};

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

  const notify = (options: NotifyOptions | RBOErrorDto) => {
    const { variant, duration } = isRBOError(options)
      ? { variant: "danger", duration: durations["long"] }
      : { variant: options.variant, duration: durations[options.duration] };

    oruga.notification.open({
      ...defaultConfig,
      variant,
      duration,
      message: options.message,
    });
  };

  return { notify };
};

export { useNotifier, NotifyVariant };
