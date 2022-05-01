const agent = {
  _id: "1234456789938",
  username: "yyaant",
  name: "Yair Yint Aung",
  password: "yya12345",
  role: "agent",
  twoDCommission: 10,
  betCommissions: {
    betCommission: true,
    winCommission: true,
  },
  persission: {
    // full control is all true
    betting: true,
    seeReport: true,
    read_write_report: false,
    report_crud_to_overman: true,
    member_Create: false,
    seeMemberList: true,
    suspendToMember: false,
  },
  commissions: [
    ...{
      id: "12334214345654654",
      matchCount: 10,
      betCommission: 100,
      winCommission: 0,
      win: false,
      win_number: null,
    },
    {
      id: "12334214345654655",
      matchCount: 12,
      betCommission: 0,
      winCommission: 1000,
      win: true,
      win_number: 56,
    },
  ],
};

const bet = {
  _id: "12334214345654654",
  agent: "1234456789938",
  code: "A-1",
  betCommission: "100",
  win_lose: true || false,
  winNumber: null || {
    number: 56,
    amount: 1000,
    winAmount: 80000,
  },
  breakNumbers: null || [
    ...{ number: 57, breakLimit: 100000, leftLimit: 40000, amout: 1000 },
  ],
  betNumbers: [...{ number: 56, amount: 1000 }],
  totalAmount: 15000,
  excessLists: null || [...{ number: 90, amount: 6000 }],
};

const report = {
  _id: "367487281728",
  agent: "1234456789938",
  betId: "12334214345654654",
  betamount: 15000,
  win_lose: {
    win: 150000,
    lose: 0,
  },
  commission: 1000,
  excessLists: false || [
    ...{
      number: 50,
      amount: 5000,
      win: true || false,
      winAmount: 0 || "other",
    },
  ],
  betTime: "12/3/2022 Mar 2:30pm",
};

const transcation = {};
