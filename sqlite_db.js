const sqlite = require('sqlite3').verbose();
let sql;


const db = new sqlite.Database('./sqlite_score.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});


function createTable() {
    sql = 'CREATE TABLE IF NOT EXISTS tetris_score(id INTEGER PRIMARY KEY, name, score, lines_cleared, level, time_stamp)';
    db.run(sql);
}

createTable();


function dbCreateRecord(name, score, lines, level) {
    sql = 'INSERT INTO tetris_score(name, score, lines_cleared, level, time_stamp) VALUES (?, ?, ?, ?, ?)';
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    console.log(timestamp)
    db.run(sql, [name, score, lines, level, timestamp], (err) => {
        if (err) return console.error(err.message);
    });
}


function dbSelectTopTen() {
    let sql = `SELECT T.rank, T.id, T.name, T.score, T.lines_cleared, T.level 
            FROM (SELECT DENSE_RANK() OVER(ORDER BY score DESC, lines_cleared, level) rank,
            id, name, score, lines_cleared, level FROM tetris_score 
            ORDER BY rank, name DESC) AS T
            WHERE T.rank <= 10`;
    db.all(sql, (err, row) => {
        if (err) return console.error(err.message);
        row.forEach((row) => {
            console.log(row);
        });
    });
}


function dbSelectLastRecord() {
    let sql = `SELECT MAX(id) AS id FROM tetris_score`;
    db.all(sql, (err, id) => {
        if (err) return console.error(err.message);
        console.log(id);
    });
}


function dbUpdateRecord(id, name, column_name) {
    let sql = 'UPDATE tetris_score SET ? = ? WHERE id = ?';
    db.run(sql, [column_name, name, id], (err) => {
        if (err) return console.error(err.message);
    });
}


function dbDeleteRecord(id) {
    let sql = 'DELETE FROM tetris_score WHERE id = ?';
    db.run(sql, [id], (err) => {
        if (err) return console.error(err.message);
    });
}


module.exports = {

    dbSelectTopTen,
    dbSelectLastRecord,
    dbDeleteRecord,
    dbCreateRecord,
    dbUpdateRecord,

};



