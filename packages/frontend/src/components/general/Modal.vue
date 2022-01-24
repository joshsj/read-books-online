<script setup lang="ts">
import { onMounted, useAttrs } from "vue";

defineProps({
  title: { type: String, required: true },

  mainButtonText: { type: String, required: true },
  mainButtonVariant: { type: String, default: "success" },
  mainButtonDisabled: { type: Boolean, default: false },

  altButtonText: { type: String, default: "Close" },
  altButtonVariant: { type: String, default: "" },
  altButtonDisabled: { type: Boolean, default: false },

  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:active", "close", "open", "main", "alt"]);

const onMainClick = () => {
  emit("main");
  close();
};

const onOtherClick = () => {
  emit("alt");
  close();
};

const attrs = useAttrs();
onMounted(() => console.log(attrs));

const close = () => {
  emit("update:active", false);
  emit("close");
};
</script>

<template>
  <!-- TODO check why update:active doesn't emit on close -->
  <o-modal @close="close">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
    </header>

    <section class="modal-card-body">
      <slot />
    </section>

    <footer class="modal-card-foot">
      <o-button
        :label="mainButtonText"
        :variant="mainButtonVariant"
        :disabled="mainButtonDisabled"
        @click="onMainClick" />

      <o-button
        :label="altButtonText"
        :variant="altButtonVariant"
        :disabled="altButtonDisabled"
        @click="onOtherClick" />
    </footer>

    <o-loading v-model:active="loading" :full-page="false" />
  </o-modal>
</template>
