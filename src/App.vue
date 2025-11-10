<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  TransitionGroup,
  watch,
} from 'vue';
import StatusFilter from './components/StatusFilter.vue';
import type { FIlterType } from './types/FilterType';
import type { Todo } from './types/Todo';
import TodoItem from './components/TodoItem.vue';
import * as todoApi from './api/todo';
import Message from './components/Message.vue';

const todos = ref<Todo[]>([]);
const title = ref<string>('');
const errorMessage = ref('');
const status = ref<FIlterType>('all');

onMounted(async () => {
  try {
    todos.value = await todoApi.getTodos();
  } catch (error) {
    errorMessage.value = 'Unable to load todos';
  }
});

const activeTodos = computed(() => {
  return todos.value.filter((todo) => !todo.completed);
});

const visibleTodos = computed(() => {
  if (status.value === 'active') {
    return activeTodos.value;
  }
  if (status.value === 'completed') {
    return todos.value.filter((todo) => todo.completed);
  }

  return todos.value;
});

async function addTodo() {
  if (!title.value) {
    errorMessage.value = 'Title should not be empty';
    return;
  }

  try {
    const newTodo = await todoApi.createTodo(title.value);
    todos.value.push(newTodo);
    title.value = '';
  } catch (error) {
    errorMessage.value = 'Unable to add todo';
  }
}

async function deleteTodo(id: number) {
  try {
    await todoApi.deletedTodo(id);
    todos.value = todos.value.filter((todo) => todo.id !== id);
  } catch (error) {
    errorMessage.value = 'Unable to delete todo';
  }
}

const updateTodo = async ({ id, title, completed }: Todo) => {
  try {
    const updatedTodo = await todoApi.upadateTodo({ id, title, completed });
    const currentTodo = todos.value.find((todo) => todo.id === id);
    if (currentTodo) {
      Object.assign(currentTodo, updatedTodo);
    }
  } catch (error) {
    errorMessage.value = 'Unable to update todo';
  }
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos {{ todos.length }}</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          type="button"
          class="todoapp__toggle-all"
          :class="{ active: activeTodos.length === 0 }"
        ></button>

        <form @submit.prevent="addTodo">
          <input
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
            @input="errorMessage = ''"
          />
        </form>
      </header>

      <TransitionGroup
        class="todoapp__main"
        name="todolist"
        tag="section"
        v-if="todos.length > 0"
      >
        <TodoItem
          :todo="todo"
          v-for="todo in visibleTodos"
          :key="todo.id"
          @delete="deleteTodo(todo.id)"
          @update="updateTodo($event)"
        />
      </TransitionGroup>

      <!-- Hide the footer if there are no todos -->
      <footer class="todoapp__footer">
        <span class="todo-count"> {{ activeTodos.length }} todos left </span>

        <StatusFilter v-model="status" />
        <!-- this button should be disabled if there are no completed todos -->
        <button
          type="button"
          :disabled="todos.length === activeTodos.length"
          class="todoapp__clear-completed"
          @click="todos = activeTodos"
        >
          Clear completed
        </button>
      </footer>

      <Message
        v-if="errorMessage"
        class="is-warning"
        :hidden="!errorMessage"
        @close="errorMessage = ''"
      >
        <template #header>
          <p>Server Error</p>
        </template>

        <template #default>
          {{ errorMessage }}
        </template>
      </Message>
    </div>
  </div>
</template>

<style scoped>
.todolist-enter-active,
.todolist-leave-active {
  max-height: 60px;
  transition: all 0.5s ease;
}
.todolist-enter-from,
.todolist-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
