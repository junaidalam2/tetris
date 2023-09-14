
import {

    player,
    game,
    regexNumberWithComma,

} from './main.js'

import {

    modalScore,
    exitScoreBtnModal,
    submitScoreForm,
    submitScoreBtn,
    deleteScore,
    scorePostRoute,
    scoreDeleteRoute,
    scoreUpdateRoute,
    getLastPlayerIdRoute,
    getTopScoresRoute,
    defaultName,
    rowColorOnHighScore,
    namePlaceholderOnHighScore,
    titleOnHighScore,
    titleDefault,
    disabledBtnFontColor,
    disabledBtnBgColor,
    enabledBtnFontColor,
    enabledBtnBgColor,
    scoreInputSection,
    titleDisplay,
    tableDisplay,

} from './constants.js'; 

import {

    closeModalScore,
    openModal,

} from './modal.js'


export function sendScoreToServer() {

    fetch(scorePostRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: defaultName,
                score: player.metrics.score,
                lines_cleared: player.metrics.linesCleared,
                level: player.metrics.level
            })
        }).then(res => {
        return res.json()
        })
        .catch(error => console.log(error));
}


function deleteRequestToServer() {

    fetch(scoreDeleteRoute, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: game.highScore.lastGameScoreId,
            })
        }).then(res => {
        return res.json();
        })
        .catch(error => console.log(error));
}


function updateNameToServer() {

    fetch(scoreUpdateRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: game.highScore.lastGameScoreId,
                name: game.highScore.name,
                column_name: 'name',
            })
        }).then(res => {
        return res.json();
        })
        .catch(error => console.log(error));
}


export function exitModalOnNewHighScore() {

    if(game.highScore.exitModalOnNewHighScore) {
        scoreInputSection.style.display = "none";
        titleDisplay.innerHTML  = titleDefault;
        
        if(game.highScore.lastGameScoreId) {
            game.highScore.highScoreIdArray = [];
            game.highScore.lastGameScoreId = null;
            receiveScorefromServer();
        }

        game.highScore.exitModalOnNewHighScore = false;
    }
}


exitScoreBtnModal.addEventListener("click", () => {
    closeModalScore();
    exitModalOnNewHighScore();
});


function checkForHighScore() {
    
    if(game.highScore.highScoreIdArray.includes(game.highScore.lastGameScoreId)) {

        game.highScore.exitModalOnNewHighScore = true;
        let rowDisplay = document.querySelector(`.row${game.highScore.lastGameScoreId}`);
        let nameDisplay = document.querySelector(`.name${game.highScore.lastGameScoreId}`);

        rowDisplay.style.color = rowColorOnHighScore;
        nameDisplay.innerHTML  = namePlaceholderOnHighScore;
        titleDisplay.innerHTML  = titleOnHighScore;

        openModal(modalScore, "hidden-score", "hidden");
        scoreInputSection.style.display = "block";
    };
};


function receiveLastIdfromServer() {

    fetch(getLastPlayerIdRoute, {
        headers: {
            'Content-Type': 'application/json'
        }})
        .then(res => {return res.json()
        })    
        .then(data => {
             game.highScore.lastGameScoreId = data.id + 1
             //console.log(game.highScore.lastGameScoreId);
         })
        .catch(error => console.log(error));
}


function clearHighScoreTable() {
    tableDisplay.innerHTML
        = "<tr><th>Rank</th><th>Name</th><th>Score</th><th>Lines</th><th>Level</th></tr>";
}


function insertHtmlHighScore(record) {

    let htmlRow = `<tr class="row${record.id}"><td class="rank-column">` + record.rank 
        + `</td><td class="name-column name${record.id}">` + record.name 
        + '</td><td class="score-column">' + regexNumberWithComma(record.score) 
        + '</td><td class="lines-column">' + record.lines_cleared 
        + '</td><td class="level-column">' + record.level + '</td></tr>'
    tableDisplay.insertAdjacentHTML("beforeend", htmlRow);
}


function receiveScorefromServer() {

    fetch(getTopScoresRoute, {
    headers: {
        'Content-Type': 'application/json'
    }})
    .then(res => {return res.json()})    
    .then(data => {
        clearHighScoreTable();
        data.forEach((record) => {
            insertHtmlHighScore(record);
            game.highScore.highScoreIdArray.push(record.id);
        });
    })
    .then(data => {
        if(game.gameSequence.endGameFlag) {
            checkForHighScore();
        }
    })
    .catch(error => console.log(error));

}

export function updateLastGameId() {
    if(!game.highScore.idDataReceivedFromServer) {
        receiveLastIdfromServer();
        game.highScore.idDataReceivedFromServer = true;
    }
} 


export function highScoreTableSetup() {
    if(!game.highScore.dataReceivedFromServer) {
        receiveScorefromServer();
        game.highScore.dataReceivedFromServer = true;
    }
}


export function enableHighScoreButtons() {

    deleteScore.style.color = enabledBtnFontColor; 
    deleteScore.style.backgroundColor = enabledBtnBgColor;
    deleteScore.disabled = false;
    
    submitScoreBtn.style.color = enabledBtnFontColor;
    submitScoreBtn.style.backgroundColor = enabledBtnBgColor;
    submitScoreBtn.disabled = false;
}


deleteScore.addEventListener("click", ()=> {
    
    deleteScore.style.color = disabledBtnFontColor;
    deleteScore.style.backgroundColor = disabledBtnBgColor;
    deleteScore.disabled = true;
    
    submitScoreBtn.style.color = disabledBtnFontColor;
    submitScoreBtn.style.backgroundColor = disabledBtnBgColor;
    submitScoreBtn.disabled = true;
   
    deleteRequestToServer();
    game.highScore.highScoreIdArray = [];
    game.highScore.lastGameScoreId = null;
    receiveScorefromServer();
    titleDisplay.innerHTML = titleDefault;
});


submitScoreForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    let name = document.getElementById("name");
    let nameDisplay = document.querySelector(`.name${game.highScore.lastGameScoreId}`);
    game.highScore.name = name.value;
    nameDisplay.innerHTML  = name.value;
    updateNameToServer();
});
