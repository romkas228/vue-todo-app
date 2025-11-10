<script setup lang="ts">
defineProps<{ hidden: boolean }>();
defineSlots<{
  header?: () => any;
  default?: () => any;
}>();
const emit = defineEmits(['close']);

</script>

<template>
  <article
    class="message"
    :class="{ 'message--hidden': hidden }"
  >
    <template class="message-header">
      <slot name="header">Message</slot>
      <button class="delete" @click="$emit('close')"></button>
    </template>

    <div class="message-body">
      <slot>No content</slot>
    </div>
  </article>
</template>

<style scoped lang="scss">
.message {
  transform-origin: top center;
  transition-property: opacity, transform;
  transition-duration: 0.3s;

  &--hidden {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
}
</style>
