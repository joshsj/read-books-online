import { FieldContext } from "vee-validate";

const fieldState = (context: FieldContext<unknown>) => ({
  variant: context.errorMessage.value ? "danger" : undefined,
  message: context.meta.touched ? context.errorMessage.value : undefined,
});

export { fieldState };
