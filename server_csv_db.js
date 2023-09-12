const csv = require('csv-parser')
const { parse } = require("csv-parse");
const fs = require('fs')
const readline = require('readline');
const results = [];


let sortedArray = [];



function sortArray() {


    results.sort(function(left, right) {
        const score = parseInt(left.score) - parseInt(right.score);
        const lines = parseInt(left.lines_cleared) - parseInt(right.lines_cleared);
        const name = left.name.localeCompare(right.name);
        return -score || lines || name;
    });


    console.log(results)

}




fs.createReadStream('db.csv')
  //.pipe(csv())
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on('data', (row) => {
    
    console.log(row)
    results.push(row)
    console.log(results)
    console.log('^^^^^')

    })
  .on('end', () => {
    
    /*
    sortedArray = results
    
    console.log('------')
    console.log(results)
    
    sortedArray.sort(function(left, right) {
        const score = parseInt(left.score) - parseInt(right.score);
        const lines = parseInt(left.lines_cleared) - parseInt(right.lines_cleared);
        const name = left.name.localeCompare(right.name);
        return -score || lines || name;
    });

    //console.log(sortedArray)
    return results;
    */
    console.log('finished');
    console.log('------')
    console.log(results)
    //sortArray();

})






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

obtainId();


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