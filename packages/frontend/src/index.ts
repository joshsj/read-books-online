import App from "@frontend/App.vue";
import { client, isRBOError } from "@frontend/client";
import { preserveTokens, preserveTokens } from "@frontend/plugins/login";
import { createRouter } from "@frontend/router";
import { store } from "@frontend/store";
import "@frontend/styles.scss";
import {
  Button,
  Config as OrugaConfig,
  Dropdown,
  Field,
  Icon,
  Input,
  Loading,
  Modal,
  Notification,
  Pagination,
  Radio,
  Select,
  Switch,
  Table,
  Tooltip,
  Checkbox,
} from "@oruga-ui/oruga-next";
import { createApp } from "vue";
import { getCookie } from "./utilities/http";

store.apiUrl = import.meta.env.VITE_API_URL;

// attempt initial authentication using refresh token
const refreshToken = getCookie(import.meta.env.VITE_REFRESH_TOKEN_KEY);

if (refreshToken) {
  const response = await client.auth.get(refreshToken);

  !isRBOError(response) && preserveTokens(response);
}

createApp(App)
  .use(createRouter())
  .use(OrugaConfig, {
    button: {
      override: true,
      rootClass: "button",
      variantClass: "is-",
      sizeClass: "is-",
      roundedClass: "is-rounded",
      iconClass: "icon",
      outlinedClass: () => "is-outlined",
    },

    notification: {
      rootClass: "notification",
      closeClass: "delete",
      variantClass: "is-",
    },

    loading: {
      overlayClass: "loading-overlay-background",
      fullPageClass: "loading-overlay-background",
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

    icon: { variantClass: "has-text-" },

    modal: {
      rootClass: "modal is-active",
      contentClass: "modal-card",
      overlayClass: "modal-background",
      closeClass: "modal-close is-large",
      canCancel: ["escape", "x", "outside", "button"],
    },

    tooltip: {
      contentClass: "tooltip",
      arrowClass: "tooltip-arrow",
      triggers: ["hover", "click", "focus"],
    },

    table: {
      tableClass: ({}: string, { data }: { data: { isMatchMedia: boolean } }) => {
        const classes = ["table"];

        classes.push(data.isMatchMedia ? "is-striped" : "is-hoverable");

        return classes.join(" ");
      },

      tdPositionClass: "has-text-",
      narrowedClass: "is-narrow",
    },

    dropdown: {
      override: true,
      rootClass: (
        {}: string,
        vm: { data: { isActive: boolean }; props: { position?: string } }
      ) => {
        const classes = ["dropdown"];

        vm.data.isActive && classes.push("is-active");
        vm.props.position?.includes("left") && classes.push("is-right");
        vm.props.position?.includes("top") && classes.push("is-up");

        return classes.join(" ");
      },
      triggerClass: "dropdown-trigger",
      menuClass: "dropdown-menu dropdown-content",
      itemTag: "a",
      itemClass: "dropdown-item",
      mobileModal: false,
    },

    pagination: {
      override: true,
      rootClass: "pagination",
      sizeClass: "is-",
      simpleClass: "is-simple",
      linkClass: "pagination-link",
      linkCurrentClass: "is-current",
      linkDisabledClass: "is-disabled",
      nextBtnClass: "pagination-next",
      prevBtnClass: "pagination-previous",
      infoClass: "mr-2",
    },

    switch: {
      checkClass: (
        {}: string,
        { props, data }: { props: { variant?: string }; data: { newValue: boolean } }
      ) => {
        const classes = ["check"];

        classes.push(
          `has-background-${data.newValue ? props.variant ?? "grey-dark" : "grey-light"}`
        );

        return classes.join(" ");
      },
      labelClass: "control-label ml-1",
    },

    select: {
      override: true,
      rootClass: ({}: string, { props }: { props: { multiple: boolean } }) => {
        const classes = ["select"];

        props.multiple && classes.push("is-multiple");

        return classes.join(" ");
      },
    },

    radio: {
      override: true,
      labelClass: "ml-1 mr-2",
    },

    checkbox: {
      override: true,
      labelClass: "ml-1 mr-2",
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
  .use(Pagination)
  .use(Switch)
  .use(Select)
  .use(Radio)
  .use(Checkbox)
  .mount("#app");
