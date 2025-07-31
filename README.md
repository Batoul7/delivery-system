Delivery Management System - Backend API
## Documentation in Postman https://documenter.getpostman.com/view/38662914/2sB34kDdvu

## Description

A backend API for the delivery management system. This part of the project provides the core functionality for authentication, user management, and permissions.

- **Authentication:** Register new users (clients or drivers) and log in securely.
- **User Management:** Users can view and update their profile information.
- **Admin Management:** The admin has full privileges to view and manage all users in the system.

The backend is built using **Node.js**, **Express**, and **MongoDB** with **JWT**-based authentication to secure the routes.

---

## Installation

Follow these steps to run the project locally:

1. **Clone the repository**
git clone https://github.com/Batoul7/delivery-system
cd project

2. **Install dependencies**
npm install

3. **Create a .env file:**
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://YOUR_NAME:YOUR_PASSWORD@cluster0.u1mv7ig.mongodb.net/delivery_project?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=174ea878765acd75165ffa0d86650fb639d460fd85a570d4ebddc4247fcc19f0

# Mailtrap Credentials for Development
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=YOUR_EMAIL_PORT
EMAIL_USERNAME=YOUR_EMAIL_USERNAME
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD

# Admin Credentials
ADMIN_NAME="Admin user"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="Admin123@"
ADMIN_PHONE_NUMBER="0911223344"

4. **Run the server**:
npm run watch

---


## Used Libraries & Packages
| Library                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `express`              | Web framework for building APIs.                              |
| `mongoose`             | ODM for MongoDB.                                              |
| `dotenv`               | Loads environment variables from a `.env` file.               |
| `jsonwebtoken`         | Handles JWT-based authentication.                             |
| `argon2`               | Secure password hashing algorithm.                            |
| `bcryptjs`             | Alternative library for hashing passwords.                    |
| `cors`                 | Enables Cross-Origin Resource Sharing.                        |
| `helmet`               | Helps secure Express apps by setting various HTTP headers.    |
| `morgan`               | Logs HTTP requests during development.                        |
| `express-async-handler`| Handles exceptions inside of async express routes.            |
| `express-validator`    | A set of express.js middlewares that wraps validator.js.      |
| `express-rate-limit`   | Basic rate-limiting middleware for Express.                   |
| `nodemailer`           | Module for sending emails.                                    |
| `socket.io`            | Enables real-time, bidirectional and event-based communication|
| `nodemon`              | Automatically restarts the server on file changes.            |

---

##  API Endpoints Summary

## Authentication

| Method | Endpoint                        | Description            | Auth Required |
|--------|---------------------------------|------------------------|---------------|
| POST   | /api/auth/signup                | Register a new user    | no            |
| POST   | /api/auth/signin                | Login and get token    | no            |
| POST   | /api/auth/logout                | Logout user            | yes           |
| PUT    | /api/auth/change-password       | Change Password        | yes           |
| POST   | /api/auth/forgot-password       | Forgot Password        | no            |
| PUT    | /api/auth/reset-password/:token | Reset Password         | no            |



---

## User Management 

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| GET    | /api/users/me      | Get user profile         | yes           |
| PUT    | /api/users/me      | Update user info         | yes           |
| GET    | /api/users/drivers | GET All Drivers          | yes           |

---


## Admin Management

These routes require admin privileges for access.

| Method | Endpoint              | Description                 | Auth Required (Admin)? |
| ------ | --------------------  | --------------------------- | ---------------------- |
| GET    | /api/admin/users      | View and manage all users.  | Yes (Admin only)       |
| DELETE | /api/admin/users/:id  | Delete a specific user.     | Yes (Admin only)       |
| GET    | /api/admin/logs       | View all logs               | Yes (Admin only)       |

---

# Orders APIS 

## 📝 Create New Order

- **Authorized Role:** Client
- **Method:** `POST`
- **Endpoint:** `/api/orders`
- **Description:** Creates a new order.
- **Request Body:**
```json
{
  "pickupAddress": "Damascus - Al-Midan",
  "deliveryAddress": "Damascus - Al-Bramka",
  "deliveryLocation": {
    "type": "Point",
    "coordinates": [35.205, 31.902]
  },
  "description": "Official document delivery",
  "expectedDeliveryTime": "2025-08-01T14:00:00.000Z"
}
```

---

## 📋 Get All Orders (Admin)

- **Method:** `GET`
- **Endpoint:** `/api/orders`
- **Description:** Retrieves all orders with optional filters (status, driver, city).

---

## 📂 Get Available Orders (Driver)

- **Method:** `GET`
- **Endpoint:** `/api/orders/available`
- **Description:** Lists all unassigned orders with status `pending`.

---

## 🔍 Get one Order

- **Method:** `GET`
- **Endpoint:** `/api/orders/:id`
- **Description:** Retrieves details for a specific order by ID.

---

## ✏️ Update Order (Admin)

- **Method:** `PUT`
- **Endpoint:** `/api/orders/:id`
- **Description:** Allows Client to update order data .

---

## ✅ Accept Order (Driver)

- **Method:** `PUT`
- **Endpoint:** `/api/orders/:id/accept`
- **Description:** Allows a driver to accept an order, changing status to `accepted`.

---

## 🔄 Update Order Status (Driver)

- **Method:** `PUT`
- **Endpoint:** `/api/orders/:id/status`
- **Description:** Update the current status of the order.
- **Example Body:**
```json
{
  "status": "in_progress"
}
```

---

## 🗑️ Delete Order (Admin)

- **Method:** `DELETE`
- **Endpoint:** `/api/orders/:id`
- **Description:** Allows admin to delete an order by ID.

---

# Ratings APIs

## 📝 Add New Rating (Client)

**Authorized Role:** Client
**Method:** POST
**Endpoint:** /api/ratings
**Description:** Allows the client to submit a rating after a delivered order
**Request Body:**
```json
{
  "order": "11",
  "driver": "11",
  "stars": 4.5,
  "comment": "خدمة ممتازة وسريعة"
}
```
**Response:**
```json
{
  "message": "Rating added successfully",
  "rating": {
    "_id": "...",
    "stars": 4.5,
    "comment": "خدمة ممتازة وسريعة",
    ...
  },
  "averageRating": "4.75"
}
```

---


# 📊 Get All Ratings for a Driver

**Method:** GET
**Endpoint:** /api/ratings/driver/:driverId
**Description:** Retrieves all ratings associated with a specific driver, including the average rating.
**Response:**
```json
{
  "driverId": "33",
  "totalRatings": 4,
  "averageRating": "4.50",
  "ratings": [
    {
      "_id": "...",
      "stars": 4,
      "comment": "جيد جداً",
      "client": {
        "_id": "...",
        "name": "Ali"
      }
    }
  ]
}
```


---

## 🔌 Backend WebSocket (Socket.IO) Architecture

### Overview
Our real-time functionality is powered by Socket.IO, enabling instant communication between the server, clients, and drivers. The architecture relies on a system of events and rooms to ensure messages are delivered efficiently and only to relevant parties.

### Authentication
Every WebSocket connection is authenticated using the same JSON Web Token (JWT) provided during the initial HTTP login. The server validates the token upon connection, attaching the user's payload (ID, role, email) to the socket instance for secure, session-aware communication.

### Room Management
We use a room-based system to segment communication channels:

- **`drivers_room`**: Global room all authenticated drivers join automatically upon connection. Used for broadcasting new order availability.
- **`orderId` rooms**: Unique per-order rooms where both the client (order creator) and assigned driver join for private order-specific communication.

---

## Key WebSocket Events
| Event Name             | Emitter       | Listener   | Room           | Description                                                                 | 
| -----------------------| --------------| ---------- | ---------------| ----------------------------------------------------------------------------|
| `joinOrderRoom`        | Client/Driver | Server     | `orderId`      | User requests to join a specific order's room                               |
| `newOrderAvailable`    | Server        | Drivers    | `drivers_room` | Broadcasts new order object to all drivers                                  |
| `orderAccepted`        | Server        | Client     | `orderId`      | Notifies client their order was accepted                                    |
| `updateDriverLocation` | Driver        | Server     | `orderId`      | Driver sends new coordinates (lat, lng) with Global                         |
| `driverLocationUpdated`| Server        | Client     | `orderId`      | Relays driver's coordinates to relevant client                              |
| `driverApproaching`    | Server        | Client     | `orderId`      | Triggers when driver is within predefined radius (e.g., 1km) of destination |

---

## Event-Driven Workflow
1. **New Order Flow**:
   ```mermaid
   graph LR
   A[Client creates order] --> B[Server emits 'newOrderAvailable']
   B --> C[Drivers in 'drivers_room' receive notification]
   C --> D[Driver accepts order]
   D --> E[Server emits 'orderAccepted' to client]
