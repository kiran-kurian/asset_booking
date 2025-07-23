# Asset Booking System

A full-stack web application designed for booking and managing technical assets like lab equipment. This project features a modern Svelte frontend and a robust Node.js backend, providing a seamless user experience for viewing available assets, selecting booking slots, and managing resource availability.

---

## Features

- **View Asset List:** Displays a real-time list of all assets fetched from the backend, including their name, ID, and current status (Available, In Use, etc.).
- **Interactive Calendar:** A clean, professional calendar interface for selecting booking dates.
- **Time Slot Booking:** Users can select from available time slots for a chosen date. Booked slots are clearly marked as unavailable.
- **Persistent Storage:** Bookings are saved permanently in a SQLite database via the backend API.
- **Full-Stack Validation:** Includes both frontend validation for a smooth UX and critical server-side validation to prevent double-bookings and booking of unavailable assets.
- **Monorepo Structure:** Professionally organized into separate `frontend` and `backend` directories for clear separation of concerns and easier deployment.

---

## Tech Stack

- **Frontend:** Svelte with Vite
- **Backend:** Node.js with Express.js
- **Database:** SQLite
- **Styling:** Tailwind CSS
- **Validation:** Zod

---

## Project Structure

The project is organized as a monorepo with two main directories:

```text
/
├── frontend/   # Contains the Svelte frontend application
└── backend/    # Contains the Node.js/Express server and database
```

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have Node.js installed on your system (which includes npm).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/asset_booking.git](https://github.com/your-username/asset_booking.git)
    cd asset_booking
    ```

2.  **Set up the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install the dependencies
    npm install

    # Initialize the database (this only needs to be done once)
    node database.js
    ```

3.  **Set up the Frontend:**
    ```bash
    # Navigate to the frontend directory from the project root
    cd ../frontend

    # Install the dependencies
    npm install
    ```

### Running the Application

To run the application, you must have **both** the backend and frontend servers running at the same time. You will need two separate terminal windows for this.

**Terminal 1: Start the Backend Server**

```bash
# Make sure you are in the 'backend' directory
cd backend
node server.js

# You should see: Backend server running on http://localhost:3000
```

**Terminal 2: Start the Frontend Server**

```bash
# Make sure you are in the 'frontend' directory
cd frontend
npm run dev

# Your Svelte application will be available at http://localhost:5173
```

Now, open your web browser and navigate to `http://localhost:5173` to use the application.

---

## API Endpoints

The backend server provides the following API endpoints:

- `GET /api/assets`: Fetches a list of all assets.
- `GET /api/bookings/:assetId`: Fetches all bookings for a specific asset ID.
- `POST /api/bookings`: Creates a new booking.

