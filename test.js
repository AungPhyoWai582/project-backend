const array = [];

const members = [{ name: "Aung", data: ["a", "b", "c"] }];

members.map((m) => {
  console.log(m);
  array.push(m);
});

console.log(array);
