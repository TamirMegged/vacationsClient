const router = require('express').Router()
const moment = require('moment');
const { verifyAdmin, verifyUser } = require('../verify');
const Query = require("../db");

// Get all vacations - GET /
router.get('/', async (req, res) => {
    try {
        let q = `SELECT * FROM vacations`;
        let vacations = await Query(q);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Search a vacation - GET /search
router.put('/search', verifyUser, async (req, res) => {
    let { searchContent, start_limit, end_limit } = req.body;
    if (searchContent || start_limit || end_limit) {
        searchContent = searchContent ? searchContent : "";
        start_limit = start_limit ? moment(req.body.start_limit).add(12, 'hours').format("YYYY-MM-DD") : "";
        end_limit = end_limit ? moment(req.body.end_limit).add(12, 'hours').format("YYYY-MM-DD") : "";
        try {
            let q = `SELECT * FROM vacations
            WHERE (description LIKE '%${searchContent}%'
            OR destination LIKE '%${searchContent}%')
            AND start_date > '${start_limit}'`;
            if (end_limit) {
                q += `AND end_date < '${end_limit}'`;
            }
            let vacations = await Query(q);
            res.json(vacations);
        } catch (err) {
            res.status(400).json({ error: true, msg: "No search content" });
        }
    }
})

// Add a vacation - POST /add (admin only)
router.post('/add', verifyAdmin, async (req, res) => {
    const { image, destination, description, price } = req.body;
    const start_date = moment(req.body.start_date).add(12, 'hours').toDate();
    const end_date = moment(req.body.end_date).add(12, 'hours').toDate();
    if (image && destination && start_date && end_date && description && price) {
        let q = `INSERT INTO vacations (image, destination, start_date, end_date, description, price)
        VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            await Query(q, [image, destination, start_date, end_date, description, price]);
            let vacations = await Query(`SELECT * FROM vacations`);
            res.json(vacations);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.status(400).json({ error: true, msg: "Missing info" });
    }
})

// Initial database creation call - POST /createdatabase
router.post('/createdatabase', async (req, res) => {
    const vacations = req.body;
    vacations.map(async (vacation) => {
        const { image, destination, description, price } = vacation;
        const start_date = moment(vacation.start_date).add(12, 'hours').toDate();
        const end_date = moment(vacation.end_date).add(12, 'hours').toDate();
        if (image && destination && start_date && end_date && description && price) {
            let q = `INSERT INTO vacations (image, destination, start_date, end_date, description, price)
            VALUES (?, ?, ?, ?, ?, ?)`;
            try {
                await Query(q, [image, destination, start_date, end_date, description, price]);
                let vacations = await Query(`SELECT * FROM vacations`);
                res.json(vacations);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.status(400).json({ error: true, msg: "Missing info" });
        }
    })
})

// Edit a vacation - PUT /:id (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
    const { image, destination, start_date, end_date, description, price } = req.body;
    try {
        let q = `UPDATE vacations SET image = ?, destination = ?, start_date = ?, 
        end_date = ?, description = ?, price = ?
        WHERE id = ?`;
        await Query(q, [image, destination, start_date, end_date, description, price, req.params.id]);
        let vacations = await Query(`SELECT * FROM vacations`);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Delete a avcation - /:id (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        let q = `DELETE FROM vacations WHERE id = ?`;
        await Query(q, [req.params.id]);
        let vacations = await Query(`SELECT * FROM vacations`);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;