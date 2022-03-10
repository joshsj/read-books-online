Cypress.Commands.add("nav", () => cy.get("nav"));
Cypress.Commands.add("main", () => cy.get("main"));
Cypress.Commands.add("pageTitle", () => cy.main().find("h1.title"));
