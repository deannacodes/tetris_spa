
const mysql = require('mysql');
const config = require('./config')

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  insertScore("taka", 50)
  _getScores();
});

_getScores = function () {
  const sql = "SELECT * FROM highscores"
  con.query(sql, function (err, result, fields) {
    console.log("Result: ");
    for (let i = 0; i < result.length; i++) {
      console.log(result[i].name + ", " + result[i].score)
    }
  });
}

_insertScore = function (name, score) {
  const sql = `INSERT INTO highscores (name, score) VALUES ('${name}', ${score})`
  console.log(sql)
  con.query(sql, function (err, result) {
    console.log("1 record inserted");
  });
}

exports.getScores = () => {
  this._getScores()
} 

exports.insertScore = (name, score) => {
  this._insertScore(name, score)
}

