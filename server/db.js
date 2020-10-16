const mysql = require("mysql");

const db = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "b360f36862cedc",
    password: "539c17bb",
    database: "heroku_693f8cf2c9f86d5",
    insecureAuth: true
})

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("db connected");
    }
})

const Query = (q, params) => {
    return new Promise((resolve, reject) => {
        db.query(q, params, (err, results) => {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports = Query;