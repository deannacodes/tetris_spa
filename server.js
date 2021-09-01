const express = require('express')
const session = require('express-session')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()


app.use(express.json())
app.use(express.urlencoded())

app.use('/', serveStatic(path.join(__dirname, '/dist')))
const port = process.env.PORT || 8080
app.listen(port)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("[+] server started on port " + port)



/************ DATABASE **************/

const config = require('./db/config')
const MySQLStore = require('express-mysql-session')(session)
const dbOptions = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
}

const sessionStore = new MySQLStore(dbOptions);

app.use(session({
    secret: '###',
    store: sessionStore,
    moves: "",
    score: 0
}));


/************ API CALLS **************/

app.post('/api/newgame', (req, res) => {
    req.session.score = 0
    req.session.moves = ""
    printSession(req)
    res.sendStatus(200)
})

app.post('/api/moves', (req, res) => {
    const multiplier = req.query.score
    const currentScore = req.session.score
    const moveScore = calculateMoveScore(req.query.score)

    req.session.moves = req.session.moves.concat(multiplier)
    req.session.score = parseInt(parseInt(moveScore) + parseInt(currentScore))

    printSession(req)

    res.status(200).json({ 'moveScore': moveScore })    
})

app.post('/api/scores', (req, res) => {
    const sessionScore = req.session.score
    const queryScore = req.query.score
    const sessionMoves = req.session.moves
    const queryMoves = req.query.game
    if ((queryScore != 0) && (sessionScore == queryScore) && (sessionMoves == queryMoves)) {
        const sql = `INSERT INTO highscores (name, score) VALUES ('${req.query.name}', ${queryScore})`
        sessionStore.query(sql, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
        })
    } else {
        res.sendStatus(403)
    }
})

app.get('/api/scores', (req, res) => {
    const sql = "SELECT * FROM highscores"
    sessionStore.query(sql, function (err, result, fields) {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": result }))
    })
})


/************ SCORES **************/

function calculateMoveScore(multiplier) {
    let add = 0
    switch (parseInt(multiplier)) {
        case 1:
            add = 40
            break
        case 2:
            add = 100
            break
        case 3:
            add = 300
            break
        case 4:
            add = 1200
            break
        default:
            add = 0

    }
    return add
}

function printSession(req) {
    console.log("Session Score: " + req.session.score)
    console.log("Session Moves: " + req.session.moves) 
}