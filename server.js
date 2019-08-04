const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/', serveStatic(path.join(__dirname, '/dist')))
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('listening on ' + port);
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
console.log("[+] server started...")



/************ DATABASE **************/

const mysql = require('mysql');
const config = require('./db/config')

var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

con.connect(function (err) {
    if (err) throw err
    console.log("Connected!")
});

app.post('/api/scores', (req, res) => {
    const sql = `INSERT INTO highscores (name, score) VALUES ('${req.query.name}', ${req.query.score})`
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
        console.log("1 record inserted");
    });
})

app.get('/api/scores', (req, res) => {
    const sql = "SELECT * FROM highscores"
    con.query(sql, function (err, result, fields) {
        console.log("Result: ");
        for (let i = 0; i < result.length; i++) {
            console.log(result[i].name + ", " + result[i].score)
        }
        res.send(JSON.stringify({ "status": 200, "error": null, "response": result }))
    })
})
