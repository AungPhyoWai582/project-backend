const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");
const Call = require("../models/Call");
const User = require("../models/User");
const Lottery = require("../models/Lottery");
const OutCall = require("../models/OutCall");
const moment = require("moment");
const { filterShortCut } = require("../utils/filterCallForShortcut");

exports.membersCollections = asyncHandler(async (req, res, next) => {
  // const start = new Date();

  let { start_date, end_date, In, Out, customer, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  // const start = "Fri Aug 19 2022 12:42:18 GMT+0630";

  // console.log(start.toISOString(), end.toISOString());
  console.log(start, end, customer, time);

  // console.log(JSON.parse(queryStr));

  var memberReport = [];

  // const lager = await Lager.find({ user: req.user._id });
  let calls;
  let members;

  const query = await User.find({ createByUser: req.user._id });
  if (customer === "All") {
    members = query;
  } else if (customer !== "All") {
    members = query.filter((q) => q._id.toString() === customer.toString());
  }
  // members = query;
  // members = query;
  console.log(colors.red(members));

  if (req.user.role === "Admin") {
    // console.log(Date(start), Date(end));
    calls = await Call.find({
      user: req.user._id,
      master: members.map((m) => m._id.toString()),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  }
  if (req.user.role === "Master") {
    calls = await Call.find({
      user: req.user._id,
      agent: members.map((m) => m._id),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  }
  if (req.user.role === "Agent") {
    calls = await Call.find({
      user: req.user._id,
      customer: members.map((m) => m._id),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  }

  console.log(colors.green(calls))

  let lots;
  if (time == "All") {
    lots = await Lottery.find({
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  } else {
    let l = await Lottery.find({
      _time: time,
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    lots = l.length ? l : [];
  }

  const _calls = calls.filter((cal) =>
    lots.map((l) => l._id.toString()).includes(cal.lottery.toString())
  );

  // console.log(colors.bgCyan(_calls));

  // .populate({ path: "user", select: "username name role" })
  // .populate({ path: "agent", select: "username name role" });
  // if (!calls.length) {
  //   return next(new ErrorResponse(`Reports not found`, 404));
  // }

  members.map((m) => {
    // console.log(m._id);
    let obj = {};
    let c;
    if (req.user.role === "Admin") {
      c = _calls.filter((cal) => cal.master.toString() === m.id.toString());
    }
    if (req.user.role === "Master") {
      c = _calls.filter((cal) => cal.agent.toString() === m.id.toString());
    }
    if (req.user.role === "Agent") {
      c = _calls.filter((cal) => cal.customer.toString() === m.id.toString());
    }
    const pout_tee_amount = c.reduce(
      (acc, cur) => acc + Number(cur.pout_tee_amount),
      0
    );

    const totalAmount = c.reduce(
      (acc, cur) => acc + Number(cur.totalAmount),
      0
    );

    const totalCommission = c.reduce(
      (acc, cur) => acc + Number(cur.commission),
      0
    );

    const totalWin = c.reduce((acc, cur) => acc + Number(cur.win), 0);

    obj = {
      memId: m._id,
      username: m.username,
      name: m.name,
      role: m.role,
      pout_tee_amount,
      totalAmount,
      totalCommission,
      totalWin,
    };
    // console.log(colors.bgGreen(obj));

    memberReport.push(obj);
  });

  if(customer!=='All'){
   const mem = memberReport.filter(mem=>mem.memId.toString()!==customer)
   console.log(mem)
  }

  // console.log(memberReport)

  const report = {
    me: {
      totalAmount: memberReport.reduce(
        (acc, cur) => acc + Number(cur.totalAmount),
        0
      ),
      totalCommission: memberReport.reduce(
        (acc, cur) => acc + Number(cur.totalCommission),
        0
      ),
      totalWin: memberReport.reduce(
        (acc, cur) => acc + Number(cur.totalWin),
        0
      ),
      pout_tee_amount: memberReport.reduce(
        (acc, cur) => acc + Number(cur.pout_tee_amount || 0),
        0
      ),
    },
    memberReport,
  };

  console.log(report);

  res.status(200).json({
    success: true,
    report,
    // data: IN,
    // report: { totalAmount, totalWin, totalCommission },

    url: req.originalUrl,
  });
});

exports.outCollections = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  console.log(start, end, req.user.id);

  const query = await OutCall.find({
    user: req.user._id,
    betTime: {
      $gte: start,
      $lte: end,
    },
  }).populate({
    path: "customer",
    select: "username name commission",
  });
  // console.log(colors.bgCyan(query));
  let calls;
  let lots;
  if (time == "All") {
    lots = await Lottery.find({
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  } else {
    let l = await Lottery.find({
      _time: time,
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    lots = l.length ? l : [];
  }
  // console.log(lots)

  if (query.length) {
    // console.log(lots);

    calls = query
      .filter((q) =>
        lots.map((l) => l._id.toString()).includes(q.lottery.toString())
      )
      .map((q) => {
        // let obj = Object.assign(q.toObject());
        let obj = q.toObject();

        const result = Object.assign(
          {
            _time:
              lots[
                [...lots].findIndex(
                  (l) => l._id.toString() == obj.lottery.toString()
                )
              ]._time,
          },
          obj
        );
        // console.log(colors.bgRed(result));
        return result;
      });
  }

  // console.log(calls);

  // const customerName = [...new Set(calls.map(cal=>cal.customer.name))].toString()
  const pout_tee_amount = calls.reduce(
    (acc, cur) => acc + Number(cur.pout_tee_amount || 0),
    0
  );
  const totalAmount = calls.reduce(
    (acc, cur) => acc + Number(cur.totalAmount),
    0
  );

  const totalCommission = calls.reduce(
    (acc, cur) => acc + Number(cur.commission),
    0
  );

  const totalWin = calls.reduce((acc, cur) => acc + Number(cur.win), 0);

  // console.log(time);
  const totalOut = {
    // customerName,
    pout_tee_amount,
    totalAmount,
    totalCommission,
    totalWin,
  };
  const report = { calls, totalOut };
  console.log(report);

  res.status(200).json({ success: true, out: "this is out data", report });
});

exports.mainCollections = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  const query = await Lager.find({
    user: req.user._id,
    _date: {
      $gte: start,
      $lte: end,
    },
  }).populate({
    path: "user",
    select: "username name",
  });

  let main;
  let lots;
  if (time == "All") {
    lots = await Lottery.find({
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
  } else {
    let l = await Lottery.find({
      _time: time,
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    lots = l.length ? l : [];
  }
  console.log(lots);

  if (query.length) {
    // console.log(lots);

    main = query
      .filter((q) =>
        lots.map((l) => l._time.toString()).includes(q._time.toString())
      )
      .map((q) => {
        // let obj = Object.assign(q.toObject());
        let obj = q.toObject();

        const result = Object.assign(
          {
            _date:
              lots[
                [...lots].findIndex(
                  (l) => l._time.toString() == obj._time.toString()
                )
              ]._date,
          },
          obj
        );
        return result;
      });
  }

  console.log(main);

  const pout_tee_amount = main.reduce((acc,cur)=>acc+Number(cur.pout_tee_amount || 0),0);
  
  const totalAmount = main.reduce((acc,cur)=>acc+Number(cur.totalAmount),0);

  const totalOriginalBreak = main.reduce((acc,cur)=>acc+Number(cur.originalBreak),0);

  const totalWin = main.reduce((acc,cur)=>acc+Number(cur.win),0);

  const totalMain = {
    pout_tee_amount,
    totalAmount,
    totalOriginalBreak,
    totalWin,
  };

  const report = { main, totalMain };
  console.log(report);

  res.status(200).json({ success: true, out: "this is main data", report });
});

exports.daily = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, _time } = await req.query;
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  console.log(_time);
  // const members = await User.find({ createByUser: req.user._id });
  const lotteries = await Lottery.find({
    _time: _time,
    _date: {
      $gte: start,
      $lte: end,
    },
  });
  console.log(lotteries);
  const calls = await Call.find({
    user: req.user._id,
    betTime: {
      $gte: start,
      $lte: end,
    },
  });
  const daily = [];
  lotteries.map((l) => {
    console.log(colors.bgGreen(l.betTime));
    const c = calls.filter(
      (cal) => cal.lottery.toString() === l._id.toString()
    );
    const pout_tee_amount = c.reduce((acc,cur)=>acc+Number(cur.pout_tee_amount || 0),0)
  
    const totalAmount = c.reduce((acc,cur)=>acc+Number(cur.totalAmount));

    const totalCommission = c.reduce((acc,cur)=>acc+Number(cur.commission));

    const totalWin = c.reduce((acc,cur)=>acc+Number(cur.win));
    
    if (c.length) {
      daily.push({
        date: moment(l._date).format("YYYY-MM-DD"),
        totalAmount,
        pout_tee_amount,
        totalCommission,
        totalWin,
      });
    }
  });

  console.log(start, end);

  console.log(daily);
  res.status(200).json({ success: true, report: daily });
});

exports.dailyMembers = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  console.log(date);
  // const { lager } = req.query;
  // // const ldate = new Date(date);
  // // console.log(ldate.toISOString());
  // const lagers = await Lager.findById(lager);

  const calls = filterShortCut(
    await Call.find({ betTime: date })
      .populate({
        path: "user",
        select: "username name role",
      })
      .populate({
        path: "master",
        select: "username name role",
      })
      .populate({
        path: "agent",
        select: "username name role",
      })
  );
  console.log(calls);
  const result = [];

  let c;
  if (req.user.role === "Admin") {
    c = [...new Set(calls.map((cal) => cal.master))];
  }
  if (req.user.role === "Master") {
    c = [...new Set(calls.map((cal) => cal.agent))];
  }
  if (req.user.role === "Agent") {
    c = [...new Set(calls.map((cal) => cal.customer))];
  }
  // c.map((cl) => result.push({ member: cl }));
  c.forEach((cal) => {
    if (cal !== undefined) result.push(cal);
  });
  console.log(colors.bgBlue(result));

  // const demo = [...result];
  result.map((rs, key) => {
    console.log(calls, rs._id);
    let memCalls;
    if (req.user.role === "Admin") {
      memCalls = calls.filter((cal) => cal.master && cal.master._id === rs._id);
    }
    if (req.user.role === "Master") {
      memCalls = calls.filter((cal) => cal.agent && cal.agent._id === rs._id);
    }
    if (req.user.role === "Agent") {
      memCalls = calls.filter(
        (cal) => cal.customer && cal.customer._id === rs._id
      );
    }

    const pout_tee_amount = memCalls.reduce((acc,cur)=>acc+Number(cur.pout_tee_amount || 0),0)
     
    const totalAmount = memCalls.reduce((acc,cur)=>acc+Number(cur.totalAmount));

    const totalCommission = memCalls.reduce((acc,cur)=>acc+Number(cur.commission));

    const totalWin = memCalls.reduce((acc,cur)=>acc+Number(cur.win));

    result[key] = {
      member: rs,
      totalAmount,
      pout_tee_amount,
      totalCommission,
      totalWin,
      callLists: memCalls,
    };
  });

  // console.log(result);

  res.status(200).json({ success: true, report: result });
});

exports.memberDetails = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, report: "this is member details" });
});
