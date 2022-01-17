import App from "@frontend/App.vue";
import { createRouter } from "@frontend/router";
import { store } from "@frontend/store";
import "@frontend/styles.scss";
import {
  Config as OrugaConfig,
  Button,
  Input,
  Field,
  Loading,
  Notification,
} from "@oruga-ui/oruga-next";
import { createApp } from "vue";

store.apiUrl = import.meta.env.VITE_API_URL;

createApp(App)
  .use(createRouter())
  .use(OrugaConfig, {
    button: {
      rootClass: "button",
      variantClass: "is-",
    },

    notification: {
      rootClass: "notification",
      closeClass: "delete",
      variantClass: "is-",
    },

    loading: {
      fullPageClass: "overlay-background",
    },

    field: {
      rootClass: "field",
      labelClass: "label",
      messageClass: "form-text",
      variantClass: "field-",
      variantMessageClass: "has-text-",
    },

    input: {
      inputClass: "input",
      variantClass: "is-",
      iconLeftClass: "input-icon-left",
      iconRightClass: "input-icon-right",
    },
  })
  .use(Button)
  .use(Notification)
  .use(Input)
  .use(Field)
  .use(Loading)
  .mount("#app");
