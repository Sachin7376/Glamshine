// Server ke liye zaroori modules ko import karein
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
// Port ko Render environment se lein, agar available ho
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '')));

// MongoDB se connect karein
// Environment variable se connection string lein
const mongoURI = process.env.MONGO_URI;

// Check karein ki MONGO_URI define hai ya nahi
if (!mongoURI) {
    console.error('MONGO_URI is not defined. Please set it as an environment variable.');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB se connect ho gaya!'))
    .catch(err => console.error('MongoDB connection error:', err));

// MongoDB schemas aur models define karein
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

const Appointment = mongoose.model('Appointment', appointmentSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// API endpoints define karein
// Appointment form data ko handle karein
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

// Feedback form data ko handle karein
// Naya endpoint '/api/feedbacks' joda gaya hai jo front-end se match karta hai
app.post('/api/feedbacks', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback safalta purvak submit ho gaya!' });
    } catch (error) {
        console.error('Feedback save karne mein error:', error);
        res.status(500).json({ message: 'Feedback save karne mein error hua.' });
    }
});

// Contact form data ko handle karein
// Naya endpoint '/api/contactmessages' joda gaya hai jo front-end se match karta hai
app.post('/api/contactmessages', async (req, res) => {
    try {
        const newContactMessage = new ContactMessage(req.body);
        await newContactMessage.save();
        res.status(201).json({ message: 'Message safalta purvak bhej diya gaya!' });
    } catch (error) {
        console.error('Message save karne mein error:', error);
        res.status(500).json({ message: 'Message save karne mein error hua.' });
    }
});

// Static files serve karne ke liye root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'glamshine.html'));
});

// Server ko start karein
app.listen(port, () => {
    console.log(`Server http://localhost:${port} par chal raha hai`);
});
