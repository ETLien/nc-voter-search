// Load dependencies
const express = require('express'); //Imports Express.js
require('dotenv').config(); //Loads environment variables from a .env file
const helmet = require('helmet'); //sets various HTTP headers for app security
const cors = require('cors'); //enables Cross-Origin Resource Sharing
//const morgan = require('morgan'); //HTTP request logger middleware - we can add if we feel we need it
const pgRouter = require('./database/postgres.js')


const app = express(); //Creates an Express application

// Middleware recommended by Copilot, let's see if we need these
app.use(express.json());
/*
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
*/


//  Routes

// Root/home page
app.get('/', (req, res) => {
    res.send('<h1>NC Voter Search</h1>');
});

app.get('/api/health', (req, res) => {
    res.json({ uptime: process.uptime(), message: 'OK', timestamp: Date.now() });
});

app.get('/api/countylist', (req, res) => {
    
});

app.get('/api/citylist', (req, res) => {
    const { county } = req.query;

    //optionally, use the county parameter to filter cities by county
    
});

app.get('/api/search', (req, res) => {

    const { firstname, firstnameExact, middlename, middlenameExact, lastname, lastnameExact, address, phone, city, county, zip } = req.query;

    console.log(`Search parameters received:
        First Name: ${firstname}
        Exact? ${firstnameExact}
        Middle Name: ${middlename}
        Exact? ${middlenameExact}
        Last Name: ${lastname}
        Exact? ${lastnameExact}
        Address: ${address}
        Phone: ${phone}
        City: ${city}
        County: ${county}
        Zip: ${zip}
    `);

    res.json(
    [
        {
            firstname: 'Johannes',
            middlename: 'Jett',
            lastname: 'Svart',
            address: 'XXXX MaiXXX StXXX',
            city: 'Raleigh',
            county: 'Wake',
            zip: '27606',
            phone: 'XXX-XXX-4567'
        },
        {
            firstname: 'Jaime',
            middlename: 'Delgado',
            lastname: 'Guzman',
            address: 'XXXX SteXXX RoXXX',
            city: 'Raleigh',
            county: 'Wake',
            zip: '27606',
            phone: 'XXX-XXX-7890'
        }
    ]
    );
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Mount the Postgres router
app.use('/pg', pgRouter)

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Forcing shutdown');
        process.exit(1);
    }, 10000);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

//module.exports = app; //if we need to export for testing