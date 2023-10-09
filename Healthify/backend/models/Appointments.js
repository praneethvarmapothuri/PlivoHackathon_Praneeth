const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
	Hospital:{
		type:String,
		required:true,
	},
	PatientId:{
		type:String,
		required:true,
	},
	PatientName:{
		type:String,
		required:true
	},
	DoctorId:{
		type:String,
		required:true,
	},
	DoctorName:{
		type:String,
		required:true,
	},
	Date:{
		type:String,
		required:true,
	},
	Location:{
		type:String,
		required:true,
		// unique:true
	},
	Healthissue:{
		type:String,
		required:true,
		// unique:true,
	},
	Status:{
		type:String,
		required:true,
	},
});

module.exports = Appointment = mongoose.model("Appointments", AppointmentSchema);
