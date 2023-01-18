import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../components/authentication/SignIn.vue";
import SignUp from "../components/authentication/SignUp.vue";
import Authentication from "../layouts/Authentication.vue";
import Home from "../layouts/Home.vue";
import { getCurrentUser } from "vuefire";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    name: "Authentication",
    component: Authentication,
    children: [
      {
        path: "signin",
        name: "SignIn",
        component: SignIn,
      },
      {
        path: "signup",
        name: "SignUp",
        component: SignUp,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        path: "/auth/signin",
        query: {
          redirectTo: to.fullPath,
        },
      };
    }
  }
});

export default router;
