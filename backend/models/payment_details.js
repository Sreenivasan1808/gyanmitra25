const mongoose = require("mongoose")

const paymentDetailsSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("paymentdetails",paymentDetailsSchema)