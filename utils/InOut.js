const asyncHandler = require("../middlewares/async");
const Lager = require("../models/Lager");

exports.inout = asyncHandler(
  async (numbers, lager, selfUrl, commission, body) => {
    let demolager = [];
    let totalAmount = 0;
    console.log(body);

    body.numbers.map((cn) => {
      if (demolager.map((l) => l.number).includes(cn.number)) {
        demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
          number: cn.number,
          amount: (
            Number(
              demolager[demolager.findIndex((obj) => obj.number === cn.number)]
                .amount
            ) + Number(cn.amount)
          ).toString(),
        };
      } else {
        demolager.push(cn);
      }
    });

    // for lager bet

    if (selfUrl === "in") {
      totalAmount =
        Number(lager.in.totalAmount) +
        Number(
          numbers
            .map((num) => Number(num.amount))
            .reduce((pre, next) => pre + next, 0)
        );
    }

    if (selfUrl === "out") {
      totalAmount =
        Number(lager.out.totalAmount) +
        Number(
          numbers
            .map((num) => Number(num.amount))
            .reduce((pre, next) => pre + next, 0)
        );
    }

    // for lager commission
    const com = totalAmount * (commission / 100);

    // for in/out data

    let obj = {};

    if (selfUrl === "in") {
      console.log("in");
      const read = await lager.in.read;
      read.push(body);
      obj = {
        in: {
          numbers: demolager,
          totalAmount: totalAmount,
          commission: com,
          read: read,
        },
      };
    }

    if (selfUrl === "out") {
      console.log("out");
      console.log(body);
      const send = await lager.out.send;
      send.push(body);
      obj = {
        out: {
          numbers: demolager,
          totalAmount: totalAmount,
          commission: com,
          send: send,
        },
      };
      console.log(send);
    }

    console.log(obj);

    const updateLager = await Lager.findByIdAndUpdate(
      lager._id,
      {
        obj,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return await updateLager;
  }
);
