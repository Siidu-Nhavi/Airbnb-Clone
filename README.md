![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-Backend-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red)
![Passport.js](https://img.shields.io/badge/Passport.js-Authentication-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)


🏡 Airbnb Clone – Full-Stack Web Application

A full-stack Airbnb-inspired web application that allows users to browse property listings, view detailed information, and authenticate securely.
The project focuses on clean backend architecture, scalable structure, and real-world authentication patterns using modern web technologies.

This application is built as a learning-plus-production-ready project to understand how large platforms like Airbnb manage listings, users, sessions, and UI rendering.

🎯 Project Objective

1.The goal of this project is to:
2.Build a real-world full-stack application
3.Understand RESTful routing and MVC architecture
4.Implement secure authentication and session management
5.Work with MongoDB Atlas and cloud-based persistence
6.Develop a scalable backend structure suitable for future features


🚀 Features Implemented

🖥️ Frontend (UI & UX)

->Fully responsive UI using Bootstrap
->Airbnb-style layout and navigation
->Dynamic rendering using EJS templates
->Flash messages for success and error feedback
->Clean, reusable partials (navbar, alerts, layouts)

🏠 Property Listings Module

->View all available property listings
->Individual listing detail pages
->Add new listings with images
->Edit existing listings
->Delete listings
->Images integrated using Unsplash
->Data stored and managed via MongoDB

🔐 User Authentication & Authorization (Recently Added)

->User signup with username, email, and password
->Secure login using Passport.js (Local Strategy)
->Password hashing with passport-local-mongoose
->Session persistence using express-session
->MongoDB-based session storage using connect-mongo
->Flash messages for login/signup success and errors
->Automatic redirect after login
->User model and authentication routes fully implemented

🗄️ Backend & Database

->MongoDB Atlas as cloud database
->Mongoose schemas and models
->Centralized error handling
->Async error wrapper utility
->Modular routing for scalability

🛠 Tech Stack
# Frontend

HTML
CSS
JavaScript
Bootstrap
EJS (Embedded JavaScript Templates)

# Backend
Node.js
Express.js
MongoDB (Atlas)
Mongoose ORM
Passport.js
express-session
connect-mongo
connect-flash


airbnb-clone/
│
├── controllers/
│   ├── listing.js        # Listing CRUD routes
│   ├── review.js         # Review-related routes
│   └── user.js           # Authentication routes (login/signup)
│
├── models/
│   ├── listing.js        # Listing schema
│   └── user.js           # User schema with Passport plugin
│
├── views/
│   ├── listings/         # Listing pages
│   ├── users/            # Login & signup pages
│   ├── includes/         # Navbar, flash messages, partials
│   └── layouts/          # Boilerplate layout
│
├── utils/
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async error wrapper
│
├── public/               # Static assets (CSS, JS, images)
├── app.js                # Main server file
├── package.json
└── package-lock.json



## ▶️ How to Run

### Backend

```bash
npm install
npm start

```Frontend
endered dynamically through EJS.

## Visit:

http://localhost:8080/listings
http://localhost:8080/signup
http://localhost:8080/login


🚀 Deployment Guide

This project is designed to be easily deployed on modern cloud platforms such as Render, Railway, or Vercel (backend-only).

🌐 Deployment on Render (Recommended)

1️⃣ Create a Web Service

Go to Render Dashboard
Click New → Web Service
Connect your GitHub repository

2️⃣ Configure Build Settings
Build Command: npm install
Start Command: npm start

3️⃣ Add Environment Variables
In Render → Environment → Add:

ATLASDB_URL=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secure_secret
NODE_ENV=production

4️⃣ MongoDB Atlas Configuration
Add your Render IP (or 0.0.0.0/0) to Atlas Network Access
Ensure the correct database user and password are set


🚄 Deployment on Railway (Alternative)
Create a new project
Connect GitHub repository
Add the same environment variables
Railway auto-detects Node.js and deploys


⚠️ Important Production Notes
Cookies are set with secure: true in production
Sessions are persisted using connect-mongo
MongoDB Atlas ensures data durability
Flash messages and authentication remain intact after deployment

🌍 Live URL (Optional)

✅ Why This Deployment Setup Is Production-Safe

Stateless server with persistent sessions
Secure cookies in production
Cloud-hosted database (MongoDB Atlas)
Environment-variable–based secrets
Scalable Express architecture


🤝 Contribution & Feedback

This project is actively evolving.
Suggestions, improvements, and feedback are welcome.
Feel free to:
Fork the repository
Open an issue
Submit a pull request

📜 License

This project is for educational purposes and personal learning.