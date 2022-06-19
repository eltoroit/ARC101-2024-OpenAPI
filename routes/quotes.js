const express = require('express');
const db = require('../services/db');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Quotes
 *   description: The quotes managing API
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       required:
 *         - quote
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the quote
 *         quote:
 *           type: string
 *           description: The actual quote
 *         author:
 *           type: string
 *           description: The quote's author
 *       example:
 *         id: 1
 *         quote: Java is to JavaScript what car is to Carpet.
 *         author: Chris Heilmann.
 */

/**
 * @openapi
 * /quotes:
 *   get:
 *     summary: Returns the list of all the quotes
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: The list of the quotes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 *       500:
 *         description: Error retrieving quotes
 */
router.get('/', async (req, res, next) => {
    try {
        const rows = await db.query('SELECT id, quote, author FROM quote');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * @openapi
 * /quotes/{id}:
 *   get:
 *     summary: Get the quote by id
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The quote's id
 *     responses:
 *       200:
 *         description: The quote description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Multiple quotes found with the same id
 *       404:
 *         description: The quote was not found
 *       500:
 *         description: Some server error
 */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const rows = await db.query('SELECT id, quote, author FROM quote WHERE id = $1', [id]);
        if (rows.length === 0) {
            res.status(404).json(rows);
        } else if (rows.length === 1) {
            res.status(200).json(rows[0]);
        } else {
            res.status(400).json(rows);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * @openapi
 * /quotes:
 *   post:
 *     summary: Create a new quote
 *     tags: [Quotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       200:
 *         description: The quote was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res, next) => {
    const { quote, author } = req.body;
    try {
        const result = await db.query('INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *', [quote, author]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * @openapi
 * /quotes/{id}:
 *  put:
 *    summary: Update the quote by the id
 *    tags: [Quotes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The quote id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Quote'
 *    responses:
 *      200:
 *        description: The quote was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Quote'
 *      400:
 *        description: Bad request
 *      404:
 *        description: The quote was not found
 *      500:
 *        description: Some server error
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { quote, author } = req.body;
        const rows = await db.query('SELECT id, quote, author FROM quote WHERE id = $1', [id]);
        if (rows.length === 0) {
            res.status(404).json(rows);
        } else if (rows.length === 1) {
            if (quote || author) {
                let sql = "UPDATE quote SET quote = $1, author = $2 WHERE id = $3";
                let data = { quote, author };
                if (!quote) data.quote = rows[0].quote;
                if (!author) data.author = rows[0].author;
                let params = [data.quote, data.author, id];
                const result = await db.query(sql, params);
                res.status(200).json(result);
            } else {
                res.status(400).json({ error: "No data provided" });
            }
        } else {
            res.status(500).json(rows);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /quotes/{id}:
 *   delete:
 *     summary: Remove the quote by id
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The quote id
 *     responses:
 *       200:
 *         description: The quote was deleted
 *       404:
 *         description: The quote was not found
 *       500:
 *        description: Some server error
 */

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await db.query('SELECT id, quote, author FROM quote WHERE id = $1', [id]);
        if (rows.length === 0) {
            res.status(404).json(rows);
        } else if (rows.length === 1) {
            const result = await db.query("DELETE FROM quote WHERE id = $1", [id]);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
