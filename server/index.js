import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

import authRoutes from './routes/auth.js';
import { authenticateToken, socketAuthenticate } from './middleware/auth.js';

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Socket.IO authentication middleware
io.use(socketAuthenticate);

// Real-time event handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.user.username);
  // TODO: Update onlineStatus, broadcast user list, handle joinRoom, sendMessage, typing, stopTyping, disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
    // TODO: Update onlineStatus, broadcast user list
  });
});

app.get('/', (req, res) => {
  res.send('Chat server running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
