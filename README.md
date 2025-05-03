# Compass Reservation API

RESTful API for managing space and resource reservations, developed with **NestJS**, **Prisma**, **TypeScript**, **MySQL**, and documented with **Swagger**.

## 📚 Technologies

- **NestJS** – Backend framework  
- **TypeScript** – Main language  
- **Prisma ORM** – Database access and migrations  
- **MySQL / MariaDB** – Relational database (via XAMPP or Docker)  
- **Swagger** – Automatic API documentation (`/api`)  
- **Docker & Docker Compose** – Optional containers for MySQL and services  
- **Jest + Supertest** – Unit and integration testing  
- **ESLint & Prettier** – Linter and code formatter  
- **class-validator / class-transformer** – DTO validations  
- **JWT (jsonwebtoken) + Passport** – Token-based authentication  
- **bcrypt** – Password hashing  

## 📁 Folder Structure

```
src/
├── clients/
├── decorators/
├── enums/
├── middlewares/
├── prisma/
├── reservations/
├── resources/
├── spaces/
├── users/
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## ⚙️ Prerequisites

- Node.js v16+ and npm or pnpm  
- XAMPP (MySQL/MariaDB) or Docker (to run MySQL via docker-compose)  

## 📦 Using XAMPP

1. Start Apache and MySQL in the XAMPP control panel.  
2. Open phpMyAdmin and create the database `reservation`.  
3. Verify user/password (default `root` with no password) or adjust in `.env`.  

## 🐳 Using Docker

```bash
# In project root
docker-compose up -d
```

The `docker-compose.yml` already sets up a MySQL container on `localhost:3306` with a persistent data volume.

## 🚀 Installation and Running

1. Clone the repository and switch to the feature branch:

```bash
git clone <repo-url>
cd CompassReservation
git checkout feature/integrate-infra-auth
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables example:

```bash
cp .env.example .env
```

4. Edit `.env` with your credentials.

5. Generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Start the application in development mode:

```bash
npm run start:dev
```

7. Access Swagger documentation at:

```
http://localhost:3000/api
```

## 🧪 Tests

- **Unit** and **e2e** tests:

```bash
npm run test        # run all tests
npm run test:e2e    # run end-to-end tests
```

## 🛠️ Linters & Formatting

- **ESLint**:

```bash
npm run lint
npm run lint:fix
```

- **Prettier**:

```bash
npm run format
```

## 🚦 Project Status

| Module                             | Status              |
|------------------------------------|---------------------|
| NestJS infrastructure              | ✅                  |
| MySQL connection                   | ✅                  |
| Prisma & Migrations                | ✅                  |
| Swagger                            | ✅                  |
| User CRUD                          | 🚧 In progress      |
| Client CRUD                        | 🚧 In progress      |
| Space CRUD                         | 🚧 In progress      |
| Resource CRUD                      | 🚧 In progress      |
| Reservation CRUD                   | 🚧 In progress      |
| Authentication (JWT)               | 🚧 Upcoming         |
| Seed initial admin                 | 🚧 Upcoming         |
| Testing (Jest + Supertest)         | 🚧 Partial coverage |
| Continuous Integration (CI)        | 🚧 Not configured   |

## 📌 Notes

- Keep `.env` secure and ignored by Git (`.gitignore`).  
- If lock file conflicts occur (e.g. `.git/index.lock`), stop editors and remove manually.  
- Use `.env.example` as reference, but ensure it stays updated.  
- When running via Docker, check the MySQL/MariaDB version in `docker-compose.yml`.  

**CodeBuilders Team © 2025**
