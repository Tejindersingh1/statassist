# Stat-Assist API Reference

## Introduction

The Stat-Assist API allows developers to integrate with the Stat-Assist platform programmatically. This document provides comprehensive information about available endpoints, authentication, request/response formats, and example usage.

> **Why this matters:** API integration enables workflow automation, data exchange with other systems, and custom application development to extend Stat-Assist functionality.

## Authentication

Stat-Assist API uses OAuth 2.0 for authentication.

### Obtaining Access Tokens

```
POST /api/v1/auth/token
```

**Request Body:**

```json
{
  "grant_type": "password",
  "username": "your.email@example.com",
  "password": "your_password",
  "client_id": "your_client_id"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "def50200641f3e3f8b99a95a40c12d2fa3224c4f2c70a126..."
}
```

### Using Access Tokens

Include the access token in the Authorization header of all API requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refreshing Tokens

```
POST /api/v1/auth/token
```

**Request Body:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "def50200641f3e3f8b99a95a40c12d2fa3224c4f2c70a126...",
  "client_id": "your_client_id"
}
```

> **Why this matters:** Proper authentication ensures that only authorized users and applications can access sensitive research data.

## API Endpoints

### Studies

#### List Studies

```
GET /api/v1/studies
```

Retrieves a list of studies accessible to the authenticated user.

**Query Parameters:**

| Parameter | Type   | Description                                     |
|-----------|--------|-------------------------------------------------|
| status    | string | Filter by status (draft, active, completed)     |
| type      | string | Filter by study type (RCT, DiagnosticAccuracy, Cohort) |
| page      | integer| Page number for pagination (default: 1)         |
| limit     | integer| Number of results per page (default: 20, max: 100) |

**Response:**

```json
{
  "data": [
    {
      "id": "study-123",
      "title": "Effect of Drug X on Blood Pressure",
      "design_type": "RCT",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:45:00Z"
    },
    {
      "id": "study-124",
      "title": "Biomarker Y for Early Detection of Disease Z",
      "design_type": "DiagnosticAccuracy",
      "status": "draft",
      "created_at": "2025-02-03T09:15:00Z",
      "updated_at": "2025-02-03T09:15:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 42
  }
}
```

#### Create Study

```
POST /api/v1/studies
```

Creates a new study.

**Request Body:**

```json
{
  "title": "New Study Title",
  "design_type": "RCT",
  "description": "Brief description of the study"
}
```

**Response:**

```json
{
  "id": "study-125",
  "title": "New Study Title",
  "design_type": "RCT",
  "description": "Brief description of the study",
  "status": "draft",
  "created_at": "2025-05-01T10:00:00Z",
  "updated_at": "2025-05-01T10:00:00Z"
}
```

#### Get Study Details

```
GET /api/v1/studies/{study_id}
```

Retrieves detailed information about a specific study.

**Response:**

```json
{
  "id": "study-123",
  "title": "Effect of Drug X on Blood Pressure",
  "design_type": "RCT",
  "description": "A randomized controlled trial investigating...",
  "status": "active",
  "research_question": {
    "intervention": "Drug X 10mg daily",
    "comparator": "Placebo",
    "population": "Adults with hypertension",
    "outcome": "Reduction in systolic blood pressure"
  },
  "variables": [
    {
      "id": "var-1",
      "name": "Systolic Blood Pressure",
      "type": "Continuous",
      "role": "Primary",
      "constraints": {
        "units": "mmHg"
      }
    },
    {
      "id": "var-2",
      "name": "Age",
      "type": "Continuous",
      "role": "Covariate",
      "constraints": {
        "units": "years"
      }
    }
  ],
  "statistical_test": {
    "name": "Independent t-test",
    "alternatives": ["Mann-Whitney U test"],
    "conditions": ["Normally distributed data"]
  },
  "power_calculation": {
    "effect_size": 0.5,
    "alpha": 0.05,
    "power": 0.8,
    "sample_size": 64
  },
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:45:00Z"
}
```

#### Update Study

```
PUT /api/v1/studies/{study_id}
```

Updates an existing study.

**Request Body:**

```json
{
  "title": "Updated Study Title",
  "description": "Updated description",
  "status": "active"
}
```

**Response:**

```json
{
  "id": "study-123",
  "title": "Updated Study Title",
  "design_type": "RCT",
  "description": "Updated description",
  "status": "active",
  "updated_at": "2025-05-01T11:30:00Z"
}
```

#### Delete Study

```
DELETE /api/v1/studies/{study_id}
```

Deletes a study.

**Response:**

```
204 No Content
```

### Variables

#### List Variables

```
GET /api/v1/studies/{study_id}/variables
```

Retrieves all variables for a specific study.

**Response:**

```json
{
  "data": [
    {
      "id": "var-1",
      "name": "Systolic Blood Pressure",
      "type": "Continuous",
      "role": "Primary",
      "constraints": {
        "units": "mmHg"
      }
    },
    {
      "id": "var-2",
      "name": "Age",
      "type": "Continuous",
      "role": "Covariate",
      "constraints": {
        "units": "years"
      }
    }
  ]
}
```

#### Create Variable

```
POST /api/v1/studies/{study_id}/variables
```

Adds a new variable to a study.

**Request Body:**

```json
{
  "name": "Diastolic Blood Pressure",
  "type": "Continuous",
  "role": "Secondary",
  "constraints": {
    "units": "mmHg"
  }
}
```

**Response:**

```json
{
  "id": "var-3",
  "name": "Diastolic Blood Pressure",
  "type": "Continuous",
  "role": "Secondary",
  "constraints": {
    "units": "mmHg"
  }
}
```

### Statistical Tests

#### Get Recommended Tests

```
POST /api/v1/statistical/tests/recommend
```

Recommends statistical tests based on study design and variables.

**Request Body:**

```json
{
  "design_type": "RCT",
  "primary_outcome": {
    "type": "Continuous",
    "paired": false
  },
  "groups": 2
}
```

**Response:**

```json
{
  "recommended_tests": [
    {
      "test_name": "Independent t-test",
      "alternatives": ["Mann-Whitney U test"],
      "conditions": ["Normally distributed data"],
      "confidence": 0.9
    }
  ],
  "explanation": "Based on your RCT study with a continuous primary outcome and two independent groups, the recommended statistical test is an Independent t-test. This assumes your data is normally distributed. If this assumption is not met, consider the Mann-Whitney U test as an alternative."
}
```

### Power Calculations

#### Calculate Power

```
POST /api/v1/statistical/power/calculate
```

Calculates statistical power or required sample size.

**Request Body:**

```json
{
  "test_type": "Independent t-test",
  "effect_size": 0.5,
  "alpha": 0.05,
  "sample_sizes": [30, 60, 90, 120],
  "groups": 2
}
```

**Response:**

```json
{
  "calculation_id": "calc-123",
  "status": "completed",
  "results": {
    "results": [
      {"sample_size": 30, "power": 0.47},
      {"sample_size": 60, "power": 0.77},
      {"sample_size": 90, "power": 0.92},
      {"sample_size": 120, "power": 0.97}
    ],
    "power_curve": [
      {"sample_size": 10, "power": 0.18},
      {"sample_size": 20, "power": 0.33},
      {"sample_size": 30, "power": 0.47},
      {"sample_size": 40, "power": 0.59},
      {"sample_size": 50, "power": 0.69},
      {"sample_size": 60, "power": 0.77},
      {"sample_size": 70, "power": 0.84},
      {"sample_size": 80, "power": 0.88},
      {"sample_size": 90, "power": 0.92},
      {"sample_size": 100, "power": 0.94},
      {"sample_size": 110, "power": 0.96},
      {"sample_size": 120, "power": 0.97}
    ],
    "explanation": "With an effect size of 0.5, significance level of 0.05, and two groups, you would need approximately 64 participants per group to achieve 80% power. Your specified sample sizes of 30, 60, 90, and 120 would yield powers of 47%, 77%, 92%, and 97% respectively."
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Status Codes

- 200 OK: Request succeeded
- 201 Created: Resource created successfully
- 204 No Content: Request succeeded with no response body
- 400 Bad Request: Invalid request parameters
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 422 Unprocessable Entity: Validation error
- 500 Internal Server Error: Server-side error

### Error Response Format

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "effect_size",
        "message": "Effect size must be greater than 0"
      }
    ]
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage and system stability.

- Standard tier: 60 requests per minute
- Premium tier: 300 requests per minute

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1620000000
```

> **Why this matters:** Rate limiting prevents system overload and ensures reliable service for all users.

## Webhooks

Stat-Assist can send webhook notifications for various events.

### Configuring Webhooks

```
POST /api/v1/webhooks
```

**Request Body:**

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["study.created", "study.updated", "calculation.completed"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload Example

```json
{
  "event": "study.created",
  "timestamp": "2025-05-01T10:00:00Z",
  "data": {
    "study_id": "study-125",
    "title": "New Study Title",
    "design_type": "RCT",
    "status": "draft"
  }
}
```

> **Why this matters:** Webhooks enable real-time integration with your systems, allowing automated workflows and immediate reactions to events in Stat-Assist.

## SDK Examples

### Python Example

```python
import requests

# Authentication
auth_response = requests.post(
    "https://api.statassist.com/api/v1/auth/token",
    json={
        "grant_type": "password",
        "username": "researcher@example.com",
        "password": "secure_password",
        "client_id": "client_id"
    }
)
token = auth_response.json()["access_token"]

# Create a new study
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

study_response = requests.post(
    "https://api.statassist.com/api/v1/studies",
    headers=headers,
    json={
        "title": "Effect of Exercise on Sleep Quality",
        "design_type": "RCT",
        "description": "Investigating how regular exercise affects sleep quality"
    }
)

study = study_response.json()
study_id = study["id"]

# Add variables
variables = [
    {
        "name": "Sleep Quality Score",
        "type": "Continuous",
        "role": "Primary",
        "constraints": {"units": "points"}
    },
    {
        "name": "Exercise Duration",
        "type": "Continuous",
        "role": "Covariate",
        "constraints": {"units": "minutes"}
    }
]

for variable in variables:
    requests.post(
        f"https://api.statassist.com/api/v1/studies/{study_id}/variables",
        headers=headers,
        json=variable
    )

# Get recommended statistical test
test_response = requests.post(
    "https://api.statassist.com/api/v1/statistical/tests/recommend",
    headers=headers,
    json={
        "design_type": "RCT",
        "primary_outcome": {"type": "Continuous", "paired": False},
        "groups": 2
    }
)

recommended_test = test_response.json()["recommended_tests"][0]["test_name"]

# Calculate power
power_response = requests.post(
    "https://api.statassist.com/api/v1/statistical/power/calculate",
    headers=headers,
    json={
        "test_type": recommended_test,
        "effect_size": 0.5,
        "alpha": 0.05,
        "sample_sizes": [30, 60, 90],
        "groups": 2
    }
)

power_results = power_response.json()["results"]
print(f"Power results: {power_results}")
```

### JavaScript Example

```javascript
const axios = require('axios');

// Authentication
async function getToken() {
  const response = await axios.post('https://api.statassist.com/api/v1/auth/token', {
    grant_type: 'password',
    username: 'researcher@example.com',
    password: 'secure_password',
    client_id: 'client_id'
  });
  
  return response.data.access_token;
}

async function createStudy() {
  const token = await getToken();
  
  // Set headers for all requests
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  // Create study
  const studyResponse = await axios.post('https://api.statassist.com/api/v1/studies', {
    title: 'Effect of Diet on Cholesterol Levels',
    design_type: 'RCT',
    description: 'Comparing plant-based vs. omnivorous diets on cholesterol levels'
  }, { headers });
  
  const studyId = studyResponse.data.id;
  
  // Add variables
  const variables = [
    {
      name: 'LDL Cholesterol',
      type: 'Continuous',
      role: 'Primary',
      constraints: { units: 'mg/dL' }
    },
    {
      name: 'HDL Cholesterol',
      type: 'Continuous',
      role: 'Secondary',
      constraints: { units: 'mg/dL' }
    }
  ];
  
  for (const variable of variables) {
    await axios.post(`https://api.statassist.com/api/v1/studies/${studyId}/variables`, 
      variable, { headers });
  }
  
  // Get recommended test
  const testResponse = await axios.post('https://api.statassist.com/api/v1/statistical/tests/recommend', {
    design_type: 'RCT',
    primary_outcome: { type: 'Continuous', paired: false },
    groups: 2
  }, { headers });
  
  const recommendedTest = testResponse.data.recommended_tests[0].test_name;
  
  // Calculate power
  const powerResponse = await axios.post('https://api.statassist.com/api/v1/statistical/power/calculate', {
    test_type: recommendedTest,
    effect_size: 0.5,
    alpha: 0.05,
    sample_sizes: [30, 60, 90],
    groups: 2
  }, { headers });
  
  console.log('Power results:', powerResponse.data.results);
}

createStudy().catch(console.error);
```

## API Changelog

### v1.2 (Current) - 2025-04-15

- Added webhook support for real-time notifications
- Expanded power calculation to support more test types
- Added batch variable creation endpoint

### v1.1 - 2025-01-10

- Added support for cohort studies
- Improved statistical test recommendations
- Added study sharing and collaboration endpoints

### v1.0 - 2024-10-01

- Initial API release
- Support for RCT and diagnostic accuracy studies
- Basic statistical test recommendations and power calculations
