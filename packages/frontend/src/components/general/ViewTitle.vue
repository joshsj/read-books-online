<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
});
</script>

<template>
  <div
    class="block is-flex is-justify-content-space-between is-align-items-flex-start">
    <h1 class="title mb-0">{{ title }}</h1>
    <div><slot /></div>
  </div>
</template>
