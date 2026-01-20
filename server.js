const express = require('express'); //Imports Express.js
const pgRouter = require('./database/postgres.js')
//const helmet = require('helmet');
//const cors = require('cors');
//const morgan = require('morgan');

//require('dotenv').config(); //Loads environment variables from a .env file if we need this. May be useful for local testing vs server.

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

app.get('/', (req, res) => {
    res.send('<h1>NC Voter Search</h1>');
});

app.use('/pg', pgRouter)

app.get('/api/health', (req, res) => {
    res.json({ uptime: process.uptime(), message: 'OK', timestamp: Date.now() });
});

app.get('/api/search', (req, res) => {
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

//const PORT = process.env.PORT || 3000;
const PORT = 3000;
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

//module.exports = app;