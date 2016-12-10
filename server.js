const express = require('express');
const http = require('http');
const path = require("path");
const Bot = require('messenger-bot');
const app = express();

/** CONFIG */
process.env.PORT = process.env.PORT || 8080;
const config = {
  development: {
    token: "EAAQhCRnyD7UBAJ3c2gItTTtTZCJj9IgnJm3RY9TUGr1Yfc5gxJY5kmP3BghkIID2Yq5rtAspi3WZArj3Af3MNdxrZBU7vvQbBZBOORZBpGDBZA1hIZB8ect0UZBpzAJxv9r8IcZATDhSmvFNQdagCaUOu9miHvHWzZAG6pJSpuZBW5pcAZDZD",
    verify: "greatestbotonearth",
    app_secret: "f8078e16030ed64e5b5f44cc8778aa72"
  },
  production: {
    token: process.env.facebook_token,
    verify: process.env.verification_token,
    app_secret: process.env.facebook_app_secret
  },
}

let bot = new Bot(config[process.env.NODE_ENV]);

bot.on('error', (err) => {
  console.log(err.message)
});

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
});

app.use("/fbbot", bot.middleware());

/** ADMIN INTERFACE */
app.use("/bower_components",express.static("bower_components")); // Shared libraries

app.use("/",express.static("display"));
app.get(['/','/*', '/**'], function(req, res) {
  res.sendFile(path.join(__dirname, '/display/index.html'));
});
  
/** API */
var admin = require("./api/admin.js");
app.use("/api", admin.router);

app.listen(process.env.PORT);
console.log(`Kopiboy bot server running at port ${process.env.PORT}.`);