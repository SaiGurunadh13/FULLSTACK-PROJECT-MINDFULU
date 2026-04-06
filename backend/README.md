# User Management Backend (Spring Boot)

## Requirements
- Java 17+
- Maven 3.9+
- MySQL running on localhost:3306
- Database: `testdb`

## Database Config
This project is already configured in `application.properties`:
- URL: `jdbc:mysql://localhost:3306/testdb`
- Username: `root`
- Password: `1234`

## Run
From the `backend` folder:

```bash
mvn spring-boot:run
```

Backend runs on:
- `http://localhost:8080`

## API Endpoints
- `GET /users`
- `GET /users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

## Example Payload
```json
{
  "name": "Alex",
  "email": "alex@example.com"
}
```

## Validation
- Name is required
- Email is required
- Email format is validated
- Email is unique

## CORS
Allows frontend origin:
- `http://localhost:3000`
