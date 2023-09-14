const sqlite = require('sqlite3').verbose();


function dbConnect() {


        const db = new sqlite.Database('./sqlite_score.db', sqlite.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        });

        return db;
  
}





function createTable() {
    const db = dbConnect();
    const sql = 'CREATE TABLE IF NOT EXISTS tetris_score(id INTEGER PRIMARY KEY, name, score, lines_cleared, level, time_stamp)';
    db.run(sql);
    db.close();
}

createTable();


function dbCreateRecord(name, score, lines, level) {
    const db = dbConnect();
    const sql = 'INSERT INTO tetris_score(name, score, lines_cleared, level, time_stamp) VALUES (?, ?, ?, ?, ?)';
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    db.run(sql, [name, score, lines, level, timestamp], (err) => {
        if (err) return console.error(err.message);
    });
    db.close();
}


function dbSelectTopTen() {
    const db = dbConnect();
    
    return new Promise((resolve, reject) => {

        const sql = `SELECT T.rank, T.id, T.name, T.score, T.lines_cleared, T.level 
                FROM (SELECT DENSE_RANK() OVER(ORDER BY score DESC, lines_cleared, level) rank,
                id, name, score, lines_cleared, level FROM tetris_score 
                ORDER BY rank, name DESC) AS T
                WHERE T.rank <= 10`;
        const resultsArray = [];
        db.all(sql, (err, row) => {
            if (err) return reject(console.error(err.message));
            row.forEach((row) => {
                resultsArray.push(row);
            });
            return resolve(resultsArray);
        });
        db.close();
    });

}


function dbSelectLastRecord() {

    const db = dbConnect();

    return new Promise((resolve, reject) => {

        const sql = `SELECT MAX(id) AS id FROM tetris_score`;
         db.get(sql, (err, id) => {
            if (err) return reject(console.error(err.message));
            console.log(id);
            return resolve(id);
        });
        db.close();
    });
}


function dbUpdateRecord(id, name) {
    const db = dbConnect();
    const sql = 'UPDATE tetris_score SET name = ? WHERE id = ?';
    db.run(sql, [name, id], (err) => {
        if (err) return console.error(err.message);
    });
    db.close();
}


function dbDeleteRecord(id) {
    const db = dbConnect();
    const sql = 'DELETE FROM tetris_score WHERE id = ?';
    db.run(sql, [id], (err) => {
        if (err) return console.error(err.message);
    });
    db.close();
}

console.log(dbSelectLastRecord() )

module.exports = {

    dbSelectTopTen,
    dbSelectLastRecord,
    dbDeleteRecord,
    dbCreateRecord,
    dbUpdateRecord,

};



