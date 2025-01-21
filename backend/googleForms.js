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
  
const deleteRowByEmail = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase(); // Normalize input email
  console.log("Request Body:", req.body);

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
      console.log("No rows found in the spreadsheet");
      return res.status(404).send({ error: "No data found in the spreadsheet" });
    }

    const headers = rows[0].map(header => header.trim());
    const emailIndex = headers.indexOf("Email");

    if (emailIndex === -1) {
      console.log("Email column not found");
      return res.status(400).send({ error: "Email column not found" });
    }

    console.log("Searching for email:", email);
    const rowIndexToDelete = rows.findIndex((row, index) => {
      if (index === 0) return false; // Skip the header row
      return row[emailIndex]?.trim().toLowerCase() === email;
    });

    if (rowIndexToDelete === -1) {
      console.log("Email not found in the spreadsheet");
      return res.status(404).send({ error: "Email not found in the spreadsheet" });
    }

    const sheetInfo = await googleSheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetInfo.data.sheets.find(sheet => sheet.properties.title === "Form Responses 1");
    if (!sheet) {
      return res.status(400).send({ error: "Sheet not found" });
    }

    const sheetId = sheet.properties.sheetId;

    const deleteRequest = {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndexToDelete,
              endIndex: rowIndexToDelete + 1,
            },
          },
        },
      ],
    };

    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: deleteRequest,
    });

    console.log("Row deleted successfully");
    res.status(200).send({ message: "Row deleted successfully" });
  } catch (error) {
    console.error("Error deleting row:", error.message);
    res.status(500).send({ error: "Error deleting row" });
  }
};


module.exports={
  getDetails:getDetails,
  deleteRowByEmail:deleteRowByEmail
}