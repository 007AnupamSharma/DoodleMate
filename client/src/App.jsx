import React, { useState } from 'react';
import socket from './socket';

function App() {

  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [playerName, setPlayerName] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);

  const createRoom = () => {
    socket.emit('create_room', { roomName, maxPlayers, playerName });
    socket.on('room_created', (room) => {
      setIsInRoom(true);
    });
    socket.on('error', (error) => alert(error.message));
  };

  const joinRoom = () => {
    socket.emit('join_room', { roomName, playerName });
    socket.on('player_joined', () => setIsInRoom(true));
    socket.on('error', (error) => alert(error.message));
  };


  return (
    <div>
      {!isInRoom ? (
        <div>
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Players"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h3>In Room: {roomName}</h3>
          <p>Welcome, {playerName}!</p>
          {/* Game components go here */}
        </div>
      )}
    </div>
  );
}

export default App
