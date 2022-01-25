<script setup lang="ts">
import { TicketDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketInformationModal from "@frontend/components/ticket/TicketInformationModal.vue";
import TicketTable from "@frontend/components/ticket/TicketTable.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import { TicketInformationModel } from "@frontend/utilities/ticket";
import { ModifyMode } from "@frontend/utilities/types";
import { FormContext } from "vee-validate";
import { onMounted, ref } from "vue";

const { notify } = useInteractor();

const { ticketBusiness } = useBusiness();

const modal = ref<{ form: FormContext<TicketInformationModel> } | undefined>();
const modalActive = ref(false);
const modalMode = ref<ModifyMode>("create");

const onModalMain = async () => {
  if (!modal.value) {
    return;
  }

  const { ticketId, information } = modal.value.form.values;

  const result = await (modalMode.value === "create"
    ? ticketBusiness.create({
        requestName: "createTicketRequest",
        information,
      })
    : ticketBusiness.provideNewInfo({
        requestName: "provideNewInformationRequest",
        ticketId,
        information,
      }));

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

const onCreateClick = () => {
  modalMode.value = "create";
  modalActive.value = true;
};

const onProvideNewInfo = ({ _id, information }: TicketDto) => {
  if (!modal.value) {
    return;
  }

  modal.value.form.values.ticketId = _id;
  modal.value.form.values.information = information;
  modalMode.value = "update";
  modalActive.value = true;
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
        @click="onCreateClick" />
    </view-title>

    <ticket-table
      :tickets="tickets"
      @need-tickets="getTickets"
      @provide-new-info="onProvideNewInfo" />
  </div>

  <ticket-information-modal
    ref="modal"
    v-model:active="modalActive"
    :mode="modalMode"
    @main="onModalMain" />
</template>
