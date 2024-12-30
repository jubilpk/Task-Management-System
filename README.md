# Task Management System

## Description
A simple web-based task management system to demonstrate Full-Stack development skills. This project includes:
- Frontend: HTML, CSS, JavaScript.
- Backend: PHP with MySQL.

## Features
- Add tasks (name, description, due date).
- View tasks in a list.
- Update task status (mark as completed or pending).
- Edit tasks (name, description, due date, status)
- Delete tasks.

## Setup Instructions
1. Ensure XAMPP is installed and running (Apache and MySQL services).
2. Clone or copy the project folder into the `htdocs` directory.
3. Create a database in MySQL named `task_manager` and a table `tasks` as described in the project.
4. Access the project via `http://localhost/task_management/frontend/index.html`.

## API Endpoints
- **GET /tasks**: Retrieve all tasks.
- **POST /tasks**: Add a new task.
- **PUT /tasks/{id}**: Update a task's status.
- **DELETE /tasks/{id}**: Delete a task.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript (Fetch API for CRUD operations).
- **Backend**: PHP, MySQL.

