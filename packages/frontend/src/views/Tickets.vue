<script setup lang="ts">
import { CreateTicketRequest, TicketDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketCreateModal from "@frontend/components/ticket/TicketCreateModal.vue";
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
import { FormContext } from "vee-validate";
import { onMounted, ref } from "vue";

const { notify } = useInteractor();
const { ticketBusiness } = useBusiness();

const table = ref({
  items: [] as TicketDto[],
  query: EmptyTicketQuery(),
});

const modals = ref({
  create: {
    active: false,

    onMain: async () => {
      if (!createModalRef.value) {
        return;
      }

      const result = await ticketBusiness.create(
        createModalRef.value.form.values
      );

      result && getTickets();
    },
  },

  info: {
    active: false,

    onMain: async () => {
      if (!infoModalRef.value) {
        return;
      }

      const { ticketId, information } = infoModalRef.value.form.values;

      const result = await ticketBusiness.complete({
        requestName: "completeTicketRequest",
        ticketId,
        information,
      });

      result && getTickets();
    },
  },

  price: {
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
  },
});
const createModalRef = ref<
  { form: FormContext<CreateTicketRequest> } | undefined
>();
const infoModalRef = ref<
  { form: FormContext<TicketInformationModel> } | undefined
>();
const priceModalRef = ref<
  { form: FormContext<TicketPriceModel> } | undefined
>();

const getTickets = async () => {
  const response = await store.pageLoad(client.ticket.get(table.value.query));

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  table.value.items = response;
};

const onCreateClick = () => {
  modals.value.create.active = true;
};

const onCompleteClick = ({ _id, information }: TicketDto) => {
  if (!infoModalRef.value) {
    return;
  }

  infoModalRef.value.form.values.ticketId = _id;
  infoModalRef.value.form.values.information = information;

  modals.value.info.active = true;
};

const onSubmitPriceClick = ({ _id }: TicketDto) => {
  if (!priceModalRef.value) {
    return;
  }

  priceModalRef.value.form.values.ticketId = _id;
  modals.value.price.active = true;
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

    <ticket-create-modal
      ref="createModalRef"
      v-model:active="modals.create.active"
      @main="modals.create.onMain" />

    <ticket-information-modal
      ref="infoModalRef"
      v-model:active="modals.info.active"
      @main="modals.info.onMain" />

    <ticket-price-modal
      ref="priceModalRef"
      v-model:active="modals.price.active"
      @main="modals.price.onMain" />
  </div>
</template>
