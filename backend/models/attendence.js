const mongoose = require("mongoose")

const attendenceSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    eventid:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        required:true
    }
}) 
module.exports=mongoose.model("attendence",attendenceSchema)