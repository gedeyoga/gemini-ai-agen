import { config } from 'dotenv';
config();
import fs from 'fs';
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (credentials) {
    fs.writeFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE, credentials);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE;
}

import express from "express";
import agenRoutes from "./routes/agenRoutes.js";
import { fetchProductDigitals } from './openaccess-client.js';
const app = express();

 
app.use(express.json());

app.use('/agent', agenRoutes);

app.get('/' , (req, res) => {
  res.send('Konek Market');
})

app.listen(() => {}) 

module.exports = app;