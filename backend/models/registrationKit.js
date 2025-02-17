const mongoose = require("mongoose");
const registrationKitSchema=new mongoose.Schema({
    user_id:{ type: String, unique: true, required: true },
    kitReceieved:{
        type:Boolean,
        unique:true,
        default:false
    }
})
module.exports=mongoose.model('registrationKitSchema',registrationKitSchema)