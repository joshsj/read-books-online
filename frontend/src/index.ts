import "./styles.scss";

// library components
import { Button, Notification, Config as OrugaConfig } from "@oruga-ui/oruga-next";

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

    notification: {
      rootClass: "notification",
      closeClass: "delete",
      variantClass: "is-",
    },
  })
  .use(Button)
  .use(Notification)
  .mount("#app");
