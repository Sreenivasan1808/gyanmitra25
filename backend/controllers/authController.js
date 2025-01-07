const coordinatorModel = require("../models/coordinator");

const authenticateCoordinator = async (req, res) => {
  const { username, password } = req.body;
  try {
    const coordinatorData = await coordinatorModel.findOne({
      username: username,
      password: password,
    });
    console.log("retreived data");
    console.log(coordinatorData);
    if (coordinatorData !== null) {
      res.status(200).json({role: coordinatorData.role, dept: coordinatorData.dept});
    } else {
      res.status(401).json("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
    authenticateCoordinator: authenticateCoordinator
}
