import { isRBOError } from "@client/index";
import { RBOErrorDto } from "@client/types";
import { createApp, getCurrentInstance, createVNode, render, RootRenderFunction } from "vue";
import { useOrugaMixin } from "./orugaMixin";
import Modal from "@frontend/components/general/Modal.vue";

type NotifyVariant = "info" | "success" | "danger";
type NotifyDuration = keyof typeof durations;
type NotifyOptions = {
  message: string;
  variant: NotifyVariant;
  duration?: NotifyDuration;
};

// @oruga-ui\oruga-next\src\utils\NoticeMixin.ts
const defaultNoticeConfig = {
  position: "top",
  queue: true,
  closable: true,
};

const durations = { short: 1500, long: 3500 };

const useInteractor = () => {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("getCurrentInstance() did not return a value");
  }

  const { oruga } = useOrugaMixin();

  const notify = (options: NotifyOptions | RBOErrorDto) => {
    const { variant, duration } = isRBOError(options)
      ? { variant: "danger", duration: durations["long"] }
      : { variant: options.variant, duration: durations[options.duration ?? "long"] };

    oruga.notification.open({
      ...defaultNoticeConfig,
      variant,
      duration,
      message: options.message,
    });
  };

  const confirm = (message: string) =>
    new Promise<boolean>((resolve) => {
      const el: Element = (() => {
        const rootEl = vm.vnode.el as Element;
        const childEl = document.createElement("div");
        rootEl.appendChild(childEl);
        return childEl;
      })();

      const destroy = () => {
        // Oruga doesn't provide a 'closed' listener,
        // so a timeout is required to allow the animation
        setTimeout(() => render(null, el), 100);
      };

      const vnode = createVNode(
        Modal,

        {
          title: "Confirmation",
          mainButtonText: "Yes",
          mainButtonVariant: "success",
          altButtonText: "No",
          altButtonVariant: "danger",
          active: true,

          onMain: () => {
            resolve(true);
            destroy();
          },
          onAlt: () => {
            resolve(false);
            destroy();
          },
        },
        () => message
      );

      vnode.appContext = vm.appContext;

      render(vnode, el);
    });

  return { notify, confirm };
};

export { useInteractor, NotifyVariant };
