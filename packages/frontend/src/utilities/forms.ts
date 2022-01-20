import { FieldContext } from "vee-validate";
import { computed } from "vue";

const fieldState = (context: FieldContext<unknown>) => ({
  message: context.meta.validated ? context.errorMessage.value : undefined,
  variant: context.errorMessage.value ? "danger" : undefined,
});

const useFieldState = () => ({
  fieldState: (context: FieldContext<unknown>) => computed(() => ({ ...fieldState(context) })),
});

export { fieldState, useFieldState };
