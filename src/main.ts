import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import App from "./App.vue";
import { firebase } from "./db/config";

const app = createApp(App);

app.use(VueFire, { firebase, modules: [VueFireAuth()] });

app.mount("#app");
