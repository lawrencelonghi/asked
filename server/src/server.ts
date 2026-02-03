
import express from 'express';
import dotenv from 'dotenv'
import { createServer } from "http";
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config()

const app = express();
const httpServer = createServer(app);


const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: 'http://localhost:3000'  // Next.js
}));


const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


io.on("connection", (socket) => {
  console.log('player connected');
  socket.on('disconnect', () => {
    console.log('👋 Player desconectou:', socket.id);
  });
});



app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} 🚀 `);
});