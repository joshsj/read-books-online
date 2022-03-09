import { store } from "@frontend/store";
import { ComponentInternalInstance, ShallowRef, VNode } from "vue";

const delayedRef =
  <T = ComponentInternalInstance["exposed"]>(_value: ShallowRef<T>) =>
  (vnode: VNode): void => {
    _value.value = vnode.component?.exposed as T;
  };

const fakeLoad = () =>
  new Promise<void>((resolve) => {
    store.page.loading = true;

    setTimeout(() => {
      store.page.loading = false;
      resolve();
    }, 150);
  });

const prettyBoolean = (b: boolean) => (b ? "Yes" : "No");

export { delayedRef, fakeLoad, prettyBoolean };
