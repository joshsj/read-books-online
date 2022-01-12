// styling
import "@oruga-ui/oruga-next/dist/oruga.css";
import "bulma/css/bulma.css";

// library components
import { Button, Config as OrugaConfig } from "@oruga-ui/oruga-next";

// root
import App from "@/App.vue";
import { createApp } from "vue";

createApp(App)
  .use(OrugaConfig, {
    button: {
      rootClass: "button",
    },
  })
  .use(Button)
  .mount("#app");
