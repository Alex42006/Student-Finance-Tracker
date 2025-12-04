Installation Instructions


1. Clone the Repository

- git clone https://github.com/Alex42006/Student-Finance-Tracker
- cd Student-Finance-Tracker

2. Install Dependencies

- Backend:
- npm install
- Frontend:
- cd frontend
- npm install

3. Configure Environment Variables

- Create a .env file:
  - cd ..
  - File contents:
    - DATABASE_URL="postgresql://<username>@localhost:5432/gatorbudget?schema=public"
      - Replace <username> with your own username on your device
    - PORT = 5001
    - JWT_SECRET="any_secure_string_here"
- Create the frontend .env file:
  - cd frontend
  - File contents:
    - VITE_BACKEND_PORT=5001
4. Set Up the PostgreSQL Database
- cd ../backend/db
- createdb gatorbudget
- npx prisma migrate dev
- npx prisma generate
- npx prisma db seed
5. Start the Backend
- cd backend
- npm run dev
- Backend will run at http://localhost:5001
6. Start the Frontend
- cd ../frontend
- npm run dev
- Frontend will run at http://localhost:5173
After these steps, the full application will be running locally with both servers connected.
