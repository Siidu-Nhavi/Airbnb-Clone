# Airbnb Clone

A full-stack Airbnb-style platform where users can browse property listings, view details, authenticate securely, and interact with a dynamic UI inspired by Airbnb.  
Built using Node.js, Express, MongoDB, and EJS templates, with clean backend architecture and scalable project structure.

---

## 🚀 Current Capabilities (Completed Work)

✔ Fully responsive UI with Bootstrap  
✔ Property listings with images (Unsplash integration)  
✔ Listing detail pages with dynamic content  
✔ Create, Edit, and Delete listings  
✔ MongoDB database with Mongoose models  
✔ Flash messages for user notifications  
✔ Passport.js setup for authentication  
✔ User signup and login system  
✔ Session management with express-session  
✔ Folder structure ready for scalable expansion  

---

## 🔐 **New Features Added Today (Authentication Update)**

### **User Authentication Module (Completed Today)**  
✔ Signup page with username, email, password  
✔ Login page using Passport Local Strategy  
✔ Secure password hashing using passport-local-mongoose  
✔ Flash messages for success/error  
✔ Login redirect system  
✔ Basic route protection foundation  
✔ User model implemented  
✔ User router implemented  

### These updates now allow:
- Creating a new user account  
- Logging in securely  
- Displaying login success/error messages  
- Redirecting to listings after login  

---

## 🏗️ Work In Progress (Upcoming Features)

◻ Route protection for creating/editing listings  
◻ Session-based redirect to originally requested page  
◻ Logout functionality  
◻ User dashboard to manage listings/bookings  
◻ Booking flow with date selection  
◻ Messaging/contact system  
◻ Admin panel for listing management  
◻ Deployment (Render / Railway / Vercel)  

---

## 🛠 Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Bootstrap  
- EJS templating engine  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose ORM)  
- Passport.js (local authentication)  
- express-session & connect-flash  

---

## 📂 Folder Structure

airbnb-clone/

├── router/
│ ├── listing.js # Listing CRUD routes
│ ├── review.js # Review routes
│ └── user.js # Login/Signup routes (NEW)
│
├── models/
│ ├── listing.js
│ └── user.js # User schema + passport plugin (NEW)
│
├── views/
│ ├── listings/ # Listing pages
│ ├── users/ # Login & Signup pages (NEW)
│ ├── includes/ # Flash, navbar, partials
│ └── layouts/ # Boilerplate layout
│
├── utils/
│ ├── ExpressError.js
│ └── wrapAsync.js
│
├── public/ # Static files
├── app.js # Main server file (updated today)
├── package.json
└── package-lock.json


---

## ▶️ How to Run

### Backend

```bash
npm install
npm start

```Frontend
endered dynamically through EJS.
Visit:

http://localhost:8080/listings
http://localhost:8080/signup
http://localhost:8080/login

🤝 Contact

For collaboration or improvement suggestions, feel free to connect or open an issue on GitHub.