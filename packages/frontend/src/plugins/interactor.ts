import { isRBOError } from "@client/index";
import { RBOErrorDto } from "@client/types";
import Modal from "@frontend/components/general/Modal.vue";
import { ModalProps } from "@frontend/utilities/types";
import { h, getCurrentInstance, render, VNode } from "vue";
import { useOrugaMixin } from "./orugaMixin";

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

  const modal = <T>(
    props: ModalProps & Record<string, any>,
    payload: T,
    children?: (() => string) | VNode
  ) =>
    new Promise<{ from: "main" | "alt" | "close"; payload: T }>((resolve) => {
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

      const vnode = h(
        Modal,
        {
          ...props,
          active: true,

          onMain: () => {
            resolve({ from: "main", payload });
            destroy();
          },
          onAlt: () => {
            resolve({ from: "alt", payload });
            destroy();
          },
          onClose: () => {
            resolve({ from: "close", payload });
            destroy();
          },
        },
        children
      );

      vnode.appContext = vm.appContext;

      render(vnode, el);
    });

  const confirm = (message: string): Promise<boolean> =>
    modal(
      {
        title: "Confirmation",
        mainButtonText: "Yes",
        mainButtonVariant: "success",
        altButtonText: "No",
      },
      undefined,
      () => message
    ).then(({ from }) => from === "main");

  return { modal, notify, confirm };
};

type Interactor = ReturnType<typeof useInteractor>;

export { useInteractor, NotifyVariant, Interactor };
