// Server ke liye zaroori modules ko import karein
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Path module import karein

const app = express();
const port = 3000;

// Middleware
// Yeh CORS ko enable karta hai taki frontend code is server se request bhej sake
app.use(cors()); 
// JSON request bodies ko parse karne ke liye
app.use(express.json()); 
// Frontend files ko serve karne ke liye
// Yeh middleware 'glamshine.html' file ko serve karega
app.use(express.static(path.join(__dirname, '')));

// MongoDB se connect karein
// IMPORTANT: Humne database ka naam badal diya hai!
const mongoURI = 'mongodb://localhost:27017/glamshine_test_db';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB se connect ho gaya!'))
    .catch(err => console.error('MongoDB connection error:', err));

// MongoDB schemas aur models define karein
// Har form ke liye ek alag schema aur model banayenge
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
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Backend ke liye API endpoints banayein
// Yeh woh routes hain jahan frontend data bhejega

// Appointment form ke liye route
app.post('/api/appointments', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment safalta purvak save ho gaya!' });
    } catch (error) {
        console.error('Appointment save karne mein error:', error);
        res.status(500).json({ message: 'Appointment save karne mein error hua.' });
    }
});

// Feedback form ke liye route
app.post('/api/feedback', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback safalta purvak submit ho gaya!' });
    } catch (error) {
        console.error('Feedback save karne mein error:', error);
        res.status(500).json({ message: 'Feedback save karne mein error hua.' });
    }
});

// Contact form ke liye route
app.post('/api/contact', async (req, res) => {
    try {
        const newContactMessage = new ContactMessage(req.body);
        await newContactMessage.save();
        res.status(201).json({ message: 'Message safalta purvak bhej diya gaya!' });
    } catch (error) {
        console.error('Message save karne mein error:', error);
        res.status(500).json({ message: 'Message save karne mein error hua.' });
    }
});

// Root URL '/' par GET request ko handle karein aur glamshine.html serve karein
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'glamshine.html'));
});

// Server ko start karein
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
