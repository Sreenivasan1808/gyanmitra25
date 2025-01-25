const { google } = require("googleapis");
const axios = require("axios").default;
const https = require("https");
const bcrypt = require("bcrypt");
const crypto =require("crypto")
const UserModel= require("./models/user")

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const getDetails=async (req, res) => {
    console.log("entered");
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
  
    const spreadsheetId = "1Bq7L2h6HOOovrdURIi_kHyWraRyMQkneFpuxoG-s6Pw";
    const range = "Form Responses 1"; // Specify the sheet name or range
  
    try {
      const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      const rows = response.data.values;
  
      if (!rows || rows.length === 0) {
        return res.status(404).send({ error: "No data found in the spreadsheet" });
      }
  
      const headers = rows[0]; // The first row is considered as headers
      const data = rows.slice(1).map((row) => {
        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = row[index] || null; // Map each cell to its header
        });
        return entry;
      });
  
      res.json(data); // Send the structured data as JSON
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error.message);
      res.status(500).send({ error: "Error fetching spreadsheet data" });
    }
}  
  
const deleteRowsByEmails = async (req, res) => {
  console.log("hi");
  const emails = req.body.emails?.map((email) => email.trim().toLowerCase()); // Normalize input emails
  console.log("Request Body:", req.body);

  if (!emails || emails.length === 0) {
    return res.status(400).send({ error: "No emails provided" });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1Bq7L2h6HOOovrdURIi_kHyWraRyMQkneFpuxoG-s6Pw";
  const range = "Form Responses 1"; // Specify the sheet name or range

  try {
    for (const email of emails) {
      // Fetch rows each time before deleting
      const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log("No rows found in the spreadsheet");
        return res.status(404).send({ error: "No data found in the spreadsheet" });
      }

      const headers = rows[0].map((header) => header.trim());
      const emailIndex = headers.indexOf("Email");

      if (emailIndex === -1) {
        console.log("Email column not found");
        return res.status(400).send({ error: "Email column not found" });
      }

      console.log(`Searching for email: ${email}`);

      // Find the row that matches the email
      const matchingRowIndex = rows.findIndex(
        (row) => row[emailIndex]?.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (matchingRowIndex === -1) {
        console.log(`Email "${email}" not found in the spreadsheet`);
        continue;
      }

      // Get the sheetId for the target sheet
      const sheetInfo = await googleSheets.spreadsheets.get({ spreadsheetId });
      const sheet = sheetInfo.data.sheets.find(
        (sheet) => sheet.properties.title === "Form Responses 1"
      );
      if (!sheet) {
        return res.status(400).send({ error: "Sheet not found" });
      }

      const sheetId = sheet.properties.sheetId;

      // Create a delete request for the found row
      const deleteRequest = {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: matchingRowIndex,
                endIndex: matchingRowIndex + 1,
              },
            },
          },
        ],
      };

      // Perform the delete operation for the row
      await googleSheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: deleteRequest,
      });

      console.log(`Row for email "${email}" deleted successfully.`);
    }

    res.status(200).send({ message: "Participants rejected successfully" });
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).send({ error: "Error deleting rows" });
  }
};



const approveParticipants = async (req, res) => {
  const participant = req.body; 
  console.log(participant)
  
  if (!participant || !participant.Email) {
    return res.status(400).send({ error: "Participant details or email missing" });
  }

  try {
    const Email = participant.Email;
    const Name = participant.Name;
    const gender = participant.gender;
    const password = participant.password;
    const mobileNo = participant.MobileNo;
    const collegeName = participant.CollegeName;
    const collegeCity = participant.CollegeCity;
    // Check if the user already exists by email
    const existingUser = await UserModel.findOne({ email: Email });

    if (existingUser) {
      // If the user already exists, return an error
      return res.status(400).send({ error: `User with email ${Email} already exists` });
    }

    // Create a new user object
    const newUser = new UserModel({
      user_id: crypto.randomBytes(20).toString('hex'),  // Generate a random user ID (you can change this logic)
      name: Name,
      email: Email,
      gender: gender,
      password: password,  // You should hash the password before saving
      phone: mobileNo,
      cname: collegeName,
      ccity: collegeCity,
      eventPayed: "Paid",  // Initial status
      workshopPayed: "Paid",  // Initial status
    });

    // Hash the password before saving it to the database
    // const salt = await bcrypt.genSalt(10);
    // newUser.password = await bcrypt.hash(newUser.password, salt);

    // Save the new user to the database
    await newUser.save();

    res.status(201).send({ message: "New participant added successfully", user: newUser });
  } catch (error) {
    console.error("Error inserting new participant:", error.message);
    res.status(500).send({ error: "Error inserting new participant" });
  } 
}


module.exports={
  getDetails:getDetails,
  deleteRowByEmail:deleteRowsByEmails,
  approveParticipants:approveParticipants
}