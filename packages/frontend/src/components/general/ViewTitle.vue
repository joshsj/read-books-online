<script setup lang="ts">
defineProps({
  title: { type: String },
});

const defaultTitleClass = "title mb-0";
</script>

<template>
  <div
    class="view-title block is-flex is-justify-content-space-between is-align-items-center"
    data-cy="view-title">
    <div>
      <slot name="title" :defaultClass="defaultTitleClass">
        <h1 :class="defaultTitleClass">{{ title }}</h1>
      </slot>
    </div>
    <div><slot /></div>
  </div>
</template>
