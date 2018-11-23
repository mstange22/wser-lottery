const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static("public"));
app.use(express.static("client/build"));

require("./controllers/lotteryController")(app);

app.listen(PORT, function() {
    console.log("App running on http://localhost:" + PORT);
});