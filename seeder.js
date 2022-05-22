const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
// const Bet = require("./models/Bet");
const User = require("./models/User");
const Report = require("./models/Report");
const BetDetail = require("./models/BetDetail");
const Call = require("./models/Call");

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON Files
const bets = JSON.parse(
  fs.readFileSync(`${__dirname}/config/bet.json`, "utf-8")
);
const report = JSON.parse(
  fs.readFileSync(`${__dirname}/config/report.json`, "utf-8")
);
const agents = JSON.parse(
  fs.readFileSync(`${__dirname}/config/agent.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await User.create(agents);
    await Call.create(bets);
    await Report.create(report);
    console.log(color.bgGreen("Imported Data ..."));
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Report.deleteMany();
    await BetDetail.deleteMany();
    await Call.deleteMany();

    console.log(color.bgRed("Data Destroyed ..."));
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
