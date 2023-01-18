<script lang="ts" setup>
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useFirebaseAuth, useFirestore } from "vuefire";
import { doc, setDoc } from "firebase/firestore";

const auth = useFirebaseAuth()!;
const db = useFirestore()!;
const googleAuthProvider = new GoogleAuthProvider();

const handleGoogleSignIn = () => {
  signInWithPopup(auth, googleAuthProvider)
    .then((result) => {
      const user = result.user;
      if (user) {
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<template>
  <div class="flex h-screen w-full justify-center bg-neutral-800 py-14">
    <div
      class="container flex flex-col items-center rounded-md border-0 border-neutral-700 sm:border"
    >
      <div class="w-full max-w-md space-y-10">
        <router-view />
        <div class="relative mx-4 border-b border-neutral-700"></div>
        <div class="flex w-full justify-center">
          <button
            @click="handleGoogleSignIn"
            class="w-full max-w-xs rounded-md bg-neutral-900 py-3 font-poppins text-lg text-gray-200 hover:bg-black hover:ring-1 hover:ring-pink-500"
          >
            Sign In With Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
