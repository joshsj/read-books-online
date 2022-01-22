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
  Table,
  Dropdown,
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
      sizeClass: "is-",
      outlinedClass: () => "is-outlined",
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

    table: {
      rootClass: "table is-striped",
    },

    dropdown: {
      rootClass: ({}: string, vm: { data: { isActive: boolean }; props: { position: string } }) => {
        const classes = ["dropdown"];

        vm.data.isActive && classes.push("is-active");
        vm.props.position.includes("left") && classes.push("is-right");
        vm.props.position.includes("top") && classes.push("is-up");

        return classes.join(" ");
      },
      triggerClass: "dropdown-trigger",
      menuClass: "dropdown-menu dropdown-content",
      itemTag: "a",
      itemClass: "dropdown-item",
      itemActiveClass: "is-active",
      mobileModal: false,
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
  .use(Table)
  .use(Dropdown)
  .mount("#app");
