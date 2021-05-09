var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

mongoose.Promise = Promise
var dbUrl = 'mongodb+srv://somethingfun:some10@cluster0.xhnjm.mongodb.net/freecodeten?retryWrites=true&w=majority'
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.use(cors())

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/messages', (req, res) =>{
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) =>{
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) =>{
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()
        console.log('saved')
        var censored = await Message.findOne({message: 'badword'})

        if(censored) {
            await Message.remove({_id: censored.id})
        } else {
            io.emit('message', req.body)
        }
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('Message post called')
    }
})

io.on('connection', (socket) => {
    console.log('User Connected')
})

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    console.log('MongoDB Connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})


