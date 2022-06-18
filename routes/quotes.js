const express = require('express');
const db = require('../services/db');
const router = express.Router();

/* GET quotes listing. */
router.get('/', async (req, res, next) => {
    try {
        const rows = await db.query('SELECT id, quote, author FROM quote');
        // res.json(rows);
        res.render('quotes', {
            title: "Quotes",
            rows,
            meta: {
                page: rows.length
            }
        });
    } catch (err) {
        console.error(`Error while getting quotes `, err.message);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    debugger;
    const { quote, author } = req.body;
    const result = await db.query('INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *', [quote, author]);

    if (!result.length) {
        res.json(result);
        return;
    } else {
        res.redirect("/quotes");
    }
});

module.exports = router;
