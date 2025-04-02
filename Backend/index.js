import express from 'express';
import initApp from './src/app.router.js';
import * as dotenv from 'dotenv';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

dotenv.config()
const port = process.env.PORT;

// Initialize routes and middleware
initApp(app, express);

// Start the server
app.listen(port, () => {
    console.log(`running on port ${port}`);
});