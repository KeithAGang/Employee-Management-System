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

**Backend configuration:** Update connection strings and secrets in backend/appsettings.json. ⚠️ Note: The PostgreSQL port in appsettings.json is set to 6543 by default to avoid conflicts with local installations that might already use 5432.If you choose not to run PostgreSQL in Docker, you’ll need to manually change this port back to 5432 or match the port your local instance uses.

**API base URL:** The frontend expects the backend at https://localhost:7026/api

**Default Manager:** Email is manager@firm.com Password is 12345678

## 🛠️ Running with Makefile

### ⚡ Windows (PowerShell or CMD)

Open a terminal in the project root.

Run:

```sh
make dev
```

This will:

* Generate HTTPS certificates via `generate-certs-win.bat`
* Start Docker Compose with frontend, backend, and database

---

### 🐗 Unix/Linux/macOS

Open a terminal in the project root.

Run:

```sh
make dev
```

This will:

* Generate HTTPS certificates via `generate-certs-unix.sh`
* Start Docker Compose with frontend, backend, and database

---

### 🛨️ To stop services

Run:

```sh
make down
```

---

### 🧹 To clean certificates

Run:

```sh
make clean-certs
```

---

## 🚀 Running without Makefile

If you prefer running manually:

### 1. Generate certificates manually

✅ **Windows:** Run the batch script

```sh
./generate-certs-win.bat
```

✅ **Unix/Linux/macOS:** Run the shell script

```sh
./generate-certs-unix.sh
```

---

### 2. Start Docker Compose

From project root:

```sh
docker-compose up --build
```

---

## 🌐 Service Ports

| Service                 | URL                                              | Notes                                        |
| ----------------------- | ------------------------------------------------ | -------------------------------------------- |
| **Frontend**            | [https://localhost:5173](https://localhost:5173) | React + Vite app served over HTTPS via nginx |
| **Backend**             | [https://localhost:7026](https://localhost:7026) | ASP.NET Core Web API                         |
| **Database (Postgres)** | localhost:6543                                   | Accessible via any Postgres client           |

---

### ⚠️ Notes

* The frontend and backend both use HTTPS, ensure you accept local self-signed certificates in your browser for full functionality.
* PostgreSQL is mapped to **port 6543** externally to avoid conflicts with local installations.

---

## License

MIT License