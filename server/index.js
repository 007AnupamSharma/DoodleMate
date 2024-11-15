import express from 'express'
import cors from 'cors'
import { Server } from "socket.io"
import { createServer } from 'http'
import router from './routes/routes.room.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import Room from './models/models.room.js';


dotenv.config();
const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// socket connection
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send("Hello World")
});

//routes

app.use("/room", router);



io.on("connection", (socket) => {
    console.log("User Connected " + socket.id);


    socket.on("create-room", async ({ roomName, maxPlayers, playerName }) => {
        let room = await Room.findOne({ roomName });
        if (room) {
            socket.emit('error', { message: "Room has already taken" });
        } else {
            room = new Room({ roomName, maxPlayers });
            room.players.push({ socketId: socket.id, name: playerName });
            room.currentPlayers += 1;
            await room.save();
            socket.join(roomName);
            socket.emit('room-created', { room })
        }
    });

    socket.on("join-room", async ({ roomName, playerName }) => {
        let room = await Room.findOne({ roomName });
        if (!room) {
            socket.emit('error', { message: "Room does not exist" });
        } else if (room.currentPlayers === room.maxPlayers) {
            socket.emit('error', { message: "Room is full" });
        } else {
            room.currentPlayers++;
            room.players.push({ socketId: socket.id, name: playerName });
            await room.save();
            socket.join(roomName);
            socket.emit('room-joined', { room })
        }
    });

    socket.on('disconnect', async () => {
        const room = await Room.findOneAndUpdate(
            { 'players.socketId': socket.id },
            { $pull: { players: { socketId: socket.id } }, $inc: { currentPlayers: -1 } },
            { new: true }
        );
        if (room && room.currentPlayers === 0) {
            await Room.deleteOne({ roomName: room.roomName });
        }
        socket.leave(room.roomName);
        io.to(room.roomName).emit('player_left', { playerId: socket.id });
    });
});

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening on port ${PORT}`);
});