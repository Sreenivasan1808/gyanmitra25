const XLSX = require('xlsx');
const studentModel = require("./models/attendence");

const axios=require("axios")

// Sample JSON data
const download = async (req, res) => {
    try {
        if(req.query.eventType=="solo"){
            const participants = await soloeventModel.find({ EventName: req.query.eventName });
            let jsonData = [];
            
            for (let i = 0; i < participants.length; i++) {
                const rollno = participants[i].Rollno; // Extract the Rollno
                //const data = await axios.get(`https://erp.mepcoeng.ac.in/StudentService.svc/getstudent/${rollno}`)
                const data=await studentModel.findOne({Rollno:rollno})
                let year=data.year
                // if(year%2==0)
                // {
                //     year=year/2
                // }
                // else{
                //     year=(year+1)/2
                // }
                if (data) {
                    jsonData.push({Rollno:data.RollNumber,Name:data.Name,Branch:data.Program,Year:year,Section:data.Section});
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
            res.setHeader('Content-Disposition', `attachment; filename=${req.query.eventName}_student_data.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Send the buffer as response
            res.send(buffer);
        }
        else{
            const participants = await groupeventModel.find({ EventName: req.query.eventName });
            let jsonData = [];
            console.log(participants)
            for (let i = 0; i < participants.length; i++) {
                const teamMembers = participants[i].members;
                const teamName=participants[i].teamName;
                for(let j=0;j<teamMembers.length;j++)
                {
                    const rollno=teamMembers[j]
                    //const data = await axios.get(`https://erp.mepcoeng.ac.in/StudentService.svc/getstudent/${rollno}`)
                    const data=await studentModel.findOne({Rollno:req.body.Rollno})
                    console.log(data);
                    if (data) {
                        jsonData.push({TeamName:teamName,Rollno:data.Rollno,Name:data.name,Branch:data.branch,Year:data.year,Section:data.section});
                    }
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
            res.setHeader('Content-Disposition', `attachment; filename=${req.query.eventName}_student_data.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Send the buffer as response
            res.send(buffer);
        }
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send('Error generating file');
    }
};

module.exports = {
    download: download
};
