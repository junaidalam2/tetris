const csv = require('csv-parser')
const { parse } = require("csv-parse");
const fs = require('fs')
const readline = require('readline');
const results = [];
let objectArrayScores = []
const highScoreListLowerLimit = 10


function readlineA() {

  const stream = fs.createReadStream("./db.csv");
  const rl = readline.createInterface({ input: stream });

  rl.on("line", (row) => {
    results.push(row.split(","));
  });
  
  rl.on("close", () => {
    console.log(results);
  });

  }




function determineRank(objectArrayScores) {

  let rankValue = 1;
  let highScoreArray = [];

  //console.log(resultsArray)
  objectArrayScores[0].rank = rankValue;
  highScoreArray.push({ rank: rankValue, name: objectArrayScores[0].name, score: objectArrayScores[0].score, lines: objectArrayScores[0].lines_cleared, level: objectArrayScores[0].level });
  
  //console.log(resultsArray[0])
  for(let i = 1; i < objectArrayScores.length; i++) {
    
    if(objectArrayScores[i - 1].score > objectArrayScores[i].score) {
      rankValue++;
    } else if (objectArrayScores[i - 1].lines_cleared < objectArrayScores[i].lines_cleared) {
      rankValue++;
    }

    if(rankValue === highScoreListLowerLimit + 1) break;
    //let nameText =  objectArrayScores[i].name;
    //console.log(objectArrayScores.name)

    highScoreArray.push({ rank: rankValue, name: objectArrayScores[i].name, score: objectArrayScores[i].score, lines: objectArrayScores[i].lines_cleared, level: objectArrayScores[i].level });

  }

  // console.log(resultsArray)
  //return resultsArray
  //console.log(highScoreArray)
  //console.log(typeof highScoreArray)
  return highScoreArray;

}


function sortArray(objectArray) {

  objectArray.sort(function(left, right) {
      const score = parseInt(left.score) - parseInt(right.score);
      const lines = parseInt(left.lines_cleared) - parseInt(right.lines_cleared);
      const name = left.name.localeCompare(right.name);
      return -score || lines || name;
  });

  //console.log(objectArray)
  return determineRank(objectArray)
  //return results;

}


function readDb() {

  let results = []

  fs.createReadStream('db.csv')
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on('data', (row) => {results.push(row)})
  .on('end', () => {
    //console.log(typeof results)
    //console.log(results)
    return sortArray(results);
    //console.log(results)
    //console.log(typeof results)
    //return results;
  })
}




async function obtainTopTen() {

  //objectArrayScores = readDb();
  console.log(readDb());
  
  //resultElements = JSON.parse(JSON.stringify(resultElements)) 
  //console.log(resultElements);
  
  //sortArray(objectArrayScores)
  //determineRank()
  //console.log(objectArrayScores);

}
obtainTopTen()



/*
fs.createReadStream("db.csv", { encoding: "utf-8" })
  .on("data", (chunk) => {
    console.log(chunk);
  })
  .on("error", (error) => {
    console.log(error);
  });
*/

function obtainId() {
    
    let numberOfRows;
    
    fs.createReadStream('db.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        numberOfRows = results.length
      
        console.log(numberOfRows + 1)
        return numberOfRows + 1;
      
  })
}

//obtainId();


let data = "2,JJ,101,11,2,2023-09-12 \r\n"
//let data = "3,AJ,101,11,2,2023-09-12 \r\n"
//let data = "1,AJ,101,11,2,2023-09-12 \r\n"

//function create(name, score, lines, level) {
function create() {




    fs.appendFile("db.csv", data, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("Data saved");
  });

}

//create();