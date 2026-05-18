# School Management System

A full-stack school management system. Supports three roles: admin, teacher, and student.

## Tech Stack
**Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT  
**Frontend:** React, Vite, Tailwind CSS  
**AI:** Groq API (Llama 3.3 70B)

## Features
- Role-based access control for admins, teachers, and students
- Class and section management with student enrollment and teacher assignment
- Attendance tracking and grade management
- AI-powered report card comment generator — queries live student data from PostgreSQL and uses a multi-stage LLM pipeline to generate personalized, editable comments with tone controls

## Setup
1. Clone the repo
2. Add a `.env` file in `/backend` with `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, and `PORT`
3. Run `npx prisma migrate dev` in `/backend`
4. Run `npm run dev` in both `/backend` and `/frontend`