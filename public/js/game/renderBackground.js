import {

  canvasBackground,
  cxtBackground,
  originalCharacterArray,
  characterArray,
  fontSize,
  yCoordinate,
  colorHash,

} from './constants.js';


function setupBackgroundArray() {
  
  canvasBackground.width = window.innerWidth;
  canvasBackground.height = window.innerHeight;
  let numberOfColumns = canvasBackground.width / fontSize; 
  
  for(let i = 0; i < numberOfColumns; i++) {
    
    yCoordinate[i] = 0;
    characterArray[i] = originalCharacterArray[Math.floor(Math.random() * originalCharacterArray.length)]

    while(i > 1 && (characterArray[i] == characterArray[i - 1] || characterArray[i] == characterArray[i - 2])) {
        characterArray[i] = originalCharacterArray[Math.floor(Math.random() * originalCharacterArray.length)];
    }
  }
}
    
setupBackgroundArray();
    
window.addEventListener('resize', () => { 
  setupBackgroundArray();
});

export function drawBackground() {
    cxtBackground.fillStyle = "rgba(216, 227, 255,0.3)";
    cxtBackground.fillRect(0, 0, canvasBackground.width, canvasBackground.height);
    cxtBackground.fillStyle = '#03ff2d'
    cxtBackground.font = fontSize+'px arial';

  let text;
  for(let xCoordinate = 0; xCoordinate < yCoordinate.length; xCoordinate++) {
    text = characterArray[xCoordinate]
    cxtBackground.fillStyle = colorHash[text]
    cxtBackground.fillText(text, xCoordinate * fontSize, yCoordinate[xCoordinate] * fontSize);
    if(yCoordinate[xCoordinate] * fontSize > canvasBackground.height && Math.random() > 0.9) {
      yCoordinate[xCoordinate] = 0;
    }
    
    yCoordinate[xCoordinate]++;
  }
}
