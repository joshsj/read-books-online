<script setup lang="ts">
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { truncate } from "@core/utilities/string";
import Username from "@frontend/components/general/Username.vue";
import { useBusiness } from "@frontend/plugins/business";
import { route } from "@frontend/router";
import { PropType } from "vue";
import StateTag from "@frontend/components/ticket/TicketStateTag.vue";

defineProps({
  tickets: {
    type: Object as PropType<TicketDto[]>,
    required: true,
  },
  simpleColumns: { type: Boolean, default: false },
});

const emit = defineEmits(["needTickets", "complete", "submitPrice"]);

const { ticketBusiness } = useBusiness();
</script>

<template>
  <o-table :data="tickets" narrowed>
    <o-table-column label="Information" :width="simpleColumns ? '75%' : '50%'">
      <template v-slot="{ row: { information } }">
        <span>
          {{ truncate(information, 200) }}
        </span>
      </template>
    </o-table-column>

    <template v-if="simpleColumns">
      <o-table-column label="Status">
        <template v-slot="{ row: { states } }">
          <state-tag :state="states.at(-1)!" fallback />
        </template>
      </o-table-column>
    </template>

    <template v-else>
      <o-table-column label="Creation">
        <template v-slot="{ row: { created } }">
          <span>
            <username :username="created.by.username" />
            <br />
            <small>{{ formatDate(created.at, "date") }}</small>
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Allocation">
        <template v-slot="{ row: { allocated } }">
          <span v-if="allocated">
            <username :username="allocated.to.username" />
            <br />
            <small>{{ formatDate(allocated.at, "date") }}</small>
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Review">
        <template v-slot="{ row: { reviewed } }">
          <span v-if="reviewed">
            <state-tag :state="reviewed.state" />
            <br />
            <small>{{ formatDate(reviewed.at, "date") }}</small>
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Price">
        <template v-slot="{ row: { priced } }">
          <span v-if="priced">
            {{ priced.value.toFixed(2) }}

            <br />
            <small>{{ formatDate(priced.at, "date") }}</small>
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Authorization">
        <template v-slot="{ row: { authorized } }">
          <span v-if="authorized">
            <state-tag :state="authorized.state" />

            <br />
            <small>{{ formatDate(authorized.at, "date") }}</small>
          </span>
        </template>
      </o-table-column>
    </template>

    <o-table-column label="Actions" position="centered" width="7.5%">
      <template v-slot="{ index, row: ticket }">
        <o-dropdown
          :position="`${index >= tickets.length / 2 ? 'top' : 'bottom'}-left`">
          <template #trigger>
            <o-button variant="info" outlined icon-right="chevron-down" />
          </template>

          <router-link
            :to="route({ name: 'ticket', ticketId: ticket._id })"
            custom
            v-slot="{ navigate }">
            <o-dropdown-item tag="a" @click="navigate">View</o-dropdown-item>
          </router-link>

          <o-dropdown-item
            v-if="ticketBusiness.canAllocate(ticket)"
            @click="
              ticketBusiness
                .allocate(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Allocate
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canReview(ticket)"
            @click="
              ticketBusiness
                .review(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Review
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canComplete(ticket)"
            @click="emit('complete', ticket)">
            Complete
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canSubmitPrice(ticket)"
            @click="emit('submitPrice', ticket)">
            Submit Price
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canAuthorize(ticket)"
            @click="
              ticketBusiness
                .authorize(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Authorize
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canCancel(ticket)"
            @click="
              ticketBusiness
                .cancel(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Cancel
          </o-dropdown-item>
        </o-dropdown>
      </template>
    </o-table-column>

    <template #empty>
      <div class="notification is-info is-light" v-if="!tickets.length">
        No tickets found
      </div>
    </template>
  </o-table>
</template>
