# Architecture Documentation

## 1. Architecture Pattern
I implemented a **Layered Architecture** (also known as N-Tier Architecture) with a separation of concerns into **Controllers**, **Services**, and **Repositories** (the Data Access Layer). This ensures modularity, testability, and scalability.

## 2. Responsibilities and Benefits
- **Controllers (`src/controllers`)**: Handle HTTP requests, input validation, and send responses. They act as the entry point and do not contain business logic.
  - *Benefit*: Decouples the HTTP interface from business rules.
- **Services (`src/services`)**: Contain the core business logic (e.g., incentive calculations, image processing). They orchestrate data flow between controllers and repositories.
  - *Benefit*: Allows business logic to be reused and tested independently of the web server.
- **Repositories (`src/repositories`)**: Handle direct database interactions using Knex.js.
  - *Benefit*: Abstraction over the database allows changing the underlying DB or ORM with minimal impact on business logic.
- **Utilities & Middleware**: Handle cross-cutting concerns like logging, error handling, and encryption.

## 3. Security Measures
- **Helmet**: Secures HTTP headers (e.g., XSS filter, frame options).
- **CORS**: Configured to allow cross-origin requests (essential for React frontend).
- **Input Validation**: Joi is used to validate all incoming data to prevent malformed queries.
- **Database Encryption**: Sensitive data (e.g., Agent Revenue) is encrypted using AES-256 before storage.
- **Error Handling**: A global error handler prevents leaking stack traces to the client in production.

## 4. SQL Injection Prevention
I used **Knex.js** Query Builder. Knex automatically binds parameters to queries rather than concatenating strings. This ensures that user input is treated as data, not executable code, effectively preventing SQL Injection attacks.
Example: `query.where('room_name', 'ilike', vars)` uses parameterized queries under the hood.

## 5. Database Normalization
I used **Third Normal Form (3NF)** where appropriate, but made a pragmatic tradeoff for the 'Booking Data' requirement.
- **Rooms and Agents** are fully normalized entities.
- **Bookings** are normalized with foreign keys to Agents (`agent_id`).
- I avoided complex join tables for fixed enums (like Property Types) to keep the schema simple for this scale, relying on application-level integrity for known types.
- Encryption was applied to specific columns without breaking normalization structure (just storing text).
