# ConsultMe Project

This project is a Next.js application using TypeScript, PNPM, PostgreSQL (via Docker), and Drizzle ORM.

## Prerequisites

- Node.js (v20 or later recommended)
- PNPM (Install via `npm install -g pnpm`)
- Docker and Docker Compose

## Setup

1.  **Clone the repository:**

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables (replace placeholder values as needed):

    ```env
    OPENAI_API_KEY=<your_openai_api_key>
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=consultme
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/consultme
    REPLICATE_API_TOKEN=<your_replicate_api_token>
    ```

    _Note: The `DATABASE_URL` should match the credentials used by Docker Compose._

4.  **Start the PostgreSQL database:**
    Make sure Docker Desktop (or your Docker daemon) is running. Then, in the project root directory, run:

    ```bash
    docker-compose up -d
    ```

    This command starts the PostgreSQL container in detached mode.

5.  **Set up the database schema:**
    ```bash
    pnpm drizzle-kit push
    ```

## Running the Application

1.  **Start the development server:**

    ```bash
    pnpm dev
    ```

    This will start the Next.js application in development mode with Turbopack.

2.  Open your browser and navigate to `http://localhost:3000/dashboard/projects` (or the port specified in the terminal output).

## Other Useful Commands

- **Build for production:**
  ```bash
  pnpm build
  ```
- **Run production server:**
  ```bash
  pnpm start
  ```
- **Lint the code:**
  ```bash
  pnpm lint
  ```
- **Stop the database container:**
  ```bash
  docker-compose down
  ```
