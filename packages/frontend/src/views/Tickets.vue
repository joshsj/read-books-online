<script setup lang="ts">
import { CreateTicketRequest, TicketDto, TicketState } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketTable from "@frontend/components/ticket/TicketTable.vue";
import ModifyTicketModal from "@frontend/components/ticket/TicketInformationModal.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import { ModifyMode } from "@frontend/utilities/types";
import { onMounted, reactive, ref } from "vue";
import { useBusiness } from "@frontend/plugins/business";
import { FormContext } from "vee-validate";
import { TicketInformationModel } from "@frontend/utilities/ticket";

const { ticketBusiness } = useBusiness();

const { notify } = useInteractor();

const modal = reactive({
  mode: "create" as ModifyMode,
  active: false,
});
const modalForm = ref<
  { form: FormContext<TicketInformationModel> } | undefined
>();
const onModalMain = async () => {
  if (!modalForm.value) {
    return;
  }

  const { information } = modalForm.value.form.values;

  const result = await ticketBusiness.create({
    requestName: "createTicketRequest",
    information,
  });

  result && getTickets();
};

const tickets = ref<TicketDto[]>([]);

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
      <o-button
        v-if="ticketBusiness.canCreate()"
        variant="primary"
        label="Create"
        @click="
          modal.mode = 'create';
          modal.active = true;
        " />
    </view-title>

    <ticket-table :tickets="tickets" @need-tickets="getTickets" />

    <modify-ticket-modal
      ref="modalForm"
      v-model:active="modal.active"
      :mode="modal.mode"
      @main="onModalMain" />
  </div>
</template>
