
import {

    audioInputsHashMusk,

} from './constants.js'


export function renderMuskText(key) {
   
    document.querySelector('.large-x').style.display = 'none';
    document.querySelector('#open-quotation').style.display = 'inline';
    document.querySelector('.musk-words').style.display = 'inline';
    document.querySelector('#close-quotation').style.display = 'inline';
    document.querySelector('.musk-words').innerHTML = audioInputsHashMusk[key]['text'];
}


export function renderMuskRestart() {
    document.querySelector('.large-x').style.display = 'inline';
    document.querySelector('#open-quotation').style.display = 'none';
    document.querySelector('.musk-words').style.display = 'none';
    document.querySelector('#close-quotation').style.display = 'none';
}
