const express = require('express');
const db = require('../services/db');
const router = express.Router();

/* GET quotes listing. */
router.get('/', async (req, res, next) => {
    try {
        const rows = await db.query('SELECT id, quote, author FROM quote');
        res.json(rows);
    } catch (err) {
        console.error(`Error while getting quotes `, err.message);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    debugger;
    const { quote, author } = req.body;
    try {
        const result = await db.query('INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *', [quote, author]);
        res.json(result);
    } catch (err) {
        next(err.detail ? err.detail : err);
    }
});

module.exports = router;
