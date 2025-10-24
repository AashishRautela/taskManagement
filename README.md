# Task Management System

A robust and scalable task management system built with Node.js and Express.js, designed to help teams organize and track their projects, issues, and collaborations efficiently.

## Features

- **User Management**
  - User registration and authentication
  - Role-based access control
  - User profile management

- **Project Management**
  - Create and manage multiple projects
  - Project member management
  - Project-level access control

- **Issue Tracking**
  - Create, update, and delete issues
  - Issue categorization and prioritization
  - Stage-based workflow management
  - Issue watchers for notifications

- **Team Collaboration**
  - Project member roles and permissions
  - Multiple user assignments per issue
  - Watcher system for issue updates

## Technology Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: MVC with Repository Pattern

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Custom middlewares
├── models/          # Database models
├── repository/      # Data access layer
├── routes/          # API routes
├── services/        # Business logic
└── utils/          # Helper functions and utilities
```

## Installation

1. Install dependencies:

   ```bash
   cd taskManagement
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Run the database seeders:

   ```bash
   npm run seed
   ```

4. Start the server:

   ```bash
   npm start
   ```

## API Documentation

The API is organized around REST principles. All endpoints accept and return JSON data.

Base URL: `/api/v1`

### Main Endpoints:

- **Authentication**
  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - User login

- **Users**
  - `GET /users` - List all users
  - `GET /users/:id` - Get user details
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

- **Projects**
  - `POST /projects` - Create project
  - `GET /projects` - List projects
  - `GET /projects/:id` - Get project details
  - `PUT /projects/:id` - Update project
  - `DELETE /projects/:id` - Delete project

- **Issues**
  - `POST /issues` - Create issue
  - `GET /issues` - List issues
  - `GET /issues/:id` - Get issue details
  - `PUT /issues/:id` - Update issue
  - `DELETE /issues/:id` - Delete issue

## Future Scope

1. **Enhanced Collaboration Features**
   - Real-time updates using WebSocket
   - In-app messaging system
   - Comment system for issues
   - File attachments for issues

2. **Advanced Project Management**
   - Kanban board view
   - Gantt chart integration
   - Sprint planning features
   - Time tracking
   - Resource allocation

3. **Reporting and Analytics**
   - Custom dashboard creation
   - Project progress reports
   - Team performance metrics
   - Burndown charts
   - Velocity tracking

4. **Integration Capabilities**
   - Email notifications
   - Calendar integration
   - Third-party tool integrations (GitHub, Slack, etc.)
   - API webhook support

5. **Enhanced Security**
   - Two-factor authentication
   - SSO integration
   - Advanced audit logging
   - Role-based access control improvements

6. **Mobile Application**
   - Native mobile apps for iOS and Android
   - Offline support
   - Push notifications

7. **Automation Features**
   - Custom workflow automation
   - Task templates
   - Automated issue assignment
   - Scheduled reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Gaurav Lakhera - _Initial work_
