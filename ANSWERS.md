# Architecture & Technical Answers

## 1. Architecture Pattern
I implemented a **Layered Architecture** (N-Tier) which is a standard pattern for scalable and maintainable enterprise applications. The application is divided into horizontal layers where each layer has a specific responsibility:
- **Routing Layer**: Entry point for HTTP requests.
- **Controller Layer**: Handles request parsing, validation, and response formatting.
- **Service Layer**: Orchestrates business logic and inter-module coordination.
- **Mapper/DTO Layer**: Translates database entities into API-friendly Data Transfer Objects.
- **Repository Layer**: Encapsulates data access and persistence logic.

## 2. Responsibilities and Benefits
- **Controllers (`src/controllers`)**:
  - *Responsibility*: Input validation (using Joi) and HTTP response handling.
  - *Benefit*: Decouples the web framework (Express) from the core business logic.
- **Services (`src/services`)**:
  - *Responsibility*: Core business rules (incentive calculations, scoring, etc.).
  - *Benefit*: Centralizes logic, making it easier to maintain, reuse, and unit test.
- **Repositories (`src/repositories`)**:
  - *Responsibility*: Database-agnostic query logic using Knex.js.
  - *Benefit*: Allows swapping the database or optimizing queries without affecting business rules.
- **Mappers (`src/mappers`)**:
  - *Responsibility*: Data transformation.
  - *Benefit*: Protects clients from changes in the database schema and avoids leaking sensitive internal fields.
- **Utilities (`src/utils`)**:
  - *Responsibility*: Cross-cutting concerns like Encryption (AES-256), Logging (Winston), and Generic HTTP Client (Axios).

## 3. Security Measures
- **Helmet**: Secures HTTP headers to prevent XSS and Clickjacking.
- **CORS**: Restricts API access to authorized origins.
- **Database Encryption**: Sensitive financial data (Agent Revenue) is encrypted with **AES-256** before being stored as text in PostgreSQL.
- **Input Validation**: **Joi** ensures that only valid, sanitised data reaches the service layer.
- **Global Error Handling**: Prevents the leakage of stack traces and internal debugging info to the client.

## 4. SQL Injection Prevention
SQL injection is prevented by using **Knex.js with Parameterized Queries**.
Instead of using string interpolation (e.g., `WHERE id = ' + id`), Knex uses place-holders (e.g., `WHERE id = ?`). The database driver passes the user input as a separate value that cannot be executed as a command, effectively neutralising the threat of SQL Injection.

## 5. Database Normalization
I utilized **Third Normal Form (3NF)** for the relational schema:
- **Agents** and **Rooms** are primary entities.
- **Bookings** are linked via foreign keys (`agent_id`), eliminating redundant storage of agent details.
- **Pragmatic approach**: While property types and categories are normalized as consistent strings, I chose not to use separate lookup tables for them to optimize query performance (joins) for this specific use case, relying instead on API-level enums for integrity.

---
**Author**: Chandan Kumar
**Project**: Hotel Management System Backend
**Stack**: Node.js, Express, PostgreSQL, Knex.js, React
