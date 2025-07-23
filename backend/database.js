const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    console.log('Setting up database...');

    // Create Assets table
    db.run(`
        CREATE TABLE IF NOT EXISTS assets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL
        )
    `);

    // Create Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id TEXT NOT NULL,
            booking_date TEXT NOT NULL,
            booking_time TEXT NOT NULL,
            FOREIGN KEY (asset_id) REFERENCES assets (id)
        )
    `);

    // Insert initial asset data if table is empty
    const stmt = db.prepare("INSERT OR IGNORE INTO assets (id, name, status) VALUES (?, ?, ?)");
    const assets = [
        { id: 'SPEC-001', name: 'Spectrum Analyzer', status: 'Available' },
        { id: 'OSC-003', name: 'Oscilloscope', status: 'Available' },
        { id: 'PSU-007', name: 'Power Supply Unit', status: 'In Use' },
        { id: 'VNA-002', name: 'Vector Network Analyzer', status: 'Available' },
        { id: 'MM-015', name: 'Digital Multimeter', status: 'Out for Calibration' },
        { id: 'SIG-004', name: 'Signal Generator', status: 'Available' },
    ];

    assets.forEach(asset => {
        stmt.run(asset.id, asset.name, asset.status);
    });
    stmt.finalize();

    console.log('Database setup complete.');
});

db.close();