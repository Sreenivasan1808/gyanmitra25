const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();

dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL_2=process.env.MONGO_URL_2
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db2=mongoose.createConnection(MONGO_URL_2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
module.exports=db2
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


const participantRouter = require("./routes/userRoutes"); //same as userRouter
app.use("/participant", participantRouter);
const coordinatorRouter = require("./routes/coordinatorRoutes"); //same as userRouter
app.use("/coordinator", coordinatorRouter);