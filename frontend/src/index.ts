import { createApp } from "vue";
import App from "./App.vue";

import { Button } from "@oruga-ui/oruga-next";
import "@oruga-ui/oruga-next/dist/oruga.css";

createApp(App).use(Button).mount("#app");
