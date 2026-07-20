# 🎵 Dhuwaani

Dhuwaani is a full-stack music streaming web application inspired by modern music platforms. Users can create an account, log in securely, browse songs and albums, and play music. Artists have additional privileges to upload and manage their music.

---

## 🚀 Live Demo

### Frontend
https://music-app-one-puce.vercel.app

### Backend API
https://music-app-ic3l.onrender.com

---

# ✨ Features

## Authentication
- User Registration
- User Login
- Secure JWT Authentication
- HTTP-Only Cookie Authentication
- Persistent Login (Session survives page refresh)
- Logout

## User Features
- Browse all songs
- Browse albums
- View album details
- Search music
- Play songs
- Music player with playback controls

## Artist Features
- Upload music
- Create albums
- Manage uploaded songs
- Artist-only protected dashboard

## Security
- Password hashing using bcrypt
- JWT authentication
- HTTP-only cookies
- Protected API routes
- Role-based authorization (User / Artist)

---

# 🛠 Tech Stack

## Frontend

- React
- React Router DOM
- Axios
- Context API
- Vite

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Cookie Parser
- CORS

---

# 📂 Project Structure

```
Dhuwaani
│
├── Backend
│   ├── src
│   │   ├── Controller
│   │   ├── Middleware
│   │   ├── Models
│   │   ├── Router
│   │   ├── Services
│   │   ├── db
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── Api
│   │   ├── Components
│   │   ├── Context
│   │   ├── Middleware
│   │   ├── Pages
│   │   ├── Assets
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/dhuwaani.git

cd dhuwaani
```

---

## Backend Setup

```bash
cd Backend

npm install
```

Create a `.env` file.

```env
PORT=4000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

# 🔐 Authentication Flow

1. User registers.
2. Password is hashed using bcrypt.
3. Server creates a JWT.
4. JWT is stored inside an HTTP-only cookie.
5. Every authenticated request automatically sends the cookie.
6. Protected routes verify the JWT before returning data.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

---

## Music

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/music` | Get all music |
| GET | `/api/music/:id` | Get single music |
| POST | `/api/music/upload` | Upload music (Artist only) |
| DELETE | `/api/music/:id` | Delete music |

---

## Albums

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/music/getalbum` | Get all albums |
| GET | `/api/music/getalbum/:id` | Get album details |
| POST | `/api/music/createalbum` | Create album |
| PATCH | `/api/music/updatealbum/:id` | Update album |
| DELETE | `/api/music/deletealbum/:id` | Delete album |

---

# 🌐 Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

### Media Storage

- Cloudinary

---


---

# 🔮 Future Improvements

- Playlist support
- Favorites / Liked Songs
- Recently Played
- Play History
- Music Recommendations
- User Profiles
- Follow Artists
- Queue System
- Shuffle & Repeat
- Dark/Light Theme
- Lyrics Support
- Comments & Reviews
- Admin Dashboard

---

# 👨‍💻 Author

**Aayush Adhikari**

GitHub: https://github.com/Aayush1Adk

LinkedIn: https://www.linkedin.com/in/aayush-adhikari619

---

# 📄 License

This project is licensed under the MIT License.
