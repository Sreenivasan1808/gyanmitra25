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
      doc.fontSize(12).text(column, x + 5, currentY + 10, {
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
        doc.fontSize(10).text(text, x + 5, currentY + 5, {
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

      const eventTitle =
        doc.widthOfString(event.name.toUpperCase()) > maxPageWidth
          ? event.name.toUpperCase().replace(/(.{25})/g, "$1\n")
          : event.name.toUpperCase();

      doc.x = tableLeft; // Ensures event name starts at left margin
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

      if (event.eventtype === "Individual") {
        let columnHeaders = [
          "Domain",
          "Prize",
          "Winner Name",
          "College",
          "GMID",
        ];
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
            { prize: "First Prize", users: firstPrizeWinners },
            { prize: "Second Prize", users: secondPrizeWinners },
            { prize: "Third Prize", users: thirdPrizeWinners },
          ];

          for (const winnerData of winnersData) {
            for (const user of winnerData.users) {
              const winnerName = user?.name || "N/A";
              const collegeName = user?.cname || "N/A";
              const gmid = user?.user_id || "N/A";

              let rowData = [
                domain_name,
                winnerData.prize,
                winnerName,
                collegeName,
                gmid,
              ];
              rowDataList.push(rowData);
            }
          }
        }

        drawTable(doc, columnHeaders, rowDataList, tableLeft, maxPageWidth);
        doc.x = tableLeft; // *Reset alignment to left after table*
      } else {
        const prizeTypes = [
          { prize: "First Prize", usersKey: "first_prize" },
          { prize: "Second Prize", usersKey: "second_prize" },
          { prize: "Third Prize", usersKey: "third_prize" },
        ];

        for (const prizeType of prizeTypes) {
          let columnHeaders = [
            "Domain",
            "Prize",
            "Winner Name",
            "College",
            "GMID",
          ];
          let rowDataList = [];

          for (const winner of eventWinners) {
            const prizeWinners = await Promise.all(
              winner[prizeType.usersKey].map((userId) =>
                userModel.findOne({ user_id: userId })
              )
            );

            for (const user of prizeWinners) {
              const winnerName = user?.name || "N/A";
              const collegeName = user?.cname || "N/A";
              const gmid = user?.user_id || "N/A";

              let rowData = [
                domain_name,
                prizeType.prize,
                winnerName,
                collegeName,
                gmid,
              ];
              rowDataList.push(rowData);
            }
          }

          doc.moveDown(2);
          doc.x = tableLeft; // *Ensure prize title starts at left*
          doc
            .fontSize(14)
            .text(`${prizeType.prize} Winners`, { align: "left" })
            .moveDown(1);
          drawTable(doc, columnHeaders, rowDataList, tableLeft, maxPageWidth);
          doc.x = tableLeft; // *Reset alignment to left after table*
        }
      }

      doc.moveDown(2);
      doc.x = tableLeft; // *Reset alignment to left after section*
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

const drawTable = (
  doc,
  columnHeaders,
  rowDataList,
  tableLeft,
  maxPageWidth
) => {
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
    const x = tableStartX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
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

  doc.x = tableLeft; // *Ensure left alignment after table*
};

const getAllPdf = async (req, res) => {
  try {
    const events = await eventModel.find({}).sort({ organizing_department: 1 });
    if (!events.length)
      return res.status(404).send("No events found for the given domain");

    const eventIds = events.map((event) => event.eventid);
    const winners = await winnersModel.find({ event_id: { $in: eventIds } });
    if (!winners.length)
      return res
        .status(404)
        .send("No winners found for the events in the given domain");

    const doc = new PDFDocument({ margin: 50 });
    const filePath = "./all_winners.pdf";
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    //doc.fontSize(18).text(Winners from ${domain_name}, { align: "center" }).moveDown(2);

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

      doc.x = tableLeft; // Ensures event name starts at left margin
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

      if (event.eventtype === "Individual") {
        let columnHeaders = [
          "Domain",
          "Prize",
          "Winner Name",
          "College",
          "GMID",
        ];
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
            { prize: "First Prize", users: firstPrizeWinners },
            { prize: "Second Prize", users: secondPrizeWinners },
            { prize: "Third Prize", users: thirdPrizeWinners },
          ];

          for (const winnerData of winnersData) {
            for (const user of winnerData.users) {
              const winnerName = user?.name || "N/A";
              const collegeName = user?.cname || "N/A";
              const gmid = user?.user_id || "N/A";

              let rowData = [
                event.organizing_department,
                winnerData.prize,
                winnerName,
                collegeName,
                gmid,
              ];
              rowDataList.push(rowData);
            }
          }
        }

        drawTable(doc, columnHeaders, rowDataList, tableLeft, maxPageWidth);
        doc.x = tableLeft; // *Reset alignment to left after table*
      } else {
        const prizeTypes = [
          { prize: "First Prize", usersKey: "first_prize" },
          { prize: "Second Prize", usersKey: "second_prize" },
          { prize: "Third Prize", usersKey: "third_prize" },
        ];

        for (const prizeType of prizeTypes) {
          let columnHeaders = [
            "Domain",
            "Prize",
            "Winner Name",
            "College",
            "GMID",
          ];
          let rowDataList = [];

          for (const winner of eventWinners) {
            const prizeWinners = await Promise.all(
              winner[prizeType.usersKey].map((userId) =>
                userModel.findOne({ user_id: userId })
              )
            );

            for (const user of prizeWinners) {
              const winnerName = user?.name || "N/A";
              const collegeName = user?.cname || "N/A";
              const gmid = user?.user_id || "N/A";

              let rowData = [
                event.organizing_department,
                prizeType.prize,
                winnerName,
                collegeName,
                gmid,
              ];
              rowDataList.push(rowData);
            }
          }

          doc.moveDown(2);
          doc.x = tableLeft; // *Ensure prize title starts at left*
          doc
            .fontSize(14)
            .text(`${prizeType.prize} Winners`, { align: "left" })
            .moveDown(1);
          drawTable(doc, columnHeaders, rowDataList, tableLeft, maxPageWidth);
          doc.x = tableLeft; // *Reset alignment to left after table*
        }
      }

      doc.moveDown(2);
      doc.x = tableLeft; // *Reset alignment to left after section*
    }

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, all_winners.pdf, (err) => {
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
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  fs.writeFileSync("debug_output.pdf", pdfBuffer);

  await browser.close();
  return pdfBuffer;
}

// const wkhtmltopdf = require('wkhtmltopdf');

// function generatePdfFromHtml(htmlContent, outputPath = 'output.pdf') {
//   return new Promise((resolve, reject) => {
//     let buffers = [];
//     // Create the PDF stream from the HTML
//     const stream = wkhtmltopdf(htmlContent, { pageSize: 'A4' });

//     stream.on('data', (data) => buffers.push(data));
//     stream.on('end', () => {
//       const pdfBuffer = Buffer.concat(buffers);
//       fs.writeFileSync(outputPath, pdfBuffer);
//       resolve(pdfBuffer);
//     });
//     stream.on('error', reject);
//   });
// }

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
        return await Promise.all(
          userIds.map(async (userId) => userModel.findOne({ user_id: userId }))
        );
      };

      // Process winners for each prize level
      for (const winner of eventWinners) {
        // Get winners for each prize category
        const firstPrizeWinners = await fetchUsers(winner.first_prize);
        const secondPrizeWinners = await fetchUsers(winner.second_prize);
        const thirdPrizeWinners = await fetchUsers(winner.third_prize);

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
const updatecode = async (req, res) => {
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
    const winners = await winnersModel.find({ event_id: { $in: eventIds } ,approved:true});
    // if (!winners.length)
    //   return res
    //     .status(404)
    //     .send("No winners found for the events in the given domain");

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

    for (const event of events) {
      const eventWinners = winners.filter((w) => w.event_id === event.eventid);

      

      htmlContent += !eventWinners.length ? `<p><h2>${event.name.toUpperCase()}</h2> - Not Updated<p>` : `<h2>${event.name.toUpperCase()}</h2>`;
      if (!eventWinners.length)
      {
        // htmlContent += `<p>Not Updated</p>`;
        continue;
      } 
      const fetchUsers = async (userIds) => {
        return await Promise.all(
          userIds.map(async (userId) => userModel.findOne({ user_id: userId }))
        );
      };

      for (const winner of eventWinners) {
        const firstPrizeWinners = await fetchUsers(winner.first_prize);
        const secondPrizeWinners = await fetchUsers(winner.second_prize);
        // const thirdPrizeWinners = await fetchUsers(winner.third_prize);

        if (event.eventtype === "Individual") {
          htmlContent += `<table>
            <tr>
              <th>Prize</th>
              <th>Winner Name</th>
              <th>College</th>
              <th>GMID</th>
            </tr>`;

          const winnersData = [
            { prize: "First Prize", users: firstPrizeWinners },
            { prize: "Second Prize", users: secondPrizeWinners },
            // { prize: "Third Prize", users: thirdPrizeWinners },
          ];

          for (const prizeData of winnersData) {
            for (const user of prizeData.users) {
              htmlContent += `
                <tr>
                  <td> ${prizeData.prize}</td>
                  <td>${user?.name || "N/A"}</td>
                  <td>${user?.cname || "N/A"}</td>
                  <td>${user?.user_id || "N/A"}</td>
                </tr>`;
            }
          }

          htmlContent += `</table>`;
        } else {
          // Separate tables for each prize level
          const teamData = [
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

            // {
            //   prize: "Third Prize",
            //   users: thirdPrizeWinners,
            //   team: winner.tname,
            // },
          ];

          for (const prizeData of teamData) {
            htmlContent += `<h3>${prizeData.prize}</h3>
            <table>
              <tr>
                <th>Winner Name</th>
                <th>College</th>
                <th>Team Name</th>
                <th>GMID</th>
              </tr>`;

            for (const user of prizeData.users) {
              htmlContent += `
                <tr>
                  <td>${user?.name || "N/A"}</td>
                  <td>${user?.cname || "N/A"}</td>
                  <td>${prizeData.team || "N/A"}</td>
                  <td>${user?.user_id || "N/A"}</td>
                </tr>`;
            }

            htmlContent += `</table>`;
          }
        }
      }
    }

    htmlContent += `
        </body>
      </html>
    `;

    console.log(htmlContent);
    const pdfBuffer = await generatePdfFromHtml(htmlContent);
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

module.exports = {
  getCollegeWisePdf: getCollegeWisePdf,
  getDomainWiseWinnersPdf: updatecode,
  getAllPdf: getAllPdf,
};
