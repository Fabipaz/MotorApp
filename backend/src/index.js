const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./database');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const Profile = require('./models/Profile');
const profileRoutes = require('./routes/profile');
const Trip = require('./models/Trip');
const tripRoutes = require('./routes/trip');
const Message = require('./models/Message');
const messageRoutes = require('./routes/message');
const News = require('./models/News');
const newsRoutes = require('./routes/news');
const usersRoutes = require('./routes/users');


const cors = require('cors');
app.use(cors());

const http = require('http');
const { Server } = require('socket.io-client');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a MotorApp Backend!');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', usersRoutes);

// Socket.io para chat general y de viajes
io.on('connection', (socket) => {
  // Unirse a sala de chat general
  socket.on('joinGeneral', () => {
    socket.join('general');
  });

  // Unirse a sala de chat de viaje
  socket.on('joinTrip', (tripId) => {
    socket.join(`trip_${tripId}`);
  });

  // Mensaje en chat general
  socket.on('generalMessage', async (data) => {
    // data: { userId, contenido }
    const message = await Message.create({
      contenido: data.contenido,
      tipo: 'general',
      userId: data.userId
    });
    io.to('general').emit('newGeneralMessage', message);
  });

  // Mensaje en chat de viaje
  socket.on('tripMessage', async (data) => {
    // data: { userId, tripId, contenido }
    const message = await Message.create({
      contenido: data.contenido,
      tipo: 'viaje',
      userId: data.userId,
      tripId: data.tripId
    });
    io.to(`trip_${data.tripId}`).emit('newTripMessage', message);
  });
});

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL exitosa.');
    await sequelize.sync();
    console.log('Modelos sincronizados.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
