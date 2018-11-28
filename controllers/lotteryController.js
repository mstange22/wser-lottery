const ONE_TICKET = 3179;
const TWO_TICKETS = 1261;
const FOUR_TICKETS = 687;
const EIGHT_TICKETS = 444;
const SIXTEEN_TICKETS = 186;
const THIRTY_TWO_TICKETS = 93;
const SIXTY_FOUR_TICKETS = 29;
const NUM_SIMULATIONS = 100000;

let tickets = [];

const populateTicketArray = (numTickets, numEntrants, lower, upper) => {
  const nums = [];
  let counter = 0;

  // build array of unique numbers in range for the current ticket group
  for (let i = lower; i < upper; i++) {
    nums.push(i);
  }

  // add numTickets * num Entrants numbers to ticket array
  while (counter < numEntrants * numTickets) {
    // pick a random number from nums
    const index = Math.floor(Math.random() * nums.length);

    // add the appropriate amount of duplicates for the current ticket group
    for (let j = 1; j <= numTickets; j++) {
      tickets.push(nums[index]);
      counter += 1;
    }
    // remove the number from array to avoid picking it again
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

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    // winners hash map to check for duplicates
    const winners = {};
    let winnersCount = 0;
    let drawCount = 0;

    // draw 250 winners for each simulation
    // NOTE: added winnersCount as Object.keys().length was too slow.
    while (winnersCount < 265) {
      // pick a random number from tickets array and increment draw count
      const winner = tickets[Math.floor(Math.random() * tickets.length - 1)];
      drawCount += 1;

      // ignore duplicates - only do something if a new number is drawn
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
    // capture draw count for each completed simulation
    draws.push(drawCount);
  }

  return {
    simCounts,
    draws,
  };
};

module.exports = (app, watchStatsConnection, dbConnection) => {
  // initialization route.  Build array with all tickets for the drawing
  app.get('/init', (req, res) => {
    tickets = [];

    // call populateTicketArray for each ticket group.
    // NOTE: refactoring further got messy and required a map of count/upper/lower values.  This seemed more concise.
    populateTicketArray(1, ONE_TICKET, 1, 4000);
    populateTicketArray(2, TWO_TICKETS, 4000, 6000);
    populateTicketArray(4, FOUR_TICKETS, 6000, 7000);
    populateTicketArray(8, EIGHT_TICKETS, 7000, 8000);
    populateTicketArray(16, SIXTEEN_TICKETS, 8000, 9000);
    populateTicketArray(32, THIRTY_TWO_TICKETS, 9000, 10000);
    populateTicketArray(64, SIXTY_FOUR_TICKETS, 10000, 10500);
    res.json({ status: 'success', tickets, length: tickets.length });
  });

  // simulation route
  app.get('/simulator', (req, res) => {
    const simResults = doSimulation();
    res.json(simResults);
  });
};