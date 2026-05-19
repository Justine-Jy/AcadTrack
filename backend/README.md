# AcadTrack — Backend API

Node.js + Express + MongoDB REST API for the AcadTrack Academic Information System.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at: `http://localhost:5000`

---

## 🔐 Login Credentials (after seeding)

| Role    | Student ID       | Password     |
|---------|-----------------|--------------|
| Admin   | ADMIN-001        | Admin@123    |
| Student | 2022-CS-00412    | Student@123  |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login, register, me
│   ├── studentController.js   # Admin: manage students
│   ├── subjectController.js   # CRUD subjects
│   ├── enrollmentController.js# Enroll / drop subjects
│   ├── gradesController.js    # View & post grades
│   ├── scheduleController.js  # Weekly timetable
│   ├── announcementController.js
│   └── dashboardController.js # Dashboard stats
├── middleware/
│   ├── auth.js                # JWT protect + authorize
│   └── errorHandler.js        # Async wrapper + errors
├── models/
│   ├── User.js
│   ├── Subject.js
│   ├── Enrollment.js
│   ├── Grade.js
│   └── Announcement.js
├── routes/
│   ├── auth.js
│   ├── students.js
│   ├── subjects.js
│   ├── enrollment.js
│   ├── grades.js
│   ├── schedule.js
│   ├── announcements.js
│   └── dashboard.js
├── utils/
│   └── seeder.js
├── .env.example
├── package.json
└── server.js
```

---

## 🌐 API Endpoints

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint                    | Access  | Description          |
|--------|-----------------------------|---------|----------------------|
| POST   | /api/auth/register          | Public  | Register student     |
| POST   | /api/auth/login             | Public  | Login, get token     |
| GET    | /api/auth/me                | Private | Get current user     |
| PUT    | /api/auth/updatepassword    | Private | Change password      |
| POST   | /api/auth/logout            | Private | Logout               |

### Dashboard
| Method | Endpoint            | Access  | Description             |
|--------|---------------------|---------|-------------------------|
| GET    | /api/dashboard/me   | Private | Full dashboard data     |

### Subjects
| Method | Endpoint            | Access        | Description        |
|--------|---------------------|---------------|--------------------|
| GET    | /api/subjects       | Private       | List all subjects  |
| GET    | /api/subjects/:id   | Private       | Get one subject    |
| POST   | /api/subjects       | Admin         | Create subject     |
| PUT    | /api/subjects/:id   | Admin         | Update subject     |
| DELETE | /api/subjects/:id   | Admin         | Delete subject     |

### Enrollment
| Method | Endpoint                  | Access  | Description       |
|--------|---------------------------|---------|-------------------|
| GET    | /api/enrollment           | Student | My enrollments    |
| POST   | /api/enrollment           | Student | Enroll in subject |
| PUT    | /api/enrollment/:id/drop  | Student | Drop subject      |
| GET    | /api/enrollment/all       | Admin   | All enrollments   |

### Grades
| Method | Endpoint                        | Access         | Description       |
|--------|---------------------------------|----------------|-------------------|
| GET    | /api/grades/me                  | Student        | My grades         |
| GET    | /api/grades/me/gpa              | Student        | My cumulative GPA |
| PUT    | /api/grades/:id                 | Admin/Faculty  | Post grade        |
| GET    | /api/grades/subject/:subjectId  | Admin/Faculty  | Subject grades    |

### Schedule
| Method | Endpoint          | Access  | Description        |
|--------|-------------------|---------|--------------------|
| GET    | /api/schedule/me  | Private | My weekly schedule |

### Announcements
| Method | Endpoint                | Access  | Description        |
|--------|-------------------------|---------|--------------------|
| GET    | /api/announcements      | Private | List announcements |
| GET    | /api/announcements/:id  | Private | Get one            |
| POST   | /api/announcements      | Admin   | Create             |
| PUT    | /api/announcements/:id  | Admin   | Update             |
| DELETE | /api/announcements/:id  | Admin   | Delete             |

### Students (Admin)
| Method | Endpoint                      | Access | Description        |
|--------|-------------------------------|--------|--------------------|
| GET    | /api/students                 | Admin  | List all students  |
| GET    | /api/students/:id             | Admin  | Get one student    |
| PUT    | /api/students/:id             | Admin  | Update student     |
| PUT    | /api/students/:id/deactivate  | Admin  | Deactivate account |

---

## 🔗 Connecting Frontend

In your `frontend/src/` folder, create `api.js`:

```js
const API = 'http://localhost:5000/api';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
```

---

## ⚙️ Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/acadtrack
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```