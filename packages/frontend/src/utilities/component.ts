import { ComponentInternalInstance, ShallowRef, VNode } from "vue";

type ModalPath = "main" | "other";

type ModifyMode = "create" | "update";

const delayedRef =
  <T = ComponentInternalInstance["exposed"]>(_value: ShallowRef<T>) =>
  (vnode: VNode): void => {
    _value.value = vnode.component?.exposed as T;
  };

export { ModifyMode, ModalPath, delayedRef };
