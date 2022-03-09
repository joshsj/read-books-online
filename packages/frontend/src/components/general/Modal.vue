<script setup lang="ts">
defineProps({
  title: { type: String, required: true },

  mainButtonText: { type: String, required: true },
  mainButtonVariant: { type: String, default: "success" },
  mainButtonDisabled: { type: Boolean, default: false },

  altButtonText: { type: String, default: "Close" },
  altButtonVariant: { type: String, default: "" },
  altButtonDisabled: { type: Boolean, default: false },
  altButtonHidden: { type: Boolean, default: false },

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

const close = () => {
  emit("update:active", false);
  emit("close");
};
</script>

<template>
  <!-- TODO check why update:active doesn't emit on close -->
  <o-modal @close="close">
    <header class="modal-card-head level">
      <p class="modal-card-title level-left">{{ title }}</p>

      <div class="level-right">
        <slot name="header" />
      </div>
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
        v-show="!altButtonHidden"
        :label="altButtonText"
        :variant="altButtonVariant"
        :disabled="altButtonDisabled"
        @click="onOtherClick" />
    </footer>

    <o-loading v-model:active="loading" :full-page="false" />
  </o-modal>
</template>
