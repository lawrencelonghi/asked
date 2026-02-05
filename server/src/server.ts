import express from 'express';
import dotenv from 'dotenv'
import http from "http";
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: 'http://localhost:3000'
}));

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let players: Array<{id: number, name: string, socketId: string}> = []

io.on("connection", (socket) => {
  console.log('player connected', socket.id);

  socket.emit('display_players', players);

  socket.on('send_message', (data) => {
    console.log(data);
    io.emit('receive_message', data)
  });

  socket.on('send_player', (data) => {
    // Adiciona o socketId ao player
    const playerWithSocket = {
      ...data,
      socketId: socket.id
    };
    
    players.push(playerWithSocket);
    console.log('Players atuais:', players);
    
    // Envia os dados do player de volta para ele
    socket.emit('your_player_data', playerWithSocket);
    
    // Envia a lista completa para TODOS os clientes
    io.emit('display_players', players);
  });

  socket.on('disconnect', () => {
    console.log('player disconnected', socket.id);
    
    // Remove o player da lista quando desconectar
    players = players.filter(p => p.socketId !== socket.id);
    io.emit('display_players', players);
  });
});

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} 🚀 `);
});