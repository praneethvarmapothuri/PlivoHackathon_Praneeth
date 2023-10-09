const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "HealthCareDB"

// routes
var UserRouter = require("./routes/Users");
var DoctorRouter = require("./routes/Doctors.js") ;
var AppointmentRouter = require("./routes/Appointments") ;
var MedicationRouter = require("./routes/Medications")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb+srv://praneeth365:iamPraneeth@2003@cluster0.6nvfb.mongodb.net/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
// app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/doctor",DoctorRouter)
app.use("/appointment",AppointmentRouter)
app.use("/medication",MedicationRouter)

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
