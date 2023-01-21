exports.startStar = (onChange) => {
    // console.log(onChange);
    return [
      { number: "00", amount: onChange.amount },
      { number: "11", amount: onChange.amount },
      { number: "22", amount: onChange.amount },
      { number: "33", amount: onChange.amount },
      { number: "44", amount: onChange.amount },
      { number: "55", amount: onChange.amount },
      { number: "66", amount: onChange.amount },
      { number: "77", amount: onChange.amount },
      { number: "88", amount: onChange.amount },
      { number: "99", amount: onChange.amount },
    ];
  };
  
  exports.k = (onChange) => {
    return [
      { number: "07", amount: onChange.amount },
      { number: "70", amount: onChange.amount },
      { number: "18", amount: onChange.amount },
      { number: "81", amount: onChange.amount },
      { number: "24", amount: onChange.amount },
      { number: "42", amount: onChange.amount },
      { number: "35", amount: onChange.amount },
      { number: "53", amount: onChange.amount },
      { number: "69", amount: onChange.amount },
      { number: "96", amount: onChange.amount },
    ];
  };
  
  exports.p = (onChange) => {
    return [
      { number: "05", amount: onChange.amount },
      { number: "50", amount: onChange.amount },
      { number: "16", amount: onChange.amount },
      { number: "61", amount: onChange.amount },
      { number: "27", amount: onChange.amount },
      { number: "72", amount: onChange.amount },
      { number: "38", amount: onChange.amount },
      { number: "83", amount: onChange.amount },
      { number: "49", amount: onChange.amount },
      { number: "94", amount: onChange.amount },
    ];
  };
  
  exports.b = (onChange) => {
    return [
      { number: "01", amount: onChange.amount },
      { number: "10", amount: onChange.amount },
      { number: "12", amount: onChange.amount },
      { number: "21", amount: onChange.amount },
      { number: "23", amount: onChange.amount },
      { number: "32", amount: onChange.amount },
      { number: "34", amount: onChange.amount },
      { number: "43", amount: onChange.amount },
      { number: "45", amount: onChange.amount },
      { number: "54", amount: onChange.amount },
      { number: "56", amount: onChange.amount },
      { number: "65", amount: onChange.amount },
      { number: "67", amount: onChange.amount },
      { number: "76", amount: onChange.amount },
      { number: "78", amount: onChange.amount },
      { number: "87", amount: onChange.amount },
      { number: "89", amount: onChange.amount },
      { number: "98", amount: onChange.amount },
      { number: "09", amount: onChange.amount },
      { number: "90", amount: onChange.amount },
    ];
  };
  
  exports.Breaks = (onChange) => {
    let arrx = Array.from(Array(10), (_, x) => x);
    let arry = Array.from(Array(10), (_, x) => x);
    let result = [];
    arrx.map((l, key) => {
      arry.map((ll, key) => {
        if (
          (l + ll).toString() == onChange.number[0].toString() ||
          (l + ll).toString() == `1${onChange.number[0]}`
        ) {
          result.push({
            number: l.toString() + ll.toString(),
            amount: onChange.amount,
          });
        }
      });
    });
    return result;
  };
  
  exports.aper = (onChange) => {
    let output = [];
    let arr = Array.from(Array(10), (_, x) => x);
    arr.map((ar, key) => {
      if (onChange.number[0] !== key.toString()) {
        output.push(
          {
            number: onChange.number[0].toString() + key.toString(),
            amount: onChange.amount,
          },
          {
            number: key.toString() + onChange.number[0].toString(),
            amount: onChange.amount,
          }
        );
      } else
        output.push({
          number: onChange.number[0].toString() + key.toString(),
          amount: onChange.amount,
        });
    });
    return output;
  };
  
  exports.padatha = (onChange) => {
    let result = [];
    let onChangeLength = onChange && onChange.number.length;
    const numOnChange = [];
    const numOnChangeStar = [];
    // numOnChange;
    console.log(onChangeLength);
    if (onChange.number.endsWith("*")) {
      Array.from(Array(onChangeLength), (x, _) => x).map((pdt, key) =>
        onChange.number[key] === "*"
          ? numOnChange.push(onChange.number[key])
          : numOnChangeStar.push(onChange.number[key])
      );
      numOnChangeStar &&
        numOnChangeStar.map((pdt, key) => {
          numOnChangeStar.map((pdt1, key) => {
            result.push({ number: `${pdt}${pdt1}`, amount: onChange.amount });
          });
        });
    } else {
      Array.from(Array(onChangeLength), (x, _) => x).map((pdt, key) =>
        onChange.number[key] === "*"
          ? numOnChange.push(onChange.number[key])
          : numOnChangeStar.push(onChange.number[key])
      );
      numOnChangeStar &&
        numOnChangeStar.map((pdt, key) => {
          numOnChangeStar.map((pdt1, key) => {
            pdt !== pdt1 &&
              result.push({ number: `${pdt}${pdt1}`, amount: onChange.amount });
          });
        });
    }
  
    return result;
  };
  
  exports.r = (onChange) => {
    return [
      {
        number: `${onChange.number[0]}${onChange.number[1]}`,
        amount: onChange.amount,
      },
      {
        number: `${onChange.number[1]}${onChange.number[0]}`,
        amount: onChange.amount,
      },
    ];
  };
  
  exports.masone = (onChange) => {
    let ma = [];
    let sone = [];
    let result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 !== 0 ? ma.push(arr) : sone.push(arr);
    });
    ma.map((m, key) => {
      sone.map((s, key) => {
        result.push({
          number: m.toString() + s.toString(),
          amount: onChange.amount,
        });
      });
    });
    // console.log(sone);
    return result;
  };
  
  exports.sonema = (onChange) => {
    let ma = [];
    let sone = [];
    let result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 !== 0 ? ma.push(arr) : sone.push(arr);
    });
    ma.map((m, key) => {
      sone.map((s, key) => {
        result.push({
          number: s.toString() + m.toString(),
          amount: onChange.amount,
        });
      });
    });
    // console.log(sone);
    return result;
  };
  
  exports.mm = (onChange) => {
    const ma = [];
    const result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 !== 0 && ma.push(arr);
    });
    ma.map((m, key) => {
      return ma.map((m1, key) => {
        result.push({
          number: m.toString() + m1.toString(),
          amount: onChange.amount,
        });
      });
    });
  
    return result;
  };
  
  exports.ss = (onChange) => {
    const sone = [];
    const result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 === 0 && sone.push(arr);
    });
    sone.map((s, key) => {
      sone.map((s1, key) => {
        result.push({
          number: s.toString() + s1.toString(),
          amount: onChange.amount,
        });
      });
    });
  
    return result;
  };
  
  exports.spu = (onChange) => {
    let sone = [];
    const result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 === 0 && sone.push(arr);
    });
    sone.map((s, key) => {
      sone.map((s1, key) => {
        s === s1 &&
          result.push({
            number: s.toString() + s1.toString(),
            amount: onChange.amount,
          });
      });
    });
    return result;
  };
  
  exports.mpu = (onChange) => {
    let ma = [];
    const result = [];
    Array.from(Array(10), (_, x) => x).map((arr, key) => {
      arr % 2 !== 0 && ma.push(arr);
    });
    ma.map((m, key) => {
      ma.map((m1, key) => {
        m === m1 &&
          result.push({
            number: m.toString() + m1.toString(),
            amount: onChange.amount,
          });
      });
    });
    return result;
  };
  
  exports.forwardPate = (onChange) => {
    const result = [];
    const numb = [];
    Array.from(Array(10), (x, _) => x).map((arr, key) => {
      result.push({
        number: `${onChange.number[0]}${key}`,
        amount: onChange.amount,
      });
    });
    console.log(result);
    return result;
  };
  
  exports.backpate = (onChange) => {
    const result = [];
    const numb = [];
    Array.from(Array(10), (x, _) => x).map((arr, key) => {
      result.push({
        number: `${key}${onChange.number[1]}`,
        amount: onChange.amount,
      });
    });
    console.log(result);
    return result;
  };
  