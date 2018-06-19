const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const passport = require("passport");
const path = require('path');
const users = require("./routes/api/users");
const giftcards = require("./routes/api/shift4");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const getusers = require("./routes/api/getusers");
const getprofiles = require("./routes/api/getprofiles");
const getbcusers = require("./routes/bcapi/getbcusers");
const bcusers = require("./routes/bcapi/bcusers");
const bcjwt = require("./routes/bcapi/bcjwt");
const postcart = require("./routes/bcapi/postcart");
const cors = require('cors')

const app = express();


// body parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get(`/`, (req, res) => res.send("Hello World"));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// User Routes
app.use("/api/users", users);
app.use("/api/shift4", giftcards);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/getusers", getusers);
app.use("/api/getprofiles", getprofiles);
app.use("/bcapi/getbcusers", getbcusers);
app.use("/bcapi/bcusers", bcusers);
app.use("/bcapi/bcjwt", bcjwt);
app.use("/bcapi/postcart", postcart);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
