
import express from 'express';
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: 'http://localhost:3000'  // Next.js
}));

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} 🚀 `);
});