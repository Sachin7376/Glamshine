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
// (Baaki ka code same rahega)
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'glamshine.html'));
});

// Server ko start karein
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
