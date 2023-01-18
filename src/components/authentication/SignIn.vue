<script lang="ts" setup>
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { ref } from "vue";

const auth = useFirebaseAuth()!;
const credentials = ref({ email: "", password: "" });
const formerror = ref({ message: "", isError: false });

const handleSignIn = () => {
  console.log(credentials.value);
  signInWithEmailAndPassword(
    auth,
    credentials.value.email,
    credentials.value.password
  )
    .then((result) => {
      window.location.href = "/";
    })
    .catch((error) => {
      formerror.value.isError = true;
      formerror.value.message = "Invalid Credentials";
    });
};
</script>

<template>
  <div class="pt-10 text-center font-inter text-3xl font-bold text-gray-100">
    SignIn To Your Account
  </div>
  <div class="w-full space-y-4 p-4">
    <div class="flex w-full flex-col space-y-1 text-gray-100">
      <div class="px-1 font-inter text-sm font-light">Email Address</div>
      <input
        class="w-full rounded-md bg-neutral-900 px-2 py-2 font-inter font-light outline-none focus:border-0 focus:ring-1 focus:ring-pink-600"
        type="text"
        placeholder="xxxxxxxxxxx@gmail.com"
        key="email"
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
        v-model="credentials.password"
      />
    </div>
    <div class="w-full text-right">
      <router-link
        to="/auth/signup"
        class="font-inter text-sm font-light text-pink-400"
        >Create An Account</router-link
      >
    </div>
    <div class="flex w-full justify-center pt-4">
      <button
        @click="handleSignIn"
        class="w-full max-w-xs rounded-md bg-pink-600 py-2 font-poppins text-gray-200 hover:bg-pink-700"
      >
        SignIn
      </button>
    </div>
    <div v-if="formerror.isError === true">
      <div class="text-center font-inter text-sm font-light text-red-500">
        {{ formerror.message }}
      </div>
    </div>
  </div>
</template>
