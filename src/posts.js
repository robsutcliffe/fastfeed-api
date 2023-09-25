const express = require('express');
const http = require('serverless-http');
const app = express()

require('dotenv').config({ path: '.env' });

const { Client } = require('pg');

const connection = new Client({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    connectionTimeoutMillis: 60000
});
app.get('/posts', async (req, res) => {

    const query = `SELECT * FROM posts`;

    try {
        await connection.connect();
        const results = await connection.query(query);
        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end();
    }
});

module.exports.handler = http(app);