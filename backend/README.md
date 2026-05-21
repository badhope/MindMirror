# MindMirror Backend API

**FastAPI-powered backend for the MindMirror psychological assessment platform.**

## Overview

This backend service provides RESTful APIs for:
- User authentication and management
- Assessment data storage and retrieval
- Assessment calculation and result generation
- Achievement tracking
- Mood tracking
- Training record management

## Tech Stack

| Layer | Technology | Version |
|:-----:|:-----------|:-------:|
| 🐍 **Framework** | FastAPI | 0.104 |
| 🗄️ **Database** | SQLAlchemy + SQLite | 2.0 |
| 📋 **Validation** | Pydantic | 2.5 |
| 🔐 **Security** | Passlib, python-jose | 1.7, 3.3 |
| 🐳 **Deployment** | Docker | - |

## Quick Start

### Prerequisites

- Python >= 3.11
- pip (or conda)

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or .\venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Health Check

Verify the server is running:
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}

curl http://localhost:8000/
# Response: {"message": "MindMirror API v1.0.0"}
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{user_id}` - Get user profile
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user
- `POST /api/v1/users/login` - User login

### Assessments
- `GET /api/v1/assessments` - List assessments
- `GET /api/v1/assessments/{id}` - Get assessment details
- `POST /api/v1/assessments/{id}/submit` - Submit assessment
- `GET /api/v1/assessments/history` - Get history

### Achievements
- `GET /api/v1/achievements` - List all achievements
- `GET /api/v1/achievements/user/{user_id}` - Get user achievements
- `POST /api/v1/achievements/unlock` - Unlock achievement

### Training
- `GET /api/v1/training` - List training records
- `POST /api/v1/training` - Create training record
- `GET /api/v1/training/stats/{user_id}` - Get training stats

### Moods
- `GET /api/v1/moods` - List mood records
- `POST /api/v1/moods` - Create mood record
- `GET /api/v1/moods/stats/{user_id}` - Get mood stats

## Project Structure

```
backend/
├── main.py                          # FastAPI application entry
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Docker configuration
├── .env.example                     # Environment variables
├── app/
│   ├── core/                        # Core infrastructure
│   │   ├── config.py                # Configuration management
│   │   ├── database.py              # Database setup
│   │   └── security.py              # Security utilities
│   ├── models/                      # SQLAlchemy models
│   │   ├── user.py
│   │   ├── assessment.py
│   │   ├── result.py
│   │   ├── achievement.py
│   │   ├── training.py
│   │   └── mood.py
│   ├── schemas/                     # Pydantic validation models
│   │   ├── user.py
│   │   └── assessment.py
│   ├── services/                    # Business logic
│   │   ├── assessment_data_service.py
│   │   ├── calculator_factory.py
│   │   └── calculators/             # Assessment calculators
│   │       ├── base.py
│   │       ├── mbti_calculator.py
│   │       ├── bigfive_calculator.py
│   │       ├── sas_calculator.py
│   │       ├── sds_calculator.py
│   │       ├── holland_calculator.py
│   │       ├── darktriad_calculator.py
│   │       └── eq_calculator.py
│   └── api/v1/                     # API routes
│       ├── users.py
│       ├── assessments.py
│       ├── achievements.py
│       ├── training.py
│       └── moods.py
├── app/data/assessments/           # Assessment data (JSON)
└── scripts/                        # Utility scripts
    ├── migrate_data.py
    └── init_metadata.py
```

## Calculators

7 assessment calculators are implemented:

| Calculator | Purpose |
|:-----------|:--------|
| **MBTICalculator** | Myers-Briggs 16 personality types |
| **BigFiveCalculator** | OCEAN Big Five personality |
| **SASCalculator** | Anxiety self-assessment scale |
| **SDSCalculator** | Depression self-assessment scale |
| **HollandCalculator** | Holland career interest |
| **DarkTriadCalculator** | Dark triad traits |
| **EQCalculator** | Emotional intelligence |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
API_V1_STR=/api/v1
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=10080
DATABASE_URL=sqlite:///./mindmirror.db
```

## Docker

### Build and Run

```bash
# Build backend image
cd backend
docker build -t mindmirror-backend .

# Run container
docker run -p 8000:8000 mindmirror-backend
```

### Docker Compose (from project root)

```bash
# Start both frontend and backend
cd ..
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Development

### Linting & Testing

```bash
# Format code
black .

# Type checking
mypy .

# Run tests
pytest tests/
```

### Adding a New Calculator

1. Create a new calculator in `app/services/calculators/`
2. Inherit from `BaseCalculator`
3. Implement `calculate()`, `get_interpretation()`, and `get_recommendations()`
4. Register in `calculator_factory.py`

## License

This project is licensed under **CC BY-NC 4.0** - see the [LICENSE](../LICENSE) file for details.
