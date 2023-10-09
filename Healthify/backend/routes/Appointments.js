var express = require("express");
var router = express.Router();
const Appointment = require("../models/Appointments");
const Doctor = require("../models/Doctors") ;
const User = require("../models/Users")
const cron = require('node-cron');
let plivo = require('plivo') ;
const client = new plivo.Client('XXXXXXXXXXXXX','XXXXXXXXXXXXX');

router.post("/book", (req, res) => {
    const newAppointment = new Appointment({
        Hospital:req.body.Hospital,
        DoctorId:req.body.DoctorId,
        DoctorName:req.body.DoctorName,
        PatientId:req.body.PatientId,
        PatientName:req.body.PatientName,
        Date: req.body.Date,
        Location: req.body.Location,
        Healthissue: req.body.Healthissue,
        Status:req.body.Status
    });
    message="Appointment request from Patient X is done with "+req.body.Healthissue+" on "+req.body.Date ;
    newAppointment.save()
        .then(appointment => {
            Doctor.findOne({_id:appointment.DoctorId}).then(doctor => {
                client.messages.create({
                    src: "+917569268862",
                    dst: doctor.phoneNumber,
                    text: message,
                  })
                  .then((response) => {
                    console.log('SMS sent to', doctor.phoneNumber, 'Response:', response);
                  })
                  .catch((error) => {
                    console.error('Error sending SMS to', doctor.phoneNumber, 'Error:', error);
                  });                
            });
            res.status(200).json(appointment);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.get("/getall",(req,res)=>{
    Appointment.find(function(err,appointments) {
		if (err) {
			console.log(err);
		} else {
			res.json(appointments);
		}
	})    
})


router.get('/getByDoctorId/:DoctorId', (req, res) => {
  const DoctorId = req.params.DoctorId ;
  console.log(req.params) ;
  Appointment.find({ 'DoctorId': DoctorId }, (err, appointments) => {
    if (err) {
      // Handle error here, e.g., return an error response
      res.status(500).json({ error: 'Error fetching appointments' });
    } else {
      res.status(200).json(appointments);
    }
  });
});

router.get('/getByUserId/:UserId', (req, res) => {
  const UserId = req.params.UserId ;
  console.log(req.params) ;
  Appointment.find({ 'PatientId': UserId }, (err, appointments) => {
    if (err) {
      // Handle error here, e.g., return an error response
      res.status(500).json({ error: 'Error fetching appointments' });
    } else {
      res.status(200).json(appointments);
    }
  });
});

router.post('/approve',(req,res)=>{
  const appointmentId = req.body.AppointmentId;
  const newStatus = "Approved"; 
  console.log(appointmentId) ;
  Appointment.updateOne(
    {'_id':appointmentId},
    { $set:{'Status': newStatus} }).then((err,appointment) => {

      
      Appointment.findOne({_id:appointmentId}).then(appointment1 =>{
          User.findOne({_id:appointment1.PatientId}).then(user => {
            console.log(user) ;
            message=" Your Appointment request  with Doctor X regarding "+appointment1.Healthissue+" on "+appointment1.Date+" has been Approved" ;
            client.messages.create({
                src: "+917569268862",
                dst: user.phoneNumber,
                text: message,
              })
              .then((response) => {
                console.log('SMS sent to', user.phoneNumber, 'Response:', response);
              })
              .catch((error) => {
                console.error('Error sending SMS to', user.phoneNumber, 'Error:', error);
              });                
        });  
      })
      res.status(200).json(appointment);
    }
  );  
})



module.exports = router;

