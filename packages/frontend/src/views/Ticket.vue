<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { client } from "@frontend/client";
import { useNotifier } from "@frontend/plugins/notifier";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { notify } = useNotifier();
const router = useRouter();
const props = defineProps({ ticketId: { type: String, required: true } });

const ticket = ref<TicketDto | undefined>();

onMounted(async () => {
  const response = await store.pageLoad(client.ticket.get(props.ticketId));

  if (isRBOError(response)) {
    notify(response);
    router.back();
    return;
  }

  ticket.value = response;
});
</script>

<template>
  <div v-if="ticket" class="container">
    <div class="columns is-6">
      <div class="column">
        <div class="content">
          <h1 class="title">Ticket</h1>

          <strong>Information</strong>
          <p>{{ ticket.information }}</p>
        </div>
      </div>

      <div class="column is-1" />

      <div class="column is-5">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <div class="tile is-child notification is-success">
              <strong>Created</strong>

              <p>
                By
                <router-link :to="route({ name: 'account' })">
                  {{ ticket.createdBy.username }}
                </router-link>
                at {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
