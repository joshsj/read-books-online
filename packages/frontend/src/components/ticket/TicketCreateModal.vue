<script setup lang="ts">
import {
  CreateTicketRequest,
  TicketFormat,
  TicketFormats,
} from "@client/models";
import { capitalize } from "@core/utilities/string";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import { fieldState } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";

const emit = defineEmits(["main"]);

const form = useForm<CreateTicketRequest>({
  validationSchema: CreateTicketRequest,
  initialValues: { requestName: "createTicketRequest" } as CreateTicketRequest,
});
const format = useField<TicketFormat>("format");
const information = useField<string>("information");

const onSubmit = form.handleSubmit(() => {
  emit("main");
  form.resetForm();
});

defineExpose({ form });
</script>

<template>
  <rbo-form-modal
    entity="Ticket"
    :valid="form.meta.value.valid ?? true"
    @main="onSubmit">
    <form @submit="onSubmit">
      <o-field label="Format" v-bind="fieldState(format)">
        <o-radio
          v-for="tf in TicketFormats"
          :native-value="tf"
          v-model="format.value"
          name="Format"
          :checked="tf === 'book' ? true : false">
          {{ capitalize(tf) }}
        </o-radio>
      </o-field>

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
  </rbo-form-modal>
</template>

<style scoped>
#Information {
  height: 5rem;
}
</style>
