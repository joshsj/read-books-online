<script setup lang="ts">
import RboFormModal from "@frontend/components/general/FormModal.vue";
import { BlankId } from "@frontend/utilities/constants";
import { fieldState, numberFieldMap } from "@frontend/utilities/forms";
import { TicketPriceModel } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";

const emit = defineEmits(["main", "update:active"]);

const form = useForm<TicketPriceModel>({
  validationSchema: TicketPriceModel,
  initialValues: { ticketId: BlankId, price: 0 },
});
const price = useField<number>("price");
const priceMap = numberFieldMap(price);

const onSubmit = form.handleSubmit(() => {
  emit("main");
  emit("update:active", false);
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
      <o-field label="Price" label-for="Price" v-bind="fieldState(price)">
        <o-input
          id="Price"
          name="Price"
          placeholder="Price"
          type="number"
          step="any"
          v-model="priceMap" />
      </o-field>
    </form>
  </rbo-form-modal>
</template>
