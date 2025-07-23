const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const PORT = 3000; // The port our backend will run on

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // Allow server to accept JSON data

let db;

// Connect to the database
(async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
})();

// --- API ENDPOINTS ---

// GET all assets
app.get('/api/assets', async (req, res) => {
    const assets = await db.all('SELECT * FROM assets');
    res.json(assets);
});

// GET bookings for a specific asset
app.get('/api/bookings/:assetId', async (req, res) => {
    const { assetId } = req.params;
    const bookings = await db.all('SELECT * FROM bookings WHERE asset_id = ?', [assetId]);

    // Restructure data for the frontend
    const formattedBookings = {};
    bookings.forEach(booking => {
        if (!formattedBookings[booking.booking_date]) {
            formattedBookings[booking.booking_date] = [];
        }
        formattedBookings[booking.booking_date].push(booking.booking_time);
    });

    res.json(formattedBookings);
});

// POST a new booking
app.post('/api/bookings', async (req, res) => {
    console.log('--- Received a new booking request ---');
    console.log('Request body:', req.body);

    const { assetId, date, time } = req.body;

    if (!assetId || !date || !time) {
        return res.status(400).json({ error: 'Missing required booking information.' });
    }

    try {
        const asset = await db.get('SELECT status FROM assets WHERE id = ?', [assetId]);

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found.' });
        }
        if (asset.status !== 'Available') {
            console.warn(`Booking rejected: Asset ${assetId} is not available. Status: ${asset.status}`);
            return res.status(409).json({ error: `This asset is currently ${asset.status.toLowerCase()} and cannot be booked.` });
        }

        const bookingDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        if (bookingDate < today) {
            console.warn(`Booking rejected: Date ${date} is in the past.`);
            return res.status(400).json({ error: 'Cannot make bookings for past dates.' });
        }

        const existingBooking = await db.get(
            'SELECT * FROM bookings WHERE asset_id = ? AND booking_date = ? AND booking_time = ?',
            [assetId, date, time]
        );

        if (existingBooking) {
            console.warn('Booking conflict: This time slot is already taken.');
            return res.status(409).json({ error: 'This time slot is no longer available. Please select another.' });
        }
        
        const result = await db.run(
            'INSERT INTO bookings (asset_id, booking_date, booking_time) VALUES (?, ?, ?)',
            [assetId, date, time]
        );

        console.log('Booking successfully inserted. New booking ID:', result.lastID);
        res.status(201).json({ message: 'Booking successful!', bookingId: result.lastID });

    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ error: 'A server error occurred while processing the booking.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});