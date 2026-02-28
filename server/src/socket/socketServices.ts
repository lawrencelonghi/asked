import { Server } from 'socket.io';
import http from "http";
import express from 'express';
import { app, server } from '../server.js';
import { generateRoomId } from '../helpers/roomsHash.js';


function socketService() {

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let players: Array<{id: number, name: string, socketId: string}> = []

const roomId = generateRoomId()



// função principal de conexao do socket 
io.on("connection", (socket) => {
  console.log('player connected', socket.id);

  socket.join(roomId)
  socket.emit('room_id', roomId)

  socket.emit('display_players', players);

  socket.on('send_message', (data) => {
    console.log(data);
    io.emit('receive_message', data)
  });

  socket.on('send_player', (data) => {
    // adiciona o socketId ao dados do player (name) enviados pelo front, melhor pratica de segurança pois os players nao conseguem alterar ID
    const playerWithSocket = {
      ...data,
      socketId: socket.id
    };
    
    players.push(playerWithSocket);
    console.log('Players atuais:', players);
    
    // envia os dados do player de volta para ele
    socket.emit('your_player_data', playerWithSocket);
    
    // envia a lista completa para TODOS os players
    io.emit('display_players', players);
  });

  socket.on('disconnect', () => {
    console.log('player disconnected', socket.id);
    
    // Remove o player da lista quando desconectar
    players = players.filter(p => p.socketId !== socket.id);
    io.emit('display_players', players);
  });
});
}

export default socketService


