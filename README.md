📘 Smart Result Viewer - Documentation
1. Project Overview
Smart Result Viewer is a modern web application designed to digitize academic record-keeping. It provides an intuitive interface for teachers and administrators to store, manage, and visualize student performance data effectively.

Instead of relying on manual paper records or complex spreadsheets, this application offers a centralized dashboard to input student details, record subject scores, and automatically generate performance analytics.

2. Key Features
🎓 Student Management
Create Student: Easily register new students with their Full Name, Registration Number, and Class.

Duplicate Check: The system prevents duplicate entries by checking if a Registration Number already exists before saving.

Search & Filter: Instantly find students by typing their Name or Reg No in the search bar.

Delete Records: Remove a student and automatically cascade the deletion to remove all their associated results (maintaining database integrity).

📊 Result Management
Score Input: Input Continuous Assessment (CA) and Exam scores for various subjects.

Auto-Calculation: The system automatically sums CA + Exam scores to derive the Total Score.

Performance Tracking: View detailed breakdowns of a student's performance across different terms and sessions.

📈 Data Visualization & Analytics
Subject Performance Charts: Interactive bar charts comparing a student's score in each subject.

Grade Distribution: Visual summaries showing how grades are distributed across the class (A-F).

Responsive Tables: Data tables automatically adjust for mobile devices (hiding less critical columns like Reg No on small screens).

3. Technology Stack
Frontend
Framework: Next.js 15 (App Router) - For server-side rendering and routing.

Language: TypeScript - For type safety and better developer experience.

Styling: Tailwind CSS - For responsive, utility-first design.

UI Components: Shadcn/UI - For accessible, pre-built components (Cards, Tables, Dialogs).

Icons: Lucide React.

Data & Logic
Data Fetching: Axios - For handling HTTP requests.

Database (Mock): JSON Server - Simulates a full REST API with a local JSON file.

Validation: Zod - Ensures data integrity (e.g., ensuring scores are numbers).

Visualization: Recharts - For rendering statistical charts.

Notifications: Sonner - For toast notifications (success/error messages).

4. System Architecture
The application follows a client-server architecture where Next.js handles the user interface and server-side rendering, while JSON Server acts as the backend database.

Data Structure (Relational Model)
The database uses a relational structure to keep data organized and scalable:

Students Table: Stores static info (id, name, regNo, class).

Results Table: Acts as a junction table linking a Student to specific Scores (studentId, termId, scores[]).

Subjects Table: Stores the master list of subjects to ensure consistency.


5. Usage Guide (Teacher Dashboard)
Adding a New Student
Navigate to the main dashboard.

Click the "+ New Student" button.

Fill in the Name, Reg No (e.g., "JS1/001"), and select a Class.

Click Create. The table will update instantly.

Adding/Viewing Results
Click on any student row in the main table or click "Open".

You will be directed to the Student Profile Page.

Here you can see the student's charts and detailed score history.

(If implemented) Use the "Add Result" form to input new scores for a term.

Deleting a Student
On the dashboard, find the student you wish to remove.

Click the "Delete" text in the Actions column.

Confirm the browser popup ("Are you sure...?").

Note: This will delete the student AND all their result records permanently.


live link: https://smart-results-viewer-1lju.vercel.app/


link to slides: https://docs.google.com/presentation/d/18nbGEEEXC47hYzTMWi3j7J-t-WMRlH_jgqWnewxfRY8/export/pdf


link to screenshots folder: https://drive.google.com/drive/folders/1IyJ8rd0wVCQhz7ABrlg3g3U0DAs41yYi?usp=drive_link

Colour Palette

🎨 Primary Palette (Brand Identity)

Color Name      Tailwind Class  Hex Code  Usage
Academic Indigo indigo-600      #4F46E5   Primary Buttons, Active Links, Highlights
Deep Indigo     indigo-700      #4338CA   Hover States, Headers
Soft Indigo     indigo-200      #C7D2FE   Avatars, Accents, Badges

🌑 Neutral Palette (UI & Backgrounds)

Color Name	   Tailwind Class	Hex Code	Usage
Obsidian	   gray-900	        #111827	    Main Dashboard Background
Charcoal	   gray-800	        #1F2937	    Cards, Modals, Sidebar
Slate	       gray-600	        #4B5563	    Borders, Secondary Text, Dividers
Cloud White	   gray-50 / white	#F9FAFB	    Main Text, Input Backgrounds

🚦 Functional Palette (Status & Grades)

Color Name	    Tailwind Class	Hex Code	Usage
Success Green	green-600	    #16A34A	   "A" Grades, Save Button, "Passed" badge
Warning Yellow	yellow-500	    #EAB308	   "C" Grades, Warning alerts
Danger Red	    red-500	        #EF4444	   "F" Grades, Delete Button, Error Toasts
Info Blue	    blue-500	    #3B82F6	    Information alerts, Links
