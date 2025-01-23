const { google } = require("googleapis");
const axios = require("axios").default;
const https = require("https");



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
  const emails = req.body.emails?.map(email => email.trim().toLowerCase()); // Normalize input emails
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
    // Fetch all rows from the spreadsheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No rows found in the spreadsheet");
      return res.status(404).send({ error: "No data found in the spreadsheet" });
    }

    const headers = rows[0].map(header => header.trim());
    const emailIndex = headers.indexOf("Email");

    if (emailIndex === -1) {
      console.log("Email column not found");
      return res.status(400).send({ error: "Email column not found" });
    }

    console.log("Searching for emails:", emails);

    // Find the row indices for the provided emails
    const rowsToDelete = rows
      .map((row, index) => {
        if (index === 0) return -1; // Skip the header row
        return emails.includes(row[emailIndex]?.trim().toLowerCase()) ? index : -1;
      })
      .filter(index => index !== -1); // Filter out invalid indices

    if (rowsToDelete.length === 0) {
      console.log("No matching emails found in the spreadsheet");
      return res.status(404).send({ error: "No matching emails found in the spreadsheet" });
    }

    const sheetInfo = await googleSheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetInfo.data.sheets.find(sheet => sheet.properties.title === "Form Responses 1");
    if (!sheet) {
      return res.status(400).send({ error: "Sheet not found" });
    }

    const sheetId = sheet.properties.sheetId;

    // Create delete requests for all rows
    const deleteRequests = rowsToDelete.map(rowIndex => ({
      deleteDimension: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    }));

    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: deleteRequests,
      },
    });

    console.log("Rows deleted successfully:", rowsToDelete);
    res.status(200).send({ message: "Participants Rejected successfully", deletedRows: rowsToDelete });
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).send({ error: "Error deleting rows" });
  }
};

const approveParticipants = async (req, res) => {
  
}


module.exports={
  getDetails:getDetails,
  deleteRowByEmail:deleteRowsByEmails,
  approveParticipants:approveParticipants
}