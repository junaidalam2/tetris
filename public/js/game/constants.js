export const canvasBoard = document.getElementById('tetris');
export const ctxBoard = canvasBoard.getContext('2d');
export const startButton = document.querySelector('#start-button');
export const endButton = document.querySelector('#end-button');
export const keysButton = document.querySelector('#keys-button-model');
export const numberOfHiddenRows = 20;
export const numberOfVisibleRows = 20;
export const numberOfRows = numberOfHiddenRows + numberOfVisibleRows;
export const numberOfCols = 10;
export const scaleFactor = 25;
export const linesToCompleteLevel = 10; 
export const baseScore = 40;
export const lineScoreFactor = [1, 1.25, 2.5, 7.5];  // score factor by number of lines; index 0 = 1 line, index 1 = 2 lines, etc...
Object.freeze(lineScoreFactor);
export const tetrominoNameArray = ['t', 'o', 'i', 'l', 'j', 'z', 's'];
Object.freeze(tetrominoNameArray);
export const tetrominoShapesHash = {

    t: [ 
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]  
        ],

    o: [ 
            [2, 2],
            [2, 2]
        ],

    i:  [
            [0, 0, 0, 0],
            [3, 3, 3, 3],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],  

    l:  [
            [0, 0, 4],
            [4, 4, 4],
            [0, 0, 0]
        ],

    j:  [
            [5, 0, 0],
            [5, 5, 5],
            [0, 0, 0]
        ],

    z:  [
            [6, 6, 0],
            [0, 6, 6],
            [0, 0, 0]
        ],

    s:  [
            [0, 7, 7],
            [7, 7, 0],
            [0, 0, 0]
        ],
}
Object.freeze(tetrominoShapesHash);
export const tetrominoColorHash = {

    t: { dark: '#49146e', medium: '#a65fd9', light: '#cea9e8', center: '#e1f0ef' },  // purple
    o: { dark: '#deb512', medium: '#bfa84b', light: '#ebdea9', center: '#e1f0ef' },  // yellow
    i: { dark: '#1069a1', medium: '#54819e', light: '#8d9ea8', center: '#e1f0ef' },  // cyan  
    l: { dark: '#ad6615', medium: '#9e784d', light: '#b5a491', center: '#e1f0ef' },  // orange
    j: { dark: '#4198a3', medium: '#5ab8c4', light: '#7ae2f0', center: '#e1f0ef' },  // blue
    z: { dark: '#b51869', medium: '#ad5e87', light: '#ad909f', center: '#e1f0ef' },  // red
    s: { dark: '#128c2d', medium: '#4f8c5c', light: '#afc4b3', center: '#e1f0ef' }, // green
    default: { dark: '#4198a3', medium: '#5ab8c4', light: '#7ae2f0', center: '#e1f0ef' },

}
Object.freeze(tetrominoColorHash);
export const timeFactorBetweenLevelsToTen = 0.85;
export const linearTimeFactorBetweenLevelsPostTen = 0.06; // rate of increase in difficulty declines after level 9
export const minimumTimeInterval = 100;  // milliseconds
export const startingDropInterval = 1000;  // milliseconds
export const hardDropInterval = 15;  // milliseconds
export const startPositionHash = {
 
    i: { x: 5, y: 20 },
    o: { x: 5, y: 21 },
    default: { x: 3, y: 21 },

}
Object.freeze(startPositionHash);
export function createArray(columnCount, rowCount) {
    
    const returnArray = [];
    
    while (rowCount--) {
        const rowArray = new Array(columnCount).fill(0);
        returnArray.push(rowArray);
    }
    
    return returnArray;
}
export const gameboard = createArray(numberOfCols, numberOfRows);
export const gameboardColor = 'LightCyan';
export const gridLineColor = 'gray';
export const endOfGameGlobalAlphaRate = 0.002;
export const endOfGameGlobalAlphaCeiling = 0.2;
export const endOfGameBackgroundColor = '#fff6e3';
export const startOfGameSeconds = 3;
export const ghostTetroFillColor = '#cce6e6';
export const ghostTetroGridColor = '#2e868c';
export const canvasText = {

    clickStart: {

        context: ctxBoard, 
        text: "Click Start", 
        globalAlpha: 1, 
        fillstyle: 'DarkMagenta', 
        fontSize: 1.5, 
        fontDetails: 'px impact', 
        alignment: "center", 
        xCoordinate: 5, 
        yCoordinate: 7,

    },
    countdown: {
        
        context: ctxBoard, 
        text: null, 
        globalAlpha: 1, 
        fillstyle: 'DarkMagenta', 
        fontSize: 2, 
        fontDetails: 'px impact', 
        alignment: "center", 
        xCoordinate: 5, 
        yCoordinate: 7,

    }, 
    pause: {
        
        context: ctxBoard, 
        text: "Paused", 
        globalAlpha: 1, 
        fillstyle: '#6d5dfc', 
        fontSize: 1.5, 
        fontDetails: 'px bold Poppins, sans-serif', 
        alignment: "center", 
        xCoordinate: 5, 
        yCoordinate: 4,

    },
    gameOver: {
    
        context: ctxBoard, 
        text: "Game Over", 
        globalAlpha: 1, 
        fillstyle: '#6d5dfc', 
        fontSize: 1.5, 
        fontDetails: 'px bold Poppins, sans-serif', 
        alignment: "center", 
        xCoordinate: 5, 
        yCoordinate: 4,

    },
}
Object.freeze(canvasText);

// next tetro specific constants
export const canvasNext = document.getElementById('tetris-preview');
export const ctxNext = canvasNext.getContext('2d');
export const numberOfRowPreview = Math.floor(numberOfVisibleRows / 4 + 1);
export const numberOfColsPreview = Math.floor(numberOfCols * 0.8);
export const canvasArrayNext = createArray(numberOfColsPreview, numberOfRowPreview);
export const backgroundColorNext = gameboardColor;
export const tetroPositionNextHash = { x: 2, y: 1 };
Object.freeze(tetroPositionNextHash);

// held tetro specific constants
export const canvasHold = document.getElementById('tetris-hold');
export const ctxHold = canvasHold.getContext('2d');
export const numberOfRowHold = numberOfRowPreview;
export const numberOfColsHold = numberOfColsPreview;
export const canvasArrayHold = createArray(numberOfColsHold, numberOfRowHold);
export const backgroundColorHold = gameboardColor;
export const tetroPositionHoldHash = { x: 2, y: 1 };
Object.freeze(tetroPositionHoldHash);

// modals - keys, info & high score
export const overlay = document.querySelector(".overlay");
export const modalKeys = document.querySelector(".modal-keys");
export const openModalBtnKeys = document.querySelector("#keys-button-modal");
export const closeModalBtnKeys = document.querySelector(".keys-button-close");
export const modalInfo = document.querySelector(".modal-info");
export const openModalBtnInfo = document.getElementById("info-button-modal");
export const closeModalBtnInfo = document.querySelector(".info-button-close");
export const modalScore = document.querySelector(".modal-score");
export const openModalBtnScore = document.getElementById("button-high-score");
export const closeModalBtnScore = document.querySelector(".score-button-close");

// high score operations
export const submitScoreForm = document.getElementById("form-high-score");
export const submitScoreBtn = document.getElementById("high-score-submit");
export const deleteScore = document.getElementById("high-score-delete");
export const exitScoreBtnModal = document.getElementById("high-score-exit");
export const scorePostRoute = "/score_post";
export const scoreDeleteRoute = "/score_delete";
export const scoreUpdateRoute = "/score_update_post";
//export const getLastPlayerIdRoute = '/score_last_get';
//export const getTopScoresRoute = '/score_get';
export const getLastPlayerIdRoute = 'http://localhost:5500/score_last_get'; //route for dev environment
export const getTopScoresRoute = 'http://localhost:5500/score_get'; //route for dev environment
export const defaultName = 'Anonymous';
export const rowColorOnHighScore = "#f57842";
export const namePlaceholderOnHighScore = "___________";
export const titleOnHighScore = "You Achieved a High Score!";
export const titleDefault = "High Scores!";
export const disabledBtnFontColor = "#bdcbd8";
export const disabledBtnBgColor = "#bebfc0";
export const enabledBtnFontColor = deleteScore.style.color;
export const enabledBtnBgColor = deleteScore.style.backgroundColor;
export const scoreInputSection = document.querySelector(".highscore-update-delete"); 
export const titleDisplay = document.querySelector(".high-score-title");
export const tableDisplay = document.querySelector('.high-score-table');

//audio
export const audioButton = document.querySelector('.button-audio');
export const volumeSlider = document.querySelector("#audioRange");
export const volumeSliderProgressBar = document.querySelector(".audio-slider-progress");
export const contextBackgroundAudio = new (window.AudioContext || window.webkitAudioContext)();
export const gainNodeBackground = contextBackgroundAudio.createGain();
export const contextSoundEffects = new (window.AudioContext || window.webkitAudioContext)();
export const gainNodeSoundEffects = contextSoundEffects.createGain();
export const initialVolumeLevelEffects = 0.3; // 1 = volume of 100%
export const initialVolumeLevelBgMusic = 0.15; // 1 = volume of 100%
export const playbackRateIncrease = 0.006;
export const playbackRateMax = 1.1;
export const audioInputsHash = {
    backgroundMusic: {path: "./resources/audio/music/Feel-Good.mp3", context: contextBackgroundAudio},
    clearLine: {path: "./resources/audio/sound_effects/clearLine.mp3", context: contextSoundEffects},
    boundTetro: {path: "./resources/audio/sound_effects/boundTetro.mp3", context: contextSoundEffects},
    newLevel: {path: "./resources/audio/sound_effects/newLevel.wav", context: contextSoundEffects},
    pause: {path: "./resources/audio/sound_effects/pause.mp3", context: contextSoundEffects},
    unpause: {path: "./resources/audio/sound_effects/unpause.mp3", context: contextSoundEffects},
    rotate: {path: "./resources/audio/sound_effects/rotateTetro.mp3", context: contextSoundEffects},
    startBeep: {path: "./resources/audio/sound_effects/startBeep.mp3", context: contextSoundEffects},
    holdTetro: {path: "./resources/audio/sound_effects/holdTetro.mp3", context: contextSoundEffects},
    hardDrop: {path: "./resources/audio/sound_effects/hardDrop.mp3", context: contextSoundEffects},
    endGame: {path: "./resources/audio/sound_effects/endGame.mp3", context: contextSoundEffects},
}
Object.freeze(audioInputsHash);

//audio - Elon Musk 
export const contextElonMusk = new (window.AudioContext || window.webkitAudioContext)();
export const gainNodeElonMusk = contextElonMusk.createGain();
export const audioElonMuskButton = document.querySelector('#button-musk');
const softwareReplace = "I might as well develop software to replace you."
const legoGame ="I can land rockets. You can barely operate an advanced lego game." 
const mars ="I'm trying to go to Mars to get away from people like you." 
const squarePeg = "You can't even put a square peg in a square hole."
const promises = "My promises will be met before you learn how to play."
const twitterStrategy = "Twitter's strategy is better than yours."
const prediction = "Your accuracy is worse than all of my predictions."
const chaosTheory = "Your tactics are based on chaos theory."
const buyingTwitter = "Buying Twitter was a better move than what you just did."
const gameplay = "Your gameplay is as interesting as my Boring Company"
const drive = "You can play about as well as I can drive."
const videoGames = "I used to love video games until I saw you play."
const boringMachine = "My boring machines move faster than you."
const lastTweet = "Your last move was as well though out as my last tweet."
const leftRight = "Perhaps you should first learn to differentiate between left and right."
const dimensions = "You're thinking one dimensionally in a two dimensional game."
export const audioInputsHashMusk = {
    a: {path: "./resources/audio/elon_musk/1_software_replace.wav", context: contextElonMusk, text: softwareReplace},
    b: {path: "./resources/audio/elon_musk/2_lego_ game.wav", context: contextElonMusk, text: legoGame},
    c: {path: "./resources/audio/elon_musk/3_mars.wav", context: contextElonMusk, text: mars},
    d: {path: "./resources/audio/elon_musk/4_square_peg.wav", context: contextElonMusk, text: squarePeg},
    e: {path: "./resources/audio/elon_musk/5_promised_play.wav", context: contextElonMusk, text: promises},
    f: {path: "./resources/audio/elon_musk/6_twitter_strategy.wav", context: contextElonMusk, text: twitterStrategy},
    g: {path: "./resources/audio/elon_musk/7_accuracy_predictions.wav", context: contextElonMusk, text: prediction},
    h: {path: "./resources/audio/elon_musk/8_chaos_theory.wav", context: contextElonMusk, text: chaosTheory},
    i: {path: "./resources/audio/elon_musk/9_buying_twitter.wav", context: contextElonMusk, text: buyingTwitter},
    j: {path: "./resources/audio/elon_musk/10_interesting_boring_company.wav", context: contextElonMusk, text: gameplay},
    k: {path: "./resources/audio/elon_musk/11_play_drive.wav", context: contextElonMusk, text: drive},
    l: {path: "./resources/audio/elon_musk/12_video_games.wav", context: contextElonMusk, text: videoGames},
    m: {path: "./resources/audio/elon_musk/13_boring_machines.wav", context: contextElonMusk, text: boringMachine},
    n: {path: "./resources/audio/elon_musk/14_last_tweet.wav", context: contextElonMusk, text: lastTweet},
    o: {path: "./resources/audio/elon_musk/15_left_right.wav", context: contextElonMusk, text: leftRight},
    p: {path: "./resources/audio/elon_musk/16_dimensions.wav", context: contextElonMusk, text: dimensions},
}
Object.freeze(audioInputsHashMusk);
export const muteMuskAudioInputsHashMusk = {
    mute: {path: "./resources/audio/elon_musk/mute_elon_musk.wav", context: contextElonMusk},
    unmute: {path: "./resources/audio/elon_musk/unmute_elon_musk.wav", context: contextElonMusk}
}
Object.freeze(muteMuskAudioInputsHashMusk);
export const initialTimeDelayMusk = 1000 * 10; // milliseconds
export const timeDelayIncreaseMusk = 1000 * 20; // milliseconds
export const eventMuskEnd = new Event('eventMuskEnd'); // signify when all Musk audio files have played
export const initialVolumeLevelMusk = 1.8

// background
export const canvasBackground = document.getElementById('background');
export const cxtBackground = canvasBackground.getContext("2d");
const characterString = "⠙⠋⠴⠹⠏⠼⠧⠺⠗⠛⡇⡴⢦";
export const originalCharacterArray = characterString.split("");
export const characterArray = originalCharacterArray;
export const fontSize = 30;
export const yCoordinate = [];
export const colorHash = {
    "⠙": '#d9e002',
    "⠋": '#d103ff',
    "⠴": '#d103ff',
    "⠹": '#ffb303',
    "⠏": '#00ff5e',
    "⠼": '#ffb303',
    "⠧": '#8a8a8a',
    "⠺": '#7a4700',
    "⠗": '#03ffdd',
    "⠛": '#006eff',
    "⡇": '#6d5dfc',
    "⡴": '#03ffdd',
    "⢦": '#03ffdd',
}
Object.freeze(colorHash);
export const backgroundTimeInterval = 150; // milliseconds
