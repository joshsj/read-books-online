<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
});
</script>

<template>
  <div
    class="block is-flex is-justify-content-space-between is-align-items-center">
    <div>
      <slot name="title">
        <h1 class="title mb-0">{{ title }}</h1>
      </slot>
    </div>
    <div><slot /></div>
  </div>
</template>
