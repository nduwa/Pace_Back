# onboarding API

## Installation

To get a local copy of this repository run the following commands:

```bash
git clone https://github.com/nduwa/Pace_back/
cd onboarding-api
```

To install the necessary dependencies, run the following command:

```bash
pnpm install
```

Then create your .env file based on .env.example

```bash
PORT=2023
DBHOST=
DBUSER=
DBPASS=
DBNAME=
JWT_TOKEN=
EXPIRE=3
AIKEY=
CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Replace the values based on your preference

Then migrate the database

```bash
pnpm migrate
```

## Scripts

- **predev**: Runs before the development server starts. Executes `pnpm run swagger` to generate Swagger specifications.
- **swagger**: Generates Swagger specifications using TSOA.
- **dev**: Concurrently runs the development server with nodemon and the TSOA spec watcher.
- **start**: Starts the API server in production mode.
- **build**: Builds the TypeScript source code.
- **migrate**: Runs all the migration against the.
- **test**: Placeholder for running tests.

To start the development server, run:

```bash
pnpm run dev
```

## Dependencies

- **bcrypt**: ^5.1.1
- **body-parser**: ^1.20.2
- **cors**: ^2.8.5
- **dotenv**: ^16.4.5
- **express**: ^4.18.3
- **jsonwebtoken**: ^9.0.2
- **pg**: ^8.11.3
- **sequelize**: ^6.37.1
- **sequelize-typescript**: ^2.1.6
- **swagger**: ^0.7.5
- **ts-node**: ^10.9.2
- **tsoa**: ^6.0.1
- **zod**: ^3.22.4
- ...

## Dev Dependencies

- **@types/bcrypt**: ^5.0.2
- **@types/body-parser**: ^1.19.5
- **@types/cors**: ^2.8.17
- **@types/express**: ^4.17.21
- **@types/jsonwebtoken**: ^9.0.6
- **@types/swagger-ui-express**: ^4.1.6
- **concurrently**: ^8.2.2
- **nodemon**: ^3.1.0
- **sequelize-cli**: ^6.6.2
- **swagger-ui-express**: ^5.0.0
- **typescript**: ^5.3.3
- ...

## Usage

1. Run `pnpm run dev` to start the development server.
2. API documentation will be available at `http://localhost:2023/api/docs` after the server starts.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Reponse Ashimwe
