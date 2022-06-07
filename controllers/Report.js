const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const AgentsReport = require("../models/Reports/AgentsReport");
const User = require("../models/User");
const Call = require("../models/Call");
// const Report = require("../models/Report");

// Desc    GET USERS
// Route   GET api/v1/reports/calls
exports.agentReports = asyncHandler(async (req, res, next) => {
  let { agentId } = req.params;
  console.log(colors.bgRed(req.params.agentId));
  const call = await Call.find({
    user: agentId ? agentId : req.user._id,
  });

  const agent = await User.findById(agentId ? agentId : req.user._id);
  const master = await User.findById(agent.createByUser);
  console.log(colors.bgBlue(agent, master));
  let bet = call
    .map((cal) => Number(cal.totalAmount))
    .reduce((pre, next) => pre + next, 0);
  // if (!bet) {
  //   return next(new ErrorResponse("There is no bet", 404));
  // }
  let ag_com = bet * (agent.commission / 100);
  let ms_com = bet * (master.commission / 100);
  let ag_win_lose =
    bet -
    ag_com -
    call.map((cal) => Number(cal.win)).reduce((pre, next) => pre + next, 0);

  let ms_win_lose =
    bet -
    ms_com -
    call.map((cal) => Number(cal.win)).reduce((pre, next) => pre + next, 0);

  let obj = {
    master: { bet: bet, com: ms_com, win_lose: ms_win_lose },
    agent: { bet: bet, com: ag_com, win_lose: ag_win_lose },
  };
  console.log(obj);
  console.log(req.user);
  res.status(200).json({ success: true, data: obj });
});

// Desc GET Masters
// Route GET api/v1/reports/master
exports.getMasters = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const agents = await User.find({ createByUser: req.user._id });
  const call = await Call.find({ user: agents.map((ag) => ag._id) }).populate({
    path: "user",
    select: "name role",
  });

  let bet = call
    .map((cal) => Number(cal.totalAmount))
    .reduce((pre, next) => pre + next, 0);
  // if (!bet) {
  //   return next(new ErrorResponse("There is no bet", 404));
  // }
  let com = bet * (req.user.commission / 100);
  let win_lose =
    bet -
    call.map((cal) => Number(cal.win)).reduce((pre, next) => pre + next, 0);

  let obj = { bet, com, win_lose };

  res.status(200).json({ success: true, data: "Masters-Report", obj });
});

// Desc GET agents of one master
// Route GET api/v1/reports/master/agents
exports.getMaster_select_agents = asyncHandler(async (req, res, next) => {
  const agents = await User.find({ createByUser: req.user._id });
  const call = await Call.find();

  console.log(agents, call);
  const arr = [];
  agents.map((ag) => {
    const calls = call.filter(
      (cal) => cal.user.toString() === ag._id.toString()
    );
    // console.log(colors.bgRed(calls));
    // agentName: ag.username
    let bet = calls
      .map((cal) => Number(cal.totalAmount))
      .reduce((pre, next) => pre + next, 0);

    let ms_com = bet * (req.user.commission / 100);
    let ag_com = bet * (ag.commission / 100);

    // let com = bet * (ag.commission / 100);
    let ag_win_lose =
      bet -
      ag_com -
      calls.map((cal) => Number(cal.win)).reduce((pre, next) => pre + next, 0);

    let ms_win_lose =
      bet -
      ms_com -
      calls.map((cal) => Number(cal.win)).reduce((pre, next) => pre + next, 0);
    // console.log({ agent: ag.username, bet, com, win_lose });

    let obj = {
      agents: ag.username,
      master: {
        bet: bet,
        com: ms_com,
        win_lose: ms_win_lose,
      },
      agent: {
        bet: bet,
        com: ag_com,
        win_lose: ag_win_lose,
      },
    };
    arr.push(obj);
  });
  // const data = await rep;
  console.log(colors.bgGreen(arr));
  res.status(200).json({ success: true, data: arr });
});

// Desc GET agent of one master
// Route GET api/v1/reports/master/agents/:agentId
exports.getMaster_select_agents_select_agentId = asyncHandler(
  async (req, res, next) => {
    res.status(200).json({ success: true, message: req.originalUrl });
  }
);

exports.getCalls = asyncHandler(async (req, res, next) => {
  // const reports = await Report.find();
  // if (reports.length <= 0) {
  //   return next(new ErrorResponse(`Report not found`, 404));
  // }
  res.status(200).json({ success: true, data: "Calls-Report" });
});

// Desc GET Agents
// Route GET api/v1/reports/agent
exports.getAgents = asyncHandler(async (req, res, next) => {
  console.log(req.params.agentId);
  let query;

  if (req.params.agentId) {
    console.log("params");
    query = AgentsReport.find({ agentID: req.params.agentId });
  } else {
    query = AgentsReport.find();
  }

  const agents = await query;
  // const agents = await AgentsReport.find();
  // if (!agents) {
  //   return next(new ErrorResponse("Reports not Found"));
  // }
  res.status(200).json({ success: true, count: agents.length, data: agents });
});

exports.createAgent = asyncHandler(async (req, res, next) => {
  console.log(colors.bgGreen(req.body));
});

// Desc GET Admin
// Route GET api/v1/reports/admin
exports.getAdmins = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: "Agents-Report" });
});
