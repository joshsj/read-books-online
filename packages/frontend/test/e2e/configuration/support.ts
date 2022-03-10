Cypress.Commands.add("nav", () => cy.get("nav"));
Cypress.Commands.add("main", () => cy.get("main"));
Cypress.Commands.add("viewTitle", () => cy.main().find("[data-cy=view-title]"));
Cypress.Commands.add("modal", () => ({
  el: cy.main().find("modal"),
  buttons: cy.main().find(".modal-card-foot"),
}));
