const mongoose = require("mongoose")

const winnersSchema = mongoose.Schema({
    first_prize:{
        type:[{type:String}],
        required:true,
    },
    second_prize:{
        type:[{type:String}],
        required:true,
    },
    third_prize:{
        type:[{type:String}],
        required:true,
    },
    event_id:{
        unique:true,
        type:String,
        required:true,
    }
}) 
module.exports=mongoose.model("winners",winnersSchema)