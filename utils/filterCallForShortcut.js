const {
    r,
    startStar,
    forwardPate,
    backpate,
    p,
    k,
    b,
    Breaks,
    aper,
    masone,
    sonema,
    mm,
    ss,
    spu,
    mpu,
    padatha,
  } = require("./BetSign");
const colors = require('colors')

exports.filterShortCut = (calls) => {
  const newCalls = calls.map((c) => {
    let obj = c;
    if (obj.remark.length > 0) {
      // let newCall;
      const newCall=[]
      let filterRemark=[];
    // let remain = [...obj.numbers];
      obj.remark.map((remk) => {
        console.log(remk);

        // ** (starStar) func:
        if (
          remk.type.toLowerCase().toString() === "**" &&
          remk.type.length == 2
        ) {
          filterRemark = startStar(remk);
        }else

        // k (natkat) func:
         if (
          remk.type.length === 1 &&
          remk.type.toLowerCase().toString() === "k"
        ) {
          filterRemark= [...filterRemark,...k(remk)];
        }

        // p (power) func:
        else if (
          remk.type.length === 1 &&
          remk.type.toLowerCase().toString() === "p"
        ) {
          filterRemark = [...filterRemark,...p(remk)];
        }

        // b (brother) func:
        else if (
          remk.type.length === 1 &&
          remk.type.toLowerCase().toString() === "b"
        ) {
          filterRemark = [...filterRemark,...b(remk)];
        }

        // 0...9/ (breaks) func:
        else if (
          remk.type.length === 2 &&
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            remk.type[0]
          ) &&
          remk.type.endsWith("/")
        ) {
          filterRemark = [...filterRemark,...Breaks(remk)];
        }

        // 0...9- (aper) func:
        else if (
          remk.type.length === 2 &&
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            remk.type[0]
          ) &&
          remk.type.endsWith("-")
        ) {
          filterRemark = [...filterRemark,...aper(remk)];
        }

        // 0...9* (forwardPate) func:
        else if (
          remk.type.length === 2 &&
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            remk.type[0]
          ) &&
          remk.type[remk.type.length - 1].toString() === "*"
        ) {
          filterRemark = [...filterRemark,...forwardPate(remk)];
        }

        // *0...9 (backpate) func:
        else if (
          remk.type.length === 2 &&
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            remk.type[1]
          ) &&
          remk.type[0].toString() === "*"
        ) {
          filterRemark = [...filterRemark,...backpate(remk)];
        }

        // 91+ (r) func:
        else if (
          remk.number.length === 3 &&
          remk.type[remk.type.length-1] === "+"
        ) {
          filterRemark=[...filterRemark,...r(remk)]
        }

        // ms (masone) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "ms"
        ) {
          filterRemark = [...filterRemark,...masone(remk)];
        }

        // sm (sonema) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "sm"
        ) {
          filterRemark = [...filterRemark,...sonema(remk)];
        }

        // mm (mama) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "mm"
        ) {
          filterRemark = [...filterRemark,...mm(remk)];
        }

        // ss (sonesone) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "ss"
        ) {
          filterRemark = [...filterRemark,...ss(remk)];
        }

        // s* (sonepu) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "s*"
        ) {
          filterRemark = [...filterRemark,...spu(remk)];
        }

        // m* (mapu) func:
        else if (
          remk.type.length === 2 &&
          remk.type.toLowerCase().toString() === "m*"
        ) {
          filterRemark = [...filterRemark,...mpu(remk)];
        }

        // 123/123* (padatha) func:
        else if (
          remk.type.length >= 3 && remk.type.endsWith("*")
            ? remk.type.length > 3 && remk.type.length <= 6
            : remk.type.length >= 3 && remk.type.length <= 5 && !isNaN(remk.type)
        ) {
          filterRemark=[...filterRemark,...padatha(remk)]

        }

        newCall.push({ number: remk.number, amount: remk.amount });

      });
      const remain =obj.numbers.filter(
          (fn) =>
            ![...filterRemark.map((fr) => fr.number.toString())].includes(
              fn.number.toString()
            )
        );
      console.log(colors.bgBlue(remain))
      obj.numbers = [...newCall,...remain]
    }
    return obj;
  });
    // console.log(remain)
//   console.log(newCalls)
  return newCalls;
};
