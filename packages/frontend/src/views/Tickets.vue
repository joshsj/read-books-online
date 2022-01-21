<script setup lang="ts">
import { client, isRBOError } from "@frontend/client";
import { TicketDto, TicketQuery } from "@client/models";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import RboTicketForm, {
  Exposed,
} from "@frontend/components/ticket/TicketForm.vue";
import { useNotifier } from "@frontend/plugins/notifier";
import { delayedRef, ModifyMode } from "@frontend/utilities/component";
import { onMounted, reactive, ref, shallowRef } from "vue";

const { notify } = useNotifier();

const mode = ref<ModifyMode>("create");
const modal = reactive({ showing: false, loading: false });
const exposed = shallowRef<Exposed | undefined>(undefined);
const getRef = delayedRef(exposed);

const save = async () => {
  if (!exposed.value) {
    return;
  }
  const { form } = exposed.value;
  const response = await client.ticket.create(form.values);

  if (response) {
    notify(response);
    return;
  }

  modal.showing = false;
  form.resetForm();
  notify({ message: "Ticket created", variant: "success", duration: "short" });
};

const tickets = ref<TicketDto[]>([]);

onMounted(async () => {
  const response = await client.ticket.get({
    filter: {
      createdAt: {},
      createdBy: ["61eb09354504c108d174b537"],
    },
  });

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  tickets.value = response;
});
</script>

<template>
  <div class="container">
    <h1 class="title">Tickets</h1>

    {{ tickets }}

    <o-button @click="modal.showing = true">Create</o-button>

    <rbo-form-modal
      entity="Ticket"
      v-model:active="modal.showing"
      :mode="mode"
      :valid="exposed?.form?.meta?.value?.valid ?? true"
      :loading="modal.loading"
      @main="save">
      <rbo-ticket-form :mode="mode" @vnode-mounted="getRef" />
    </rbo-form-modal>
  </div>
</template>
