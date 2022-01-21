import { FieldContext } from "vee-validate";

const fieldState = (context: FieldContext<unknown>) => ({
  message: context.meta.validated ? context.errorMessage.value : undefined,
  variant: context.errorMessage.value ? "danger" : undefined,
});

export { fieldState };
