<template>
  <div
    class="todo"
    :class="{ completed: todo.completed }"
  >
    <label class="todo__status-label">
      <input
        type="checkbox"
        class="todo__status"
        :checked="todo.completed"
        @change="emit('update', { ...todo, completed: !todo.completed })"
      />
    </label>
    <form v-if="editing" @submit.prevent="rename">
      <input
        ref="titleField"
        type="text"
        class="todo__title-field"
        placeholder="Empty todo will be deleted"
        @keyup.escape="editing = false"
        @blur="rename"
        v-model.trim="newTitle"
      />
    </form>

    <template v-else>
      <span
        class="todo__title"
        @dblclick="startEditing"
      >
        {{ todo.title }}
      </span>
      <button
        type="button"
        class="todo__remove"
        @click="emit('delete')"
      >
        ×
      </button>
    </template>

    <div
      class="modal overlay"
      :class="{ 'is-active': false }"
    >
      <div class="modal-background has-background-white-ter" />
      <div class="loader" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, VNodeRef } from 'vue';
import { Todo } from '../types/Todo';

const props = defineProps<{ todo: Todo }>();
const emit = defineEmits(['delete', 'update']);

const newTitle = ref(props.todo.title);
const editing = ref(false);
const titleField = ref<HTMLInputElement | null>(null);

const rename = () => {
  if (!editing.value) return;

  editing.value = false;

  if (newTitle.value === props.todo.title) {
    return;
  }

  if (!newTitle.value) {
    emit('delete');
    return;
  }
  emit('update', {...props.todo, title: newTitle.value})
}


const startEditing = async() => {
  newTitle.value = props.todo.title;
  editing.value = true;

  await nextTick();
  if (titleField.value) {
    titleField.value.focus();
  }
};

</script>

<style lang="scss" scoped></style>
