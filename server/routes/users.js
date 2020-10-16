const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const Query = require('../db');
const e = require('express');

//Register - POST /register
router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, username, password, role } = req.body;
        if (first_name && last_name && username && password) {
            if (!role) {
                role = "user";
            }
            let user = await Query(`SELECT * FROM users WHERE username = ?`, username);
            if (!user.length) {
                const salt = genSaltSync();
                const hash = hashSync(password, salt);
                let q = `INSERT INTO users (first_name, last_name, username, password, role)
                VALUES (?, ?, ?, ?, ?)`;
                await Query(q, [first_name, last_name, username, hash, role]);
                res.status(201).json({ error: false, msg: "New user added successfully", hash });
            } else {
                res.status(400).json({ error: true, msg: "Username already taken" });
            }
        } else {
            res.status(400).json({ error: true, msg: "Missing info" });
        }
    } catch (err) {
        res.sendStatus(500);
    }
})

//Login - POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            let q = `SELECT * FROM users WHERE username = ?`;
            let user = await Query(q, [username]);
            if (user.length) {
                if (compareSync(password, user[0].password)) {
                    const { id, first_name, last_name, role } = user[0];
                    let access_token = jwt.sign({ id, first_name, last_name, username, role }, "kingTamir", {
                        expiresIn: "10m"
                    });
                    res.status(200).json({ error: false, msg: "Logged In", access_token, password: user[0].password });
                } else {
                    res.status(401).json({ error: true, msg: "User or password invalid" });
                }
            } else {
                res.status(401).json({ error: true, msg: "User or password invalid" });
            }
        } catch (err) {
            res.sendStatus(500);
        }
    } else {
        res.status(400).json({ error: true, msg: "Missing info" });
    }
})

module.exports = router;