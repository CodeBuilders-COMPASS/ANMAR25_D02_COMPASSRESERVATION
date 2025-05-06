# Reservation API - Reservation Management System

## Overview



## Technologies Stack

### Core Dependencies
- **NestJS**: ^11.1.0
  - `@nestjs/common`: ^11.1.0
  - `@nestjs/core`: ^11.1.0
  - `@nestjs/config`: ^4.0.2
  - `@nestjs/platform-express`: ^11.1.0
- **Prisma**: ^6.6.0
  - `@prisma/client`: ^6.6.0
- **Authentication**
  - `bcrypt`: ^5.1.1 (password hashing)
  - `jsonwebtoken`: (via `@nestjs/jwt`: ^11.0.0)
- **Validation**
  - `class-validator`: ^0.14.1
  - `class-transformer`: ^0.5.1
- **API Documentation**
  - `@nestjs/swagger`: ^11.2.0 
- **Middleware & Utilities**
  - `cors`: ^2.8.5
### Runtime
- **Node.js**: (version should be specified in your .nvmrc or engine field)
- **TypeScript**: ^5.7.3

### Development Tools
- **Testing**
  - `jest`: ^29.7.0
  - `@types/jest`: ^29.5.14
  - `ts-jest`: ^29.2.5
  - `supertest`: ^7.0.0
- **Linting & Formatting**
  - `eslint`: ^9.18.0
  - `prettier`: ^3.4.2
  - ESLint plugins:
    - `@eslint/eslintrc`: ^3.2.0
    - `@eslint/js`: ^9.18.0
    - `eslint-config-prettier`: ^10.0.1
    - `eslint-plugin-prettier`: ^5.2.2
- **Build Tools**
  - `@swc/core`: ^1.10.7 (Speedy Web Compiler)
  - `ts-node`: ^10.9.2
  - `tsconfig-paths`: ^4.2.0
- **NestJS CLI**: ^11.0.7



## Installation

### 1. Clone Repository
```bash
git clone git@github.com:CodeBuilders-COMPASS/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment configure (.env)
Rename the `.env.example` file to `.env` and configure the database credentials and default_user.

**.env.example**
```env**.env.example****.env.example**
DATABASE_URL="mysql://USER_DB:PASSWORD_DB@localhost:3306/reservation"
JWT_SECRET="your_jwt_secret"
DEFAULT_USER_NAME=Admin
DEFAULT_USER_EMAIL=admin@example.com
DEFAULT_USER_PASSWORD=admin123
PORT=3000
```

### .env Seed Details
The seed script will:
 Create a default admin user with:
   - Name: `Admin` (configurable via `DEFAULT_USER_NAME`)
   - Email: `admin@example.com` (configurable via `DEFAULT_USER_EMAIL`)
   - Password: `admin123` (hashed with bcrypt, configurable via `DEFAULT_USER_PASSWORD`)


### Environment Variables Reference

| Variable               | Required | Default               | Purpose                          |
|------------------------|----------|-----------------------|----------------------------------|
| `DATABASE_URL`         | Yes      | -                     | Database connection string       |
| `JWT_SECRET`           | Yes      | -                     | JWT signing key                  |
| `DEFAULT_USER_NAME`    | Yes      | -                     | Name for default admin user      |
| `DEFAULT_USER_EMAIL`   | Yes      | -                     | Email for default admin user     |
| `DEFAULT_USER_PASSWORD`| Yes      | -                     | Password for default admin user  |
| `PORT`                 | No       | 3000                  | Application port                 |

### 4. Configure credentials Database with Docker-Compose
Configure the database credentials: `docker-compose.yml` file in the `docker` directory:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql
    environment:
      MYSQL_USER: USER_DB
      MYSQL_ROOT_PASSWORD: PASSWORD_DB
      MYSQL_DATABASE: reservation
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### 5. Start Docker-Compose
```bash
docker-compose -f ./docker/docker-compose.yml up -d
```

### 6. Run Migrations
```bash
npx prisma db push
```


### 7. **Run the seed script**:
```bash
npm run seed
```

**Alternative using Prisma CLI**:
```bash
npx prisma db seed
```
 **Expected output**:
```
✅ Default user created successfully 
```
or
```
 ❗Default user already exists
```

### 8. Start Application
```bash
npm run start
```
# Auth Module Documentation

## Overview

This module handles user authentication, including login functionality with JWT token generation.

## Installation



## Module Configuration

The AuthModule requires the following environment variable:
- `JWT_SECRET`: Secret key for signing JWT tokens

## # Auth Module Documentation - API Endpoints

## 🚀 Endpoints LOGIN

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized` - When invalid credentials are provided
```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

- `500 Internal Server Error` - When JWT_SECRET is not configured
```json
{
  "message": "Internal server error",
  "statusCode": 500
}
```

## Implementation Details

### AuthController
- Handles the `api/v1/auth/login` route
- Validates user credentials
- Returns JWT token on successful authentication

### AuthService
- `validateUser`: Verifies user credentials against the database
- `login`: Generates a JWT token with user payload

### Security
- Passwords are stored as bcrypt hashes
- JWT tokens expire in 1 hour (`expiresIn: '1h'`)
- Password field is excluded from returned user objects

## 🚀 Endpoints USERS

## Base URL
All endpoints are prefixed with `api/v1/users`

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header.

## Endpoints

### 1. Create a User

**Endpoint**: `POST api/v1/users`

**Request Body**:
```json
{
  "name": "string",
  "email": "string (valid email format)",
  "password": "string (min 8 characters)",
  "phone": "string (valid Brazilian phone number)"
}
```

**Success Response (201 Created)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "5511999999999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

**Error Responses**:
- 400 Bad Request: Email already exists or validation failed
- 401 Unauthorized: Missing or invalid JWT token

---

### 2. Get All Users

**Endpoint**: `GET api/v1/users`

**Query Parameters**:
- `name` (optional): Filter by name (contains)
- `email` (optional): Filter by email (contains)
- `status` (optional): Filter by status ("ACTIVE" or "INACTIVE")
- `page` (optional): Pagination page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "5511999999999",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": null
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "5511888888888",
    "status": "ACTIVE",
    "created_at": "2023-01-02T00:00:00.000Z",
    "updated_at": "2023-01-03T00:00:00.000Z"
  }
]
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token

---

### 3. Get Single User

**Endpoint**: `GET api/v1/users/:id`

**Path Parameters**:
- `id`: User ID (positive integer)

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "5511999999999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

**Error Responses**:
- 400 Bad Request: Invalid user ID format
- 401 Unauthorized: Missing or invalid JWT token
- 404 Not Found: User not found

---

### 4. Update User

**Endpoint**: `PATCH api/v1/users/:id`

**Path Parameters**:
- `id`: User ID (positive integer)

**Request Body** (all fields optional):
```json
{
  "name": "string",
  "email": "string (valid email format)",
  "password": "string (min 8 characters, must contain letters and numbers)",
  "phone": "string (10-15 digits)"
}
```

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "5511999999999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 400 Bad Request: Invalid user ID format or validation failed
- 401 Unauthorized: Missing or invalid JWT token
- 404 Not Found: User not found

---

### 5. Delete User (Soft Delete)

**Endpoint**: `DELETE api/v1/users/:id`

**Path Parameters**:
- `id`: User ID (positive integer)

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "5511999999999",
  "status": "INACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 400 Bad Request: Invalid user ID format
- 401 Unauthorized: Missing or invalid JWT token
- 404 Not Found: User not found

---


## 🚀 Endpoints CLIENTS

## Overview

This API provides endpoints for client management, including creation, updating, querying, and deactivation. All endpoints are protected by JWT authentication.

## Base Endpoints

All endpoints are available at `/api/v1/clients`

## Authentication

All endpoints require a valid JWT token in the `Authorization` header.

## Data Models

### Client
```json
{
  "id": 1,
  "name": "John Doe",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01T00:00:00.000Z",
  "email": "john@example.com",
  "phone": "(11) 99999-9999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

### StatusEnum
- `ACTIVE` - Active client
- `INACTIVE` - Inactive client

## Endpoints

### 1. Create Client

**POST** `/api/v1/clients`

Creates a new client in the system.

#### Request:
```json
{
  "name": "John Doe",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01",
  "email": "john@example.com",
  "phone": "(11) 99999-9999"
}
```

#### Response (Success - 201):
```json
{
  "id": 1,
  "name": "John Doe",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01T00:00:00.000Z",
  "email": "john@example.com",
  "phone": "(11) 99999-9999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

#### Possible errors:
- 400 - Email or CPF already registered
- 400 - Invalid date format
- 500 - Internal server error

---

### 2. List Clients

**GET** `/api/v1/clients`

Lists all clients with filtering and pagination options.

#### Query Parameters:
- `page` (optional, default=1) - Page number
- `limit` (optional, default=10) - Items per page
- `email` (optional) - Email filter (contains)
- `name` (optional) - Name filter (contains)
- `cpf` (optional) - CPF filter (contains)
- `status` (optional) - Status filter (ACTIVE/INACTIVE)

#### Response (Success - 200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "cpf": "123.456.789-00",
      "birth_date": "1990-01-01T00:00:00.000Z",
      "email": "john@example.com",
      "phone": "(11) 99999-9999",
      "status": "ACTIVE",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

#### Possible errors:
- 500 - Internal server error

---

### 3. Get Client by ID

**GET** `/api/v1/clients/:id`

Retrieves details of a specific client.

#### Response (Success - 200):
```json
{
  "id": 1,
  "name": "John Doe",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01T00:00:00.000Z",
  "email": "john@example.com",
  "phone": "(11) 99999-9999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

#### Possible errors:
- 404 - Client not found
- 500 - Internal server error

---

### 4. Update Client

**PATCH** `/api/v1/clients/:id`

Updates data of an existing client.

#### Request:
```json
{
  "name": "John Doe Smith",
  "email": "new-email@example.com"
}
```

#### Response (Success - 200):
```json
{
  "id": 1,
  "name": "John Doe Smith",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01T00:00:00.000Z",
  "email": "new-email@example.com",
  "phone": "(11) 99999-9999",
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

#### Possible errors:
- 400 - Invalid date format
- 404 - Client not found
- 500 - Internal server error

---

### 5. Deactivate Client

**DELETE** `/api/v1/clients/:id/deactivate`

Deactivates a client (changes status to INACTIVE). Cannot deactivate clients with open or approved reservations.

#### Response (Success - 200):
```json
{
  "id": 1,
  "name": "John Doe Smith",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01T00:00:00.000Z",
  "email": "new-email@example.com",
  "phone": "(11) 99999-9999",
  "status": "INACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-03T00:00:00.000Z"
}
```

#### Possible errors:
- 400 - Client has open/approved reservations
- 404 - Client not found
- 500 - Internal server error

---

## Validations

### CPF
- Format: `XXX.XXX.XXX-XX`

### Phone
- Accepted formats:
  - `(XX) XXXX-XXXX`
  - `(XX) XXXXX-XXXX`
  - `XX XXXX-XXXX`
  - `XX XXXXX-XXXX`

### Email
- Must be a valid email address

### Birth Date
- Format: `YYYY-MM-DD`

---

## 🚀 Endpoints Resources

# Resources API Documentation

## Overview

This API provides CRUD operations for managing resources in the system. All endpoints require JWT authentication.

## Base URL

`/api/v1/resources`

## Endpoints

### Create a Resource

**URL**: `POST /api/v1/resources`  
**Description**: Creates a new resource  
**Request Body**:
```json
{
  "name": "Resource Name",
  "description": "Resource description (optional)",
  "quantity": 10
}
```

**Success Response**:
```json
{
  "id": 1,
  "name": "Resource Name",
  "description": "Resource description",
  "quantity": 10,
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

**Error Responses**:
- `400 Bad Request` - If resource with same name already exists
- `401 Unauthorized` - If JWT token is missing or invalid

---

### List Resources

**URL**: `GET /api/v1/resources`  
**Description**: Returns paginated list of resources with optional filtering  
**Query Parameters**:
- `name` (optional): Filter by name (partial match)
- `status` (optional): Filter by status (ACTIVE/INACTIVE)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request**: `GET /api/v1/resources?name=Resource&status=ACTIVE&page=1&limit=5`

**Success Response**:
```json
{
  "count": 15,
  "pages": 3,
  "data": [
    {
      "id": 1,
      "name": "Resource Name",
      "description": "Resource description",
      "quantity": 10,
      "status": "ACTIVE",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": null
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - If JWT token is missing or invalid

---

### Get Single Resource

**URL**: `GET /api/v1/resources/:id`  
**Description**: Returns a single resource by ID  
**Parameters**:
- `id` (required): Resource ID (positive integer)

**Example Request**: `GET /api/v1/resources/1`

**Success Response**:
```json
{
  "id": 1,
  "name": "Resource Name",
  "description": "Resource description",
  "quantity": 10,
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": null
}
```

**Error Responses**:
- `400 Bad Request` - If ID is not a positive integer
- `404 Not Found` - If resource with given ID doesn't exist
- `401 Unauthorized` - If JWT token is missing or invalid

---

### Update Resource

**URL**: `PATCH /api/v1/resources/:id`  
**Description**: Updates an existing resource  
**Parameters**:
- `id` (required): Resource ID (positive integer)

**Request Body**:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Success Response**:
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "quantity": 15,
  "status": "ACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request` - If ID is invalid or resource with new name already exists
- `404 Not Found` - If resource with given ID doesn't exist
- `401 Unauthorized` - If JWT token is missing or invalid

---

### Deactivate Resource

**URL**: `DELETE /api/v1/resources/:id/deactivate`  
**Description**: Deactivates a resource (soft delete)  
**Parameters**:
- `id` (required): Resource ID (positive integer)

**Example Request**: `DELETE /api/v1/resources/1/deactivate`

**Success Response**:
```json
{
  "id": 1,
  "name": "Resource Name",
  "description": "Resource description",
  "quantity": 10,
  "status": "INACTIVE",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-03T00:00:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request` - If ID is invalid
- `404 Not Found` - If resource with given ID doesn't exist
- `401 Unauthorized` - If JWT token is missing or invalid

---

## Validation Rules

### Create Resource
- `name`: Required, string, 3-56 characters
- `description`: Optional string
- `quantity`: Required, positive number

### Update Resource
- All fields optional but at least one required
- `name`: If provided, must be unique

### Filter Resources
- `name`: Optional string filter
- `status`: Optional enum (ACTIVE/INACTIVE)
- `page`: Optional positive integer (default: 1)
- `limit`: Optional positive integer (default: 10)

---

## Status Codes

- `200 OK`: Successful GET requests
- `201 Created`: Successful resource creation
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found


---


## 🚀 Endpoints SPACES

### 1. Create Space

**POST** `api/v1/spaces`

#### Request Body:

```json
{
  "name": "Conference Room A",
  "description": "A large conference room with a projector.",
  "capacity": 20
}
```

#### Response 201 Created:

```json
{
  "id": 1,
  "name": "Conference Room A",
  "description": "A large conference room with a projector.",
  "capacity": 20,
  "status": "ACTIVE",
  "createdAt": "2025-04-29T02:34:15.671Z",
  "updateAt": "null"
}
```

**Rules:**
- All fields are required.
- Name must be unique.
- Status is automatically set to `ACTIVE`.
- `createdAt` is generated at creation time.

---

### 2. Edit Space

**PATCH** `api/v1/spaces/:id`

#### Request Body (partial or complete):

```json
{
  "name": "Updated Room Name",
  "description": "New description",
  "capacity": 30
}
```

#### Response 200 OK:

```json
{
  "id": 1,
  "name": "Updated Room Name",
  "description": "New description",
  "capacity": 30,
  "status": "ACTIVE",
  "createdAt": "2025-04-29T02:34:15.671Z",
  "updatedAt": "2025-04-29T03:12:10.123Z"
}
```

**Rules:**
- All fields are optional for updates.
- If changed, updates the `updatedAt` timestamp.
- Same validations as creation (unique name, etc).

---

### 3. List Spaces (with filters and pagination)

**GET** `api/v1/spaces`

#### Query Params:

| Param       | Type     | Description |
|:------------|:---------|:----------|
| `name`      | `string` | Partial name search |
| `capacity`  | `number` | Minimum capacity |
| `status`    | `ACTIVE` or `INACTIVE` | Space status |
| `page`      | `number` | Current page (default: 1) |
| `limit`     | `number` | Items per page (default: 10) |

#### Example call:


**GET** `api/v1/spaces?name=conference&capacity=10&status=ACTIVE&page=1&limit=5`


#### Response 200 OK:

```json
{
  "count": 13,
  "pages": 3,
  "data": [
    {
      "id": 1,
      "name": "Conference Room A",
      "description": "A large conference room with a projector.",
      "capacity": 20,
      "status": "ACTIVE",
      "createdAt": "2025-04-29T01:59:07.671Z",
      "updateAt": "null"
    },
    {
      "id": 2,
      "name": "Meeting Room B",
      "description": "A small meeting room for team discussions.",
      "capacity": 10,
      "status": "ACTIVE",
      "createdAt": "2025-04-29T01:59:07.671Z",
      "updateAt": "2025-04-29T01:59:07.671Z"
    }
  ]
}
```

---

### 4. Get Space by ID

**GET** `api/v1/spaces/:id`

#### Response 200 OK:

```json
{
  "id": 1,
  "name": "Conference Room A",
  "description": "A large conference room with a projector.",
  "capacity": 20,
  "status": "ACTIVE",
  "createdAt": "2025-04-29T02:34:15.671Z"
}
```

#### Error 404:

```json
{
  "statusCode": 404,
  "message": "Space not found",
  "error": "Not Found"
}
```

---

### 5. Deactivate Space (Soft Delete)

**DELETE** `api/v1/spaces/:id/deactivate`

(Note: **Doesn't physically delete**, only changes status.)

#### Response 200 OK:

```json
{
  "id": 1,
  "name": "Conference Room A",
  "description": "A large conference room with a projector.",
  "capacity": 20,
  "status": "INACTIVE",
  "createdAt": "2025-04-29T02:34:15.671Z",
  "updatedAt": "2025-04-29T03:45:22.002Z"
}
```

#### Error 404:

```json
{
  "statusCode": 404,
  "message": "Space not found",
  "error": "Not Found"
}
```

---

## 🚀 Endpoints Reservation

# Reservation Management API

This API provides endpoints for managing reservations of spaces and resources within a facility.

## Authentication
All endpoints require JWT authentication.

## Endpoints

### Create a Reservation
`POST /api/v1/reservations`

**Request:**
```json
{
  "user_id": 1,
  "client_id": 1,
  "space_id": 1,
  "start_date": "2023-12-01T10:00:00Z",
  "end_date": "2023-12-01T12:00:00Z",
  "resources": [
    {
      "resource_id": 1,
      "quantity": 2
    }
  ]
}
```

**Response (Success):**
```json
{
  "id": 1,
  "client_id": 1,
  "user_id": 1,
  "space_id": 1,
  "start_date": "2023-12-01T10:00:00.000Z",
  "end_date": "2023-12-01T12:00:00.000Z",
  "status": "OPEN",
  "created_at": "2023-11-15T08:00:00.000Z",
  "updated_at": null
}
```

### List Reservations
`GET /api/v1/reservations`

**Query Parameters:**
- `cpf` (optional): Filter by client's CPF (format: XXX.XXX.XXX-XX)
- `status` (optional): Filter by reservation status (OPEN, CANCELLED)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "count": 15,
  "pages": 2,
  "data": [
    {
      "id": 1,
      "client_id": 1,
      "user_id": 1,
      "space_id": 1,
      "start_date": "2023-12-01T10:00:00.000Z",
      "end_date": "2023-12-01T12:00:00.000Z",
      "status": "OPEN",
      "created_at": "2023-11-15T08:00:00.000Z",
      "updated_at": null,
      "client": {
        "id": 1,
        "name": "John Doe",
        "cpf": "123.456.789-00"
      },
      "space": {
        "id": 1,
        "name": "Meeting Room A"
      },
      "reservationResources": [
        {
          "resource_id": 1,
          "quantity": 2,
          "resource": {
            "id": 1,
            "name": "Projector"
          }
        }
      ]
    }
  ]
}
```

### Get Reservation Details
`GET /api/v1/reservations/:id`

**Response:**
```json
{
  "id": 1,
  "client_id": 1,
  "user_id": 1,
  "space_id": 1,
  "start_date": "2023-12-01T10:00:00.000Z",
  "end_date": "2023-12-01T12:00:00.000Z",
  "status": "OPEN",
  "created_at": "2023-11-15T08:00:00.000Z",
  "updated_at": null,
  "client": {
    "id": 1,
    "name": "John Doe",
    "cpf": "123.456.789-00"
  },
  "space": {
    "id": 1,
    "name": "Meeting Room A"
  },
  "reservationResources": [
    {
      "resource_id": 1,
      "quantity": 2,
      "resource": {
        "id": 1,
        "name": "Projector"
      }
    }
  ]
}
```

### Update Reservation
`PATCH /api/v1/reservations/:id`

**Request:**
```json
{
  "start_date": "2023-12-01T11:00:00Z",
  "end_date": "2023-12-01T13:00:00Z",
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": 1,
  "client_id": 1,
  "user_id": 1,
  "space_id": 2,
  "start_date": "2023-12-01T11:00:00.000Z",
  "end_date": "2023-12-01T13:00:00.000Z",
  "status": "OPEN",
  "created_at": "2023-11-15T08:00:00.000Z",
  "updated_at": "2023-11-15T09:30:00.000Z"
}
```

### Cancel Reservation
`DELETE /api/v1/reservations/:id/cancel`

**Response:**
```json
{
  "id": 1,
  "client_id": 1,
  "user_id": 1,
  "space_id": 2,
  "start_date": "2023-12-01T11:00:00.000Z",
  "end_date": "2023-12-01T13:00:00.000Z",
  "status": "CANCELLED",
  "created_at": "2023-11-15T08:00:00.000Z",
  "updated_at": "2023-11-15T10:00:00.000Z"
}
```

## Validation Rules

### Create Reservation
- All fields are required
- Client, space, and resources must exist and be active
- No time conflicts for the same space
- Resource quantities must be available

### Update Reservation
- All referenced entities must exist and be active
- If the `status` field is provided in the update request, it must adhere to the following rules:
    1. The status **cannot** be changed to `CANCELLED` through this update endpoint.
    2. The status can only be changed to `APPROVED` if the current status is `OPEN`
    3. The status can only be changed to `CLOSED` if the current status is `APPROVED`.
      

### Cancel Reservation
- Only OPEN reservations can be cancelled

## Error Responses

**Reservation Conflict:**
```json
{
  "statusCode": 400,
  "message": "Reservation conflict for the selected time and space",
  "error": "Bad Request"
}
```

**Reservation Not Found:**
```json
{
  "statusCode": 404,
  "message": "Reservation not found",
  "error": "Not Found"
}
```

**Invalid CPF Format:**
```json
{
  "statusCode": 400,
  "message": "CPF must be in the format XXX.XXX.XXX-XX",
  "error": "Bad Request"
}
```




