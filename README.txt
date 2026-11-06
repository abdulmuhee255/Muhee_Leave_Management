EMPLOYEE LEAVE MANAGEMENT SYSTEM

SETUP
1. Run database.sql in MySQL Workbench.
2. Open this folder in VS Code.
3. Run: npm install
4. In app.js, change password: "root" to your actual MySQL password.
5. Run: npm start
6. Open: http://localhost:3000/

FILES
app.js - Node.js and Express backend
database.sql - Database and table creation
public/index.html - Dashboard
public/employees.html - Add/list employees
public/leaveTypes.html - View leave types
public/applyLeave.html - Apply for leave
public/listLeaves.html - List leave requests
public/approveLeave.html - Approve/reject requests
public/updateLeave.html - Modify leave records
public/history.html - Employee leave history

Keep app.js in the main folder and all HTML files in public.
This is an academic CRUD application and does not include login or role-based security.
