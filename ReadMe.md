# Employee Management System

A full-stack Employee Management System with a React + TypeScript + Vite frontend and an ASP.NET Core backend.

---

## Project Structure

```
Employee-Management-System/
├── backend/   # ASP.NET Core Web API (C#)
└── frontend/  # React + TypeScript + Vite
```

---

## Backend (`backend/`)

- **Tech Stack:** ASP.NET Core, Entity Framework Core, SignalR
- **Features:**
  - User authentication (JWT, cookies)
  - Employee and Manager profile management
  - Leave application and approval workflow
  - Sales record tracking
  - Real-time notifications via SignalR
- **Key Folders:**
  - `Controllers/` – API endpoints (e.g., `UserController`, `EmployeeController`, `ManagerController`)
  - `Services/` – Business logic (e.g., `EmployeeServices`, `ManagerServices`)
  - `Models/` – Entity models (e.g., `User`, `Employee`, `Manager`)
  - `Data/` – Database context (`ApplicationDbContext.cs`)
  - `Dtos/` – Data transfer objects

### Running the Backend

1. **Configure the database** in `backend/appsettings.json`.
2. **Restore dependencies:**
   ```sh
   dotnet restore
   ```
3. **Apply migrations:**
   ```sh
   dotnet ef database update
   ```
4. **Run the API:**
   ```sh
    dotnet run --launch-profile https
   ```
   The API will be available at `https://localhost:7026`.

---

## Frontend (`frontend/`)

- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, TanStack Router, TanStack(React) Query, Zustand, Zod
- **Features:**
  - User registration and login
  - Employee and manager dashboards
  - Profile creation and editing
  - Leave application forms
  - Sales record forms and cards
  - Manager approval and reporting interfaces
- **Key Folders:**
  - `src/components/` – UI components (forms, dashboards, cards, etc.)
  - `src/routes/` – Route definitions for TanStack Router
  - `src/hooks/` – Custom React hooks for API/data logic

### Running the Frontend

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Docker

You can run both frontend and backend using Docker Compose:

```sh
docker-compose up --build
```

---

## Usage

1. **Register a new user** via the Sign Up page.
2. **Complete your profile** (employee or manager) after registration.
3. **Access dashboards** based on your role.
4. **Employees** can apply for leave and record sales.
5. **Managers** can approve leave, view reports, and manage subordinates.

---

## Development Notes

- **Frontend configuration:** See [frontend/README.md](frontend/README.md)
- **Backend configuration:** Update connection strings and secrets in `backend/appsettings.json`
- **API base URL:** The frontend expects the backend at `https://localhost:7026/api`
- **Default Manager** Email is `manager@firm.com` Password is `12345678`

---

## License

MIT License