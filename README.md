Here's a comprehensive `README.md` for your project, including project setup, structure, and other essential details:

```markdown
# User Management and Blocking Microservice

This project is a user management and blocking microservice built using NestJS. It provides functionalities to manage users, block and unblock users, cache frequently accessed data, and search users. The backend is built with MongoDB as the database.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Middleware](#middleware)
- [Token Generator](#tokengenerator)

## Features

- CRUD operations for users
- Blocking and unblocking users
- User search functionality
- Caching frequently accessed data
- JWT token extraction for user ID

## Project Structure

```plaintext
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── block/
│   ├── block.controller.ts
│   ├── block.module.ts
│   ├── block.service.ts
│   └── block.schema.ts
├── cache/
│   └── cache.service.ts
├── common/
│   ├── filters/
│   │   └── all-exceptions.filter.ts
│   └── middleware/
│       └── extract-user.middleware.ts
├── user/
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── user.service.ts
│   ├── user.interface.ts
│   └── user.schema.ts
├── main.ts
└── config/
    └── configuration.ts
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/user-management-blocking-microservice.git
   cd user-management-blocking-microservice
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret
```

Replace `<username>`, `<password>`, and `your_jwt_secret` with your actual MongoDB credentials and JWT secret.

## Running the Application

To start the application, run:

```sh
npm run start:dev
```

The application will be available at `http://localhost:3000`.

## Testing

To run the tests, use:

```sh
npm run test
```

To run end-to-end tests, use:

```sh
npm run test:e2e
```

To check test coverage, use:

```sh
npm run test:cov
```

## Middleware

The `ExtractUserMiddleware` is used to extract the user ID from JWT tokens for authenticated routes.

## Token Generator

This is the script to generate the token to use.

```sh
const jwt = require('jsonwebtoken');

const payload = { sub: '668f79869183db8f39f0b861' };
const secretKey = 'your_secret_key';

const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
console.log(token);
```

To run the script use:

```sh
node file_name.js
```
