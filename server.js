const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());
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
    dbServerSqlite.dbCreateRecord(req.body.name, req.body.score, req.body.lines_cleared, req.body.level);
    
    res.json({status: 'Score received by server.'});
});


app.post('/score_update_post', (req, res) => {
    console.log(req.body);
    dbServerSqlite.dbUpdateRecord(req.body.id, req.body.name);
    res.json({status: 'Name received by server.'});
});


app.delete('/score_delete', (req, res) => {
    console.log(req.body);
    dbServerSqlite.dbDeleteRecord(req.body.id);
    
    res.json({status: 'Delete request received by server.'});
});


app.get('/score_get', async (req, res) => {
    
    try {
        let resultElements = await dbServerSqlite.dbSelectTopTen();
        resultElements = JSON.parse(JSON.stringify(resultElements));
        res.status(200).json(resultElements); 
    } catch(e) {
        console.log(e); 
        res.sendStatus(500);
    }
});


app.get('/score_last_get', async (req, res) => {

    try {
        let resultElements = await dbServerSqlite.dbSelectLastRecord();
        resultElements = JSON.parse(JSON.stringify(resultElements));
        res.status(200).json(resultElements); 
    } catch(e) {
        console.log(e); 
        res.sendStatus(500);
    }
});
