let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(require("path").join(__dirname, "public")));
console.log(require("path").join(__dirname, "public"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
