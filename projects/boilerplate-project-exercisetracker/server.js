require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
const moment = require("moment");
const shortId = require("shortid");

const mySecret = process.env['MONGO_URI'];
const mongoose = require("mongoose");
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const personSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: shortId.generate },
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  log: [{ description: String, duration: Number, date: Date }]
});

const Person = mongoose.model("User", personSchema);

app.post("/api/users", function(req, res) {
  Person.findOne({ username: req.body.username }, (err, data) => {
    if (err) {
      return;
    }
    if (data) {
      res.send("Username already taken");
    } else {
      const newPerson = new Person({
        username: req.body.username
      });
      newPerson.save();
      res.json({ username: req.body.username, _id: newPerson._id });
    }
  });
});

app.get("/api/users", function(req, res) {
  Person.find({ }, (err, data) => {
    if (err) {
      return;
    }
    res.json(data);
  });
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date } = req.body;
  let id = req.params._id;
  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }

  try {
    let foundPerson = await Person.findOne({ _id: id })
    if (foundPerson){
      foundPerson.count++;
      foundPerson.log.push({ description: description, duration: parseInt(duration), date: date });
      foundPerson.save();

      res.json({ username: foundPerson.username, description: description, duration: parseInt(duration), _id: id, date: date });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/users/:_id/logs", function(req, res) {
  Person.findById(req.params._id, (err, result) => {
    if (!err) {
      let resultObject = result;
      if (req.query.from || req.query.to) {
        let fD = new Date(0);
        let tD = new Date();
        let fromQuery = new Date(req.query.from);
        let toQuery = new Date(req.query.to);

        if (req.query.from) {
          fD = fromQuery;
        }

        if (req.query.to) {
          tD = toQuery;
        }

        fD = fD.getTime();
        tD = tD.getTime();

        resultObject.log = resultObject.log.filter(session => {
          let sD = new Date(session.date).getTime();
          return sD >= fD && sD <= tD;
        });
      }

      if (req.query.limit) {
        resultObject.log = resultObject.log.slice(0, req.query.limit);
      }

      resultObject = resultObject.toJSON();
      resultObject["count"] = result.log.length;
      res.json(resultObject);
    }
  });
});

app.post("/api/users/view", (req, res) => {
  console.log(req.body);
  Person.findById(req.body._id, (err, result) => {
    if (!err) {
      let resultObject = result;

      if (req.body.from || req.body.to) {
        let fD = new Date(0);
        let tD = new Date();
        let fromQuery = new Date(req.query.from);
        let toQuery = new Date(req.query.to);

        if (req.body.from) {
          fD = fromQuery;
        }

        if (req.body.to) {
          tD = toQuery;
        }

        fD = fD.getTime();
        tD = tD.getTime();

        resultObject.log = resultObject.log.filter(session => {
          let sD = new Date(session.date).getTime();
          return sD >= fD && sD <= tD;
        });
      }

      if (req.body.limit) {
        resultObject.log = resultObject.log.slice(0, req.body.limit);
      }

      resultObject = resultObject.toJSON();
      resultObject["count"] = result.log.length;
      res.json(resultObject);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

