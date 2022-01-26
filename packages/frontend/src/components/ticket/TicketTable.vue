<script setup lang="ts">
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { truncate } from "@core/utilities/string";
import Username from "@frontend/components/general/Username.vue";
import { useBusiness } from "@frontend/plugins/business";
import { route } from "@frontend/router";
import { ticketProgressState } from "@frontend/utilities/ticket";
import { PropType } from "vue";

defineProps({
  tickets: {
    type: Object as PropType<TicketDto[]>,
    required: true,
  },
});

const emit = defineEmits(["needTickets", "complete"]);

const { ticketBusiness } = useBusiness();

const tagClass = "tag is-light is-medium is-";
</script>

<template>
  <o-table :data="tickets">
    <o-table-column label="Information" width="40%">
      <template v-slot="{ row: { information } }">
        <span>
          {{ truncate(information, 200) }}
        </span>
      </template>
    </o-table-column>

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
      <template v-slot="{ row: { states, allocated } }">
        <span v-if="states.includes('allocated')">
          <username :username="allocated.to.username" />
          <br />
          <small>{{ formatDate(allocated.at, "date") }}</small>
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Review">
      <template v-slot="{ row: { states, reviewed } }">
        <span v-if="states.includes('allocated')">
          <span
            :class="tagClass + ticketProgressState.variant(reviewed?.state)">
            {{ ticketProgressState.displayText(reviewed?.state) }}
          </span>

          <br />
          <small>
            {{ reviewed ? formatDate(reviewed.at, "date") + " " : "" }}
          </small>
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Purchase">
      <template v-slot="{ row: { states, authorized } }">
        <span v-if="states.includes('complete')">
          <span
            :class="tagClass + ticketProgressState.variant(authorized?.state)">
            {{ ticketProgressState.displayText(authorized?.state) }}
          </span>

          <br />
          <small>
            {{ authorized ? formatDate(authorized.at, "date") + " " : "" }}
          </small>
        </span>
      </template>
    </o-table-column>

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
