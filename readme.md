🚗 Project Name: Vehicle Management System

🌐 Live URL: https://vehicle-management-system-seven-flame.vercel.app/

# 📌 Features
### User Management
    - Admin: create, update, delete users
    - Customer: view and update own profile

### Vehicle Management
    - Admin: add, update, delete vehicles
    - Vehicle availability management

### Booking System
    - Customer or Admin can create bookings
    - Automatic price calculation
    - Vehicle availability updates automatically
    - Booking status management (active, cancelled, returned)
    - Role-based access control (Admin / Customer)

### JWT-based authentication
    - API error handling with meaningful messages

### 🛠 Technology Stack
    - Backend: Node.js, TypeScript
    - Framework: Express.js
    - Database: PostgreSQL
    - Authentication: Bcrypt (password hashing), JWT (JSON Web Tokens)
    - Testing / Dev Tools: Postman

## ⚙️ Setup & Usage

### 1. Clone the repository
    git clone https://github.com/Md-Sufian-Jidan/Assignment-2-Vehicle-Management-System.git
    cd Vehicle-Management-System

### 2. Install dependencies
    npm install

### 3. Create a .env file in the root directory
    ni .env (For PowerShell) or touch .env (For Git Bash)

    PORT=5000
    DATABASE_URL=postgres://username:password@localhost:5432/your_database
    TOKEN_SECRET=your_jwt_secret

### 4. Start the server in development mode
    npm run dev

### The server should now be running at:
### http://localhost:5000

### API Testing
#### Use Postman or a similar tool
    - Include Authorization: Bearer <jwt_token> in headers for protected routes
#### Available endpoints:
    - POST /api/v1/auth/signup - Register a new user account
    - POST /api/v1/auth/signin - Login and receive JWT authentication token
    - POST /api/v1/vehicles - Add a new vehicle to the system (Admin only)
    - GET /api/v1/vehicles - Retrieve all vehicles in the system
    - GET /api/v1/vehicles/:vehicleId - Retrieve specific vehicle details
    - PUT /api/v1/vehicles/:vehicleId - Update vehicle details, price, or availability status (Admin only)
    - DELETE /api/v1/vehicles/:vehicleId - Delete a vehicle (only if no active bookings exist) (Admin only)
    - GET /api/v1/users - Retrieve all users in the system (Admin only)
    - PUT /api/v1/users/:userId - Admin can update any user's role or details. Customer can update own profile only
    - DELETE /api/v1/users/:userId - Delete a user (only if no active bookings exist) (Admin only)
    - POST /api/v1/bookings - Create a new booking with automatic price calculation and vehicle status update
    - GET /api/v1/bookings - Retrieve bookings based on user role (Admin sees all, Customer sees own)
    - PUT /api/v1/bookings/:bookingId - Update booking status based on user role and business rules

### HTTP Status Codes Table

```markdown
| Code | Meaning                | Usage                                   |
|------|------------------------|-----------------------------------------|
| 200  | OK                     | Successful GET, PUT, DELETE             |
| 201  | Created                | Successful POST (resource created)      |
| 400  | Bad Request            | Validation errors, invalid input        |
| 401  | Unauthorized           | Missing or invalid authentication token |
| 403  | Forbidden              | Valid token but insufficient permissions|
| 404  | Not Found              | Resource doesn't exist                  |
| 500  | Internal Server Error  | Unexpected server errors                |