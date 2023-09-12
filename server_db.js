const mysql = require('mysql');
require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    datatbase: process.env.DATABASE
});


db.connect((err) => {
    if(err) {
        console.log('Error related to database connection: ' + err);
    } else {
        console.log(`MySql connected on port ${process.env.DB_PORT}`);
    }
});


function dbConnect() {
    let sql = `USE ${process.env.DATABASE}`;
    db.query(sql, (err, result) => {
        if(err) console.log('Error connecting to database:' + err);
        console.log(result);
    });
}

dbConnect(); 


function dbSelectTopTen() {
    return new Promise((resolve, reject) => {
    let sql = `SELECT T.rank, T.id, T.name, T.score, T.lines_cleared, T.level 
            FROM (SELECT DENSE_RANK() OVER(ORDER BY score DESC, lines_cleared, level) rank,
            id, name, score, lines_cleared, level FROM tetris_score 
            ORDER BY rank, name DESC) AS T
            WHERE T.rank <= 10`;
        db.query(sql, (err, result) => {
            if(err) return reject('Error obtaining top 10 scores:' + err);
            return resolve(result);
        });
    });
};


function dbSelectLastRecord() {
    return new Promise((resolve, reject) => {
    let sql = `SELECT MAX(id) AS id FROM tetris_score`;
        db.query(sql, (err, result) => {
            if(err) return reject('Error obtaining last record:' + err);
            return resolve(result);
        });
    });
};


function dbDeleteScoreData(idValue) {
    return new Promise((resolve, reject) => {
    let sql = `DELETE FROM tetris_score WHERE id = ${idValue}`;
        db.query(sql, (err, result) => {
            if(err) return reject('Error deleting record:' + err);
            return resolve(result);
        });
    });
};


function dbInsertScoreData(nameValue, scoreValue, lines_clearedValue, levelValue) {
    let sql = `INSERT INTO	tetris_score (name, score, lines_cleared, level) VALUES 
        ('${nameValue}', '${scoreValue}', '${lines_clearedValue}', '${levelValue}')`;
    db.query(sql, (err, result) => {
        if(err) console.log('Error inserting high score to database:' + err);
        console.log(result);
    });
}


function dbUpdateScoreData(idValue, fieldValue, fieldName) {
    let sql = `UPDATE tetris_score SET ${fieldName} = "${fieldValue}" WHERE id = ${idValue}`;
    db.query(sql, (err, result) => {
        if(err) console.log('Error updating database:' + err);
        console.log(result);
    });
}


module.exports = {

    dbSelectTopTen,
    dbSelectLastRecord,
    dbDeleteScoreData,
    dbInsertScoreData,
    dbUpdateScoreData,

};
