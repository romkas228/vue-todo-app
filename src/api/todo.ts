import { Todo } from "../types/Todo";
import { client } from "../utils/http";

const USER_ID = 3437;

export const getTodos = async () => {
  const response =  await client.get(`/todos?userId=${USER_ID}`);

  return response.data;
}

export const createTodo = async (title: string) => {
  const response = await client.post('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  })

  return response.data;
}

export const upadateTodo = async (todo: Todo) => {
  const response = await client.patch(`/todos/${todo.id}`, {
    title: todo.title,
    completed: todo.completed
  })

  return response.data;
}

export const deletedTodo = async (id: number) => {
  const response = await client.delete(`/todos/${id}`);
  return response.data;
}
