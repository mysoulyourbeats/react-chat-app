const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')

const { addUser, removeUser, getUser} = require('./users.js')
console.log(socketio)
const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server,{
    cors: {
      origin: "https://mysoulyourbeats.netlify.app",
      methods: ["GET", "POST"],
    },
  })
  
//io is instance of server

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room })

      if(error) return callback(error)

      socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the chatroom - ${user.room}!` })
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, is here!`})

      socket.join(user.room)


      callback()
    })

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)

      io.to(user.room).emit('message', { user: user.name, text: message })

      callback()
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`})
        }
    })
})

app.use(router)
app.use(cors())
server.listen(PORT)

