const csv = require('csv-parser')
const fs = require('fs')
const results = [];


let sortedArray = [];

fs.createReadStream('db.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    //console.log(results[0]);
    sortedArray = results
    //sortedArray.sort((a, b) => (b.score.localeCompare(a.score) || a.lines_cleared - b.lines_cleared || a.name - b.name));
    sortedArray.sort((a, b) => (b.score.localeCompare(a.score) || a.lines_cleared - b.lines_cleared || a.name - b.name));
    console.log(sortedArray)
    return results;
    
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


/*

let data = "2,JJ,101,11,2,2023-09-12 \n"



fs.appendFile("db.csv", data, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("Data saved");
  });
*/