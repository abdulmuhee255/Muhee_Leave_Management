const express = require("express");
const mysql = require("mysql8");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // Replace with your MySQL password
  database: "employee_leave"
});
db.connect(err => {
  if (err) { console.log("MySQL connection failed:", err.message); return; }
  console.log("Connected to MySQL");
});

app.get("/employees", (req,res) => db.query("SELECT * FROM employees ORDER BY employee_id", (e,r) => e ? res.status(500).send(e.message) : res.json(r)));
app.post("/employees", (req,res) => {
  const {name,email,department,designation}=req.body;
  if(!name||!email||!department||!designation) return res.status(400).send("All employee fields are required");
  db.query("INSERT INTO employees(name,email,department,designation) VALUES(?,?,?,?)",[name,email,department,designation],e=>e?res.status(500).send(e.message):res.send("Employee Added Successfully"));
});
app.get("/leave-types", (req,res) => db.query("SELECT * FROM leave_types ORDER BY leave_type_id",(e,r)=>e?res.status(500).send(e.message):res.json(r)));
app.post("/leave-requests", (req,res) => {
  const {employee_id,leave_type_id,from_date,to_date,reason}=req.body;
  if(!employee_id||!leave_type_id||!from_date||!to_date||!reason) return res.status(400).send("All leave fields are required");
  if(to_date<from_date) return res.status(400).send("To date must be on or after from date");
  db.query("INSERT INTO leave_requests(employee_id,leave_type_id,from_date,to_date,reason) VALUES(?,?,?,?,?)",[employee_id,leave_type_id,from_date,to_date,reason],e=>e?res.status(500).send(e.message):res.send("Leave Applied Successfully"));
});
app.get("/leave-requests",(req,res)=>db.query(`SELECT r.*,e.name,l.type_name FROM leave_requests r JOIN employees e ON r.employee_id=e.employee_id JOIN leave_types l ON r.leave_type_id=l.leave_type_id ORDER BY r.request_id DESC`,(e,r)=>e?res.status(500).send(e.message):res.json(r)));
app.put("/leave-requests/:id/status",(req,res)=>{
  const {status}=req.body;if(!["Approved","Rejected"].includes(status))return res.status(400).send("Invalid status");
  db.query("UPDATE leave_requests SET status=? WHERE request_id=?",[status,req.params.id],(e,r)=>{if(e)return res.status(500).send(e.message);if(!r.affectedRows)return res.status(404).send("Leave Request Not Found");res.send("Leave Status Updated Successfully")});
});
app.put("/leave-requests/:id",(req,res)=>{
  const {leave_type_id,from_date,to_date,reason}=req.body;
  if(!leave_type_id||!from_date||!to_date||!reason)return res.status(400).send("All leave details are required");
  if(to_date<from_date)return res.status(400).send("To date must be on or after from date");
  db.query("UPDATE leave_requests SET leave_type_id=?,from_date=?,to_date=?,reason=? WHERE request_id=?",[leave_type_id,from_date,to_date,reason,req.params.id],(e,r)=>{if(e)return res.status(500).send(e.message);if(!r.affectedRows)return res.status(404).send("Leave Request Not Found");res.send("Leave Details Updated Successfully")});
});
app.delete("/leave-requests/:id",(req,res)=>db.query("DELETE FROM leave_requests WHERE request_id=?",[req.params.id],(e,r)=>{if(e)return res.status(500).send(e.message);if(!r.affectedRows)return res.status(404).send("Leave Request Not Found");res.send("Leave Request Deleted Successfully")}));
app.get("/leave-history/:employee_id",(req,res)=>db.query("SELECT r.*,l.type_name FROM leave_requests r JOIN leave_types l ON r.leave_type_id=l.leave_type_id WHERE r.employee_id=? ORDER BY r.from_date DESC",[req.params.employee_id],(e,r)=>e?res.status(500).send(e.message):res.json(r)));
app.listen(3000,()=>console.log("Server running at http://localhost:3000"));
