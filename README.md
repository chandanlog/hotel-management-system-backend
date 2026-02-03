# Hotel Management System - Practical Test

This project is a modular Node.js application for managing hotel rooms and calculating agent incentives.

## Tech Stack
- **Backend**: Node.js, Express, Knex.js, PostgreSQL
- **Database**: PostgreSQL

## 1. Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database installed and running

### Database Setup
1. Create a PostgreSQL database (e.g., `hotel_db`).
2. Configure your environment variables.
   - Go to `HotelManagementSystemBackend/`.
   - Create a `.env` file (or use the default in `knexfile.js`).
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=hotel_db
   PORT=3000
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd HotelManagementSystemBackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Migrations (Create Tables):
   ```bash
   npx knex migrate:latest
   ```
4. Run Seeds (Insert Initial Agent/Booking Data):
   ```bash
   npx knex seed:run
   ```
   *Note: This will populate the 3 Agents and their bookings/revenue as per the requirements.*

5. Start the Server:
   ```bash
   npm run dev
   ```
   The server runs on `http://localhost:3000`.

## 2. Features Implemented

### Architecture & Backend
- **Layered Architecture**: Controller-Service-Repository pattern.
- **Security**: Helmet, CORS, Data Encryption (AES-256 for revenue).
- **Validation**: Joi validation for inputs.
- **Error Handling**: Global error handler.
- **Question Q2**: See `ARCHITECTURE.md` for written answers.

### Technical Tasks
- **Q1 Hotel Room Management**:
  - Room Listing: Thumbnail, Search (Name/Code), Sort (Date, etc.).
  - Room Creation: CKEditor for rich text, Image Upload (Multer).
- **Q2 Booking Agent Report**:
  - Full incentive calculation logic (Base + Volume + High Performer + Pts).
  - Detailed breakdown UI with filtering/sorting.
  - Export to CSV.

## Project Structure
```
HotelManagementSystem/
├── HotelManagementSystemBackend/
│   ├── src/
│   │   ├── config/       # DB & App Config
│   │   ├── controllers/  # Request Handlers
│   │   ├── services/     # Business Logic
│   │   ├── repositories/ # DB Access
│   │   ├── routes/       # API Routes
│   │   ├── utils/        # Helpers (Encryption, wrapper)
│   │   └── data/         # Migrations & Seeds
│   └── uploads/          # Stored images
└── ARCHITECTURE.md       # Architecture Answers
```

