var express = require("express");
var router = express.Router();
const User = require("../models/Users");
const cron = require('node-cron');

router.get("/", function(req, res) {
    User.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

router.post("/register", (req, res) => {
    const newUser = new User({
        userName: req.body.userName,
        password:req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber:req.body.phoneNumber,
        emergencyContacts:req.body.emergencyContacts,
        medications: req.body.medications
    });

    newUser.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.get("/getById/:userId",(req,res) =>{
  const UserId = req.params.userId ;
  console.log(req.params) ;
  User.find({ '_id': UserId }, (err, appointments) => {
    if (err) {
      // Handle error here, e.g., return an error response
      res.status(500).json({ error: 'Error fetching appointments' });
    } else {
      res.status(200).json(appointments);
    }
  });
})


router.post("/login", (req, res) => {
	const email = req.body.email;
	User.findOne({ email }).then(user => {
		if (!user) {
			return res.status(404).json({
				error: "Email not found",
			});
        }
        else{
            res.send("Email Found");
            return user;
        }
	});
});

let plivo = require('plivo')

let scheduleData = [
    { timestamp: '4 16 * * *', phoneNumber: '+917013459187' },
] ;


function sendSMS(phoneNumber, message) {
    const client = new plivo.Client('XXXXXXXXXXXXX','XXXXXXXXXXXXX');
  
    client.messages.create({
      src: "+917569268862",
      dst: phoneNumber,
      text: message,
    })
    .then((response) => {
      console.log('SMS sent to', phoneNumber, 'Response:', response);
    })
    .catch((error) => {
      console.error('Error sending SMS to', phoneNumber, 'Error:', error);
    });
}

function scheduleMessages() {
    scheduleData.forEach((data) => {
      const { timestamp, phoneNumber } = data;
      const message = 'Your scheduled message here';
  
      cron.schedule(timestamp, () => {
        console.log('Sending SMS to', phoneNumber, 'at', new Date().toString());
        sendSMS(phoneNumber, message);
      });
    });
}

scheduleMessages();

module.exports = router;

