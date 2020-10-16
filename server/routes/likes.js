const router = require('express').Router();
const { verifyAdmin, verifyUser } = require('../verify');
const Query = require('../db');

// Add like - POST / (user only)
router.post('/', verifyUser, async (req, res) => {
    const { userID, vacationID } = req.body;
    if (userID && vacationID) {
        try {
            let q1 = `INSERT INTO likes (userID, vacationID)
            VALUES (?, ?)`;
            await Query(q1, [userID, vacationID]);
            let q2 = `UPDATE vacations SET followers = followers+1 WHERE id = ?`;
            await Query(q2, [vacationID]);
            res.json({ error: false, msg: "Liked" });
        } catch (err) {
            res.sendStatus(500);
        }
    } res.status(400).json({ error: true, msg: "Missing info" });
})

// Unlike - DELETE / (user only)
router.delete('/', verifyUser, async (req, res) => {
    const { userID, vacationID } = req.body;
    if (userID && vacationID) {
        try {
            let q1 = `DELETE FROM likes WHERE userID = ? AND vacationID = ?`;
            await Query(q1, [userID, vacationID]);
            let q2 = `UPDATE vacations SET followers = followers-1 WHERE id = ?`;
            await Query(q2, [vacationID]);
            res.json({ error: false, msg: "Unliked" });
        } catch (err) {
            res.sendStatus(500);
        }
    } else {
        res.status(400).json({ error: true, msg: "Missing info" });
    }
})

// Get all vacations liked by user-id - GET /liked/:id (user only)
router.get('/liked/:id', verifyUser, async (req, res) => {
    try {
        let q = `SELECT vacations.*
        FROM likes
        INNER JOIN users ON likes.userID = users.id
        INNER JOIN vacations ON likes.vacationID = vacations.id
        WHERE users.id = ?`;
        let likedVacations = await Query(q, [req.params.id]);
        res.json(likedVacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Get all vacations a user did not like - GET /rest/:id (user only)
router.get('/rest/:id', verifyUser, async (req, res) => {
    try {
        let q = `SELECT vacations.*
        FROM vacations
        WHERE NOT EXISTS (
          SELECT *
          FROM likes
          WHERE vacations.id=likes.vacationID AND likes.userID = ?
        );`
        let unlikedVacations = await Query(q, [req.params.id]);
        res.json(unlikedVacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;