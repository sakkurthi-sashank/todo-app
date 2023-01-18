import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import App from "./App.vue";
import { firebaseApp } from "./db/config";
import router from "./router";
import "./styles/style.css";

const app = createApp(App);

app.use(router);

app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] });

app.mount("#app");
