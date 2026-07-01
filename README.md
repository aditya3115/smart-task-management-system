# Smart Task Management System

Smart Task Management System is an MCA major project designed to help users create, organize, track, and complete tasks through a secure web-based dashboard. The system provides user authentication, task management, status tracking, priority filtering, dashboard analytics, and a responsive Bootstrap 5 frontend.

The project follows an MVC-style Node.js and Express.js backend architecture with MySQL as the database. The frontend is built using HTML5, CSS3, Bootstrap 5, and vanilla JavaScript, and it communicates with the backend through REST APIs.

## Project Objectives

- Provide a simple and secure task management platform.
- Allow users to register, log in, and manage their own task records.
- Support task creation, viewing, editing, completion, deletion, filtering, and searching.
- Display dashboard analytics such as total tasks, pending tasks, completed tasks, overdue tasks, charts, and recent tasks.
- Use a responsive design so the application works on desktop, tablet, and mobile screens.
- Demonstrate a clean full-stack project structure suitable for academic presentation and future enhancement.

## Key Features

- User registration and login with JWT authentication.
- Password hashing using bcrypt.
- Protected task APIs using authentication middleware.
- Task CRUD operations.
- Task status management: pending, in progress, and completed.
- Task priority management: low, medium, and high.
- Task category and due date support.
- Dashboard summary cards for total, pending, completed, and overdue tasks.
- Canvas-based dashboard charts without extra chart libraries.
- Recent tasks and due-soon task sections.
- Responsive Bootstrap 5 frontend pages.
- Centralized validation and error handling.
- MySQL database schema with users and tasks tables.

## Completed Frontend Pages

- Login
- Register
- Forgot Password
- Reset Password
- Dashboard
- Task List
- Add Task
- Edit Task
- Events
- Add Event
- Edit Event
- Profile

## Completed Backend Modules

- Express.js application setup
- Environment configuration using dotenv
- MySQL connection pool using mysql2
- User model and authentication controller
- Task model and task controller
- JWT helper utilities
- Request validation using express-validator
- Authentication middleware
- Centralized 404 and error handlers

## Installation Guide

Follow these steps to set up and run the project on a local machine.

### Prerequisites

Install the following software before running the project:

- Node.js
- npm
- MySQL Server
- MySQL client or GUI tool such as MySQL Workbench
- Code editor such as Visual Studio Code

### 1. Open The Project Folder

Open a terminal inside the project directory:

```bash
cd smart-task-management-system
```

### 2. Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

Main packages used by the project include Express.js, MySQL2, bcrypt, jsonwebtoken, dotenv, helmet, cors, express-validator, Bootstrap, and nodemon.

### 3. Configure Environment Variables

Create a `.env` file in the project root. You can copy the values from `.env.example` and update them according to your local MySQL setup.

Example:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_task_management_system
DB_CONNECTION_LIMIT=10

JWT_SECRET=replace_with_your_secure_jwt_secret
JWT_EXPIRES_IN=1d
```

Important fields:

- `PORT` defines the server port.
- `DB_USER` is your MySQL username.
- `DB_PASSWORD` is your MySQL password.
- `DB_NAME` is the project database name.
- `JWT_SECRET` is used to sign authentication tokens.

### 4. Create And Import The Database

Open MySQL and run the schema file:

```text
database/schema.sql
```

The schema file creates the database, users table, tasks table, indexes, relationships, and sample records.

If you want to create the database manually first, run:

```sql
CREATE DATABASE smart_task_management_system;
```

Then import the full schema file into that database.

### 5. Start The Development Server

Run the project in development mode:

```bash
npm run dev
```

The server will attempt to start on the port configured in `.env` (default `5000`). If that port is unavailable, it will automatically try the next ports until it finds one that is free.

The server starts at:

```text
http://localhost:5000
```

If the default port is busy, check the terminal output for the actual port used.

### 6. Open The Application

Open the following URL in a browser:

```text
http://localhost:5000
```

The application loads the login page. New users can register, then access the dashboard and task management pages.

### 7. Production Start Command

For production-style execution, use:

```bash
npm start
```

### 8. Common Setup Issues

- If the database connection fails, check MySQL is running.
- If login or task APIs fail, confirm `.env` database values are correct.
- If JWT authentication fails, confirm `JWT_SECRET` exists in `.env`.
- If Bootstrap files do not load, run `npm install` again.

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

All API responses follow a common JSON format.

Success response:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Authentication Header

Protected routes require a JWT token in the request header:

```text
Authorization: Bearer your_token_here
```

The frontend stores the token after login or registration and sends it automatically when calling protected APIs.

### Endpoint Summary

```text
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/complete
DELETE /api/tasks/:id
```

### Health Check

```text
GET /api/health
```

Checks whether the API server is running.

Example response:

```json
{
  "success": true,
  "message": "API health check successful",
  "timestamp": "2026-07-01T00:00:00.000Z"
}
```

### Register User

```text
POST /api/auth/register
```

Creates a new user account.

Request body:

```json
{
  "name": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "Password123"
}
```

Validation rules:

- Name is required and must be 2 to 100 characters.
- Email is required and must be valid.
- Password must be at least 8 characters.
- Password must include uppercase, lowercase, and number.

Example response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Aditya Sharma",
      "email": "aditya@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Login User

```text
POST /api/auth/login
```

Authenticates an existing user.

Request body:

```json
{
  "email": "aditya@example.com",
  "password": "Password123"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Aditya Sharma",
      "email": "aditya@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Profile

```text
GET /api/auth/profile
```

Protected: Yes

Returns the authenticated user's profile.

Example response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Aditya Sharma",
      "email": "aditya@example.com",
      "role": "user",
      "created_at": "2026-07-01T00:00:00.000Z"
    }
  }
}
```

### Logout

```text
POST /api/auth/logout
```

Protected: Yes

JWT logout is handled mainly on the client side by removing the saved token. The backend endpoint confirms that the authenticated user can end the session.

### Create Task

```text
POST /api/tasks
```

Protected: Yes

Creates a new task for the authenticated user.

Request body:

```json
{
  "title": "Create dashboard UI",
  "description": "Build the Bootstrap dashboard page.",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "dueDate": "2026-07-20"
}
```

Allowed status values:

```text
pending, in_progress, completed
```

Allowed priority values:

```text
low, medium, high
```

### Get All Tasks

```text
GET /api/tasks
```

Protected: Yes

Returns all tasks for the authenticated user.

Supported query parameters:

```text
status=pending
priority=high
category=Development
dueBefore=2026-07-31
dueAfter=2026-07-01
search=dashboard
sortBy=dueDate
sortOrder=asc
```

Allowed `sortBy` values:

```text
createdAt, updatedAt, dueDate, priority, status, title
```

Allowed `sortOrder` values:

```text
asc, desc
```

Example:

```text
GET /api/tasks?status=pending&priority=high&sortBy=dueDate&sortOrder=asc
```

### Get Single Task

```text
GET /api/tasks/:id
```

Protected: Yes

Returns one task by ID. The task must belong to the authenticated user.

Example:

```text
GET /api/tasks/1
```

### Update Task

```text
PUT /api/tasks/:id
```

Protected: Yes

Updates an existing task.

Request body:

```json
{
  "title": "Update dashboard UI",
  "description": "Improve cards and charts.",
  "status": "in_progress",
  "priority": "medium",
  "category": "Development",
  "dueDate": "2026-07-25"
}
```

### Complete Task

```text
PATCH /api/tasks/:id/complete
```

Protected: Yes

Marks a task as completed and sets the completion timestamp.

Example:

```text
PATCH /api/tasks/1/complete
```

### Delete Task

```text
DELETE /api/tasks/:id
```

Protected: Yes

Deletes a task owned by the authenticated user.

Example:

```text
DELETE /api/tasks/1
```

### Common HTTP Status Codes

- `200 OK`: Request completed successfully.
- `201 Created`: New user or task created successfully.
- `401 Unauthorized`: Token is missing, invalid, or expired.
- `404 Not Found`: Requested record does not exist.
- `409 Conflict`: Email is already registered.
- `422 Unprocessable Entity`: Validation failed.
- `500 Internal Server Error`: Unexpected server error.

## Folder Structure

```text
smart-task-management-system/
|-- database/
|   |-- schema.sql
|   `-- migrations/
|       |-- 001_create_users_table.sql
|       `-- 002_add_task_category_and_indexes.sql
|
|-- public/
|   |-- assets/
|   |   `-- images/
|   |       `-- auth-bg.svg
|   |-- css/
|   |   |-- app.css
|   |   `-- auth.css
|   |-- js/
|   |   |-- app-common.js
|   |   |-- dashboard.js
|   |   |-- login.js
|   |   |-- profile.js
|   |   |-- register.js
|   |   |-- task-form.js
|   |   `-- tasks.js
|   |-- add-task.html
|   |-- dashboard.html
|   |-- edit-task.html
|   |-- login.html
|   |-- profile.html
|   |-- register.html
|   `-- tasks.html
|
|-- src/
|   |-- config/
|   |   |-- appConfig.js
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   `-- taskController.js
|   |-- middlewares/
|   |   |-- authMiddleware.js
|   |   |-- errorHandler.js
|   |   |-- notFound.js
|   |   `-- validateRequest.js
|   |-- models/
|   |   |-- taskModel.js
|   |   `-- userModel.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- index.js
|   |   `-- taskRoutes.js
|   |-- utils/
|   |   |-- apiResponse.js
|   |   `-- jwt.js
|   |-- validators/
|   |   |-- authValidator.js
|   |   `-- taskValidator.js
|   |-- app.js
|   `-- server.js
|
|-- .env.example
|-- package.json
|-- package-lock.json
`-- README.md
```

### Folder Details

- `database/`: Contains SQL schema and migration files for MySQL database setup.
- `public/`: Contains all frontend HTML, CSS, JavaScript, and static assets.
- `public/css/`: Contains frontend styling files.
- `public/js/`: Contains page-specific JavaScript and shared frontend helper functions.
- `src/`: Contains the backend Node.js and Express.js source code.
- `src/config/`: Contains application and database configuration.
- `src/controllers/`: Contains request handling logic for authentication and tasks.
- `src/middlewares/`: Contains authentication, validation, 404, and error handling middleware.
- `src/models/`: Contains MySQL database query logic.
- `src/routes/`: Contains API route definitions.
- `src/utils/`: Contains reusable helper functions such as JWT and API response helpers.
- `src/validators/`: Contains request validation rules using express-validator.

### Important Files

- `src/server.js`: Starts the Express server.
- `src/app.js`: Configures middleware, static files, and API routes.
- `src/config/db.js`: Creates the MySQL connection pool.
- `database/schema.sql`: Creates the database tables and sample records.
- `public/dashboard.html`: Main dashboard page.
- `public/js/app-common.js`: Shared frontend API and authentication helper functions.
- `package.json`: Contains project metadata, scripts, and dependencies.
- `.env.example`: Example environment configuration file.

## Technology Stack

### Frontend

- HTML5: Used to create the structure of all web pages.
- CSS3: Used for custom styling and responsive layout improvements.
- Bootstrap 5: Used for responsive grid layout, navigation, buttons, forms, alerts, and utility classes.
- Vanilla JavaScript: Used for API calls, form validation, authentication handling, dashboard charts, and dynamic UI rendering.
- Canvas API: Used to draw dashboard charts without an external chart library.

### Backend

- Node.js: JavaScript runtime used to build the server-side application.
- Express.js: Web framework used to create APIs, configure middleware, and serve frontend files.
- MySQL2: Used to connect Node.js with the MySQL database using a connection pool.
- bcrypt: Used for secure password hashing.
- JSON Web Token: Used for stateless user authentication.
- dotenv: Used to load environment variables from the `.env` file.
- helmet: Used to add basic security-related HTTP headers.
- cors: Used to configure cross-origin API access.
- express-validator: Used to validate user input and API request data.

### Database

- MySQL: Relational database used to store users and tasks.
- SQL schema: Used to create tables, relationships, indexes, and sample records.

### Development Tools

- npm: Used for dependency management and running project scripts.
- nodemon: Used to restart the server automatically during development.
- Visual Studio Code: Recommended code editor for development.
- MySQL Workbench: Recommended GUI tool for database setup and inspection.

## Screenshots Placeholder

Add final screenshots after running the project locally.

### Login Page

```text
Screenshot Placeholder: Login page with email and password form.
```

### Register Page

```text
Screenshot Placeholder: Register page with name, email, password, and confirm password fields.
```

### Dashboard Page

```text
Screenshot Placeholder: Dashboard with total tasks, pending, completed, overdue cards, charts, and recent tasks.
```

### Task List Page

```text
Screenshot Placeholder: Task list page with search, filters, edit, complete, and delete actions.
```

### Add Task Page

```text
Screenshot Placeholder: Add task form with title, description, status, priority, due date, and category.
```

### Edit Task Page

```text
Screenshot Placeholder: Edit task form with pre-filled task details.
```

### Profile Page

```text
Screenshot Placeholder: Profile page showing user name, email, role, and joined date.
```

## Future Scope

The current system covers the core task management workflow. The following features can be added in future versions:

- Admin dashboard for managing all users and tasks.
- Email verification during user registration.
- Password reset using email OTP or reset link.
- Task reminders through email or browser notifications.
- File attachments for tasks.
- Team collaboration and task assignment.
- Task comments and activity history.
- Calendar view for due dates.
- Drag-and-drop task board using columns such as Pending, In Progress, and Completed.
- Advanced reports for productivity and completion trends.
- Export tasks to PDF, Excel, or CSV.
- Dark mode support.
- Pagination for large task lists.
- Role-based access control for admin and normal users.
- Unit and integration tests for APIs.
- Docker-based deployment setup.

## Deployment Guide

This project can be deployed on any server that supports Node.js and MySQL.

### 1. Prepare The Server

Install the required software on the production server:

- Node.js
- npm
- MySQL Server
- Process manager such as PM2
- Web server such as Nginx or Apache, if reverse proxy is required

### 2. Upload Project Files

Upload the project folder to the server. Do not upload unnecessary development files such as local logs or temporary files.

Recommended production folder example:

```text
/var/www/smart-task-management-system
```

### 3. Install Production Dependencies

Inside the project directory, run:

```bash
npm install --production
```

If development dependencies are also needed for your deployment workflow, use:

```bash
npm install
```

### 4. Configure Environment Variables

Create a production `.env` file:

```env
NODE_ENV=production
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=production_database_user
DB_PASSWORD=production_database_password
DB_NAME=smart_task_management_system
DB_CONNECTION_LIMIT=10

JWT_SECRET=use_a_long_secure_random_secret
JWT_EXPIRES_IN=1d
```

Important production notes:

- Use a strong `JWT_SECRET`.
- Do not commit the `.env` file to version control.
- Use a MySQL user with only the permissions required by the application.
- Keep database credentials private.

### 5. Set Up The Database

Create the production database and import the schema:

```sql
CREATE DATABASE smart_task_management_system;
```

Then import:

```text
database/schema.sql
```

For production, sample seed records can be removed or replaced with real initial data.

### 6. Start The Application

Run the server directly:

```bash
npm start
```

For production, using PM2 is recommended:

```bash
pm2 start src/server.js --name smart-task-management-system
```

Save the PM2 process list:

```bash
pm2 save
```

### 7. Configure Reverse Proxy

If using Nginx, configure it to forward traffic to the Node.js server running on port `5000`.

Example Nginx location block:

```nginx
location / {
  proxy_pass http://localhost:5000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 8. Enable HTTPS

Use SSL/TLS in production. A common option is Let's Encrypt with Certbot.

After enabling HTTPS, access the application using:

```text
https://your-domain.com
```

### 9. Production Checklist

- `.env` file is configured correctly.
- MySQL database is running.
- Database schema is imported.
- `JWT_SECRET` is strong and private.
- Application starts with `npm start` or PM2.
- Reverse proxy points to the correct port.
- HTTPS is enabled.
- Login, register, dashboard, and task APIs are tested after deployment.
