import express from 'express';
import dotenv from 'dotenv'
import http from "http";
import cors from 'cors';
import { SocketConnectionService } from './socket/socketIndex.js';


dotenv.config()

export const app = express();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: 'http://localhost:3000'
}));

export const server = http.createServer(app)

const socketConnection = new SocketConnectionService(server)

socketConnection.listen()


server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} 🚀 `);
});