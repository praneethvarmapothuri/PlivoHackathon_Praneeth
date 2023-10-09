var express = require("express");
var router = express.Router();
const Doctor = require("../models/Doctors");
const cron = require('node-cron');


router.post("/register", (req, res) => {
    const newDoctor = new Doctor({
        doctorName:req.body.doctorName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        specialisation: req.body.specialisation,
        hospital:{
            name:req.body.hospital.name,
            location: req.body.hospital.location
        }
    });

    newDoctor.save()
        .then(user => {
            res.status(200).json(doctor);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});




router.get("/getall",(req,res)=>{
    Doctor.find(function(err,doctors) {
		if (err) {
			console.log(err);
		} else {
			res.json(doctors);
		}
	})    
})

router.get("/getById/:DoctorId",(req,res)=>{
    const DoctorId = req.params.DoctorId ;
    console.log(req.params) ;
    Doctor.find({ '_id': DoctorId }, (err, appointments) => {
      if (err) {
        // Handle error here, e.g., return an error response
        res.status(500).json({ error: 'Error fetching appointments' });
      } else {
        res.status(200).json(appointments);
      }
    });
})




module.exports = router;

