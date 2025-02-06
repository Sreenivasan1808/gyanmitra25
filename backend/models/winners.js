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
    },
    fname:{
        type:String,
        required:true,
    },
    sname:{
        type:String,
        required:true,
    },
    tname:{
        type:String,
        required:true,
    },
    approved:{
        type:Boolean,
        required:true
    }
}) 
module.exports=mongoose.model("winners",winnersSchema)