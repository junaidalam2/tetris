import {

    overlay,
    modalKeys,
    openModalBtnKeys,
    closeModalBtnKeys,
    modalInfo,
    openModalBtnInfo,
    closeModalBtnInfo,
    modalScore,
    openModalBtnScore,
    closeModalBtnScore,

} from './constants.js'; 

import {

    game,
    PauseResume,

} from './main.js'

import {

    exitModalOnNewHighScore,

} from './highscore.js'


export function openModal(modal, cssModalClass, cssOverlayClass){
    if (modal.classList.contains(cssModalClass)) {
            modal.classList.remove(cssModalClass);
            overlay.classList.remove(cssOverlayClass);
            if(!game.gameSequence.gamePaused) {
                PauseResume();
            } else {
                game.modal.startedOnPause = true;
            }

            game.modal.open = true;
    }
}

openModalBtnKeys.addEventListener("click", ()=> {
    openModal(modalKeys, "hidden-keys", "hidden");
});

openModalBtnInfo.addEventListener("click", ()=> {
    openModal(modalInfo, "hidden-info", "hidden");
});

openModalBtnScore.addEventListener("click", ()=> {
    openModal(modalScore, "hidden-score", "hidden");
});

function closeModal(modal, cssModalClass, cssOverlayClass){
   if (!modal.classList.contains(cssModalClass)) {
       modal.classList.add(cssModalClass);
       overlay.classList.add(cssOverlayClass);
       game.modal.open = false;
       if(!game.modal.startedOnPause) {
           PauseResume();
       }
   }
}

const closeModalKeys = function () {
   closeModal(modalKeys, "hidden-keys", "hidden");
}

const closeModalInfo = function() {
   closeModal(modalInfo, "hidden-info", "hidden");
}

export const closeModalScore = function() {
   closeModal(modalScore, "hidden-score", "hidden");
}

closeModalBtnKeys.addEventListener("click", closeModalKeys);
overlay.addEventListener("click", closeModalKeys);

closeModalBtnInfo.addEventListener("click", closeModalInfo);
overlay.addEventListener("click", closeModalInfo);

closeModalBtnScore.addEventListener("click", () => {
    closeModalScore();
    exitModalOnNewHighScore();
});

overlay.addEventListener("click", () => {
    if(!game.highScore.exitModalOnNewHighScore){
        closeModalScore();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeModalInfo();
        closeModalScore();
        closeModalKeys();
        exitModalOnNewHighScore();
    }
});
