const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
	doctorName:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true,
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	phoneNumber:{
		type:String,
		required:true,
		unique:true,
	},
    specialisation:{
        type: String,
        required:true
    },
    hospital:{
        name:{
            type:String,
            required:true,
        },
        location:{
            type:String,
            required:true
        }
    }
});

module.exports = Doctor = mongoose.model("Doctors", DoctorSchema);
