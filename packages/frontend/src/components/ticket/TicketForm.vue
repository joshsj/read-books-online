<script setup lang="ts">
import { CreateTicketRequest } from "@client/models";
import { ModifyMode } from "@frontend/utilities/component";
import { fieldState } from "@frontend/utilities/forms";
import { FormContext, useField, useForm } from "vee-validate";
import { PropType } from "vue";

defineProps({
  mode: {
    type: String as PropType<ModifyMode>,
    required: true,
  },
});

const form = useForm<CreateTicketRequest>({
  validationSchema: CreateTicketRequest,
  initialValues: { requestName: "createTicketRequest", information: "" },
});
const information = useField<string>("information");

const onSubmit = form.handleSubmit(() => void 0);

defineExpose<Exposed>({ form });

export type Exposed = { form: FormContext<CreateTicketRequest> };
</script>

<template>
  <form @submit="onSubmit">
    <o-field
      label="Information"
      label-for="Information"
      v-bind="fieldState(information)">
      <o-input
        id="Information"
        name="Information"
        placeholder="Information"
        v-model="information.value" />
    </o-field>
  </form>
</template>
