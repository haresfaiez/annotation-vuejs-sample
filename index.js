const express = require('express')

const app = express()

app.use(express.json())
app.use("/src", express.static(__dirname + '/src'));

const history = []

const client = (req, res) => {
  res.sendFile(`${__dirname}/src/client.html`)
}

const admin = (req, res) => {
  res.sendFile(`${__dirname}/src/admin.html`)
}

const addMessage = (req, res) => {
  console.log('got new message', req.body)
  history.push(Object.assign({ id: history.length + 1 }, req.body))
  res.send({ state: 'success' })
}

const messages = (req, res) => {
  res.send(history)
}

app.get('/client', client)
app.get('/admin', admin)
app.post('/message', addMessage)
app.get('/messages', messages)

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}!`))
