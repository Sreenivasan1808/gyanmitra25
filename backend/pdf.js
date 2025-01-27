
const PDFDocument = require("pdfkit");
const fs = require("fs");
const coordinatorController=require("./controllers/coordinatorController")



const getCollegeWisePdf = async (req, res) => {
    try {
        const { cname } = req.query;
        console.log("College Name:", cname);

        if (!cname) {
            return res.status(400).send("College name (cname) is required");
        }

        const data = await coordinatorController.collegeWiseParticipant(cname);

        if (!data || data.length === 0) {
            return res.status(404).send("No participants found for the given college name");
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
                .text(column, x + 5, currentY + 10, { width: columnWidth - 10, align: "center" });
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
            const rowHeight = Math.max(
                doc.heightOfString(eventsText, { width: columnWidth - 10, fontSize: 10 }),
                doc.heightOfString(workshopsText, { width: columnWidth - 10, fontSize: 10 }),
                20 // Minimum height for rows
            ) + 10; // Add padding

            // Data for each column
            const rowData = [participantName, eventsText || "None", workshopsText || "None"];

            rowData.forEach((text, i) => {
                const x = tableLeft + i * columnWidth;
                doc.rect(x, currentY, columnWidth, rowHeight).stroke();
                doc
                    .fontSize(10)
                    .text(text, x + 5, currentY + 5, { width: columnWidth - 10, align: "left" });
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


module.exports={
    getCollegeWisePdf:getCollegeWisePdf
}
