/// <reference types="cypress" />

describe("Tickets", () => {
  it("Can create tickets", () => {
    cy.visit("tickets");

    cy.viewTitle().find("button").first().click();
  });
});
