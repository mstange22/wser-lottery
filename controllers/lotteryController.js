
const t1 = [];
const t2 = [];
const t4 = [];
const t8 = [];
const t16 = [];
const t32 = [];
const t64 = [];
let allTickets = [];

const ONE_TICKET = 3179;
const TWO_TICKETS = 1261;
const FOUR_TICKETS = 687;
const EIGHT_TICKETS = 444;
const SIXTEEN_TICKETS = 186;
const THIRTY_TWO_TICKETS = 93;
const SIXTY_FOUR_TICKETS = 29;

const populateArrays = (arr, numTickets, numEntrants, lower, upper) => {
  const nums = [];
  for (let i = lower; i < upper; i++) {
    nums.push(i);
  }
  while (arr.length < numEntrants * numTickets) {
    const index = Math.floor(Math.random() * nums.length);
    for (let j = 1; j <= numTickets; j++) {
      arr.push(nums[index]);
    }
    nums.splice(index, 1);
  }
};

const doSimulation = () => {
  const draws = [];
  const simCounts = {
    '1': { entrants: ONE_TICKET, winners: 0 },
    '2': { entrants: TWO_TICKETS, winners: 0 },
    '4': { entrants: FOUR_TICKETS, winners: 0 },
    '8': { entrants: EIGHT_TICKETS, winners: 0 },
    '16': { entrants: SIXTEEN_TICKETS, winners: 0 },
    '32': { entrants: THIRTY_TWO_TICKETS, winners: 0 },
    '64': { entrants: SIXTY_FOUR_TICKETS, winners: 0 },
  };
  for (let i = 0; i < 100000; i++) {
    const winners = {};
    let winnersCount = 0;
    let drawsCount = 0;

    while (winnersCount < 265) {
      drawsCount += 1;
      const winner = allTickets[Math.floor(Math.random() * allTickets.length - 1)];
      if (!winners[winner]) {
        winners[winner] = 1;
        winnersCount += 1;
        if (winner < 4000) simCounts['1'].winners += 1;
        else if (winner >= 4000 && winner < 6000) simCounts['2'].winners += 1;
        else if (winner >= 6000 && winner < 7000) simCounts['4'].winners += 1;
        else if (winner >= 7000 && winner < 8000) simCounts['8'].winners += 1;
        else if (winner >= 8000 && winner < 9000) simCounts['16'].winners += 1;
        else if (winner >= 9000 && winner < 10000) simCounts['32'].winners += 1;
        else simCounts['64'].winners += 1;
      }
    }
    draws.push(drawsCount);
  }
  const simResults = {
    simCounts,
    draws,
  };
  return simResults;
};

module.exports = (app, watchStatsConnection, dbConnection) => {
  app.get('/init', (req, res) => {
    populateArrays(t1, 1, ONE_TICKET, 1, 4000);
    populateArrays(t2, 2, TWO_TICKETS, 4000, 6000);
    populateArrays(t4, 4, FOUR_TICKETS, 6000, 7000);
    populateArrays(t8, 8, EIGHT_TICKETS, 7000, 8000);
    populateArrays(t16, 16, SIXTEEN_TICKETS, 8000, 9000);
    populateArrays(t32, 32, THIRTY_TWO_TICKETS, 9000, 10000);
    populateArrays(t64, 64, SIXTY_FOUR_TICKETS, 10000, 10500);
    allTickets = [...t1, ...t2, ...t4, ...t8, ...t16, ...t32, ...t64];
    res.json({ status: 'success', allTickets, length: allTickets.length });
  });

  app.get('/simulator', (req, res) => {
    const simResults = doSimulation();
    res.json(simResults);
  });
};