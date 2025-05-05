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
npm run dev
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

## 📝 Reservation Endpoint Description

The `ReservationService` handles the business logic for managing reservations of spaces and resources. It interacts with a database via Prisma ORM and performs operations like creation, updating, retrieval, and cancellation. Highlights:

### 1. `create(data: CreateReservationDto)`
- Validates client, space, and requested resources (availability and stock).
- Checks for scheduling conflicts.
- Creates reservation and resource relationships.
- Decrements resource quantities.

### 2. `update(id: number, dto: UpdateReservationDto)`
- Ensures reservation exists and is `OPEN`.
- Validates client, space, and new resources.
- Deletes old resources and associates new ones.
- Updates reservation details.

### 3. `findAll(page: number = 1)`
- Paginates and returns all reservations with metadata.

### 4. `findOne(id: number)`
- Validates reservation exists and is `OPEN`.
- Ensures all associated data (client, space, resources) are active.

### 5. `cancel(id: number)`
- Cancels reservation only if `OPEN`.
- Marks reservation as `CANCELLED` and records timestamp.

## 🌱 Seed Script

- Seeds initial admin and example data for development.

## 📌 Notes

- Keep `.env` secure and in `.gitignore`.
- Use `.env.example` for reference.
- Resolve `.git/index.lock` issues manually if needed.
- Check Docker MySQL version compatibility if used.

**CodeBuilders Team © 2025**
