import {
    
    //basic gameplay
    startButton,
    endButton,
    linesToCompleteLevel,
    baseScore,
    lineScoreFactor,
    tetrominoNameArray,
    tetrominoShapesHash,
    timeFactorBetweenLevelsToTen,
    linearTimeFactorBetweenLevelsPostTen,
    minimumTimeInterval,
    startingDropInterval,
    hardDropInterval,
    startPositionHash,
    gameboard,
    canvasArrayNext,
    tetroPositionNextHash,
    canvasArrayHold,
    tetroPositionHoldHash,

} from './constants.js'; 

import {

    draw,

} from './render.js';

import {

    playbackBackgroundAudio,
    audioVariablesHash,
    playSoundEffect,
    stopBackgroundAudio,
    playbackRateBackgroundAudio,
    stopMuskAudioAll,
    playMuskAudioAll,
    pauseResumeMusk,

} from './audio.js';

import {

    renderMuskRestart,

} from './renderMusk.js';

import {} from './modal.js'; // to allow event listners in modal.js to function

import {

    sendScoreToServer,
    highScoreTableSetup,
    enableHighScoreButtons,
    updateLastGameId

} from './highscore.js'


export const player = {

    position: { x: null, y: null }, 
    currentTetro: { name: null, array: null, harddrop: false },
    nextTetro: { name: null, array: null },
    heldTetro: { name: null, array: null },
    ghostTetro: { position: { x: null, y: null }},
    heldTetroStatus: { firstSlot: 'open', secondSlot: 'open' },
    metrics: { score: 0, linesCleared: 0, level: 0 }, 

};


export const game = {

    gameSequence: {

        gameOn: false,
        gameStartedFlag: false,
        firstGameStartedFlag: false,
        acceptUserInputMoves: false,
        gamePaused: false,
        endGameFlag: false,

    },
    tetro: {

        timeCounterAfterLastDrop: 0,
        currentDropTimeCounter: 0,
        updateForNextTetro: false,
        firstTetroFlag: true,
        removeRowsFlag: false,

    },
    render: { 

        gameRenderFlag: true, 
        renderPostShake: false, 
        gamePausedTextDrawn: false, 
        endGameAlpha: 0, 
        backgroundFunctionCalled: false, 
        clickStartText: { functionCalledFlag: false, setIntervalIdText: null, setIntervalIdBg: null },
        startGameRender: { startCountFlag: false, startCountComplete: false },
    
    },
    highScore: { 

        dataSentToServer: false, 
        dataReceivedFromServer: false, 
        idDataReceivedFromServer: false, 
        highScoreIdArray: [], 
        lastGameScoreId: null, 
        exitModalOnNewHighScore: false, 
        name: null,

    },
    modal: { open: false, startedOnPause: false },
};


function getTetroArray(tetroName) {

    switch(tetroName) {
        case 't': {
            return tetrominoShapesHash.t;
            break;
        }
        case 'o': {
            return tetrominoShapesHash.o;
            break;
        }
        case 'i': {
            return tetrominoShapesHash.i;
            break;
        }
        case 'l': {
            return tetrominoShapesHash.l;
            break;
        }
        case 'j': {
            return tetrominoShapesHash.j;
            break;
        }
        case 'z': {
            return tetrominoShapesHash.z;
            break;
        }
        case 's': {
            return tetrominoShapesHash.s;
            break;
        }
        default: {
            return tetrominoShapesHash.t;
        }
    }
}


function getStartingPosition(tetroName) {

    switch(tetroName) {
        case 'o': {
            return {x: startPositionHash.o.x, y: startPositionHash.o.y};
            break;
        }
        case 'i': {
            return {x: startPositionHash.i.x, y: startPositionHash.i.y};
            break;
        }
        default: {
            return {x: startPositionHash.default.x, y: startPositionHash.default.y};
        }
    }
}


function transposeTetroArray(direction, tetroArray) {
    
    for (let y = 0; y < tetroArray.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                tetroArray[x][y],
                tetroArray[y][x],
            ] = [
                tetroArray[y][x],
                tetroArray[x][y],
            ];
        }
    }

    if (direction === "clockwise") {
        tetroArray.forEach(row => row.reverse());
    } else {
        tetroArray.reverse();
    }
}

 
function collisionDetection(gameboard, tetroArray, positionHash) {
        
    for (let row = 0; row < tetroArray.length; row++) {
        for (let column = 0; column < tetroArray[row].length; column++) {
            if (tetroArray[row][column] !== 0 
                && (gameboard[row + positionHash.y] 
                && gameboard[row + positionHash.y][column + positionHash.x]) !== 0) {
                    return true;
            }
        } 
    } 

    return false;
}


function findGhostTetroPosition(gameboard, player) {

    player.ghostTetro.position.x = player.position.x;
    player.ghostTetro.position.y = player.position.y; 

    while(!collisionDetection(gameboard, player.currentTetro.array, player.ghostTetro.position)) {
        player.ghostTetro.position.y++;
    }  

    player.ghostTetro.position.y--;
    let minPositionHash = getStartingPosition(player.currentTetro.name);
    player.ghostTetro.position.y = Math.max(player.ghostTetro.position.y, minPositionHash.y);

}


function endGameLogic() {
    game.gameSequence.endGameFlag = true;
    game.gameSequence.gameOn = false;
    game.gameSequence.gamePaused = false;
    game.gameSequence.acceptUserInputMoves = false;
    playSoundEffect(audioVariablesHash.decodedAudioHash, 'endGame');
    stopBackgroundAudio();
    stopMuskAudioAll();
    document.getElementById('start-button').innerHTML = "Start";
    
    if(!game.highScore.dataSentToServer) {
        sendScoreToServer();
        game.highScore.dataSentToServer = true;
    }

    //clearHighScoreTable();
    game.highScore.dataReceivedFromServer = false;
    //game.highScore.idDataReceivedFromServer = false;
    highScoreTableSetup();
    //receiveLastIdfromServer();
}


function bindTetroToBoard(gameboard, player) {  // fixes tetro in its current position
    
    let bindTetroFlag = false;
    
    player.currentTetro.array.forEach((row, y) => {
        row.forEach((element, x) => {
            if (element !== 0) {
                if(gameboard[y + player.position.y][x + player.position.x]) {
                    endGameLogic()
                }

                gameboard[y + player.position.y][x + player.position.x] = element;
                bindTetroFlag = true;
            }
        });
    });

    if(bindTetroFlag && !game.gameSequence.endGameFlag) {
        playSoundEffect(audioVariablesHash.decodedAudioHash, 'boundTetro')
    }
}


function removeRowsShakeTimer(removedRowCounter) {
    let milliseconds = Math.min(700, Math.max(removedRowCounter * 200 - 100, 0));
    setTimeout(function() {game.tetro.removeRowsFlag = false}, milliseconds);
    playSoundEffect(audioVariablesHash.decodedAudioHash, 'clearLine')
}


function detectFullRows(gameboard) {

    let numberOfCols = gameboard[0].length;
    let removedRowCounter = 0;
    for(let y = 0; y < gameboard.length; y++) {
        for(let x = 0; x < gameboard[y].length; x++) {
            if (gameboard[y][x] === 0) {
                break;
            } else if (x == gameboard[y].length - 1) {
                gameboard.splice(y, 1);
                let rowArray = new Array(numberOfCols).fill(0);
                gameboard.unshift(rowArray);
                game.tetro.removeRowsFlag = true;
                removedRowCounter++;
            };
        };

    };
    
    if(game.tetro.removeRowsFlag) {
        removeRowsShakeTimer(removedRowCounter);
    }    

    return removedRowCounter;
}


function updateScore(removedRowCounter, player) {

    let numberOf4Lines =  Math.floor(removedRowCounter / 4);
    let remainingLines = Math.max(removedRowCounter - numberOf4Lines * 4, 0);
    let numberOf3Lines = Math.floor(remainingLines / 3);
    remainingLines = Math.max(remainingLines - numberOf3Lines * 3, 0);
    let numberof2Lines = Math.floor(remainingLines / 2);
    let numberOf1Lines = Math.max(remainingLines - numberof2Lines * 2, 0);
    let scoreToAdd = numberOf4Lines * 4 * baseScore * lineScoreFactor[3] * (player.metrics.level + 1)
                    + numberOf3Lines * 3 * baseScore * lineScoreFactor[2] * (player.metrics.level + 1)
                    + numberof2Lines * 2 * baseScore * lineScoreFactor[1] * (player.metrics.level + 1)
                    + numberOf1Lines * baseScore * lineScoreFactor[0] * (player.metrics.level + 1);
    player.metrics.score += scoreToAdd;
}


function clearCanvasArray(canvasArray) {
    canvasArray.forEach((row, y) => {
        canvasArray[y] = row.fill(0);
    })
}


function placeTetroInCanvasArray(canvasArray, tetroArray, positionHash) {
    tetroArray.forEach((row, rowIndex) => {
        row.forEach((element, colIndex) => {
            if (element !== 0) {
                canvasArray[positionHash.y + rowIndex][positionHash.x + colIndex] = element;
            }
        })
    })
}


function updateStaticCanvas(canvasArray, tetroArray, positionHash) {
    clearCanvasArray(canvasArray);
    placeTetroInCanvasArray(canvasArray, tetroArray, positionHash);
}


export function regexNumberWithComma(integer) {

    return integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function updateScoreHTML() {
    document.getElementById('score').innerHTML = regexNumberWithComma(player.metrics.score)
    document.getElementById('lines').innerHTML = player.metrics.linesCleared.toString();
    document.getElementById('level').innerHTML = player.metrics.level.toString();
}


function updateHeldTetroStatus(player) {
    if(player.heldTetroStatus.firstSlot === 'out') {
        player.heldTetroStatus.firstSlot = 'in';
        player.heldTetroStatus.secondSlot = 'open';
    }
}


function dropTetro() {

    player.position.y++;

    if (collisionDetection(gameboard, player.currentTetro.array, player.position)) {
        player.position.y--;
        bindTetroToBoard(gameboard, player);
        game.tetro.updateForNextTetro = true;
    }

    game.tetro.currentDropTimeCounter = 0;
    findGhostTetroPosition(gameboard, player);
}


function moveTetroHorizontal(direction) {
    
    let increment = 1;
    if(direction === 'Left'){
        increment = -1;
    }

    if(!player.currentTetro.harddrop) {
        player.position.x += increment;
        if (collisionDetection(gameboard, player.currentTetro.array, player.position)) {
            player.position.x -= increment;
        }
    }

    findGhostTetroPosition(gameboard, player);
}


function rotateTetro(direction) {

    /* if a player rotates at the starting position and collisions in all scenarios, the while loop below 
    will not exit. If statement below to rectify. */
    let assignedStartPosition = getStartingPosition(player.currentTetro.name)
    if(player.position.x === assignedStartPosition.x && player.position.y === assignedStartPosition.y  
        && collisionDetection(gameboard, player.currentTetro.array, player.position)) {
        endGameLogic();
        return
    }
    
    transposeTetroArray(direction, player.currentTetro.array);

    let xCoordinateBeforeRotation = player.position.x;
    let xAxisOffset = 1;  // used to 'push off' from wall or another piece upon rotation
    
    while(collisionDetection(gameboard, player.currentTetro.array, player.position)) { 

        player.position.x += xAxisOffset;
        xAxisOffset = -(xAxisOffset + (xAxisOffset > 0 ? 1 : -1));
        
        if (Math.abs(xAxisOffset) > player.currentTetro.array[0].length) {
            player.position.x = xCoordinateBeforeRotation;
            if (direction === "clockwise") { 
                direction = "counterclockwise";
            } else {
                direction = "clockwise";
            }

            transposeTetroArray(direction, player.currentTetro.array);
        }
    }

    playSoundEffect(audioVariablesHash.decodedAudioHash, 'rotate')
    findGhostTetroPosition(gameboard, player);
}


function selectTetro(tetrominoNameArray) {

    let randomIndex = Math.floor(Math.random() * tetrominoNameArray.length);
    let tetroName = tetrominoNameArray[randomIndex];
    return tetroName;
}


function holdTetro() {

    if(player.heldTetroStatus.secondSlot !== 'open') {
        return;
    }

    if(player.heldTetroStatus.firstSlot === 'open') {
  
        player.heldTetro.name = player.currentTetro.name;
        player.heldTetro.array = getTetroArray(player.heldTetro.name);
        player.currentTetro.name = player.nextTetro.name;        
        player.currentTetro.array = player.nextTetro.array;
        player.nextTetro.name = selectTetro(tetrominoNameArray);
        player.nextTetro.array = getTetroArray(player.nextTetro.name);
        player.heldTetroStatus.firstSlot = 'in';
        updateStaticCanvas(canvasArrayNext, player.nextTetro.array, tetroPositionNextHash);
    } else {
        
        [player.currentTetro.name, player.heldTetro.name] = [player.heldTetro.name, player.currentTetro.name];
        player.currentTetro.array = getTetroArray(player.currentTetro.name);
        player.heldTetro.array = getTetroArray(player.heldTetro.name);
        player.heldTetroStatus.secondSlot = 'in';
        player.heldTetroStatus.firstSlot = 'out';
    }

    playSoundEffect(audioVariablesHash.decodedAudioHash, 'holdTetro')
    player.position = getStartingPosition(player.currentTetro.name);
    updateStaticCanvas(canvasArrayHold, player.heldTetro.array, tetroPositionHoldHash);
    findGhostTetroPosition(gameboard, player);
}


function setupCanvasNext() {
        
    player.nextTetro.name = selectTetro(tetrominoNameArray);
    player.nextTetro.array = getTetroArray(player.nextTetro.name);
    updateStaticCanvas(canvasArrayNext, player.nextTetro.array, tetroPositionNextHash);
}


function moveNextToGameboard(player) {

    player.currentTetro.name = player.nextTetro.name;
    player.currentTetro.array = getTetroArray(player.currentTetro.name);
    player.nextTetro.name = selectTetro(tetrominoNameArray);
    player.nextTetro.array = getTetroArray(player.nextTetro.name);
}


function checkDropConditions(time, player, game) {

    let dropTimeInterval = null;

    if (player.currentTetro.harddrop) {
        dropTimeInterval = hardDropInterval;
        playSoundEffect(audioVariablesHash.decodedAudioHash, 'hardDrop');
    } else {
        dropTimeInterval = Math.max(startingDropInterval * (timeFactorBetweenLevelsToTen ** Math.min(player.metrics.level, 10)) 
        - linearTimeFactorBetweenLevelsPostTen * Math.max(player.metrics.level -10, 0), minimumTimeInterval);
    }

    const deltaTime = time - game.tetro.timeCounterAfterLastDrop;
    game.tetro.timeCounterAfterLastDrop = time; 
    game.tetro.currentDropTimeCounter += deltaTime;
    if (game.tetro.currentDropTimeCounter > dropTimeInterval) {
        return true;
    }
}


function updateGameStats(player) {

    let removedRowCounter = detectFullRows(gameboard);
    if (removedRowCounter) {
        let previousLevel = player.metrics.level
        updateScore(removedRowCounter, player);
        player.metrics.linesCleared += removedRowCounter;
        player.level = Math.floor(player.metrics.linesCleared / linesToCompleteLevel);
        updateScoreHTML();

        if(previousLevel < player.metrics.level) {
            playSoundEffect(audioVariablesHash.decodedAudioHash, 'newLevel');
            playbackRateBackgroundAudio();
        }
    }
}


function updateGameboardForFirstTetro() {

    moveNextToGameboard(player);
    player.position = getStartingPosition(player.currentTetro.name);
    updateStaticCanvas(canvasArrayNext, player.nextTetro.array, tetroPositionNextHash);
    findGhostTetroPosition(gameboard, player);
}


function updateAllForNextTetro() {

    updateGameStats(player);
    updateHeldTetroStatus(player);
    moveNextToGameboard(player);
    updateStaticCanvas(canvasArrayNext, player.nextTetro.array, tetroPositionNextHash);
    player.position = getStartingPosition(player.currentTetro.name);
    player.currentTetro.harddrop = false;
    findGhostTetroPosition(gameboard, player);
}


document.querySelectorAll("button").forEach( function(item) { // ensures space bar cannot activate buttons
    item.addEventListener('focus', function() {
        this.blur();
    })
})


window.addEventListener("keydown", function(e) { // ensures keys do not scroll through page
    
    if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);


window.onkeydown = function(e) { // activate for input box, disallow for entire screen (i.e. scrolling)
    
    // 32 = space, 37 = left arrow, 39 = right arrow
    if(e.keyCode == 32 && e.target == document.body) { 
        e.preventDefault();
        return false;
    }

    if(e.keyCode == 37 && e.target == document.body) {
        e.preventDefault();
        return false;
    }

    if(e.keyCode == 39 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};


const startAndPauseGame = function() {

    if(game.gameSequence.gamePaused || !game.gameSequence.gameStartedFlag) {
        
        if(game.gameSequence.gamePaused) {
            pauseResumeMusk();
            game.gameSequence.acceptUserInputMoves = true;

        } else {
            playMuskAudioAll();
        }
        
        game.gameSequence.gamePaused = false;
        game.gameSequence.gameOn = true;
        game.render.gameRenderFlag = true;
        document.getElementById('start-button').innerHTML = "Pause";
        game.render.gamePausedTextDrawn = false;

        if(!game.gameSequence.gameStartedFlag && audioVariablesHash.soundOn) {
            playbackBackgroundAudio();
        }

        if(!audioVariablesHash.soundOn && audioVariablesHash.onAtGamePause){
            playbackBackgroundAudio();
            audioVariablesHash.onAtGamePause = false;
            audioVariablesHash.soundOn = true;
            playSoundEffect(audioVariablesHash.decodedAudioHash, 'unpause');
        }

    } else if (!game.gameSequence.gamePaused) {
        game.gameSequence.gamePaused = true;
        game.gameSequence.gameOn = false;
        game.render.gameRenderFlag = false;
        game.gameSequence.acceptUserInputMoves = false;
        document.getElementById('start-button').innerHTML = "Resume";
        pauseResumeMusk();

        if(audioVariablesHash.soundOn){
            playbackBackgroundAudio();
            audioVariablesHash.onAtGamePause = true;
            playSoundEffect(audioVariablesHash.decodedAudioHash, 'pause');
        }
    }
}


export const PauseResume = function() {
    if(!game.gameSequence.endGameFlag && game.gameSequence.gameStartedFlag){
         startAndPauseGame();
    }
}


startButton.addEventListener('click', () => {
    if(!game.modal.open) {
        if(game.gameSequence.endGameFlag) { // when game ends and user starts a new game
            resetGame();
            playbackBackgroundAudio();
            playMuskAudioAll();
            document.getElementById('start-button').innerHTML = "Pause";
        } else {
            startAndPauseGame();
        }
    }
})


endButton.addEventListener('click', () => {
    if(!game.gameSequence.endGameFlag && !game.modal.open && game.gameSequence.firstGameStartedFlag) {
        endGameLogic();
    }
})


window.mobileCheck = function() {
     let mobileFlag = false;
     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) mobileKeys = true;})(navigator.userAgent||navigator.vendor||window.opera);

     if(mobileFlag) {
       
        let mobileKeys = document.querySelector(".mobile-keys");
        mobileKeys.computedStyleMap.display = "block";
     
        let desktopKeys = document.querySelector(".desktop-keys");
        desktopKeys.computedStyleMap.display = "none";
    }
    
     return mobileFlag;
};


document.addEventListener('keydown', KeyboardEvent => {
    
    let keysPressed = KeyboardEvent.key
    
    if(window.mobileCheck() === true) { // keys for mobile
        if(game.gameSequence.acceptUserInputMoves){
            switch(keysPressed) {
                case "4": {
                    moveTetroHorizontal('Left');
                    break;
                }
                case "6": { 
                    moveTetroHorizontal('Right');
                    break;
                }
                case "5": { 
                    dropTetro();
                    break;
                }
                case "7":
                case "2":
                case "*": {
                    rotateTetro("clockwise");
                    break;
                }
                case "9": 
                case "#": {
                    rotateTetro("counterclockwise");
                    break;
                }
                case "0": {
                    holdTetro();
                    break;
                }
                case "2": {
                    player.currentTetro.harddrop = true;
                    break;
                }
            }
        }

        switch(keysPressed) {
            case "1":
            case "3": {
                PauseResume()
                break;
            }
        }

    } else {
        if (KeyboardEvent.ctrlKey && (KeyboardEvent.key === 'z' || KeyboardEvent.key === 'Z')) {
            keysPressed = "counterclockwise";
        } else if (KeyboardEvent.shiftKey && (KeyboardEvent.key === 'c' || KeyboardEvent.key === 'C')) {
            keysPressed = "hold";
        }

        if(game.gameSequence.acceptUserInputMoves){
            switch(keysPressed) {
                case "ArrowLeft": 
                case "4": {
                    moveTetroHorizontal('Left');
                    break;
                }
                case "ArrowRight": 
                case "6": { 
                    moveTetroHorizontal('Right');
                    break;
                }
                case "ArrowDown":  
                case "2": { 
                    dropTetro();
                    break;
                }
                case "ArrowUp": 
                case "X":
                case "x":
                case "1":
                case "5":
                case "9": {
                    rotateTetro("clockwise");
                    break;
                }
                case "3":  
                case "7":
                case "counterclockwise": {
                    rotateTetro("counterclockwise");
                    break;
                }
                case "0":
                case "hold": {
                    holdTetro();
                    break;
                }
                case "8":
                case " ":
                case "Space Bar": {
                    player.currentTetro.harddrop = true;
                    break;
                }
            }
        }

        switch(keysPressed) {
            case "Escape":
            case "F1":
            case "p":
            case "P": {
                if(!game.modal.open) {PauseResume()};
                break;
            }
        }
    }
});


function resetGame() {

    player.position.x = null; 
    player.position.y = null; 
    player.currentTetro.name = null;
    player.currentTetro.array = null;
    player.nextTetro.name = null;
    player.nextTetro.array = null;
    player.heldTetro.name = null;
    player.heldTetro.array = null;
    player.ghostTetro.position.x = null;
    player.ghostTetro.position.y = null;
    player.heldTetroStatus.firstSlot = 'open'; 
    player.heldTetroStatus.secondSlot = 'open'; 
    player.metrics.score = 0;
    player.metrics.linesCleared = 0;
    player.metrics.level = 0;
    player.currentTetro.harddrop = false;

    game.gameSequence.gameOn = true;
    game.gameSequence.gameStartedFlag = false;
    game.gameSequence.acceptUserInputMoves = false;
    game.gameSequence.gamePaused = false;
    game.gameSequence.endGameFlag = false;
    game.tetro.timeCounterAfterLastDrop = 0;
    game.tetro.currentDropTimeCounter = 0;
    game.tetro.updateForNextTetro = false;
    game.tetro.firstTetroFlag = true;
    game.tetro.removeRowsFlag = false;
    game.render.gameRenderFlag = true;
    game.render.renderPostShake = false;
    game.render.gamePausedTextDrawn = false;
    game.render.endGameAlpha = 0;
    game.render.startGameRender.startCountFlag = false;
    game.render.startGameRender.startCountComplete = false;
    game.highScore.dataSentToServer = false;
    game.highScore.exitModalOnNewHighScore = false;
    game.highScore.highScoreIdArray = [];
    game.highScore.name = null;
    game.modal.open = false;
    game.modal.startedOnPause = false;

    clearCanvasArray(gameboard);
    clearCanvasArray(canvasArrayNext);
    clearCanvasArray(canvasArrayHold);
    updateScoreHTML();
    document.getElementById('start-button').innerHTML = "Start";
    renderMuskRestart();
    enableHighScoreButtons();
    game.highScore.idDataReceivedFromServer = false;
    updateLastGameId();

}


function update(time = 0) {

    if(!game.gameSequence.firstGameStartedFlag) {
        highScoreTableSetup();
        updateLastGameId();

    }

    if(game.gameSequence.gameOn && !game.gameSequence.endGameFlag) {

        if(!game.gameSequence.gameStartedFlag) {
            setupCanvasNext();
            game.render.startGameRender.startCountFlag = true;
            game.gameSequence.gameStartedFlag = true;
            game.gameSequence.firstGameStartedFlag = true;
        }

        if(game.render.startGameRender.startCountComplete) {
    
            if(game.tetro.firstTetroFlag) {
                updateGameboardForFirstTetro();
                game.tetro.firstTetroFlag = false;
                game.gameSequence.acceptUserInputMoves = true;
            } 
             
            if(checkDropConditions(time, player, game)) {
                dropTetro();
            }

            if(game.tetro.updateForNextTetro) {
                updateAllForNextTetro();
                game.tetro.updateForNextTetro = false;       
            }
        }
    }
    
    draw();
    requestAnimationFrame(update);
}


update();
