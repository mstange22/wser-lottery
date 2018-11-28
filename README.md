# Western States Lottery Simulation in React / Express / Node
I saw a social media post about the 2018 Western States Lottery and shared it with Mailei.  She got the idea to run her own simulation and got hers up and running in python.  I decided to implement a solution in Javascript and add a front end.

The calculation was freezing up the UI, so I moved the simulations over to a node / express server (see controllers/lotterController) and await the response with a spinner.

I'm not really crazy about the multiple calls to `populateTicketArray()` with hard-coded constants, but this implementation proved to be less code and more concise / readable than some other refactored solutions:

* Building a map for each ticket group with count of tickets and the range for the distribution (lower & upper variables).
* Build an array with ticket counts and build the range dynamically before each function call.

If I needed to reuse this code for other values or successive years, I would definitely add range constants and use those for the initialization and simulation logic.