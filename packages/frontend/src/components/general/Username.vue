<script setup lang="ts">
import { route } from "@frontend/router";

defineProps({ username: { type: String, required: true } });
</script>

<template>
  <router-link :to="route({ name: 'account', username: username })">
    @{{ username }}
  </router-link>
</template>
