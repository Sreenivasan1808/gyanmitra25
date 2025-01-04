const XLSX = require('xlsx');
const attendanceModel = require("./models/attendence");
const workshopAttendanceModel = require("./models/workshopattendence");
const userModel = require("./models/user")

// Sample JSON data
const attendanceDownload = async (req, res) => {
    try {
       console.log("entered")
            const participants = await attendanceModel.find({ event_id: req.query.event_id });
            let jsonData = [];
            
            for (let i = 0; i < participants.length; i++) {
                const user_id = participants[i].user_id; 
                const data=await userModel.findOne({user_id:user_id})
                
                if (data) {
                    jsonData.push({GMId:data.user_id,Name:data.name,CollegeName:data.cname});
                }
            }

            

            // Convert JSON data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(jsonData);

            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');

            // Write the workbook to a buffer
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

            // Set headers to trigger file download
            res.setHeader('Content-Disposition', `attachment; filename=event_data.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Send the buffer as response
            res.status(200).send(buffer);
       
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send('Error generating file');
    }
};
const workshopAttendanceDownload = async (req, res) => {
    try {
       console.log("entered")
            const participants = await workshopAttendanceModel.find({ workshopid: req.query.workshopid });
            let jsonData = [];
            
            for (let i = 0; i < participants.length; i++) {
                const user_id = participants[i].user_id; 
                const data=await userModel.findOne({user_id:user_id})
                
                if (data) {
                    jsonData.push({GMId:data.user_id,Name:data.name,CollegeName:data.cname});
                }
            }

            

            // Convert JSON data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(jsonData);

            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');

            // Write the workbook to a buffer
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

            // Set headers to trigger file download
            res.setHeader('Content-Disposition', `attachment; filename=event_data.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Send the buffer as response
            res.status(200).send(buffer);
       
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send('Error generating file');
    }
};
module.exports = {
    attendanceDownload:attendanceDownload,
    workshopAttendanceDownload:workshopAttendanceDownload
};
