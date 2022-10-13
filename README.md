# Read Books Online (RBO)


A CRUD application to manage purchase requests and employees featuring ticket status tracking, email notifications, and real-time chat.

Architected like Jason Taylor's Clean Architecture, it's built with a full Typescript stack: MongoDB and Mongoose for persistence; Node, Express, yup, tsyringe, and bcrypt in the backend; HTML, CSS, Vue, and Socket.io in the frontend; and Mocha, Chai, and Cypress for testing.
                
## /packages Structure

Source code for the application

### /core

Functionality available to all other projects:

- CQRS implementation
- Utility functions
- Unit tests

### /backend

Modelled on Jason Taylor's
[Clean Architecture](https://github.com/jasontaylordev/CleanArchitecture#overview):

- API and socket endpoints for frontend
- Authentication
- Authorization
- Validation
- Database management
- Application logic
- Error handling
- Unit & integration tests

### /client

Middleman between the /backend and /frontend:

- Shared data models (DTOs, CQRS requests)
- Type definition for backend API endpoints
- Javascript Proxy provider for the API type definition
- Unit tests

### /frontend

Single-page application served as a website:

- Routing
- Authentication
- Authorization
- Validation
- Application logic
- Error handling
- End-to-end tests

## Prerequisites

- NodeJS
  - Installation [here](https://nodejs.org/en/download/)
- MongoDB database (minimum version 4.0)

  - Installation
    [here](https://docs.mongodb.com/manual/installation/)

  - If using access control, credentials to a read/write
    will be required

- SMTP emailing server
  - For development,
    [smtp4dev](https://github.com/rnwood/smtp4dev/wiki/Installation)
    provides a local email server for testing
- HTTPS certificate
  - Available online for free, or
  - Create one for local development/testing
    [here](https://devcenter.heroku.com/articles/ssl-certificate-self)

## Usage

### Environment Variables

The application uses use environment variables for
configuration before the starting, loaded from a file using
dotenv.

In the root of the backend and frontend projects, create a
file named `.env`. In their respective project, define the
following case-sensitive key-value pairs.

| Key                                    | Function                                                                                       | Example                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Backend**                            |
| `NODE_ENV`                             | Running mode of NodeJS                                                                         | development                                                                             |
| `APP_URL`                              | URL to frontend application                                                                    | https://127.0.0.1:3000                                                                  |
| `SERVER_PORT`                          | API server port                                                                                | 443                                                                                     |
| `SERVER_HTTPS_KEY_PATH`                | Path to HTTPS key file                                                                         | C:/Projects/https-cert/server.key                                                       |
| `SERVER_HTTPS_CERT_PATH`               | Path to HTTPS certificate file                                                                 | C:/Projects/https-cert/server.cert                                                      |
| `MONGO_URI`                            | MongoDB connection string                                                                      | mongodb://127.0.0.1:27017                                                               |
| `MONGO_DB_NAME`                        | MongoDB database name for the application                                                      | readBooksOnline                                                                         |
| `HASHING_SALT_ROUNDS`                  | Amount of salt rounds; used for hashing passwords                                              | 10                                                                                      |
| `AUTH_EXPIRES_IN_MS`                   | Timespan of auth tokens                                                                        | 86400000 (1 day)                                                                        |
| `JWT_SECRET`                           | Random data; used for encrypting JWTs                                                          | (see generaetor in [resources](#resources))                                             |
| `JWT_ALGORITHM`                        | Encryption algorithm used to encrypt JWTs                                                      | HS256                                                                                   |
| `JWT_ISSUER`                           | See 'Registered Claim Names' [here](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1) | readBooksOnlineBackend                                                                  |
| `JWT_AUDIENCE`                         | See 'Registered Claim Names' [here](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1) | readBooksOnlineFrontend                                                                 |
| `EMAIL_HOST`                           | Email server host                                                                              | localhost (see [smtp4dev](https://github.com/rnwood/smtp4dev/wiki/Configuring-Clients)) |
| `EMAIL_PORT`                           | Email server port                                                                              | 25 (see [smtp4dev](https://github.com/rnwood/smtp4dev/wiki/Configuring-Clients))        |
| `EMAIL_FROM`                           | Sender on email notifications                                                                  | localDev@readBooksOnline.com                                                            |
| `TICKET_COST_THRESHOLD`                | Threshold for ticket costs to require manual authorization                                     | 40                                                                                      |
| **Client**                             |
| `INTEGRATION_API_URL`                  | API URL                                                                                        | http://127.0.0.1:443/api                                                                |
| `INTEGRATION_USER_CLIENT_USERNAME`     | Username for user with client role                                                             | testUserClient                                                                          |
| `INTEGRATION_USER_CLIENT_PASSWORD`     | Password for user with client role                                                             | testUserClient                                                                          |
| `INTEGRATION_USER_EMPLOYEE_USERNAME`   | Username for user with employee role                                                           | testUserEmployee                                                                        |
| `INTEGRATION_USER_EMPLOYEE_PASSWORD`   | Password for user with employee role                                                           | testUserEmployee                                                                        |
| `INTEGRATION_USER_AUTHORIZER_USERNAME` | Username for user with authorizer role                                                         | testUserAuthorizer                                                                      |
| `INTEGRATION_USER_AUTHORIZER_PASSWORD` | Password for user with authorizer role                                                         | testUserAuthorizer                                                                      |
| **Frontend**                           |
| `VITE_API_URL`                         | API URL                                                                                        | https://127.0.0.1:443/api                                                               |
| `VITE_HTTPS_KEY_PATH`                  | Path to HTTPS key file                                                                         | C:/Projects/https-cert/server.key                                                       |
| `VITE_HTTPS_CERT_PATH`                 | Path to HTTPS key file                                                                         | C:/Projects/https-cert/server.cert                                                      |
| `VITE_REFRESH_TOKEN_KEY`               | Identifier for the refresh token cookie                                                        | readBooksOnlineRefreshToken                                                             |
| `E2E_BASE_URL`                         | URL to frontend application                                                                    | https://127.0.0.1:3000                                                                  |

These values are formatted as `key=value`; e.g.,
`NODE_ENV=development`

### Running

Before running the application, ensure the
[prerequisites](#prerequisites) have been constructed and
started, and the
[environment variable](#environment-variables) files have
been created.

1. Open a terminal
2. Navigate to the /packages folder
3. Run `npm install` (installs the required packages)
4. Run `npm run build` (builds all projects)

5) Navigate to the /packages/backend folder
6) Run `npm start`

7. Open a second terminal
8. Navigate to the /packages/frontend folder
9. Run `npm start`

10) Open https://127.0.0.1:3000 to use the application!

### Seeding

All data can be managed using the website, except assigning
the authorizer role to a user. This is handled within
MongoDB:

1. Start the application
2. Create a user, making note of the username; e.g., steve
3. Open a
   [legacy shell](https://docs.mongodb.com/manual/reference/mongo-shell/)
4. Use the database named in your .env file
5. Update the user's roles to include authorizer; e.g.,
   `db.user.updateOne({username:"steve"},{$push:{roles:"authorizer"}})`

## Testing

Each project defines some kind of tests; view the `scripts`
section in their `package.json` files to run its tests. For
example, to run the backend unit tests:

1. Open a terminal
2. Navigate to the /packages/backend folder
3. Run `npm run build`
4. Run `npm run test:unit`

**Note:** before running integration tests, ensure the users
specified in the .env file must exist.

## Resources

- [Project Board](https://b8022626.atlassian.net/jira/software/c/projects/RBO/issues)

* [How to Write Epics and User Stories](https://productcoalition.com/how-to-write-epics-and-user-stories-best-practice-1de5b983900)
* [How to write acceptance criteria?](https://productcoalition.com/how-to-write-acceptance-criteria-e2be975f92a3)

- [Password/Secret Generator](https://www.grc.com/passwords.htm)
