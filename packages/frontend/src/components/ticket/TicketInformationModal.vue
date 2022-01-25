<script setup lang="ts">
import RboFormModal from "@frontend/components/general/FormModal.vue";
import { fieldState } from "@frontend/utilities/forms";
import { TicketInformationModel } from "@frontend/utilities/ticket";
import { useField, useForm } from "vee-validate";

const emit = defineEmits(["main"]);

const form = useForm<TicketInformationModel>({
  validationSchema: TicketInformationModel,
});
const information = useField<string>("information");

const onSubmit = form.handleSubmit(() => emit("main"));

defineExpose({ form });
</script>

<template>
  <rbo-form-modal
    entity="Ticket"
    :valid="form.meta.value.valid ?? true"
    @main="onSubmit">
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
  </rbo-form-modal>
</template>

<style scoped>
#Information {
  height: 5rem;
}
</style>
