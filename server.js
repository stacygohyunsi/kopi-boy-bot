const express = require('express');
const http = require('http');
const Bot = require('messenger-bot');

const app = express();

let bot = new Bot({
  token: process.env.facebook_token,
  verify: process.env.verification_token,
  app_secret: process.env.facebook_app_secret
});

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

app.use("/", function(req, res, next) {
  res.send("yay");
});

app.listen(process.env.PORT);
console.log('Kopiboy bot server running at port 6787.')