import "./styles.scss";

// library components
import { Button, Config as OrugaConfig } from "@oruga-ui/oruga-next";

// root
import { createApp } from "vue";
import App from "@/App.vue";
import { createRouter } from "@/router";

const router = createRouter();

createApp(App)
  .use(router)
  .use(OrugaConfig, {
    button: {
      rootClass: "button",
    },
  })
  .use(Button)
  .mount("#app");
