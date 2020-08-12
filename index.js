const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");
const path = require("path");
const cors = require("cors");

//Routes importing
const auth = require("./routes/auth");
const users = require("./routes/users");
const recipes = require("./routes/recipes");

//App settings and config
const app = express();
const port = process.env.PORT || "4000";

// Letting all origins to pass
//app.use(cors());
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
//log
app.use(morgan(":method :url :status  :response-time ms"));

app.use(
  session({
    cookieName: "session",
    secret: "sdfg6546gfhgh",
    duration: 30 * 60 * 1000,
    activeDuration: 0,
    cookie: {
      httpOnly: false,
    },
  })
);

//Routing
app.use("/users", users);
app.use("/recipes", recipes);
app.use(auth);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
