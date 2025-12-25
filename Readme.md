# 🚀 Real-Time One-to-One Chat Backend

A production-ready, scalable real-time chat backend built with Node.js, Socket.IO, Express, and MongoDB. Features JWT authentication, real-time messaging, user presence tracking, and message persistence.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Socket Events](#socket-events)
- [Testing Guide](#testing-guide)
- [Architecture](#architecture)

---

## ✨ Features

### Core Features
- ✅ **JWT Authentication** - Secure token-based authentication for HTTP and WebSocket
- ✅ **Real-Time Messaging** - Instant one-to-one message delivery with Socket.IO
- ✅ **User Presence** - Track online/offline status with automatic updates
- ✅ **Message Persistence** - All messages stored in MongoDB with chat history
- ✅ **Typing Indicators** - Real-time typing status updates
- ✅ **Read Receipts** - Message read tracking and notifications
- ✅ **Unread Counter** - Track unread message counts per user

### Technical Features
- 🔐 Socket connection authentication with JWT
- 📱 RESTful API for message history and user management
- 🗄️ MongoDB with optimized indexes for chat queries
- 🛡️ Input validation and error handling
- 📊 Scalable architecture with service layer pattern
- 🔄 Automatic reconnection handling
- 🌐 CORS enabled for cross-origin requests

---


## Frontend – Text Client

✅ **Frontend (`text-client.html`)**  
A simple HTML-based frontend is included for testing the real-time chat backend. This client helps verify real-time messaging, socket events, and user interactions without using a full frontend framework.

---

## How to Test

1. Start the **backend server**.
2. Open `text-client.html` in **two separate browser tabs**.
3. In **Tab 1**:
   - Enter **User 1 JWT token**
   - Enter **Receiver ID** (User 2)
4. In **Tab 2**:
   - Enter **User 2 JWT token**
   - Enter **Receiver ID** (User 1)
5. Start sending messages between the two tabs.

You will see messages appear instantly on the chat UI.

---

## Implemented Features

- 💬 Real-time send and receive messages
- 🔊 Message notification sounds
- ✍️ Typing indicators (start typing / stop typing)
- 📜 Event log console displaying:
  - Message sent
  - Message received
  - Other socket-related operations
- 🖥️ Simple chat UI for testing and debugging


## Notes

- This frontend is meant **only for testing and debugging**.
- Make sure valid **JWT tokens** and **user IDs** are used.
- Open the file in multiple tabs to simulate multiple users.

---



## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Real-Time:** Socket.IO v4.6+
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

---

## 📁 Project Structure

```
real-time-chat-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection setup
│   │   └── socket.js             # Socket.IO initialization
│   ├── middleware/
│   │   ├── auth.middleware.js    # HTTP JWT authentication
│   │   └── socketAuth.middleware.js # Socket JWT authentication
│   ├── models/
│   │   ├── User.model.js         # User schema with auth methods
│   │   └── Message.model.js      # Message schema with indexes
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── message.controller.js # Message CRUD operations
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication endpoints
│   │   └── message.routes.js     # Message endpoints
│   ├── services/
│   │   └── socket.service.js     # Socket event handlers
│   ├── utils/
│   │   ├── jwt.util.js           # JWT helper functions
│   │   └── response.util.js      # Response formatters
│   └── server.js                 # Application entry point
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd real-time-chat-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/realtime_chat
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Run the application**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | 7d | No |


---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "isOnline": false,
      "lastSeen": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 2. Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200): Same as register

#### 3. Get Current User
**GET** `/auth/me`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "isOnline": true,
      "lastSeen": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 4. Get All Users
**GET** `/auth/users`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "janedoe",
        "email": "jane@example.com",
        "isOnline": true,
        "lastSeen": "2024-01-15T10:35:00.000Z"
      }
    ]
  }
}
```

### Message Endpoints

#### 5. Get Conversation
**GET** `/messages/:userId?limit=50&skip=0`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "Conversation fetched successfully",
  "data": {
    "messages": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "sender": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "isOnline": true
        },
        "receiver": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "janedoe",
          "isOnline": true
        },
        "content": "Hello!",
        "isRead": false,
        "messageType": "text",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### 6. Mark Messages as Read
**PUT** `/messages/read/:userId`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "Messages marked as read",
  "data": {
    "modifiedCount": 5
  }
}
```

#### 7. Get Unread Count
**GET** `/messages/unread/count`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "Unread count fetched successfully",
  "data": {
    "unreadCount": 5
  }
}
```

---

## 🔌 Socket Events

### Connection

**Client connects to socket:**
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Emitted by Client

#### 1. send_message
Send a new message to another user

Payload:
```javascript
socket.emit('send_message', {
  receiverId: '507f1f77bcf86cd799439012',
  content: 'Hello, how are you?',
  messageType: 'text',
  tempId: 'temp-123' // Optional: for optimistic updates
});
```

#### 2. typing_start
Notify that user started typing

Payload:
```javascript
socket.emit('typing_start', {
  receiverId: '507f1f77bcf86cd799439012'
});
```

#### 3. typing_stop
Notify that user stopped typing

Payload:
```javascript
socket.emit('typing_stop', {
  receiverId: '507f1f77bcf86cd799439012'
});
```

#### 4. message_read
Mark a message as read

Payload:
```javascript
socket.emit('message_read', {
  messageId: '507f1f77bcf86cd799439013',
  senderId: '507f1f77bcf86cd799439011'
});
```

### Received by Client

#### 1. receive_message
Receive a new message

Payload:
```javascript
socket.on('receive_message', (data) => {
  console.log('New message:', data.message);
  // data.message contains full message object
});
```

#### 2. message_sent
Confirmation that message was sent

Payload:
```javascript
socket.on('message_sent', (data) => {
  console.log('Message sent:', data.message);
  console.log('Temp ID:', data.tempId);
});
```

#### 3. user_status
User online/offline status update

Payload:
```javascript
socket.on('user_status', (data) => {
  console.log('User status:', data);
  // { userId, isOnline, lastSeen }
});
```

#### 4. user_typing
Typing indicator

Payload:
```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  // { userId, isTyping }
});
```

#### 5. message_read_receipt
Message read notification

Payload:
```javascript
socket.on('message_read_receipt', (data) => {
  console.log('Message read:', data);
  // { messageId, readerId, readAt }
});
```

#### 6. error
Error notification

Payload:
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
});
```

---

## 🧪 Testing Guide

### Using Postman

#### Step 1: Set Up Environment

1. Open Postman
2. Create a new Environment named "Chat API"
3. Add variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (leave empty, will be set automatically)

#### Step 2: Create Two Users

**Request 1: Register User 1**
- Method: POST
- URL: `{{base_url}}/api/auth/register`
- Body (JSON):
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```
- Save the token from response to `token` variable

**Request 2: Register User 2**
- Method: POST
- URL: `{{base_url}}/api/auth/register`
- Body (JSON):
```json
{
  "username": "bob",
  "email": "bob@example.com",
  "password": "password123"
}
```
- Save the token and user ID for later use

#### Step 3: Test Authentication

**Get Current User**
- Method: GET
- URL: `{{base_url}}/api/auth/me`
- Headers: `Authorization: Bearer {{token}}`

**Get All Users**
- Method: GET
- URL: `{{base_url}}/api/auth/users`
- Headers: `Authorization: Bearer {{token}}`

#### Step 4: Test Socket Connection

Use Socket.IO client library or Postman's WebSocket feature:

```javascript
// In browser console or Node.js script
const socket = io('http://localhost:5000', {
  auth: { token: 'user-1-token' }
});

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('user_status', (data) => {
  console.log('User status:', data);
});
```

#### Step 5: Send Messages

**Via Socket (User 1 to User 2):**
```javascript
socket.emit('send_message', {
  receiverId: 'user-2-id',
  content: 'Hello Bob!',
  messageType: 'text'
});
```

#### Step 6: Get Chat History

**Request:**
- Method: GET
- URL: `{{base_url}}/api/messages/user-2-id`
- Headers: `Authorization: Bearer {{token}}`

#### Step 7: Test Typing Indicators

**User 1 starts typing:**
```javascript
socket.emit('typing_start', {
  receiverId: 'user-2-id'
});
```

**User 1 stops typing:**
```javascript
socket.emit('typing_stop', {
  receiverId: 'user-2-id'
});
```

#### Step 8: Test Read Receipts

**Mark messages as read:**
- Method: PUT
- URL: `{{base_url}}/api/messages/read/user-2-id`
- Headers: `Authorization: Bearer {{token}}`

---

## 🏗️ Architecture

### Design Patterns

1. **Service Layer Pattern**: Business logic separated in service classes
2. **Repository Pattern**: Data access abstracted through Mongoose models
3. **Middleware Pattern**: Authentication and validation as middleware
4. **Event-Driven**: Real-time features using Socket.IO events

### Key Design Decisions

1. **ES Modules**: Modern JavaScript module system
2. **JWT Authentication**: Stateless authentication for scalability
3. **Socket-User Mapping**: In-memory Map for fast user lookup
4. **Database Indexes**: Optimized queries for chat history
5. **Error Handling**: Centralized error handling with meaningful messages

### Scalability Considerations

- **Horizontal Scaling**: Use Redis adapter for Socket.IO across multiple servers
- **Database Sharding**: Partition messages by date or user pairs
- **Caching**: Implement Redis for frequently accessed data
- **Load Balancing**: Sticky sessions for WebSocket connections

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Socket connection authentication
- Input validation on all endpoints
- CORS protection
- Environment variable protection
- MongoDB injection prevention (Mongoose)

---

## 📝 License

This project is created for educational purposes as part of a backend developer assignment.

---

## 🤝 Contributing

This is an assignment project. For production use, consider:
- Adding rate limiting
- Implementing Redis for session storage
- Adding file upload functionality
- Implementing message encryption
- Adding comprehensive unit tests
- Setting up CI/CD pipeline

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
