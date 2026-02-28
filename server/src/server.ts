import express from 'express';
import dotenv from 'dotenv'
import http from "http";
import { Server } from 'socket.io';
import cors from 'cors';
import socketService from './socket/socketServices.js';

dotenv.config()

export const app = express();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: 'http://localhost:3000'
}));

export const server = http.createServer(app)

socketService()


server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} 🚀 `);
});