<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useFirebaseAuth, useFirestore } from "vuefire";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const auth = useFirebaseAuth()!;
const db = useFirestore();

interface Todo {
  id: number;
  title: string;
}

const todos = ref<Todo[]>([]);

const currentTodo = ref("");

const addTodo = () => {
  if (currentTodo.value) {
    const userRef = doc(db, "users", auth.currentUser!.uid);
    setDoc(
      userRef,
      {
        todos: [
          ...todos.value,
          { id: todos.value.length, title: currentTodo.value },
        ],
      },
      { merge: true }
    );
    todos.value = [
      ...todos.value,
      { id: todos.value.length, title: currentTodo.value },
    ];
    currentTodo.value = "";
  }
};

const deleteTodo = (todo: Todo) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);
  updateDoc(userRef, {
    todos: todos.value.filter((t) => t.id !== todo.id),
  });
  todos.value = todos.value.filter((t) => t.id !== todo.id);
};

onMounted(async () => {
  const userRef = doc(db, "users", auth.currentUser!.uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    if (userDoc.data()!.todos) {
      todos.value = userDoc.data()!.todos;
    }
  }
});

const handleSignOut = () => {
  auth.signOut().then(() => {
    window.location.href = "/";
  });
};
</script>

<template>
  <div class="relative flex h-screen w-full justify-center bg-neutral-800">
    <button
      class="absolute top-4 right-10 rounded-sm border border-neutral-600 px-3 py-1 text-gray-400 hover:border-pink-500 hover:text-pink-500"
      @click="handleSignOut"
    >
      SignOut
    </button>
    <div
      class="flex w-full max-w-xl flex-col items-center space-y-10 px-10 py-20"
    >
      <div class="w-full space-y-4">
        <input
          type="text"
          placeholder="Add a todo"
          class="w-full rounded-md bg-neutral-900 py-3 px-3 text-xl text-neutral-300 outline-none"
          v-model="currentTodo"
        />
        <button
          class="rounded-sm bg-pink-600 px-3 py-1 font-inter text-neutral-200"
          @click="addTodo"
        >
          Add Todo
        </button>
      </div>
      <div class="w-full space-y-1">
        <div class="w-full" v-for="todo in todos" :key="todo.id">
          <div
            class="flex w-full justify-between rounded-md border border-neutral-700 p-3"
          >
            <div class="font-inter text-neutral-300">{{ todo.title }}</div>
            <button @click="deleteTodo(todo)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6 text-neutral-600 hover:text-neutral-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
