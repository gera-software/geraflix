import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuidV4 } from 'uuid'

import express from 'express'

const port = process.env.PORT || 3000;

const app = express()
app.use(cors())

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    connectionStateRecovery: {},
});

app.get('/', (req, res) => {
    res.sendStatus(200)
})

// generate room id
// deprecated
app.get('/api/room', (req, res) => {
    res.json({ roomId: uuidV4() })
})

const rooms = new Map()
const roomsOwners = new Map()

function createRoom(id) {
    rooms.set(id, new Map())
    console.log('createRoom()', id, rooms)
}

function deleteRoom(id) {
    rooms.delete(id)
    roomsOwners.delete(id)
    console.log('deleteRoom()', id, rooms)
}

/**
 * 
 * user: { 
 *   roomId: string, 
 *   socketId: string, 
 *   peerId: string, 
 *   id: string, 
 *   name: string, 
 *   color: string,
 *   kind: string 
 * } 
 */
function joinUser(user) {
    rooms.get(user.roomId).set(user.socketId, user)
    console.log('joinUser()', user, rooms)
}

function getUser(roomId, socketId) {
    return rooms.get(roomId).get(socketId)
}

function leaveUser(roomId, socketId) {
    rooms.get(roomId).delete(socketId)
    console.log('leaveUser()', socketId, roomId, rooms)
}

io.on('connection', socket => {

    socket.on('create-meeting', (userId, callback) => {
        const roomId = uuidV4()
        roomsOwners.set(roomId, userId)
        console.log('[create-meeting]', roomId, userId)
        callback({ roomId, ownerId: userId })
    } )

    socket.on('join-meeting', (roomId, user, peerId, callback) => {
        const isHost = roomsOwners.get(roomId) === user.id
        console.log('[join-meeting]', socket.id, roomId, user, isHost)
        socket.join(roomId)


        // FIX garantir suporte ao mesmo usuarios em várias rooms simultâneas
        joinUser({
            roomId: roomId,
            socketId: socket.id,
            peerId: peerId,
            id: user.id,
            name: user.name,
            color: user.color,
            kind: isHost ? 'host' : 'attendee'
        })

        const users = Object.fromEntries(rooms.get(roomId))
        const formatedUsers = Object.values(users)
            // .map(u => ({ 
            //     peerId: u.peerId, 
            //     name: u.name, 
            //     color: u.color 
            // }))
        callback(formatedUsers)

        // TODO rename to joined-meeting
        socket.to(roomId).emit('user-connected', formatedUsers.find(occupant => occupant.id === user.id ))

        // socket.on('disconnect', () => {
        //     console.log('### disconnect', roomId, userId)
        //     // socket.to(roomId).emit('user-disconnected', userId)
        // })
    })

    socket.on('leave-meeting', (roomId) => {
        console.log('[leave-meeting]', roomId)
        socket.leave(roomId)
        // socket.to(roomId).emit('user-disconnected', userId)
    })

})

/**
 * Room internal events
 */

io.of("/").adapter.on("create-room", (roomId) => {
    console.log(`#### created room ${roomId}`);
    createRoom(roomId)
});

io.of("/").adapter.on("delete-room", (roomId) => {
    console.log(`#### deleted room ${roomId}`);
    deleteRoom(roomId)
});

io.of("/").adapter.on("join-room", (roomId, socketId) => {
    // if(room === id) return // ignora global room events
    console.log(`#### socket ${socketId} has joined room ${roomId}`);
});

io.of("/").adapter.on("leave-room", (roomId, socketId) => {
    // if(room === id) return // ignore global room events
    console.log(`#### socket ${socketId} has leaved room ${roomId}`);
    const user = {...getUser(roomId, socketId)} // shallow copy
    
    // TODO rename to leaved-meeting
    console.log('emiting "user-disconnected"', user.id)
    io.to(roomId).emit('user-disconnected', user.id)

    leaveUser(roomId, socketId)
});



server.listen(port, () => {
    console.log('server started on port', port)
})
