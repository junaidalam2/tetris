import {

    //all canvases
    scaleFactor,
    gridLineColor,
    
    //gameboard
    canvasBoard,
    ctxBoard,
    tetrominoNameArray,
    tetrominoColorHash,
    gameboardColor, 
    numberOfVisibleRows,
    numberOfHiddenRows,
    numberOfCols,
    gameboard,
    endOfGameGlobalAlphaRate,
    endOfGameGlobalAlphaCeiling,
    endOfGameBackgroundColor,
    startOfGameSeconds,
    ghostTetroFillColor,
    ghostTetroGridColor,
    canvasText,

    //next tetro
    canvasNext,
    ctxNext,
    numberOfRowPreview,
    numberOfColsPreview,
    canvasArrayNext,
    backgroundColorNext,

    //tetro held
    canvasHold,
    ctxHold,
    numberOfRowHold,
    numberOfColsHold,
    canvasArrayHold,
    backgroundColorHold,

    //background
    backgroundTimeInterval,

} from './constants.js'; 


import {

    player,
    game,

} from './main.js'; 


import {

    audioVariablesHash,
    playSoundEffect,

} from './audio.js';

import {

    drawBackground,

} from './renderBackground.js';


canvasBoard.width = scaleFactor * numberOfCols;
canvasBoard.height = scaleFactor * numberOfVisibleRows;
ctxBoard.scale(scaleFactor, scaleFactor);

canvasNext.width = scaleFactor * numberOfColsPreview;
canvasNext.height = scaleFactor * numberOfRowPreview;
ctxNext.scale(scaleFactor, scaleFactor);

canvasHold.width = scaleFactor * numberOfColsHold;
canvasHold.height = scaleFactor * numberOfRowHold;
ctxHold.scale(scaleFactor, scaleFactor);


function getTetroColorHashKey(tetroName) {

    switch(tetroName) {
        case 't': {
            return tetrominoColorHash.t;
            break;
        }
        case 'o': {
            return tetrominoColorHash.o;
            break;
        }
        case 'i': {
            return tetrominoColorHash.i;
            break;
        }
            case 'l': {
            return tetrominoColorHash.l;
            break;
        }
            case 'j': {
            return tetrominoColorHash.j;
            break;
        }
            case 'z': {
            return tetrominoColorHash.z;
            break;
        }
            case 's': {
            return tetrominoColorHash.s;
            break;
        }
            default: {
            return tetrominoColorHash.default;
        }
    }
}


function drawGameEndBackground() {
    
    ctxBoard.globalAlpha = Math.min(endOfGameGlobalAlphaCeiling, game.render.endGameAlpha += endOfGameGlobalAlphaRate);
    ctxBoard.fillStyle = endOfGameBackgroundColor;
    ctxBoard.fillRect(0, 0, canvasBoard.width, canvasBoard.height);

}


function drawText(canvasTextHash, text) {

    canvasTextHash.context.globalAlpha = canvasTextHash.globalAlpha;
    canvasTextHash.context.fillStyle = canvasTextHash.fillstyle;
    canvasTextHash.context.font = canvasTextHash.fontSize + canvasTextHash.fontDetails;
    canvasTextHash.context.textAlign = canvasTextHash.alignment;
    canvasTextHash.context.fillText(text, canvasTextHash.xCoordinate, canvasTextHash.yCoordinate);

}


function clearClickStartText() {

    if(game.render.clickStartText.setIntervalIdText) {
        clearInterval(game.render.clickStartText.setIntervalIdText);
    }

    if(game.render.clickStartText.setIntervalIdBg) {
        clearInterval(game.render.clickStartText.setIntervalIdBg);
    }    
}
 

function drawClickStartText() {

    game.render.clickStartText.setIntervalIdText = setInterval(function() {drawText(canvasText.clickStart, canvasText.clickStart.text);}, 2000);
        
    setTimeout(function () {game.render.clickStartText.setIntervalIdBg 
        = setInterval( function() {drawGameboardCanvas();}, 2000);}, 1000);
        
}


function updateflags() {

    game.render.startGameRender.startCountComplete = true;
    game.render.gameRenderFlag = true;
    game.gameSequence.acceptUserInputMoves = true;
}


function executeFillText(number) {

    if(number < startOfGameSeconds) {
        drawGameboardCanvas();
    }
    
    drawText(canvasText.countdown, number);
    playSoundEffect(audioVariablesHash.decodedAudioHash, 'startBeep')

}


function drawCountDown() {

    let counter = startOfGameSeconds;
    let millisecondsDelay = 0;
    
    while(counter > 0) {
        setTimeout(executeFillText, millisecondsDelay, counter);
        millisecondsDelay += 1000;
        
        counter--;
    }
    
    setTimeout(function() {updateflags();}, millisecondsDelay);

}


function fillCanvasBackground(context, color, canvasWidth, canvasHeight) {

    context.fillStyle = color;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

}


function drawGridLines(context, color, width, coordinates, x, y){

    context.strokeStyle = color;
    context.lineWidth = width/scaleFactor;
    context.strokeRect(x + coordinates.x, y +  coordinates.y, 1, 1);

} 


function drawRectangle(context, color, coordinates, y, x, offset) {

    context.fillStyle = color;
    context.fillRect(x + coordinates.x + offset / 2, y + coordinates.y + offset / 2, 1 - offset, 1 - offset);

}


function drawTetroBlock(context, tetroKey, coordinates, y, x) {

    drawRectangle(context, tetroKey.dark, coordinates, y, x, 0);
    drawRectangle(context, tetroKey.medium, coordinates, y, x, 0.2);
    drawRectangle(context, tetroKey.light, coordinates, y, x, 0.25);
    drawRectangle(context, tetroKey.dark, coordinates, y, x, 0.3);

    let gradient = context.createRadialGradient(x + coordinates.x + 0.5, y + coordinates.y + 0.5, 0.01, 
        x + coordinates.x + 0.5, y + coordinates.y + 0.5, 0.2);
    gradient.addColorStop(0, tetroKey.center);
    gradient.addColorStop(0.25, tetroKey.dark); 

    drawRectangle(context, gradient, coordinates, y, x, 0.7);
    drawGridLines(context, gridLineColor, 0.25, coordinates, x, y);
    
}


function drawBlurred(context, tetroKey, coordinates, y, x) {
    
    let replicas = 30;
    let dx = 1 / replicas;
    let dy = 1 / replicas;
    context.globalAlpha = 1/(replicas / 1.2); 

    for(let i = 0; i < replicas; i++){
        drawTetroBlock(context, tetroKey, coordinates, y + (i * dy) / scaleFactor, x + (i * dx) / scaleFactor);
    }

    context.globalAlpha = 1;
}


function drawArray(context, drawTetroFlag, array, coordinates) {

    array.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                let tetroKey = getTetroColorHashKey(tetrominoNameArray[value - 1]);
                if(drawTetroFlag && player.currentTetro.harddrop) {
                    drawBlurred(context, tetroKey, coordinates, y, x);
                } else {
                    drawTetroBlock(context, tetroKey, coordinates, y, x);
                }
            } else {
                drawGridLines(context, gridLineColor, 0.015, coordinates, x, y);
            };
        });
    });
};


function drawGostArray(context, array, coordinates) {

    array.forEach((row, y) => {
        row.forEach((value, x) => {
            
            if(value !== 0) {
                drawRectangle(context, ghostTetroFillColor, coordinates, y, x, 0);
                drawGridLines(context, ghostTetroGridColor, 0.15, coordinates, x, y);
            } 
        })
    })
}


function drawGameboardCanvas() {

    fillCanvasBackground(ctxBoard, gameboardColor, canvasBoard.width, canvasBoard.height);
    
    let slicedArray = gameboard.slice(-1 * numberOfVisibleRows);
    drawArray(ctxBoard, false, slicedArray, {x: 0, y: 0});
    drawGhostPiece();

}


function drawCanvasNext() {

    fillCanvasBackground(ctxNext, backgroundColorNext, canvasNext.width, canvasNext.height);
    drawArray(ctxNext, false, canvasArrayNext, {x: 0, y: 0});

}


function drawCanvasHold() {

    fillCanvasBackground(ctxHold, backgroundColorHold, canvasHold.width, canvasHold.height);
    drawArray(ctxHold, false, canvasArrayHold, {x: 0, y: 0});

}


function drawTetroPiece() {

    if(!game.tetro.firstTetroFlag) {
        drawArray(ctxBoard, true, player.currentTetro.array, {x: player.position.x, y: player.position.y - numberOfHiddenRows});
    }

}


function drawGhostPiece() {

    if(!game.tetro.firstTetroFlag) {
        drawGostArray(ctxBoard, player.currentTetro.array, {x: player.ghostTetro.position.x, y: player.ghostTetro.position.y - numberOfHiddenRows});
    }

}


function drawGameEnd() {

    drawGameEndBackground();
    if(game.render.endGameAlpha > endOfGameGlobalAlphaCeiling) {
        drawText(canvasText.gameOver, canvasText.gameOver.text);
    }
}


function preShake(context) {
    context.save();
    let dx = Math.random() * 10 / scaleFactor;
    let dy = Math.random() * 10 / scaleFactor;
    context.translate(dx, dy);
    
    game.render.renderPostShake = true;
}


function postShake(context) {
    context.restore();
    game.render.renderPostShake = false;
}


export function draw() {

    if(game.render.gameRenderFlag) {
        if(game.tetro.removeRowsFlag) preShake(ctxBoard);
        drawGameboardCanvas();
        if(game.render.renderPostShake) postShake(ctxBoard);
        drawCanvasNext();
        drawCanvasHold();
        drawTetroPiece();
    } 
    
    if(!game.render.clickStartText.functionCalledFlag) {
        drawClickStartText();
        game.render.gameRenderFlag = false;
        game.render.clickStartText.functionCalledFlag = true;
    }
    
    if(game.render.startGameRender.startCountFlag) {
        game.render.startGameRender.startCountFlag = false;
        game.render.gameRenderFlag = false;
        clearClickStartText();
        drawCountDown();
    }

    if(game.gameSequence.gamePaused) {
        if(!game.render.gamePausedTextDrawn) {
            drawText(canvasText.pause, canvasText.pause.text);
            game.render.gamePausedTextDrawn = true;
            //game.render.gameRenderFlag = false;
        }
    }
    
    if(game.gameSequence.endGameFlag) {
        game.render.gameRenderFlag = false;
        drawGameEnd();
    }

    if(!game.render.backgroundFunctionCalled) {
        setInterval(drawBackground, backgroundTimeInterval);
        game.render.backgroundFunctionCalled = true;
    }
};
