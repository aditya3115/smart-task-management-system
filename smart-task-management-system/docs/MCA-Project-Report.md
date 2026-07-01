# MCA Project Report: Smart Task Management System

## Project Title
Smart Task Management System

## Objective
Develop a web-based task management platform with secure user authentication, task lifecycle management, event tracking, and dashboard analytics suitable for an MCA major project.

## Overview
This project demonstrates a full-stack application using Node.js, Express.js, MySQL, and Bootstrap-based frontend pages. It is built with modular MVC-style backend code and a responsive user interface.

## Technology Stack
- Node.js
- Express.js
- MySQL
- HTML5, CSS3, JavaScript
- Bootstrap 5
- JWT authentication
- bcrypt password hashing
- express-validator for request validation
- helmet and cors for security

## System Architecture
- `src/app.js`: Express application setup, middleware, static file serving, route registration.
- `src/server.js`: Server startup entry point.
- `src/routes/`: API routing for authentication, tasks, and events.
- `src/controllers/`: Business logic for authentication, task, and event operations.
- `src/models/`: Database access layer for users, tasks, and events.
- `src/middlewares/`: Authentication, validation, error handling.
- `src/utils/`: Shared API response and JWT utilities.
- `public/`: Frontend HTML, CSS, and JavaScript pages.

## Page Structure
The application includes the following pages:

- `login.html`: Secure login page with remember-me option and redirect to dashboard.
- `register.html`: User registration with password validation.
- `forgot-password.html`: Email-based password reset request.
- `reset-password.html`: Password reset form with token handling.
- `dashboard.html`: Main overview page with task summary cards, recent task list, and due-soon section.
- `tasks.html`: Task management page with search, filters, and task action buttons.
- `add-task.html`: Form to create a new task.
- `edit-task.html`: Form to update an existing task.
- `events.html`: Event management page supporting event search and deletion.
- `add-event.html`: Form to add a new event.
- `edit-event.html`: Form to edit an existing event.
- `profile.html`: User profile page showing current account details.

### Consistent UI Elements
- Navbar and sidebar structure are standardized on all authenticated pages.
- Auth pages share a consistent form layout and alert handling.
- Dashboard uses summary cards and quick action buttons for an academic presentation.

## Database Schema
The database schema includes:
- `users`: user id, name, email, password hash, role, timestamps.
- `tasks`: task id, user id, title, description, status, priority, category, due date, timestamps.
- `events`: event id, user id, title, description, status, category, location, event date, timestamps.

## Functional Highlights
- Protected API endpoints for tasks and events.
- User-based data isolation through authenticated requests.
- Task filtering, sorting, and search capabilities.
- Dashboard analytics with total, pending, completed, and overdue task counts.
- Responsive design suitable for desktop and mobile.

## Installation
1. Clone the project.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Import `database/schema.sql` into MySQL.
5. Run `npm run dev`.

## Future Enhancements
- Add role-based access for admin and student accounts.
- Include chart visualization using a library like Chart.js.
- Add task deadlines and calendar views.
- Implement file uploads for attachments.

## Conclusion
This project is structured to meet MCA academic standards by combining a documented backend architecture, responsive frontend pages, authentication, CRUD operations, and clear project documentation.
