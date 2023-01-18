<script lang="ts" setup>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";
import z from "zod";
import { useFirebaseAuth } from "vuefire";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

const auth = useFirebaseAuth()!;
const db = useFirestore()!;
const validateSchema = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.string().email().min(1).max(50),
  password: z.string().min(8).max(50),
});

const credentials = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const formerror = ref({
  message: "",
  isError: false,
});

const handleCreateUsers = () => {
  const isValid = validateSchema.safeParse(credentials.value).success;
  if (isValid) {
    createUserWithEmailAndPassword(
      auth,
      credentials.value.email,
      credentials.value.password
    )
      .then(async (result) => {
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          displayName: `${credentials.value.firstName} ${credentials.value.lastName}`,
          email: credentials.value.email,
          photoURL: "",
        }).then(() => {
          window.location.href = "/auth/signin";
        });
      })
      .catch(() => {
        formerror.value.isError = true;
        formerror.value.message = "email already in use";
      });
  } else {
    formerror.value.isError = true;
    formerror.value.message =
      "Invalid Credentials first And last name should be between 3 and 50 characters, email should be a valid email address, password should be between 8 and 50 characters";
  }
};
</script>

<template>
  <div class="pt-10 text-center font-inter text-3xl font-bold text-gray-100">
    Create Your Account
  </div>
  <div class="w-full space-y-4 p-4">
    <div class="flex space-x-2">
      <div class="flex w-full flex-col space-y-1 text-gray-100">
        <div class="px-1 font-inter text-sm font-light">First Name</div>
        <input
          class="w-full rounded-md bg-neutral-900 px-2 py-2 font-inter font-light outline-none focus:border-0 focus:ring-1 focus:ring-pink-600"
          type="text"
          placeholder="John"
          key="firstName"
          required
          v-model="credentials.firstName"
        />
      </div>
      <div class="flex w-full flex-col space-y-1 text-gray-100">
        <div class="px-1 font-inter text-sm font-light">Last Name</div>
        <input
          class="w-full rounded-md bg-neutral-900 px-2 py-2 font-inter font-light outline-none focus:border-0 focus:ring-1 focus:ring-pink-600"
          type="text"
          placeholder="Doe"
          key="lastName"
          required
          v-model="credentials.lastName"
        />
      </div>
    </div>
    <div class="flex w-full flex-col space-y-1 text-gray-100">
      <div class="px-1 font-inter text-sm font-light">Email Address</div>
      <input
        class="w-full rounded-md bg-neutral-900 px-2 py-2 font-inter font-light outline-none focus:border-0 focus:ring-1 focus:ring-pink-600"
        type="text"
        placeholder="xxxxxxxxxxx@gmail.com"
        key="email"
        required
        v-model="credentials.email"
      />
    </div>
    <div class="flex w-full flex-col space-y-1 text-gray-100">
      <div class="px-1 font-inter text-sm font-light">Password</div>
      <input
        class="w-full rounded-md bg-neutral-900 px-2 py-2 font-inter outline-none focus:border-0 focus:ring-1 focus:ring-pink-600"
        type="password"
        placeholder="Password"
        key="password"
        required
        v-model="credentials.password"
      />
    </div>

    <div class="w-full text-right">
      <router-link
        to="/auth/signin"
        class="font-inter text-sm font-light text-pink-400"
        >Login to Account</router-link
      >
    </div>
    <div class="flex w-full justify-center pt-4">
      <button
        class="w-full max-w-xs rounded-md bg-pink-600 py-2 font-poppins text-gray-200 hover:bg-pink-700"
        @click="handleCreateUsers"
      >
        SignUp
      </button>
    </div>
    <div v-if="formerror.isError === true">
      <div class="text-center font-inter text-sm font-light text-red-500">
        {{ formerror.message }}
      </div>
    </div>
  </div>
</template>
