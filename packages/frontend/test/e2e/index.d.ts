/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      pageTitle(): Chainable<JQuery<HTMLHeadingElement>>;
      nav(): Chainable<JQuery<HTMLDivElement>>;
      main(): Chainable<JQuery<HTMLDivElement>>;
    }
  }
}

export {};
