<script setup lang="ts">
import { TicketDto, TicketState } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketTable from "@frontend/components/ticket/TicketTable.vue";
import RboTicketForm, {
  Exposed,
} from "@frontend/components/ticket/TicketForm.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import { delayedRef } from "@frontend/utilities/component";
import { ModifyMode } from "@frontend/utilities/types";
import { onMounted, reactive, ref, shallowRef } from "vue";

const { notify } = useInteractor();

const modal = reactive({
  mode: "create" as ModifyMode,
  showing: false,
  loading: false,
});
const ticketForm = shallowRef<Exposed | undefined>(undefined);
const getFormRef = delayedRef(ticketForm);
const tickets = ref<TicketDto[]>([]);

const createTicket = async () => {
  if (!ticketForm.value) {
    return;
  }
  const { form } = ticketForm.value;
  const response = await client.ticket.create(form.values);

  if (response) {
    notify(response);
    return;
  }

  modal.showing = false;
  form.resetForm();
  notify({ message: "Ticket created", variant: "success", duration: "short" });
  getTickets();
};

const getTickets = async () => {
  const response = await store.pageLoad(
    client.ticket.get({
      filter: {
        created: {
          by: store.user!.roles.every((r) => r === "client")
            ? [store.user!._id]
            : [],
        },
      },
    })
  );

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  tickets.value = response;
};

onMounted(getTickets);
</script>

<template>
  <div class="container">
    <view-title title="Tickets">
      <o-button variant="primary" @click="modal.showing = true">
        Create
      </o-button>
    </view-title>

    <ticket-table :tickets="tickets" @need-tickets="getTickets" />

    <rbo-form-modal
      id="modify-ticket-modal"
      entity="Ticket"
      v-model:active="modal.showing"
      :mode="modal.mode"
      :valid="ticketForm?.form?.meta?.value?.valid ?? true"
      :loading="modal.loading"
      @main="createTicket">
      <rbo-ticket-form @vnode-mounted="getFormRef" />
    </rbo-form-modal>
  </div>
</template>

<style>
#modify-ticket-modal textarea {
  height: 5rem;
}
</style>
