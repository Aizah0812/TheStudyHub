# 📚 Study Hub - Library Management System

A modern full-stack Library Management & Membership System built to simplify seat allocation, membership management, payment verification, and student administration.

Study Hub provides a complete digital solution for libraries and study centers with separate dashboards for users and administrators.

---

## 🚀 Features

### 👨‍🎓 User Features

* User Registration & Login
* JWT Authentication
* Membership Application
* Seat Selection System
* Payment Screenshot Upload
* Membership Status Tracking
* Membership Card Download
* Contact Form Support
* Responsive UI

### 👨‍💼 Admin Features

* Admin Dashboard
* Membership Management
* User Management
* Seat Management
* Revenue Tracking
* Complaint Management
* Notice Management
* Payment Verification
* Membership Approval & Rejection

### 🤖 Automated Features

* Membership Expiry Detection
* Automatic Seat Release
* Membership Expiry Reminder Emails
* Booking Confirmation Emails
* Membership Status Updates

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS3
* Framer Motion
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Services

* MongoDB Atlas
* Cloudinary
* Nodemailer
* Gmail SMTP

---

## 📂 Project Structure

```text
my-app
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── config
│
├── public
│
├── src
│   ├── components
│   ├── pages
│   ├── assets
│   ├── config
│   └── styles
│
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd my-app
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 🔄 Membership Workflow

1. Student submits membership application.
2. Student uploads payment screenshot.
3. Admin verifies payment.
4. Membership gets approved.
5. Membership card becomes available.
6. System tracks membership validity.
7. Reminder email is sent before expiry.
8. Membership expires automatically.
9. Seat becomes available again.

---

## 🔒 Security Features

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Environment Variables
* Secure File Uploads
* Cloud Storage Integration

---

## 📈 Future Enhancements

* Online Payment Gateway
* QR-Based Membership Verification
* Attendance Tracking
* Analytics Dashboard
* Mobile Application
* Multi-Branch Support

---

## 👩‍💻 Author

**Aizah Sarfaraz**

Government Engineering College, Vaishali

Full Stack Developer | Problem Solver | Open Source Contributor
