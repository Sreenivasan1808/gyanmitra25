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
      console.log(data);
      res.status(200).json(data); // Send the structured data as JSON
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error.message);
      res.status(500).send({ error: "Error fetching spreadsheet data" });
    }
}  
  
const deleteRowsByEmails = async (req, res) => {
  
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
  try {
    const participants = await getRowsByEmails(req.body.emails); // Fetch participant data based on emails
    const approvedFor=req.body.approvedFor
    if (!participants || participants.length === 0) {
      return res.status(400).send({ error: "No participants found for the provided emails" });
    }

    const addedParticipants = [];

    for (const participant of participants) {
      if (!participant || !participant.Email) {
        return res.status(400).send({ error: "Participant details or email missing" });
      }

      
      const Email=participant.Email
      const Name=participant.Name
      const gender=participant.gender
      const password=participant.password
      const MobileNo=participant.MobileNo
      const CollegeName=participant.CollegeName
      const CollegeCity=participant.CollegeCity
      // Check if the user already exists by email
      const existingUser = await UserModel.findOne({ email: Email });
      if (existingUser) {
        return res.status(400).send({ error: `User with email ${Email} already exists` });
      }
      let epay= approvedFor == 1 || approvedFor == 2 ? "Paid" : "Not Paid"; 
      let wpay= approvedFor == 0 || approvedFor == 2 ? "Paid" : "Not Paid"; 

      // Create a new user object
      const newUser = new UserModel({
        user_id: crypto.randomBytes(20).toString("hex"),
        name: Name,
        email: Email,
        gender: gender,
        password: password,
        phone: MobileNo,
        cname: CollegeName,
        ccity: CollegeCity,
        eventPayed: epay,
        workshopPayed: wpay,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();
      addedParticipants.push(savedUser);
    }
    const fakeRes = {
      status: (statusCode) => {
        fakeRes.statusCode = statusCode;
        return fakeRes;
      },
      send: (data) => {
        fakeRes.data = data;
        return fakeRes;
      },
    };
    const response = await deleteRowsByEmails(req,fakeRes)
    // console.log(response.statusCode)
    res.status(201).send({
      message: "New participants added successfully",
      participants: addedParticipants,
    });
  } catch (error) {
    console.error("Error inserting new participant:", error.message);
    res.status(500).send({ error: "Error inserting new participant" });
  }
};

const getRowsByEmails = async (emails) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1Bq7L2h6HOOovrdURIi_kHyWraRyMQkneFpuxoG-s6Pw";
  const range = "Form Responses 1";

  try {
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in the spreadsheet.");
      return [];
    }

    const headers = rows[0]; // The first row contains headers
    const emailIndex = headers.indexOf("Email");
    if (emailIndex === -1) {
      throw new Error('The "Email" column was not found in the spreadsheet.');
    }

    // Find rows matching the provided emails
    const matchingRows = rows.slice(1).filter((row) => emails.includes(row[emailIndex]));

    // Map the matching rows to objects
    return matchingRows.map((row) => {
      const data = {};
      headers.forEach((header, index) => {
        data[header] = row[index] || null;
      });
      return data;
    });
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error.message);
    return [];
  }
};



module.exports={
  getDetails:getDetails,
  deleteRowByEmail:deleteRowsByEmails,
  approveParticipants:approveParticipants
}