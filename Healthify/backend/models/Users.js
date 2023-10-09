const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true,
	},
	dateOfBirth:{
		type:Date,
		required:true,
	},
	phoneNumber:{
		type:String,
		required:true,
		unique:true,
	},
	emergencyContacts:[{
		name:{
			type:String,
			required:true,
		},
		relationship:{
			type:String,
		},
		phoneNumber:{
			type:String,
			required:true
		}
	}],
});

module.exports = User = mongoose.model("Users", UserSchema);
