# 📰 News Aggregator API

A **Node.js + Express** based API that lets users:
- Sign up and log in securely (passwords hashed with bcrypt).
- Authenticate with JWT tokens.
- Set and retrieve news topic preferences.
- Fetch live news from **NewsAPI** based on preferences.

---

## 🚀 Features
- 🔐 **JWT Authentication** for secure endpoints.
- 🛡 **Password Hashing** with bcrypt.
- 🎯 **Custom Preferences** for personalized news.
- 🌍 **Live News Fetching** from [NewsAPI.org](https://newsapi.org/).
- 🗄 In-memory storage (easy to swap with a real database).

---

## 🛠 Tech Stack
- **Node.js**
- **Express.js**
- **bcrypt**
- **jsonwebtoken**
- **axios**
- **dotenv**
- **NewsAPI**

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/news-aggregator-api.git
cd news-aggregator-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file in the root directory:
```
PORT=3000
JWT_SECRET=your_jwt_secret
NEWS_API_KEY=your_newsapi_key
```
> Replace `your_newsapi_key` with your key from [NewsAPI.org](https://newsapi.org/).

### 4️⃣ Add `.env` to `.gitignore`
Ensure `.env` is not tracked by Git:
```
# Ignore environment variable file
.env
```

### 5️⃣ Run the server
```bash
node index.js
```
Server runs at:
```
http://localhost:3000
```

---

## 📡 API Endpoints

### **1. Root Endpoint**
**GET** `/`  
Returns a welcome message.
```json
{
  "message": "Welcome to the news aggregator API by saiharish"
}
```

---

### **2. Sign Up**
**POST** `/users/signup`  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword",
  "preferences": ["technology", "sports"]
}
```
**Response:**
```json
{
  "message": "User registered successfully.",
  "hashedPassword": "<hashed_password>"
}
```

---

### **3. Log In**
**POST** `/users/login`  
**Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword"
}
```
**Response:**
```json
{
  "token": "<jwt_token>"
}
```

---

### **4. Update Preferences**
**PUT** `/users/preferences`  
**Headers:**
```
Authorization: Bearer <jwt_token>
```
**Body:**
```json
{
  "preferences": ["business", "health"]
}
```
**Response:**
```json
{
  "message": "Preferences updated successfully."
}
```

---

### **5. Get Preferences**
**GET** `/users/preferences`  
**Headers:**
```
Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "preferences": ["business", "health"]
}
```

---

### **6. Fetch News**
**GET** `/news`  
**Headers:**
```
Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "news": [
    {
      "source": { "id": null, "name": "Example Source" },
      "author": "Author Name",
      "title": "Sample News",
      "description": "Short description",
      "url": "https://example.com",
      "urlToImage": "https://imageurl.com",
      "publishedAt": "2025-08-10T10:00:00Z",
      "content": "Full content..."
    }
  ]
}
```

---

## 🔐 Authentication
- Login returns a JWT token.
- Pass the token in the header for protected routes:
```
Authorization: Bearer <token>
```

---

## ⚠️ Notes
- Currently uses **in-memory storage** — data resets on server restart.
- Use a database like **MongoDB** or **PostgreSQL** in production.
- Never commit `.env` or secrets to version control.

---

## 📜 License
MIT License
