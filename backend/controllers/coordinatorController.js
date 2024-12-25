const winnersModel=require("../models/winners")
const attendanceModel = require("../models/attendence")
const uploadWinners = async (req, res) => {
    try {
        console.log(req.body)
        console.log("entered");
        const first_prize = [];
        const second_prize = [];
        const third_prize = [];
        const event_id = req.body.eventId;
        const fp = req.body.firstPrize;
        console.log(event_id);
        console.log(fp);

        for (let i = 0; i < fp.length; i++) {
            const verify = await attendanceModel.findOne({ user_id: fp[i], event_id: event_id });
            if (verify == null) {
                return res.status(204).json({ message: `${fp[i]} not participated in this event` });
            }
            first_prize.push(fp[i]);
        }

        const sp = req.body.secondPrize;
        for (let i = 0; i < sp.length; i++) {
            const verify = await attendanceModel.findOne({ user_id: sp[i], event_id: event_id });
            if (verify == null) {
                return res.status(204).json({ message: `${sp[i]} not participated in this event` });
            }
            second_prize.push(sp[i]); // Corrected this line
        }

        const tp = req.body.thirdPrize;
        for (let i = 0; i < tp.length; i++) { // Corrected this line
            const verify = await attendanceModel.findOne({ user_id: tp[i], event_id: event_id });
            if (verify == null) {
                return res.status(204).json({ message: `${tp[i]} not participated in this event` });
            }
            third_prize.push(tp[i]);
        }

        const newData = new winnersModel({
            first_prize: first_prize,
            second_prize: second_prize,
            third_prize: third_prize,
            event_id:event_id
        });

        const s = await newData.save(); // Ensure to await the save operation
        if (s) {
            res.status(200).json({ message: "uploaded successfully" });
        } else {
            res.status(201).json({ message: "upload unsuccessful" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "An error occurred",e})
    }
}
const getWinners = async (req,res)=>{
    try{
        const data = await winnersModel.findOne({event_id:req.query.eventId})
        if(data==null){
            res.status(204).json({message:"no details found"})
        }
        else{
            res.status(200).json(data)
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "An error occurred",e})
    }
}
module.exports={
    uploadWinners:uploadWinners,
    getWinners:getWinners
}