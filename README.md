# School Management System

A comprehensive school management system built with FastAPI and React.

## Features

- User authentication and authorization
- Role-based access control (Student, Teacher, Principal, Developer)
- Academic content management (Subjects, Chapters, Resources)
- Student progress tracking
- Assignment management
- Task management
- File upload and management
- Email notifications
- Real-time updates with Redis

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- Alembic
- JWT Authentication

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- React Query

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 13+
- Redis 6+

## Setup Instructions

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following content:
```env
# Database
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=school_management

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (optional)
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAILS_FROM_EMAIL=your-email@gmail.com
EMAILS_FROM_NAME=School Management System

# External Services (optional)
YOUTUBE_API_KEY=your-youtube-api-key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
```

4. Initialize the database:
```bash
python -m app.db.init_db_script
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

3. Start the development server:
```bash
npm start
```

## Default Admin Account

- Email: admin@school.com
- Password: admin123

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Code Style

The project uses:
- Black for Python code formatting
- isort for import sorting
- ESLint and Prettier for JavaScript/TypeScript code formatting

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

## Deployment

For production deployment, please refer to the deployment documentation in the `docs` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 