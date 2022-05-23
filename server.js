const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middlewares/Logger");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

// connect DB
connectDB();

// Routes Files
const call = require("./routes/Call");
const auth = require("./routes/auth");
const master = require("./routes/Master");
const agent = require("./routes/Agent");
const result = require("./routes/Result");
const error = require("./middlewares/error");

const app = express();

app.use(cors());

// Body Parser
app.use(express.json());

// middleware
app.use(logger);

// routers
app.use(
  "/api/v1/auth",
  // () => res.header("Access-Control-Allow-Origin", "*"),
  auth
);
app.use(
  "/api/v1/master",
  // () => res.header("Access-Control-Allow-Origin"),
  master
);
app.use("/api/v1/agent", agent);
app.use(
  "/api/v1/call",
  // () => res.header("Access-Control-Allow-Origin"),
  call
);
app.use("/api/v1/result", result);

app.use(error);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server is running on port : ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit
  server.close(() => process.exit(1));
});
