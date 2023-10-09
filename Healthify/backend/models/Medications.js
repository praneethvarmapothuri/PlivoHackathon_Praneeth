const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
	DoctorName:{
		type:String,
		required:true,
	},
    UserName:{
        type:String,
        required:true
    },
    DoctorId:{
        type:String,
        required: true,
    },
    UserId:{
        type:String,
        requireed:true
    },
    UserPhoneNumber:{
        type:String,
        required:true,
    },
	Time:{
		type:String,
		required:true,
	},
    Dosage:{
        type:String,
        required:true,
    },
	Healthissue:{
		type:String,
		required:true,
	}
});

module.exports = Medication = mongoose.model("Medications", MedicationSchema);
