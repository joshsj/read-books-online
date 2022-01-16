import "./styles.scss";

// library components
import { Button, Notification, Loading, Config as OrugaConfig } from "@oruga-ui/oruga-next";

// root
import { createApp } from "vue";
import App from "@frontend/App.vue";
import { createRouter } from "@frontend/router";

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

    loading: {
      fullPageClass: "overlay-background",
    },
  })
  .use(Button)
  .use(Notification)
  .use(Loading)
  .mount("#app");
