import App from "@frontend/App.vue";
import { client, isRBOError } from "@frontend/client";
import { toUserStore } from "@frontend/plugins/login";
import { createRouter } from "@frontend/router";
import { store } from "@frontend/store";
import "@frontend/styles.scss";
import {
  Button,
  Config as OrugaConfig,
  Field,
  Icon,
  Input,
  Loading,
  Modal,
  Notification,
  Tooltip,
} from "@oruga-ui/oruga-next";
import { createApp } from "vue";

store.apiUrl = import.meta.env.VITE_API_URL;

// attempt initial authentication using refresh token
store.user = await (async () => {
  const response = await client.auth.get();

  return isRBOError(response) ? undefined : toUserStore(response.token);
})();

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
      overlayClass: "overlay-background",
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

    modal: {
      rootClass: "modal is-active",
      contentClass: "modal-card",
      overlayClass: "modal-background",
      closeClass: "modal-close is-large",
    },

    tooltip: {
      contentClass: "tooltip",
      arrowClass: "tooltip-arrow",
      triggers: ["hover", "click", "focus"],
    },
  })
  .use(Button)
  .use(Notification)
  .use(Input)
  .use(Field)
  .use(Loading)
  .use(Modal)
  .use(Tooltip)
  .use(Icon)
  .mount("#app");
