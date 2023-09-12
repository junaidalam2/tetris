const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());
//const dbServer = require('./server_db.js')
const dbServerSqlite = require('./sqlite_db.js');
const { resolve6 } = require('dns/promises');

// handle uncaught exceptions
process.on('uncaughtException', function (err) {
    console.log(err);
});  


app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error) console.log(`Error: ${error}`);
    console.log(`Server started on port ${PORT}.`); 
});


app.use(express.json({limit: '500kb'}));
app.post('/score_post', (req, res) => {
    console.log(req.body);
    //dbServer.dbInsertScoreData(req.body.name, req.body.score, req.body.lines_cleared, req.body.level);
    dbServerSqlite.dbCreateRecord(req.body.name, req.body.score, req.body.lines_cleared, req.body.level);
    
    res.json({status: 'Score received by server.'});
});


app.post('/score_update_post', (req, res) => {
    console.log(req.body);
    //dbServer.dbUpdateScoreData(req.body.id, req.body.name, req.body.column_name);
    dbServerSqlite.dbUpdateRecord(req.body.id, req.body.name, req.body.column_name);
    res.json({status: 'Name received by server.'});
});


app.delete('/score_delete', (req, res) => {
    console.log(req.body);
    //dbServer.dbDeleteScoreData(req.body.id);
    dbServerSqlite.dbDeleteRecord(req.body.id);
    
    res.json({status: 'Delete request received by server.'});
});


app.get('/score_get', async (req, res, next) => {
    try {
        //let resultElements = await dbServer.dbSelectTopTen();
        let resultElements = await dbServerSqlite.dbSelectTopTen();
        console.log(resultElements)
        resultElements = JSON.parse(JSON.stringify(resultElements)) 
        //console.log(resultElements)
        res.status(200).json(resultElements); 
    } catch(e) {
        console.log(e); 
        res.sendStatus(500);
    }
});


app.get('/score_last_get', async (req, res, next) => {
    try {
        //let resultElements = await dbServer.dbSelectLastRecord();
        let resultElements = await dbServerSqlite.dbSelectLastRecord();
        
        resultElements = JSON.parse(JSON.stringify(resultElements)) 
        //console.log(resultElements)
        res.status(200).json(resultElements); 
    } catch(e) {
        console.log(e); 
        res.sendStatus(500);
    }
});
