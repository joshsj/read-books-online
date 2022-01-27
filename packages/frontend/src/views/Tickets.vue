<script setup lang="ts">
import { TicketDto, TicketQuery } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketInformationModal from "@frontend/components/ticket/TicketInformationModal.vue";
import TicketPriceModal from "@frontend/components/ticket/TicketPriceModal.vue";
import TicketTable from "@frontend/components/ticket/TicketTable.vue";
import TableFilters from "@frontend/components/ticket/TicketTableFilters.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import {
  TicketInformationModel,
  TicketPriceModel,
} from "@frontend/utilities/forms";
import { EmptyTicketQuery } from "@frontend/utilities/ticket";
import { ModifyMode } from "@frontend/utilities/types";
import { FormContext } from "vee-validate";
import { onMounted, reactive, ref, watch } from "vue";

const { notify } = useInteractor();
const { ticketBusiness } = useBusiness();

const table = reactive({
  items: [] as TicketDto[],
  query: EmptyTicketQuery(),
});

const getTickets = async () => {
  const response = await store.pageLoad(client.ticket.get(table.query));

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  table.items = response;
};

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

    <table-filters v-model:query="table.query" @change="getTickets" />

    <ticket-table
      :tickets="table.items"
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
