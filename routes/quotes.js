const express = require('express');
const router = express.Router();

/* GET quotes listing. */
router.get('/', function (req, res, next) {
    // res.json({});
    res.render('quotes', {
        title: "Quotes",
        quotes: [
            {
                text: 'First, solve the problem. Then, write the code.',
                author: 'John Johnson'
            },
            {
                text: 'the quick brown fox jumped over the lazy dog.',
                author: 'IBM Mainframe'
            }
        ],
        meta: {
            page: 2
        }
    });
});

module.exports = router;
