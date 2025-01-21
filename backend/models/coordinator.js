const mongoose = require("mongoose")

const coordinatorSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    dept: {
        type: String,
        required: true
    }
}) 
module.exports=mongoose.model("Coordinator",coordinatorSchema)