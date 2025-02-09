const PDFDocument = require("pdfkit");
const fs = require("fs");
const coordinatorController = require("./controllers/coordinatorController");
const winnersModel = require("./models/winners");
const eventModel = require("./models/events");
const userModel = require("./models/user");

const getCollegeWisePdf = async (req, res) => {
  try {
    const { cname } = req.query;
    console.log("College Name:", cname);

    if (!cname) {
      return res.status(400).send("College name (cname) is required");
    }

    const data = await coordinatorController.collegeWiseParticipant(cname);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .send("No participants found for the given college name");
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const filePath = `./${cname}_participants.pdf`;
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add Title
    doc.fontSize(18).text(`Participants from ${cname}`, { align: "center" });
    doc.moveDown(2);

    // Table Configuration
    const tableTop = 150; // Start position (y-coordinate)
    const columnWidth = 180;
    const tableLeft = 50;
    const columns = ["Participant Name", "Events", "Workshops"];
    const pageWidth = doc.page.width;

    // Draw Table Header
    let currentY = tableTop;

    columns.forEach((column, i) => {
      const x = tableLeft + i * columnWidth;
      doc.rect(x, currentY, columnWidth, 30).stroke(); // Header height = 30
      doc
        .fontSize(12)
        .text(column, x + 5, currentY + 10, {
          width: columnWidth - 10,
          align: "center",
        });
    });

    currentY += 30;

    // Draw Rows
    data.forEach((participant) => {
      const participantName = participant.user?.name || "N/A";
      const events = participant.events || [];
      const workshops = participant.workshops || [];

      // Calculate the row height dynamically based on content
      const eventsText = events.map((e) => `• ${e.name}`).join("\n");
      const workshopsText = workshops.map((w) => `• ${w.name}`).join("\n");
      const rowHeight =
        Math.max(
          doc.heightOfString(eventsText, {
            width: columnWidth - 10,
            fontSize: 10,
          }),
          doc.heightOfString(workshopsText, {
            width: columnWidth - 10,
            fontSize: 10,
          }),
          20 // Minimum height for rows
        ) + 10; // Add padding

      // Data for each column
      const rowData = [
        participantName,
        eventsText || "None",
        workshopsText || "None",
      ];

      rowData.forEach((text, i) => {
        const x = tableLeft + i * columnWidth;
        doc.rect(x, currentY, columnWidth, rowHeight).stroke();
        doc
          .fontSize(10)
          .text(text, x + 5, currentY + 5, {
            width: columnWidth - 10,
            align: "left",
          });
      });

      currentY += rowHeight;

      // Add Page Break if Needed
      if (currentY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        currentY = tableTop;
      }
    });

    // Finalize the PDF and Send the Response
    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `${cname}_participants.pdf`, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }

        // Delete the file after sending
        fs.unlinkSync(filePath);
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing file:", err);
      res.status(500).send("Error generating PDF");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getDomainWiseWinnersPdf = async (req, res) => {
  try {
    const { domain_name } = req.query;

    if (!domain_name) {
      return res.status(400).send("Domain name (domain_name) is required");
    }

    const events = await eventModel.find({
      organizing_department: domain_name,
    });
    if (!events.length)
      return res.status(404).send("No events found for the given domain");

    const eventIds = events.map((event) => event.eventid);
    const winners = await winnersModel.find({ event_id: { $in: eventIds } });
    if (!winners.length)
      return res
        .status(404)
        .send("No winners found for the events in the given domain");

    const doc = new PDFDocument({ margin: 50 });
    const filePath = `./${domain_name}_winners.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc
      .fontSize(18)
      .text(`Winners from ${domain_name}`, { align: "center" })
      .moveDown(2);

    const maxPageWidth = doc.page.width - 100;
    const tableLeft = 50;

    for (const event of events) {
      const eventWinners = winners.filter((w) => w.event_id === event.eventid);
      if (!eventWinners.length) continue;

      doc.moveDown(2);

      // Properly wrap event name if too long
      const eventTitle =
        doc.widthOfString(event.name.toUpperCase()) > maxPageWidth
          ? event.name.toUpperCase().replace(/(.{25})/g, "$1\n")
          : event.name.toUpperCase();

      // Move cursor to the left for proper alignment of event name
      doc.x = tableLeft;

      // Display event name with proper wrapping, now aligned to the left
      doc
        .fontSize(16)
        .text(eventTitle, {
          align: "left",
          underline: true,
          width: maxPageWidth,
        })
        .moveDown(1);

      doc
        .moveTo(tableLeft, doc.y)
        .lineTo(doc.page.width - tableLeft, doc.y)
        .stroke()
        .moveDown(1);

      let columnHeaders = ["Domain", "Prize", "Winner Name", "College"];
      let rowDataList = [];

      for (const winner of eventWinners) {
        const firstPrizeWinners = await Promise.all(
          winner.first_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );
        const secondPrizeWinners = await Promise.all(
          winner.second_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );
        const thirdPrizeWinners = await Promise.all(
          winner.third_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );

        const winnersData = [
          {
            prize: "First Prize",
            users: firstPrizeWinners,
            team: winner.fname,
          },
          {
            prize: "Second Prize",
            users: secondPrizeWinners,
            team: winner.sname,
          },
          {
            prize: "Third Prize",
            users: thirdPrizeWinners,
            team: winner.tname,
          },
        ];

        for (const winnerData of winnersData) {
          const winnerNames = winnerData.users
            .map((u) => u?.name || "N/A")
            .join(", ");
          const collegeNames = winnerData.users
            .map((u) => u?.cname || "N/A")
            .join(", ");

          let rowData = [
            domain_name,
            winnerData.prize,
            winnerNames,
            collegeNames,
          ];

          if (event.eventtype !== "Individual") {
            if (!columnHeaders.includes("Team Name"))
              columnHeaders.push("Team Name");
            rowData.push(winnerData.team);
          }

          rowDataList.push(rowData);
        }
      }

      let columnWidths = columnHeaders.map((header, i) => {
        let maxWidth = doc.widthOfString(header, { fontSize: 12 }) + 20;
        rowDataList.forEach((row) => {
          const cellWidth =
            doc.widthOfString(row[i] || "N/A", { fontSize: 10 }) + 20;
          if (cellWidth > maxWidth) maxWidth = cellWidth;
        });
        return maxWidth;
      });

      const totalTableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
      if (totalTableWidth > maxPageWidth) {
        const scaleFactor = maxPageWidth / totalTableWidth;
        columnWidths = columnWidths.map((w) => w * scaleFactor);
      }

      let currentY = doc.y;

      const tableStartX = tableLeft;

      // Draw Table Header
      columnHeaders.forEach((column, i) => {
        const x =
          tableStartX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, currentY, columnWidths[i], 30).stroke();
        doc.fontSize(12).text(column, x + 5, currentY + 10, {
          width: columnWidths[i] - 10,
          align: "center",
        });
      });

      currentY += 30;

      // Draw Rows
      for (const rowData of rowDataList) {
        const rowHeight =
          Math.max(
            ...rowData.map((text, i) =>
              doc.heightOfString(text, {
                width: columnWidths[i] - 10,
                fontSize: 10,
              })
            )
          ) + 10;

        rowData.forEach((text, i) => {
          const x =
            tableStartX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.rect(x, currentY, columnWidths[i], rowHeight).stroke();
          doc.fontSize(10).text(text, x + 5, currentY + 5, {
            width: columnWidths[i] - 10,
            align: "left",
          });
        });

        currentY += rowHeight;

        if (currentY + rowHeight > doc.page.height - 50) {
          doc.addPage();
          currentY = doc.y;
        }
      }

      doc.moveDown(2);
    }

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `${domain_name}_winners.pdf`, (err) => {
        if (err) console.error("Error sending file:", err);
        fs.unlinkSync(filePath);
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing file:", err);
      res.status(500).send("Error generating PDF");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

const puppeteer = require("puppeteer");

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  fs.writeFileSync("debug_output.pdf", pdfBuffer);

  await browser.close();
  return pdfBuffer;
}
const domainWinnersPdf = async (req, res) => {
  try {
    const { domain_name } = req.query;
    if (!domain_name) {
      return res.status(400).send("Domain name (domain_name) is required");
    }

    const events = await eventModel.find({
      organizing_department: domain_name,
    });
    if (!events.length)
      return res.status(404).send("No events found for the given domain");

    const eventIds = events.map((event) => event.eventid);
    const winners = await winnersModel.find({ event_id: { $in: eventIds } });
    if (!winners.length)
      return res
        .status(404)
        .send("No winners found for the events in the given domain");

    // Build the HTML template
    let htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${domain_name} Winners List</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                h2 { margin-top: 40px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #eee; }
              </style>
            </head>
            <body>
              <h1>Winners from ${domain_name}</h1>
        `;

    // Loop through each event to generate its section
    for (const event of events) {
      // Filter winners for the current event
      const eventWinners = winners.filter((w) => w.event_id === event.eventid);
      if (!eventWinners.length) continue;

      htmlContent += `<h2>${event.name.toUpperCase()}</h2>`;
      // Create table header; add extra column for team if the event is not individual
      let tableHeaders = `<tr>
              <th>Prize</th>
              <th>Winner Name</th>
              <th>College</th>`;
      if (event.eventtype !== "Individual") {
        tableHeaders += `<th>Team Name</th>`;
      }
      tableHeaders += `</tr>`;
      htmlContent += `<table>${tableHeaders}`;

      const fetchUsers = async (userIds) => {
        return await Promise.all(userIds.map(async (userId) => userModel.findOne({ user_id: userId })));
      };

      // Process winners for each prize level
      for (const winner of eventWinners) {
        // Get winners for each prize category
        const firstPrizeWinners =  await fetchUsers(winner.first_prize);
        const secondPrizeWinners =  await fetchUsers(winner.second_prize);
        const thirdPrizeWinners =  await fetchUsers(winner.third_prize);

        const winnersData = [
          {
            prize: "First Prize",
            users: firstPrizeWinners,
            team: winner.fname,
          },
          {
            prize: "Second Prize",
            users: secondPrizeWinners,
            team: winner.sname,
          },
          {
            prize: "Third Prize",
            users: thirdPrizeWinners,
            team: winner.tname,
          },
        ];

        // For each prize level, create a row in the table
        for (const prizeData of winnersData) {
          const winnerNames = prizeData.users
            .map((u) => (u && u.name ? u.name : "N/A"))
            .join(", ");
          const collegeNames = prizeData.users
            .map((u) => (u && u.cname ? u.cname : "N/A"))
            .join(", ");
          htmlContent += `<tr>
                <td>${prizeData.prize}</td>
                <td>${winnerNames}</td>
                <td>${collegeNames}</td>`;
          if (event.eventtype !== "Individual") {
            htmlContent += `<td>${prizeData.team || "N/A"}</td>`;
          }
          htmlContent += `</tr>`;
        }
      }
      htmlContent += `</table>`;
    }

    htmlContent += `
            </body>
          </html>
        `;
console.log(htmlContent);
    // Use Puppeteer to generate the PDF from the HTML content
    const pdfBuffer = await generatePdfFromHtml(htmlContent);

    // Set headers so that the browser downloads the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${domain_name}_winners.pdf"`
    );
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllWinnersPdf = async (req, res) => {
  try {
    const events = await eventModel.find({}).sort({ organizing_department: 1 });
    if (!events.length) return res.status(404).send("No events found");

    const eventIds = events.map((event) => event.eventid);
    const winners = await winnersModel.find({ event_id: { $in: eventIds } });

    const doc = new PDFDocument({ margin: 50 });
    const filePath = `./all_events_winners.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc
      .fontSize(18)
      .text("Winners from All Events", { align: "center" })
      .moveDown(2);

    const maxPageWidth = doc.page.width - 100;
    const tableLeft = 50;

    for (const event of events) {
      const eventWinners = winners.filter((w) => w.event_id === event.eventid);
      if (!eventWinners.length) continue;

      doc.moveDown(2);

      const eventTitle =
        doc.widthOfString(
          event.name.toUpperCase() +
            " - " +
            event.organizing_department.toUpperCase()
        ) > maxPageWidth
          ? (
              event.name.toUpperCase() +
              " - " +
              event.organizing_department.toUpperCase()
            ).replace(/(.{25})/g, "$1\n")
          : event.name.toUpperCase() +
            " - " +
            event.organizing_department.toUpperCase();
      doc.x = tableLeft;
      doc
        .fontSize(16)
        .text(eventTitle, {
          align: "left",
          underline: true,
          width: maxPageWidth,
        })
        .moveDown(1);

      // doc.moveTo(tableLeft, doc.y).lineTo(doc.page.width - tableLeft, doc.y).stroke().moveDown(1);

      let columnHeaders = ["Event", "Prize", "Winner Name", "College"];
      let rowDataList = [];

      for (const winner of eventWinners) {
        const firstPrizeWinners = await Promise.all(
          winner.first_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );
        const secondPrizeWinners = await Promise.all(
          winner.second_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );
        const thirdPrizeWinners = await Promise.all(
          winner.third_prize.map((userId) =>
            userModel.findOne({ user_id: userId })
          )
        );

        const winnersData = [
          {
            prize: "First Prize",
            users: firstPrizeWinners,
            team: winner.fname,
          },
          {
            prize: "Second Prize",
            users: secondPrizeWinners,
            team: winner.sname,
          },
          {
            prize: "Third Prize",
            users: thirdPrizeWinners,
            team: winner.tname,
          },
        ];

        for (const winnerData of winnersData) {
          const winnerNames = winnerData.users
            .map((u) => u?.name || "N/A")
            .join(", ");
          const collegeNames = winnerData.users
            .map((u) => u?.cname || "N/A")
            .join(", ");

          let rowData = [
            event.name,
            winnerData.prize,
            winnerNames,
            collegeNames,
          ];

          if (event.eventtype !== "Individual") {
            if (!columnHeaders.includes("Team Name"))
              columnHeaders.push("Team Name");
            rowData.push(winnerData.team);
          }

          rowDataList.push(rowData);
        }
      }

      let columnWidths = columnHeaders.map((header, i) => {
        let maxWidth = doc.widthOfString(header, { fontSize: 12 }) + 20;
        rowDataList.forEach((row) => {
          const cellWidth =
            doc.widthOfString(row[i] || "N/A", { fontSize: 10 }) + 20;
          if (cellWidth > maxWidth) maxWidth = cellWidth;
        });
        return maxWidth;
      });

      const totalTableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
      if (totalTableWidth > maxPageWidth) {
        const scaleFactor = maxPageWidth / totalTableWidth;
        columnWidths = columnWidths.map((w) => w * scaleFactor);
      }

      let currentY = doc.y;
      const tableStartX = tableLeft;

      columnHeaders.forEach((column, i) => {
        const x =
          tableStartX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, currentY, columnWidths[i], 30).stroke();
        doc.fontSize(12).text(column, x + 5, currentY + 10, {
          width: columnWidths[i] - 10,
          align: "center",
        });
      });

      currentY += 30;

      for (const rowData of rowDataList) {
        const rowHeight =
          Math.max(
            ...rowData.map((text, i) =>
              doc.heightOfString(text, {
                width: columnWidths[i] - 10,
                fontSize: 10,
              })
            )
          ) + 10;

        rowData.forEach((text, i) => {
          const x =
            tableStartX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.rect(x, currentY, columnWidths[i], rowHeight).stroke();
          doc.fontSize(10).text(text, x + 5, currentY + 5, {
            width: columnWidths[i] - 10,
            align: "left",
          });
        });

        currentY += rowHeight;

        if (currentY + rowHeight > doc.page.height - 50) {
          doc.addPage();
          currentY = doc.y;
        }
      }

      doc.moveDown(2);
    }

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `all_events_winners.pdf`, (err) => {
        if (err) console.error("Error sending file:", err);
        fs.unlinkSync(filePath);
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing file:", err);
      res.status(500).send("Error generating PDF");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getCollegeWisePdf: getCollegeWisePdf,
  getDomainWiseWinnersPdf: domainWinnersPdf,
  getAllPdf: getAllWinnersPdf,
};
