# 🎓 SmartCampus — Smart Campus Resource Booking & Demand Prediction System

> A production-quality, full-stack college campus management platform built with Next.js 14, Prisma ORM, PostgreSQL, NextAuth, and Recharts.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Docker Desktop** (for PostgreSQL)

### 1. Start the Database
```bash
docker compose up -d
```
This starts PostgreSQL 16 on port **5434**.

### 2. Install Dependencies
```bash
npm install
```

### 3. Push Schema & Seed Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open **http://localhost:3000**

---

## 🔐 Demo Accounts

| Role    | Email                         | Password    |
|---------|-------------------------------|-------------|
| Admin   | admin@smartcampus.edu         | Admin@123   |
| Faculty | prof.sharma@smartcampus.edu   | Faculty@123 |
| Student | alice@smartcampus.edu         | Student@123 |
| Student | bob@smartcampus.edu           | Student@123 |

---

## ✨ Features

### Students & Faculty
- 🔍 **Resource Catalog** — Browse facilities with filtering by category, status, capacity
- 📅 **Smart Booking** — Real-time conflict detection prevents overlapping reservations
- 📊 **Demand Indicators** — AI-powered predictions show busy vs. available timeslots
- 🔔 **Notifications** — Instant alerts on booking confirmations, approvals, rejections
- 📋 **My Bookings** — Track and cancel active, pending, completed bookings

### Administrators
- ✅ **Booking Approvals** — Review/approve/reject pending bookings with justification
- 🏫 **Resource Management** — Full CRUD for campus facilities
- 👥 **User Management** — View and manage all student/faculty accounts
- 📈 **Analytics Dashboard** — Trends, category breakdowns, peak hours, top resources
- 🧠 **Demand Forecasting** — AI demand matrix across all campus facilities

---

## 🛠️ Technology Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Framework | Next.js 14 (App Router)            |
| Language  | TypeScript 5.7                     |
| Styling   | Tailwind CSS 3.4                   |
| Database  | PostgreSQL 16 (Docker)             |
| ORM       | Prisma 5.22                        |
| Auth      | NextAuth.js 4 (JWT + Credentials)  |
| Forms     | React Hook Form + Zod              |
| Charts    | Recharts 2.15                      |
| Icons     | Lucide React                       |

---

## 📜 Scripts

| Command                   | Description                         |
|---------------------------|-------------------------------------|
| `npm run dev`             | Start dev server on port 3000       |
| `npm run build`           | Build production bundle             |
| `npx prisma db push`      | Push schema to database             |
| `npx tsx prisma/seed.ts`  | Seed with demo data                 |
| `npx prisma studio`       | Open Prisma database GUI            |

---

## 🌐 AWS Deployment

Architected for AWS EC2 + Auto Scaling + Load Balancer:
1. Deploy Next.js on EC2 with PM2
2. Replace Docker DB with AWS RDS PostgreSQL
3. Configure Auto Scaling Group + ALB
4. Use AWS Secrets Manager for environment variables
