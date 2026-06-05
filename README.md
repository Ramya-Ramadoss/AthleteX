# AthleteX – Sports Training Tracker

## Project Overview
AthleteX is a simple full-stack CRUD web application for managing sports, training logs, and performance records.

### Tech Stack
- Frontend: React, Axios, React Router
- Backend: FastAPI, Pydantic, SQLAlchemy
- Database: PostgreSQL

## Project Structure
```
athletex/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   └── database.py
│   ├── models/
│   │   ├── sport_model.py
│   │   ├── training_model.py
│   │   └── performance_model.py
│   ├── routes/
│   │   ├── sports.py
│   │   ├── training.py
│   │   └── performance.py
│   └── schemas/
│       ├── sport_schema.py
│       ├── training_schema.py
│       └── performance_schema.py
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx
        ├── index.jsx
        ├── index.css
        ├── pages/
        │   ├── Home.jsx
        │   ├── Sports.jsx
        │   ├── Training.jsx
        │   └── Performance.jsx
        └── services/
            └── api.js
```

## Backend Setup
1. Install Python dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
2. Create PostgreSQL database:
   - Database name: `athletex_db`
   - Update `backend/database/database.py` if your credentials differ.
3. Run the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload
   ```
4. Open Swagger docs at:
   ```
   http://localhost:8000/docs
   ```

## Frontend Setup
1. Install Node dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React app:
   ```bash
   npm start
   ```
3. Open the app in the browser at:
   ```
   http://localhost:3000
   ```

## PostgreSQL Schema
Create the database and tables using:
```sql
CREATE DATABASE athletex_db;

\c athletex_db

CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  sport_name VARCHAR(100) NOT NULL
);

CREATE TABLE training_logs (
  id SERIAL PRIMARY KEY,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  training_date DATE NOT NULL,
  hours INTEGER NOT NULL
);

CREATE TABLE performance (
  id SERIAL PRIMARY KEY,
  speed INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  stamina INTEGER NOT NULL,
  overall_score FLOAT NOT NULL
);
```

## How It Works
- React uses Axios to request the FastAPI backend.
- FastAPI validates data using Pydantic schemas.
- SQLAlchemy maps Python models to PostgreSQL tables.
- Performance records calculate overall score in the backend.

## Database configuration (quick dev option)

The backend reads the database connection from the `DATABASE_URL` environment variable. If `DATABASE_URL` is not set, the app falls back to a local SQLite database file `athletex.db` for quick development and testing.

To use PostgreSQL, set `DATABASE_URL` before starting the backend, for example on Windows PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://<user>:<password>@<host>:<port>/athletex_db"
uvicorn backend.main:app --reload
```

Or on macOS / Linux:

```bash
export DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/athletex_db"
uvicorn backend.main:app --reload
```

If you prefer to test without installing PostgreSQL, simply start the backend and it will use the file `athletex.db` in the `backend` folder.

## Remaining Files to Add
- `frontend/.gitignore`
- `backend/.gitignore`
- `backend/__init__.py` files (optional)
