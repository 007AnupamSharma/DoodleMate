import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    socketId: { type: String, required: true },
    name: { type: String, required: true }
});

const roomSchema = new mongoose.Schema({
    roomName: { type: String, unique: true, required: true },
    maxPlayers: { type: Number, required: true },
    currentPlayers: { type: Number, default: 0 },
    players: [playerSchema],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Room", roomSchema);