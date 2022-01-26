<script setup lang="ts">
import { TicketDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketInformationModal from "@frontend/components/ticket/TicketInformationModal.vue";
import TicketPriceModal from "@frontend/components/ticket/TicketPriceModal.vue";
import TicketTable from "@frontend/components/ticket/TicketTable.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import {
  TicketInformationModel,
  TicketPriceModel,
} from "@frontend/utilities/forms";
import { ModifyMode } from "@frontend/utilities/types";
import { FormContext } from "vee-validate";
import { onMounted, reactive, ref } from "vue";

const { notify } = useInteractor();
const { ticketBusiness } = useBusiness();

const tableSimpleColumns = ref<boolean>(false);

const infoModalRef = ref<
  { form: FormContext<TicketInformationModel> } | undefined
>();
const infoModal = reactive({
  active: false,
  mode: "create" as ModifyMode,

  onMain: async () => {
    if (!infoModalRef.value) {
      return;
    }

    const { ticketId, information } = infoModalRef.value.form.values;

    const result = await (infoModal.mode === "create"
      ? ticketBusiness.create({
          requestName: "createTicketRequest",
          information,
        })
      : ticketBusiness.complete({
          requestName: "completeTicketRequest",
          ticketId,
          information,
        }));

    result && getTickets();
  },
});

const priceModalRef = ref<
  { form: FormContext<TicketPriceModel> } | undefined
>();
const priceModal = reactive({
  active: false,

  onMain: async () => {
    if (!priceModalRef.value) {
      return;
    }

    const { ticketId, price } = priceModalRef.value.form.values;

    const result = await ticketBusiness.submitPrice({
      requestName: "submitTicketPriceRequest",
      ticketId,
      price,
    });

    result && getTickets();
  },
});

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
  infoModal.mode = "create";
  infoModal.active = true;
};

const onCompleteClick = ({ _id, information }: TicketDto) => {
  if (!infoModalRef.value) {
    return;
  }

  infoModalRef.value.form.values.ticketId = _id;
  infoModalRef.value.form.values.information = information;

  infoModal.mode = "update";
  infoModal.active = true;
};

const onSubmitPriceClick = ({ _id }: TicketDto) => {
  if (!priceModalRef.value) {
    return;
  }

  priceModalRef.value.form.values.ticketId = _id;
  priceModal.active = true;
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

    <div class="block">
      <o-switch variant="info" v-model="tableSimpleColumns">
        Simple Columns
      </o-switch>
    </div>

    <ticket-table
      :tickets="tickets"
      :simple-columns="tableSimpleColumns"
      @need-tickets="getTickets"
      @complete="onCompleteClick"
      @submit-price="onSubmitPriceClick" />

    <ticket-information-modal
      ref="infoModalRef"
      v-model:active="infoModal.active"
      :mode="infoModal.mode"
      @main="infoModal.onMain" />

    <ticket-price-modal
      ref="priceModalRef"
      v-model:active="priceModal.active"
      @main="priceModal.onMain" />
  </div>
</template>
