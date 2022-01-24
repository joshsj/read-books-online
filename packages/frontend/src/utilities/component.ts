import { store } from "@frontend/store";
import { ComponentInternalInstance, ShallowRef, VNode } from "vue";

const delayedRef =
  <T = ComponentInternalInstance["exposed"]>(_value: ShallowRef<T>) =>
  (vnode: VNode): void => {
    _value.value = vnode.component?.exposed as T;
  };

const fakeLoad = () =>
  new Promise<void>((resolve) => {
    store.pageLoading = true;

    setTimeout(() => {
      store.pageLoading = false;
      resolve();
    }, 150);
  });

export { delayedRef, fakeLoad };
