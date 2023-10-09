var express = require("express");
var router = express.Router();
const Medication = require("../models/Medications");
const Doctor = require("../models/Doctors") ;
const cron = require('node-cron');
let plivo = require('plivo') ;
const { format, parse } = require('date-fns');
const client = new plivo.Client('XXXXXXXXXXXXX','XXXXXXXXXXXXX');



router.get("/getall",(req,res)=>{
    Medication.find(function(err,appointments) {
		res.status(200).json(appointments) ;
	})    
})


let scheduleData = [] ;

const scheduledTasks = [];


function sendSMS(phoneNumber, message) {
    const client = new plivo.Client('XXXXXXXXXXXXX','XXXXXXXXXXXXX');
  
    client.messages.create({
      src: "+917569268862",
      dst: phoneNumber,
      text: message,
    })
    .then((response) => {
      console.log('SMS sent to', phoneNumber, 'Response:', response);
      client.calls.create(
        "+919999999999",
        phoneNumber,
        "https://infinosmobile.s3.ap-south-1.amazonaws.com/play_text.xml",
        {
          answerMethod: "GET",
      },
    ).then(function (response) {
       console.log("Call succesfull")
        console.log(response);
    }, function (err) {
        console.error(err);
    });
    })
    .catch((error) => {
      console.error('Error sending SMS to', phoneNumber, 'Error:', error);
    });
}

function scheduleMessages() {
    scheduleData.forEach((data) => {
      const { Time, UserPhoneNumber,UserName,DoctorName,Dosage } = data;
      const message = `Hello ${UserName}, \n Its time to take your medication as recommended by ${DoctorName} \n Medication:${Dosage} \n Prescribed Time: ${Time} \n Please remember to follow the doctors instructions for a safe and effective treatment.`;
      const parsedTime = parse(Time, 'h:mm a', new Date());
      const cronTimestamp = `${parsedTime.getMinutes()} ${parsedTime.getHours()} * * *`;
      console.log(cronTimestamp) ;
      const task = cron.schedule(cronTimestamp, () => {
        console.log('Sending SMS to', UserPhoneNumber, 'at', new Date().toString());
        sendSMS(UserPhoneNumber, message);
      }); 
      scheduledTasks.push(task);
    });
}


router.post("/add", (req, res) => {
    const newMedication = new Medication({
        DoctorName:req.body.DoctorName,
        UserName:req.body.UserName,
        DoctorId:req.body.DoctorId,
        UserId:req.body.UserId,
        UserPhoneNumber:req.body.UserPhoneNumber,
        Healthissue: req.body.Healthissue,
        Time:req.body.Time,
        Dosage:req.body.Dosage
    });

    newMedication.save()
    .then(medication => {
        res.status(200).json(medication);
        Medication.find(function(err,medications) {
            if (Array.isArray(medications)) {
                scheduleData = medications;
                scheduledTasks.forEach((task) => {
                    task.stop();
                });
                scheduleMessages();
              } else {
                res.status(400).send('Invalid schedule data format');
              }  
        })         
    })
    .catch(err => {
        res.status(400).send(err);
    });

});



router.post("/delete", (req, res) => {
    Medication.findOneAndDelete({ _id: req.body.medicationId })
    .then((medication) => {
      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }
      res.status(200).json(medication); 
      Medication.find(function(err,medications) {
        if (Array.isArray(medications)) {
            scheduleData = medications;
            scheduledTasks.forEach((task) => {
                task.stop();
            });
            scheduleMessages();
          } else {
            res.status(400).send('Invalid schedule data format');
          }  
     }) 
     
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/getByDoctorId/:DoctorId', (req, res) => {
  const DoctorId = req.params.DoctorId ;
  console.log(req.params) ;
  Medication.find({ 'DoctorId': DoctorId }, (err, appointments) => {
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
  Medication.find({ 'UserId': UserId }, (err, appointments) => {
    if (err) {
      // Handle error here, e.g., return an error response
      res.status(500).json({ error: 'Error fetching appointments' });
    } else {
      res.status(200).json(appointments);
    }
  });
});




module.exports = router;

