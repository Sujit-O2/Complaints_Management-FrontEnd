🌐✨ Complaint Management System — Frontend

A smart, fast & secure platform to submit, track, and manage complaints
Built with ⚡ React + Vite · 🔐 JWT Auth · 🎨 Modern UI

👇 Live App
🔗 https://complaints-management-front-end.vercel.app/

<div align="center">
🚀 Sleek • Fast • Secure

🌈 A smooth user experience with powerful admin controls.

</div>
🎯 Core Features

✨ For Users

📝 Submit complaints instantly

🔎 Track complaint status live

👤 Manage your own profile

🔐 Secure login with JWT

🛡️ For Admins

📂 View all complaints

🟡 Update status (Pending → In-Progress → Resolved)

🧮 Dashboard insights

👥 Manage users

🧠 System

🛣️ Protected Routes

⚡ Ultra-fast Vite build

📡 Integrated with Spring Boot API

📱 Fully responsive

🧩 Tech Stack
🎨 Frontend
Tech	Purpose
⚛️ React (Vite)	UI Framework
🧭 React Router	Navigation
📡 Axios	API calls
🌀 Context API	Auth management
🎨 Tailwind / CSS	Styling
🔐 JWT	Authentication
🖥 Backend (Connected)
Tech	Purpose
☕ Spring Boot	REST API
💾 MySQL	Database
🛡 Spring Security	Authorization
🔑 JWT	Token Security
📁 Project Structure
src/
│── assets/            # images/icons
│── components/        # reusable UI parts
│── pages/             # main screens
│── services/          # api + axios wrapper
│── context/           # auth state
│── utils/             # helper functions
│── App.jsx
│── main.jsx

⚙️ Setup & Installation
🧪 1️⃣ Clone the Repo
git clone https://github.com/your-username/complaints-management-front-end.git

📦 2️⃣ Install Dependencies
npm install

🔐 3️⃣ Add Environment Variables

Create .env:

VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Complaint Management

🚀 4️⃣ Run the Project
npm run dev


Your local dev server is live at:
🌍 http://localhost:5173

🔐 Authentication Workflow (Smooth & Secure)

🔑 User logs in → receives JWT Token

💾 Token saved in localStorage

🛰 Axios interceptor attaches token to every request

🚪 Protected routes verify:

👤 USER → user dashboard

🛡 ADMIN → admin panel

❌ Invalid token → auto logout

🔗 API Endpoints Used
🔑 Auth
POST /auth/login  
POST /auth/register

📝 User
POST /complaints
GET  /complaints/my

🛡 Admin
GET  /admin/complaints
PUT  /admin/status/{id}

🎨 UI Preview (Add Screenshots Later)
🌟 Dashboard  
📝 Complaint Form  
🛡 Admin Panel  
🔐 Login & Register  

🚀 Deployment (Vercel – Super Easy)

1️⃣ Push code → GitHub
2️⃣ Open Vercel → New Project
3️⃣ Select Repo
4️⃣ Add environment variables
5️⃣ Deploy 💨

Vercel handles:
✔ Auto build
✔ Global CDN
✔ Lightning speed

🌟 Upcoming Enhancements

🔔 Real-time notification system

📊 Advanced analytics for admin

📱 PWA + Mobile App support

📨 Email alerts

🎛 Filters & search for complaints

🤝 Contributing

💡 PRs are welcome!
Help improve UI, logic, or docs.

🧑‍💻 Developer

👋 Sujit Swain
🌐 Frontend Live: https://complaints-management-front-end.vercel.app/

📧 sujitswain077@gmail.com