import "./wc.js";
import {drawUI, drawTitle, drawSelect, drawInstruction, drawLevel, drawWin} from "./canvas.js";
import {loadFile} from "./json.js";
import {gameState, instruction} from "./state.js";
import {changeLoaded, changeWiz, loadLevel, moving, level, size, length, spawn, flag, hb, loaded, log, initLevel, useBomb, wiz} from "./game.js";

let win = false;
let canvas = document.querySelector('canvas');

update();

function update(){
    requestAnimationFrame(update);

    canvas.width = 1000;
    canvas.height = 1000;

    drawUI();
    switch (gameState) {
        // Title Screen
        case 0:
            win = false;
            changeLoaded();
            drawTitle();
            break;
        
        // Level Selection Screen
        case 1:
            win = false;
            changeLoaded();
            drawSelect();
            break;
        
        // Game Screen
        case 2:
            if (!loaded) loadFile(loadLevel, "data/levels.json");
            else changeWiz(drawLevel(level, size, length, spawn, flag, hb));
            break;
    }

    // Instruction Screen
    if (instruction) drawInstruction();
    if (win) drawWin();
}

// Check for user input
window.onkeydown = e => {
    // If the player is not on the game screen
    if (gameState < 2 || instruction) return;

    // If the player is playing the game
    if (gameState == 2 && !win) switch (e.keyCode){
        // Up - W
        case 87: 
            if (wiz.x == undefined) return;
            moving({ x: 0, y: -1 });
            break;
        
        // Down - S
        case 83: 
            if (wiz.x == undefined) return;
            moving({ x: 0, y: 1 }); 
            break;

        // Left - A
        case 65: 
            if (wiz.x == undefined) return;
            moving({ x: -1, y: 0 }); 
            break;

        // Right - D
        case 68: 
            if (wiz.x == undefined) return;
            moving({ x: 1, y: 0 }); 
            break;

        // Reset level - R
        case 82:
            initLevel(); 
            break;

        // Undo - Z
        case 90:
            log.undo();
            break;

        // Use item - Space
        case 32:
            if (wiz.x == undefined) return;
            useBomb();
            break;
    }
}

function changeWin(){ win = true; }

export { changeWin };