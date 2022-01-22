<script setup lang="ts">
import { CreateTicketRequest } from "@client/models";
import { fieldState } from "@frontend/utilities/forms";
import { FormContext, useField, useForm } from "vee-validate";

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
    <o-field v-bind="fieldState(information)">
      <template #label>
        Information
        <o-tooltip label="ISBN, Title, Year, Author" position="right">
          <o-icon icon="information" size="small" />
        </o-tooltip>
      </template>

      <template #default>
        <o-input
          id="Information"
          name="Information"
          placeholder="Information"
          type="textarea"
          v-model="information.value" />
      </template>
    </o-field>
  </form>
</template>

<style scoped>
#Information {
  height: 4em;
}
</style>
