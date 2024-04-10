# Indigov Backend

  

This is the backend for the Indigov project. It provides APIs for managing data related to constituents

  

## Prerequisites

1. Node (version `v18.13.0`)
2. nvm (node version manager) to switch to the correct version of node
3. npm

This project uses sqlite to persist data atm into a file named `indigov.db`
  

## Getting Started

  

To get started with the Indigov backend, follow these steps:

  

1. Clone the repository:

  

```
git clone https://github.com/navidnahidi/indigov
```

2.  Use the correct version of node:

```
nvm use
```

3.  Install dependencies:

```
cd indigov-backend npm install
```

4. Start the server:
```
npm start
```


## Routes

1.  **GET /constituents**  
    Retrieve a list of constituents.
**Parameters:**
	-   `page` (optional): Specifies the page number for pagination. [Number 1 or greater]
	-   `size` (optional): Specifies the number of items per page.  [Number 1 or greater]
	```
	curl http://localhost:3000/constituents
	```
    
2.  **POST /constituents**  
    Add a new constituent.
-   **Required Fields (in request body):**
    -   `email`: Email address of the constituent. (str)
    -   `name`: Name of the constituent. (str)
    -   `address`: Address of the constituent. (str)
    -   `signUpTime`: Date and time when the constituent signed up. (UTC timestamp as a string)

    For example, for the POST request, you need to include all these fields in the request body as JSON data.
	```
	curl -X POST \
	  -H "Content-Type: application/json" \
	  -d '{"email": "john@example.com", "name": "John Doe", "address": "123 Main St", "signUpTime": "2024-04-10T10:00:00Z"}' \
	  http://localhost:3000/constituents
	```

3.  **GET /constituents/export**  
    Export constituents to a CSV file.
	```
	curl -o constituents.csv http://localhost:3000/constituents/export
	```


## Scripts

-   `npm test`: Run tests using Jest.
-   `npm run build`: Build the project using TypeScript.
-   `npm start`: Start the server using Nodemon.
-   `npm run test:watch`: Run tests in watch mode.
-   `npm run test:coverage`: Run tests with coverage report.
-   `npm run setupDatabase`: Set up the database.
-   `npm run lint`: Lint the codebase using ESLint.
-   `npm run lint:fix`: Fix linting errors automatically.

## Dependencies

-   `@types/koa`: TypeScript type definitions for Koa.
-   `@types/koa-bodyparser`: TypeScript type definitions for Koa Bodyparser middleware.
-   `@types/koa-router`: TypeScript type definitions for Koa Router middleware.
-   `csv-stringify`: Library for converting objects into CSV strings.
-   `csv-writer`: Library for writing CSV files.
-   `koa`: Koa web framework for Node.js.
-   `koa-bodyparser`: Middleware for parsing request bodies in Koa.
-   `koa-router`: Router middleware for Koa.
-   `sqlite`: SQLite database driver.
-   `sqlite3`: SQLite3 bindings for Node.js.
-   `typescript`: TypeScript compiler and language server.

## Dev Dependencies

-   `@types/jest`: TypeScript type definitions for Jest.
-   `@types/node`: TypeScript type definitions for Node.js.
-   `@types/sqlite3`: TypeScript type definitions for SQLite3.
-   `eslint`: JavaScript and TypeScript code linter.
-   `eslint-config-airbnb-base`: ESLint configuration based on Airbnb's JavaScript style guide.
-   `eslint-plugin-import`: ESLint plugin for linting import/export syntax.
-   `jest`: JavaScript testing framework.
-   `nodemon`: Utility for automatically restarting the server during development.
-   `ts-jest`: Jest preprocessor for TypeScript.
-   `ts-node`: TypeScript execution environment and REPL for Node.js.