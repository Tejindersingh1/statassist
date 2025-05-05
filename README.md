# Stat-Assist Platform

A comprehensive platform for streamlining study design, data capture, analysis, and reporting for clinicians.

## Overview

Stat-Assist is designed to make clinical research design, analysis, and reporting friction-less for clinicians. The platform guides users through the process of designing studies, selecting appropriate statistical tests, calculating required sample sizes, and generating study protocols.

## Key Features

- **Study Design Wizard**: Step-by-step guidance for designing various study types (RCT, Diagnostic Accuracy, Cohort)
- **Statistical Test Recommender**: Automated recommendations for appropriate statistical tests based on study design and variables
- **Power Calculator**: Interactive sample size and power calculations with visualizations
- **Protocol Generator**: Automated generation of study protocols based on design inputs

## Technology Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React (Next.js), Tailwind CSS, shadcn/ui
- **Statistical Services**: Python-based power simulation engine
- **Deployment**: Kubernetes-ready

## Project Structure

```
stat-assist/
├── docs/                   # Documentation files
├── statassist-api/         # Backend API service
│   ├── app/
│   │   ├── core/           # Core business logic
│   │   ├── db/             # Database models and connection
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Utility functions
│   └── requirements.txt    # Python dependencies
├── statassist-ui/          # Frontend UI service
│   ├── src/
│   │   ├── app/            # Next.js pages and components
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # CSS and styling
│   └── package.json        # Node.js dependencies
└── powersim-service/       # Statistical simulation service
    ├── app/
    │   ├── core/           # Statistical algorithms
    │   ├── schemas/        # Data models
    │   └── utils/          # Utility functions
    └── requirements.txt    # Python dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-org/stat-assist.git
   cd stat-assist
   ```

2. Install dependencies for all services:
   ```
   npm run install:all
   ```

   This will install:
   - Python dependencies for the API service
   - Python dependencies for the PowerSim service
   - Node.js dependencies for the UI service

### Running the Application

Start all services with a single command:

```
npm start
```

This will concurrently run:
- Backend API at http://localhost:8000
- Frontend UI at http://localhost:3000
- PowerSim service at http://localhost:8001

### Development

For development, you can run each service individually:

```
# Run only the backend API
npm run start:api

# Run only the frontend UI
npm run start:ui

# Run only the PowerSim service
npm run start:powersim
```

## Demo Access

For demonstration purposes, you can use the "Demo Login" button on the login page. This will give you access to the platform without requiring registration.

## Performance Requirements

- Page load time: ≤2s p95
- API response time: ≤500ms p95
- Power calculations: ≤5s for complex simulations

## Security and Compliance

- PHI isolation with field-level encryption
- Comprehensive audit trail
- Zero-trust security model
- HIPAA and GDPR compliant (under reviewal)

## Accessibility

- WCAG 2.2 AA compliant
- Mobile-first responsive design
- Support for screen readers and keyboard navigation
