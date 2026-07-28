# 🌟 SkillSphere

SkillSphere is a MERN stack web application that allows users to share skills, connect with other learners, send skill exchange requests, schedule learning sessions, and build a collaborative learning community.

---

## 🚀 Features

### 🔐 Authentication
- User Registration and Login
- JWT-based Authentication
- Secure password hashing using bcrypt
- Protected routes

### 👤 User Profiles
- Create and update profiles
- Add personal information
- View other user profiles

### 🎯 Skills Management
- Add skills
- Edit and delete skills
- Explore skills shared by users

### 🤝 Skill Requests
- Send skill exchange requests
- Accept or reject requests
- Track request status

### 📅 Learning Sessions
- Schedule learning sessions
- Manage upcoming sessions
- View session details

### ⭐ Reviews
- Give ratings and reviews
- Share feedback after sessions

### 🎨 UI
- Responsive design
- Clean and modern interface
- User-friendly dashboard

---

# 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT
- bcryptjs

---

# 📂 Project Structure

```
SkillSphere
│
├── client        # React frontend
│
├── server        # Node & Express backend
│
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/vishali12092006-art/SkillSphere.git
```

Go to project folder:

```bash
cd SkillSphere
```

Install dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

# 🔧 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

# ▶️ Run the Project

From the root folder:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

# 🔒 Security

- Passwords are encrypted using bcrypt.
- JWT is used for authentication.
- Sensitive information is stored in environment variables.
- `.env` file is excluded using `.gitignore`.

---

# 🎯 Future Enhancements

- Real-time chat
- Email verification
- Forgot password
- Notifications
- AI-based skill recommendations
- Advanced search and filters

---

# 👩‍💻 Author

**Vishali**

B.Tech Computer Science and Engineering Student

Aspiring Full-Stack MERN Developer

GitHub:
https://github.com/vishali12092006-art

---

⭐ If you like this project, consider giving it a star!
