# College Project Hub 🎓

A complete, full-stack **MERN (MongoDB, Express, React, Node.js)** centralized platform for colleges and universities to organize, manage, submit, evaluate, and showcase student academic projects.

---

## 🌟 Key Features

### 1. View Projects (Public Showcase)
* Browse all uploaded projects grouped and filterable by **Academic Year** and **Section / Branch**.
* Search projects dynamically by title, abstract keywords, and tech stack.
* Interactive **Project Preview** showcasing abstract, team members, deliverables (GitHub repo, live prototype, documentation), and faculty evaluation scorecards.

### 2. Student Team Self-Registration & Project Dispatch
* **Self-Enrollment for Student Teams**: Students can self-register their team directly on the platform without faculty manual data entry:
  * Select **Academic Cohort (Year)** and **Branch / Section** from initialized faculty rosters.
  * Enter **Team Name** and project scope.
  * Enter **Team Lead Name & Email** and choose their own secure password.
  * Dynamically add **Co-researchers / Team Members** (Name & Roll Number).
  * Receive an **instant confirmation email receipt** with registered team details.
* **Team Lead Sign In & Pre-fill**:
  * If email is not registered $\rightarrow$ shows `"you are not authorized"`.
  * If password is wrong $\rightarrow$ shows `"your password is wrong just check that"`.
  * Pre-fills team roster, description, and cohort data into the submission form.
* **One-Time Submission Enforcement**: Submissions are strictly one-time. After submission, the portal locks further modifications.

### 3. Teacher Portal (Faculty & Admin Control Center)
* **All Projects**: High-level table of all submitted projects with filters.
* **Pending Projects**: Tracks registered teams whose team lead has not yet submitted.
* **Unrated Projects**: Filterable queue of submissions awaiting faculty grading.
* **Multi-Criteria Scoring Rubric**:
  * Technical Approach (0–10)
  * Idea & Innovation (0–10)
  * Design Thinking (0–10)
  * UI & UX (0–10)
  * Aggregate Score (out of 40) + Qualitative Feedback.
  * **Automated Scorecard Notification**: An email report is automatically dispatched to the team lead upon submission.
* **Rated Projects**: Review previously evaluated projects with scorecards and edit capabilities.
* **Team Lead Data (Year-wise)**: Stored credentials directory for faculty reference.
* **Academic Management (Year $\rightarrow$ Section $\rightarrow$ Team)**:
  * Create academic years, sections, and teams with designated team leads.
  * Auto-generates secure passwords and sends initial login credentials to the lead's email.
  * **Cascading Deletions with Confirmation Modals**:
    * Deleting a team automatically deletes the lead account & submission.
    * Deleting a section automatically deletes all child teams and submissions.
    * Deleting a year automatically deletes all child sections, teams, and submissions.

---

## 🗂️ Project Structure

```text
ProjectHub/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection using Mongoose
│   │   └── mailer.js             # Nodemailer email dispatch service
│   ├── controllers/
│   │   ├── academicController.js # Years, Sections, Teams, Leads logic & cascades
│   │   ├── authController.js     # Teacher login & Team Lead verification
│   │   └── projectController.js  # Showcase, Submissions & Multi-rubric rating
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection for Teacher & Team Lead
│   ├── models/
│   │   ├── Project.js            # Submissions, links, scores & feedback
│   │   ├── Section.js            # Branch / section schema
│   │   ├── Teacher.js            # Faculty schema with bcrypt
│   │   ├── Team.js               # Team roster, lead email & credentials
│   │   └── Year.js               # Academic year schema
│   ├── routes/
│   │   ├── academicRoutes.js     # /api/academic
│   │   ├── authRoutes.js         # /api/auth
│   │   └── projectRoutes.js      # /api/projects
│   ├── utils/
│   │   ├── cascadeDelete.js      # Safe cascading removal helpers
│   │   └── emailTemplates.js     # Responsive HTML email templates
│   ├── .env                      # Environment configurations
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ConfirmModal.jsx  # Deletion confirmation dialog
    │   │   ├── Footer.jsx        # App footer
    │   │   ├── Navbar.jsx        # Navigation & active sessions
    │   │   ├── ProjectCard.jsx   # Project showcase card
    │   │   └── RatingModal.jsx   # Rubric scoring & feedback modal
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state for Teacher & Team Lead
    │   ├── pages/
    │   │   ├── Home.jsx          # Public showcase & filters
    │   │   ├── ProjectDetails.jsx# Project preview & scorecard
    │   │   ├── TeacherDashboard.jsx # 6-tab faculty management center
    │   │   ├── TeacherLogin.jsx  # Faculty authentication & quick demo seed
    │   │   └── UploadProject.jsx # Team Lead verification & submission
    │   ├── services/
    │   │   └── api.js            # Axios client with JWT interceptor
    │   ├── App.jsx               # React Router layout
    │   ├── index.css             # Tailwind base styles
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local Community Server running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### Step 1: Install & Start Backend

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```

2. Review or update `backend/.env`:
   ```ini
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/college_project_hub
   JWT_SECRET=college_project_hub_super_secret_jwt_key_2026

   # Optional: Configure real SMTP credentials (e.g. Gmail App Password)
   # If left default, the app uses simulated logging so you can test without SMTP
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   EMAIL_FROM="College Project Hub <no-reply@projecthub.edu>"
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   * The API will run on `http://localhost:5000`.

---

### Step 2: Install & Start Frontend

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start Vite development server:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing the Complete Workflow

1. **Teacher Login**:
   * Go to `http://localhost:5173/teacher/login`.
   * Click **"Auto-fill Demo Teacher Credentials"** (creates `teacher@college.edu` / `password123`) and log in.
2. **Setup Academic Hierarchy**:
   * In the Teacher Dashboard, switch to **"Academic Management"**.
   * Add a Year (e.g. `2024-2025`).
   * Add a Section (e.g. `CSE-A`).
   * Add a Team (e.g. `Team Alpha`, Lead Email: `lead@college.edu`).
   * An auto-generated password will be created and logged/emailed.
3. **Team Lead Upload**:
   * Go to `http://localhost:5173/upload`.
   * Enter the team lead's email and password.
   * Verify credentials $\rightarrow$ fill in title, abstract, GitHub URL $\rightarrow$ submit.
   * Notice that the form immediately locks to prevent multiple submissions.
4. **Faculty Evaluation**:
   * Back in Teacher Portal, open **"Unrated Projects"**.
   * Click **"Rate Project"**, adjust category sliders (*Technical Approach, Idea, Design Thinking, UI & UX*), write remarks, and submit.
   * The project moves to **"Rated Projects"** and the scorecard is emailed to the lead.
5. **Public Showcase**:
   * Go to the home page `http://localhost:5173`.
   * The project is visible under Year and Section filters, with complete preview and evaluation badge.

