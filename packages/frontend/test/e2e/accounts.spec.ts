/// <reference types="cypress" />

describe("Accounts", () => {
  const username = "stevejenkins123";
  const password = "stevejenkins123";
  const email = "stevejenkins123@email.com";

  it("Redirects to the login page by default", () => {
    cy.visit("");

    cy.pageTitle().should("have.text", "Login");
  });

  it("Can create an account", () => {
    cy.visit("signup");

    cy.get("input[name=Username]").type(username);
    cy.get("input[name=Password]").type(password);
    cy.get("input[name=Email]").type(email);
    cy.get("button[type=submit]").click();

    cy.pageTitle().should("have.text", "Tickets");
  });

  it("Can log out of an account", () => {
    cy.visit("");

    cy.nav().find(".navbar-item").last().click();

    cy.pageTitle().should("have.text", "Login");
  });

  it("Can log into an account", () => {
    cy.visit("login");

    cy.get("input[name=Username]").type(username);
    cy.get("input[name=Password]").type(password);
    cy.get("button[type=submit]").click();

    cy.pageTitle().should("have.text", "Tickets");
  });

  it("Logs in automatically when refreshed", () => {
    cy.visit("login");

    cy.get("input[name=Username]").type(username);
    cy.get("input[name=Password]").type(password);
    cy.get("button[type=submit]").click();

    cy.pageTitle().should("have.text", "Tickets");

    cy.reload();

    cy.pageTitle().should("have.text", "Tickets");
  });
});
