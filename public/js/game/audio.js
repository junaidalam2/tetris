
import {

    //audio
    audioButton,
    volumeSlider,
    contextBackgroundAudio,
    gainNodeBackground,
    contextSoundEffects,
    gainNodeSoundEffects,
    audioInputsHash,
    initialVolumeLevelEffects,
    initialVolumeLevelBgMusic,
    playbackRateIncrease,
    playbackRateMax,

    //audio - Elon Musk 
    contextElonMusk,
    gainNodeElonMusk,
    audioElonMuskButton,
    audioInputsHashMusk,
    muteMuskAudioInputsHashMusk,
    initialTimeDelayMusk,
    timeDelayIncreaseMusk,
    eventMuskEnd,
    initialVolumeLevelMusk,

  } from './constants.js';


import {

    game,

} from './main.js'


import {

    renderMuskText,

} from './renderMusk.js'


export const audioVariablesHash = {
    started: false,
    soundOn: false,
    onAtGamePause: false,
    playbackRate: 1,
    decodedAudioHash: {},
    sourceAudioHash: {},
    musk: {
        soundOn: true,   
        lastestSourcePlayed: null,
        sourceNodeKeysArray: null,
        decodedAudioHash: {},
        sourceAudioHash: {},
        decodedMuteAudioHash: {},
        setTimeoutHash: {},
    },
}

gainNodeBackground.gain.value = initialVolumeLevelBgMusic;
gainNodeSoundEffects.gain.value = initialVolumeLevelEffects;
gainNodeElonMusk.gain.value = initialVolumeLevelMusk;


function decodeAudioFile(filepath, context, hash, key) {

    fetch(filepath)
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        hash[key] = decodedAudio;
    }); 
}

function decodeMultipleAudioFiles(sourceHash, destinationHash) {

    let keysArray = Object.keys(sourceHash);

    keysArray.forEach((key) => {
        decodeAudioFile(sourceHash[key]['path'], sourceHash[key]['context'], destinationHash, key);
    });
}

decodeMultipleAudioFiles(audioInputsHash, audioVariablesHash.decodedAudioHash);
decodeMultipleAudioFiles(audioInputsHashMusk, audioVariablesHash.musk.decodedAudioHash);
decodeMultipleAudioFiles(muteMuskAudioInputsHashMusk, audioVariablesHash.musk.decodedMuteAudioHash);


function lastestAudioMusk(key) {
     audioVariablesHash.musk.lastestSourcePlayed = audioVariablesHash.musk.sourceAudioHash[key];
}


function playSound(context, decodedAudioHash, key, gainNode, soundtype, loopBoolean = false) {
    const source = context.createBufferSource();
    source.buffer = decodedAudioHash[key];
    source.connect(gainNode).connect(context.destination);
    source.loop = loopBoolean;
    source.start(context.currentTime);

    switch(soundtype) {
        case 'background': {
            audioVariablesHash.sourceAudioHash[key] = source;
            break;
        }
        case 'elonMusk': {
            audioVariablesHash.musk.sourceAudioHash[key] = source;
            lastestAudioMusk(key);
            break;
        }
    }
}


function checkForLastSourceNodeMusk(key) {
    if(audioVariablesHash.musk.sourceNodeKeysArray.slice(-1) == key) {
        window.dispatchEvent(eventMuskEnd);
    }
}


function playElonMusk(key) {

    if(audioVariablesHash.soundOn && audioVariablesHash.musk.soundOn) {
        playSound(contextElonMusk, audioVariablesHash.musk.decodedAudioHash, key, gainNodeElonMusk, 'elonMusk');
    }
    
    renderMuskText(key);
    checkForLastSourceNodeMusk(key);
}


function shuffleArray(array) {

    let currentIndex = array.length;
    let randomIndex;

    while(currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}


function createSourceNodeKeysArrayMusk() {
    audioVariablesHash.musk.sourceNodeKeysArray = Object.keys(audioVariablesHash.musk.decodedAudioHash);
    return shuffleArray(audioVariablesHash.musk.sourceNodeKeysArray);
}


export function playMuskAudioAll() {

    let timeDelay = initialTimeDelayMusk;
    audioVariablesHash.musk.sourceNodeKeysArray = createSourceNodeKeysArrayMusk();
    audioVariablesHash.musk.sourceNodeKeysArray.forEach((key) => {
        audioVariablesHash.musk.setTimeoutHash[key] = setTimeout(() => {playElonMusk(key)}, timeDelay);
        timeDelay += timeDelayIncreaseMusk;  
    });
}


export function volumeIconManagement() {

    // uses Google icons
    if(audioVariablesHash.soundOn) {
        document.getElementById('volume-icon').innerHTML = "volume_up";
    } else {
        document.getElementById('volume-icon').innerHTML = "volume_off";
    }
}


export function stopMuskAudioAll() {

    let sourceNodeArray = Object.values(audioVariablesHash.musk.sourceAudioHash);
    sourceNodeArray.forEach((element) => {
        element.stop();
    });

    let setTimeoutArray = Object.values(audioVariablesHash.musk.setTimeoutHash);
    setTimeoutArray.forEach((element) => {
        clearTimeout(element);
    });

    audioVariablesHash.musk.setTimeoutHash = {};
}


export function stopBackgroundAudio() {
    
    if(audioVariablesHash.started) {
        audioVariablesHash.sourceAudioHash['backgroundMusic'].stop();
        audioVariablesHash.started = false;
    }

    audioVariablesHash.playbackRate = 1;
}


export function pauseResumeMusk() {
    if(contextElonMusk.state === 'running') {
        contextElonMusk.suspend();
        stopMuskAudioAll();
    }  else if(contextElonMusk.state === 'suspended') {
        contextElonMusk.resume();
        playMuskAudioAll();
    }
}


function pauseResumeSound() {
    if(contextBackgroundAudio.state === 'running') {
        contextBackgroundAudio.suspend().then(function() {
        audioVariablesHash.soundOn = false;
        volumeIconManagement();
        });
    } else if(contextBackgroundAudio.state === 'suspended') {
        contextBackgroundAudio.resume().then(function() {
        audioVariablesHash.soundOn = true;
        volumeIconManagement();
        });  
    }
}


export function playbackBackgroundAudio() {
    
    if(!audioVariablesHash.started && audioVariablesHash.soundOn) {
        if(contextBackgroundAudio.state === 'suspended') {
            contextBackgroundAudio.resume();
        }

        playSound(contextBackgroundAudio, audioVariablesHash.decodedAudioHash , 'backgroundMusic', gainNodeBackground, 'background', true);
        audioVariablesHash.started = true;
        volumeIconManagement();
    } else if(audioVariablesHash.started){
        pauseResumeSound(); 
    }
} 


export function playSoundEffect(decodedAudio, key) {
    if(audioVariablesHash.soundOn) {
        playSound(contextSoundEffects, decodedAudio, key, gainNodeSoundEffects, 'soundEffect');
    }
}


export function playbackRateBackgroundAudio() {
    audioVariablesHash.playbackRate += playbackRateIncrease;
    if(audioVariablesHash.started){
        audioVariablesHash.sourceAudioHash['backgroundMusic'].playbackRate.value = Math.min(audioVariablesHash.playbackRate, playbackRateMax);
    }
}


function stopLatestAudioMusk() {
    if(audioVariablesHash.musk.lastestSourcePlayed) {
        audioVariablesHash.musk.lastestSourcePlayed.stop();
    }
}


audioButton.addEventListener('click', function() {
    if(!game.gameSequence.gamePaused) {
        audioVariablesHash.soundOn = !audioVariablesHash.soundOn;
        volumeIconManagement();
        if(game.gameSequence.gameOn) {
            playbackBackgroundAudio();
        }
        if(!audioVariablesHash.soundOn) {
            stopLatestAudioMusk();
        }
    }
});


volumeSlider.oninput = function () {
    let factor = this.value / 50  // 50 = start value in index.html
    gainNodeBackground.gain.value = factor * initialVolumeLevelBgMusic;
    gainNodeSoundEffects.gain.value = factor * initialVolumeLevelEffects;
    gainNodeElonMusk.gain.value = factor * initialVolumeLevelMusk;
};


window.addEventListener("eventMuskEnd", function() {
    playMuskAudioAll();
});


function muteMuskButtonAudio() {
    if(audioVariablesHash.soundOn) {
        if(audioVariablesHash.musk.soundOn) {
            playSound(contextElonMusk, audioVariablesHash.musk.decodedMuteAudioHash, 'unmute', gainNodeElonMusk, 'soundEffect');
        } else {
            playSound(contextElonMusk, audioVariablesHash.musk.decodedMuteAudioHash, 'mute', gainNodeElonMusk, 'soundEffect');
        }
    }
}


function muskButtonText() {

    if(audioVariablesHash.musk.soundOn) {
        document.getElementById('button-musk').innerHTML = "Mute Elon Musk";
    } else {
        document.getElementById('button-musk').innerHTML = "Unmute Elon Musk";
    }
}


audioElonMuskButton.addEventListener('click', function() {
    audioVariablesHash.musk.soundOn = !audioVariablesHash.musk.soundOn;
    muskButtonText();
    stopLatestAudioMusk();
    muteMuskButtonAudio();
});
