// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the current folder (glamshine.html in root)
app.use(express.static(path.join(__dirname)));

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('MONGO_URI is not defined. Please set it as an environment variable.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB se connect ho gaya!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const appointmentSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  service: String,
  date: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  comments: String,
  createdAt: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Routes
app.post('/api/appointments', async (req, res) => {
  try {
    const doc = await Appointment.create(req.body);
    res.status(201).json({ message: 'Appointment safalta purvak save ho gaya!', id: doc._id });
  } catch (error) {
    console.error('Appointment save karne mein error:', error);
    res.status(500).json({ message: 'Appointment save karne mein error hua.' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const doc = await Feedback.create(req.body);
    res.status(201).json({ message: 'Feedback safalta purvak submit ho gaya!', id: doc._id });
  } catch (error) {
    console.error('Feedback save karne mein error:', error);
    res.status(500).json({ message: 'Feedback save karne mein error hua.' });
  }
});

app.post('/api/contactmessages', async (req, res) => {
  try {
    const doc = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Message safalta purvak bhej diya gaya!', id: doc._id });
  } catch (error) {
    console.error('Message save karne mein error:', error);
    res.status(500).json({ message: 'Message save karne mein error hua.' });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'glamshine.html'));
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} par chal raha hai`);
});
