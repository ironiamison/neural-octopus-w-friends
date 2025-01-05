# API Reference

## Overview

The papermemes.fun API provides comprehensive endpoints for trading, learning, and meme generation functionalities.

## API Architecture

```mermaid
graph TB
    subgraph "API Gateway"
        A[API Router] --> B[Authentication]
        A --> C[Rate Limiting]
        A --> D[Validation]
    end
    
    subgraph "Service Layer"
        B --> E[Trading API]
        B --> F[Learning API]
        B --> G[Meme API]
    end
    
    subgraph "Data Layer"
        E --> H[Trading Service]
        F --> I[Learning Service]
        G --> J[Meme Service]
    end
```

## Authentication

### 1. Authentication Flow
```mermaid
sequenceDiagram
    participant Client
    participant Auth
    participant API
    participant Service
    
    Client->>Auth: Authentication Request
    Auth->>Auth: Validate Credentials
    Auth->>Client: JWT Token
    Client->>API: API Request + Token
    API->>Auth: Validate Token
    Auth->>API: Token Valid
    API->>Service: Process Request
    Service->>Client: Response
```

### 2. Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "secure_password"
}
```

Response:
```json
{
    "token": "jwt_token",
    "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
    }
}
```

## Trading API

### 1. Market Data

#### Get Market Price
```http
GET /api/market/price/{symbol}
Authorization: Bearer {token}
```

Response:
```json
{
    "symbol": "BTC/USD",
    "price": 50000.00,
    "timestamp": "2024-01-20T12:00:00Z",
    "change": 2.5
}
```

### 2. Trading Operations

#### Place Order
```http
POST /api/trading/order
Content-Type: application/json
Authorization: Bearer {token}

{
    "symbol": "BTC/USD",
    "type": "MARKET",
    "side": "BUY",
    "quantity": 1.0
}
```

Response:
```json
{
    "orderId": "order_123",
    "status": "FILLED",
    "price": 50000.00,
    "quantity": 1.0,
    "timestamp": "2024-01-20T12:00:00Z"
}
```

## Learning API

### 1. Course Management

#### Get Courses
```http
GET /api/learning/courses
Authorization: Bearer {token}
```

Response:
```json
{
    "courses": [
        {
            "id": "course_1",
            "title": "Trading Basics",
            "description": "Learn the basics of trading",
            "progress": 60
        }
    ]
}
```

### 2. Progress Tracking

#### Update Progress
```http
POST /api/learning/progress
Content-Type: application/json
Authorization: Bearer {token}

{
    "courseId": "course_1",
    "lessonId": "lesson_1",
    "completed": true
}
```

## Meme API

### 1. Meme Generation

#### Generate Meme
```http
POST /api/memes/generate
Content-Type: application/json
Authorization: Bearer {token}

{
    "context": "trading_success",
    "text": "When your trade hits the moon"
}
```

Response:
```json
{
    "memeId": "meme_123",
    "url": "https://papermemes.fun/memes/123.jpg",
    "timestamp": "2024-01-20T12:00:00Z"
}
```

## WebSocket API

### 1. Connection Flow
```mermaid
sequenceDiagram
    participant Client
    participant WebSocket
    participant Service
    
    Client->>WebSocket: Connect
    WebSocket->>Client: Connection Established
    Client->>WebSocket: Subscribe to Updates
    WebSocket->>Service: Register Subscription
    Service-->>WebSocket: Market Update
    WebSocket-->>Client: Push Update
```

### 2. Subscription Example
```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://papermemes.fun/ws');

// Subscribe to market data
ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'market',
    symbols: ['BTC/USD']
}));

// Handle updates
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Market Update:', data);
};
```

## Error Handling

### 1. Error Codes
```mermaid
graph TB
    A[Error Response] --> B[4xx Client Errors]
    A --> C[5xx Server Errors]
    B --> D[400 Bad Request]
    B --> E[401 Unauthorized]
    B --> F[403 Forbidden]
    B --> G[404 Not Found]
    C --> H[500 Internal Error]
    C --> I[503 Service Unavailable]
```

### 2. Error Response Format
```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Error description",
        "details": {
            "field": "Additional information"
        }
    }
}
```

## Rate Limiting

### 1. Limits
- Authentication: 5 requests per minute
- Trading: 60 requests per minute
- Market Data: 120 requests per minute
- Meme Generation: 30 requests per minute

### 2. Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1579521600
```

## API Versioning

### 1. Version Control
```mermaid
graph LR
    A[API Request] --> B[Version Check]
    B --> C[v1 Handler]
    B --> D[v2 Handler]
    C --> E[Response]
    D --> E
```

### 2. Version Headers
```http
Accept: application/json
API-Version: v1
```

## Data Models

### 1. User Model
```json
{
    "id": "string",
    "email": "string",
    "name": "string",
    "created_at": "datetime",
    "settings": {
        "theme": "string",
        "notifications": "boolean"
    }
}
```

### 2. Order Model
```json
{
    "id": "string",
    "user_id": "string",
    "symbol": "string",
    "type": "string",
    "side": "string",
    "quantity": "number",
    "price": "number",
    "status": "string",
    "created_at": "datetime"
}
```

## Testing

### 1. Test Environment
- Base URL: `https://api-test.papermemes.fun`
- Test Credentials Available
- Sandbox Trading Environment

### 2. Example Test
```javascript
const response = await fetch('https://api-test.papermemes.fun/api/market/price/BTC-USD', {
    headers: {
        'Authorization': 'Bearer test_token'
    }
});
```

## SDK Examples

### 1. JavaScript
```javascript
const papermemes = require('papermemes-sdk');

const client = new papermemes.Client({
    apiKey: 'your_api_key'
});

// Place order
const order = await client.trading.placeOrder({
    symbol: 'BTC/USD',
    type: 'MARKET',
    side: 'BUY',
    quantity: 1.0
});
```

### 2. Python
```python
from papermemes_sdk import Client

client = Client(api_key='your_api_key')

# Get market price
price = client.market.get_price('BTC/USD')
``` 