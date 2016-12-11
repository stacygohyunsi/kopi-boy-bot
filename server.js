const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAQgsoQsJvkBAKWG6dXPficR0PNK0KkGgmce0JWuFgfBc8zJVb6X5vmBOYl79U96ATZCohRYQPXki327Pi9O3dmZAJZCQRIZC8VFXufYkXS5Jqmp93qTKZBZCD6a6bfCpBeDLZCLMlIXVJL60B7JElBUDszm57zqXII67utDPzbIwZDZD',
  verify: 'greatestbotonearth',
  app_secret: 'bc1ad72a1965e279a83d25d2b38b7270'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(6787)
console.log('Kopiboy bot server running at port 6787.')