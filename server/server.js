
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./socket'); 


const incidentRoutes = require('./routes/incident');
const resourceRoutes = require('./routes/resource');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO by passing it the main http server
initSocket(server);

app.use(cors({ origin: "http://localhost:3001" }));


app.use(express.json());

app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => console.log(`Server with real-time support running on port ${PORT}`));