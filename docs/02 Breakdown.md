# Breakdown

## Process

1. Establish Epics from the case study
2. Derive User Stories from the requirements
3. Design the implementation of each user story
4. Add any entities to the ERD for the system

## Terminology

**Resource** <br> A book or an audiobook.

## Initial Assumptions

> Client users should be able to list and search their own
> requests

- Employees and Administrators can view all request,
  regardless of assignee

## Questions

> Requests with missing information is sent back to the
> client to be updated

- What information is needed for a adequate request?

> Notify user (see Figure 1)

- The specification does not provide any details about
  notifications. What's the deal with that?

## Potential Additional Features

> You might think of other features that you may wish to add

### Resource information provider

When requesting a resource, information about 'known'
resources would be helpful.

This could be provided by an open API of books & audiobooks.

### Resource quantity

> ReadBook Online management team is keen on being able to
> obtain reports on the current status of the requests

Providing multiple copies of high-demand resources would be
useful.

Culminating requests for additional copies would identify
the resources with the most demand, to be processed by
Employees & Administrators.

Test

### Duplicate request prevention

The system does not validate whether a request resources
already exists. Without this validation, duplicate resources
may be approved, which is not allowed as per the
specification.

Implementing this ensures no additional resources can be
purchased, and no time is wasted on duplicates.
