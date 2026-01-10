# 🛒 GroCart

**GroCart** is your go-to online grocery store, offering a wide range of fresh produce, pantry essentials, and household items with fast and reliable delivery right to your doorstep.

🌐 **Live App:** (<https://grocart-bice.vercel.app/>)  
🔌 **Socket Server:** (<https://grocart-socket-server.onrender.com>)

---

📂 **Repository URL:** [Next App](https://github.com/RizwanTariq/grocart)
📂 **Repository Structure**

```bash
grocart/
├── public
│   ├── images
│   └── fonts
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   └── register
│   │   ├── (sections)
│   │   │   ├── admin
│   │   │   ├── user
│   │   │   └── delivery-rider
│   │   ├── api
│   │   │   ├── admin
│   │   │   ├── auth
│   │   │   ├── cron
│   │   │   ├── delivery-chat
│   │   │   ├── delivery-rider
│   │   │   ├── me
│   │   │   ├── reverse-geocode
│   │   │   └── socket
│   │   │   ├── user
│   │   │   ├── webhooks
│   │   ├── actions
│   │   ├── unauthorized
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └──  page.tsx
│   ├── assets
│   └── components
│   ├── constants
│   ├── hooks
│   ├── libs
│   ├── models
│   ├── server
│   ├── store
│   ├── types
│   ├── auth.ts
│   ├── utils
│   ├── AuthStoreBootstrap.tsx
│   ├── global.d.ts
│   ├── next-auth.d.ts
│   ├── Provider.tsx
│   ├── proxy.ts
│   └── SocketContext.tsx
├── .env
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

grocart-socket-server/
├── src
│   ├── env.ts
│   ├── index.ts
│   ├── redis.ts
│   └── requests.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Overview

GroCart is a **full-stack grocery delivery platform** built with modern web technologies. It supports real-time order tracking, live chat between customers and delivery riders, secure online payments, and OTP-based delivery verification via WhatsApp and Email.

The platform is designed to serve **three types of users**:

- **Customers**
- **Delivery Riders**
- **Admins**

---

## 👥 User Roles & Features

### 🧑‍💼 Customers

- Browse grocery products
- Add items to cart
- Place orders
- Pay online using **Stripe**
- Track orders in real-time on map
- Live chat with delivery rider
- Receive OTP via **WhatsApp & Email** for delivery verification
- View order history and details

---

### 🛵 Delivery Riders

- Receive order delivery broadcasts
- Accept **only one active delivery at a time**
- Share live location with customers
- Chat with customers in real time
- Verify delivery using OTP
- Update order delivery status

---

### 🛠️ Admins

- Manage products & stock
- Manage orders
- Broadcast delivery requests to active riders
- Monitor order statuses
- Oversee platform operations

---

## 🧰 Tech Stack

### Frontend

- **Next.js (App Router)**
- **TypeScript**
- **React 19**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Auth.js (NextAuth v5)** – Authentication & Authorization
- **Leaflet + OpenStreetMap** – Live delivery tracking
- **React Leaflet** (Map)
- **Recharts** – Analytics & charts
- **Lucide React** – Icons
- **Motion React** (Animations)
- **Google GenAI** (Chat message suggestions)
- **React Hot Toast** (Notifications)
- **use-local-storage-state** (Local storage)
- **Country Flag Icons** (Country flags)
- **clsx** (Classname utilities)
- **Axios** (HTTP requests)

---

### Backend

- **Next.js API Routes**
- **MongoDB**
- **Mongoose**
- **Stripe** – Online payments
- **Cloudinary** – Image storage
- **bcryptjs** – Password hashing
- **node-mailjet** – Email OTPs
- **SendZen** – WhatsApp OTPs
- **Gemini (Google GenAI)** – Chat message suggestions
- **Axios** (HTTP requests)
- **Cron** (Scheduled jobs)
- **Auth.js (NextAuth v5)** – Authentication & Authorization

---

### Realtime & Background Jobs

- **Socket.IO** (separate server)
  - Live chat (Customer ↔ Rider)
  - Order status updates
  - Rider location updates
- **Redis (location storage & lastest active riders)**
- **EasyCron**
  - Auto-expire unpaid orders
  - Cleanup failed payments

---

### Notifications & Messaging

- **Mailjet** – Email OTPs
- **SendZen** – WhatsApp OTPs
- **Gemini (Google GenAI)** – Chat message suggestions

---

## 🔌 Socket.IO Server

A **separate Socket.IO server** is used for real-time features:

- Order chat
- Order status updates
- Live rider location updates
- Event-based communication

🔗 **Socket Server URL:**  
<https://grocart-socket-server.onrender.com>

---

## 🗺️ Live Order Tracking

GroCart provides **real-time order tracking** using:

- **Leaflet**
- **OpenStreetMap**
- Live GPS updates from delivery riders via Socket.IO

Customers can see rider movement on the map until delivery is completed.

---

## 🔐 Authentication & Authorization

- Powered by **Auth.js (NextAuth v5)**
- Role-based access control:
  - Admin
  - Customer
  - Delivery Rider
- Secure session handling
- Protected routes for sensitive operations

---

## 💳 Payments

- **Stripe** is used for online payments
- Payment status is verified before order confirmation
- Failed payments are handled via cron jobs
- Orders expire automatically if payment is not completed within a specified time

---

## ⏱️ Cron Jobs

GroCart uses **EasyCron** to run scheduled jobs:

- Automatically expire unpaid orders
- Handle failed payment cleanups

🔗 <https://www.easycron.com/cron-jobs>

---

## 📦 Environment Variables

Create a `.env` file and configure the following:

```env
# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_DOMAIN_EMAIL="contact@yourdomain.com"

# Database
MONGODB_URL= ***************

# Auth
AUTH_SECRET= ***************
GOOGLE_CLIENT_ID= ***************
GOOGLE_CLIENT_SECRET= ***************

# Stripe
STRIPE_SECRET_TOKEN= ***************
STRIPE_WEBHOOK_SECRET= ***************

# Cloudinary
CLOUDINARY_CLOUD_NAME= ***************
CLOUDINARY_API_KEY= ***************
CLOUDINARY_API_SECRET= ***************

# Mailjet
MAILJET_API_KEY= ***************
MAILJET_API_SECRET= ***************
MAILJET_FROM_EMAIL= ***************

# SendZen
SENDZEN_API_KEY= ***************
SENDZEN_FROM_NUMBER= ***************

# Socket Server
NEXT_PUBLIC_SOCKET_URL= https://grocart-socket-server.onrender.com
EMITTER_SECRET="verifyable secret in socket server"

# Cron
CRON_SECRET="verifyable secret in socket server"

# Gemini AI
GEMINI_API_KEY=
```
