/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      nav: () => Chainable<JQuery<HTMLElement>>;
      main: () => Chainable<JQuery<HTMLElement>>;

      viewTitle: () => Chainable<JQuery<HTMLElement>>;
      modal: () => {
        el: Chainable<JQuery<HTMLDivElement>>;
        buttons: Chainable<JQuery<HTMLButtonElement>>;
      };
    }
  }
}

export {};
