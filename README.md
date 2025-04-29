

## 🚀 Endpoints SPACES

### 1. Create Space

**POST** `/spaces`

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
  "createdAt": "2025-04-29T02:34:15.671Z"
}
```

**Rules:**
- All fields are required.
- Name must be unique.
- Status is automatically set to `ACTIVE`.
- `createdAt` is generated at creation time.

---

### 2. Edit Space

**PATCH** `/spaces/:id`

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

**GET** `/spaces`

#### Query Params:

| Param       | Type     | Description |
|:------------|:---------|:----------|
| `name`      | `string` | Partial name search |
| `capacity`  | `number` | Minimum capacity |
| `status`    | `ACTIVE` or `INACTIVE` | Space status |
| `page`      | `number` | Current page (default: 1) |
| `limit`     | `number` | Items per page (default: 10) |

#### Example call:

```
GET /spaces?name=conference&capacity=10&status=ACTIVE&page=1&limit=5
```

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
      "createdAt": "2025-04-29T01:59:07.671Z"
    },
    {
      "id": 2,
      "name": "Meeting Room B",
      "description": "A small meeting room for team discussions.",
      "capacity": 10,
      "status": "ACTIVE",
      "createdAt": "2025-04-29T01:59:07.671Z"
    }
  ]
}
```

---

### 4. Get Space by ID

**GET** `/spaces/:id`

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

**PATCH** `/spaces/:id/deactivate`

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

# 📄 Object Structure (Space)

```typescript
interface Space {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt?: Date;
}
```
