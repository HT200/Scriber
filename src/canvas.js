import {images} from "./image.js";
import {buttons, instruction} from "./state.js";
import { updateHB, updateFlag, updateSpawn, hasBomb } from "./game.js";

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Draw the main UIs that persist throughout all game states
function drawUI(){
    ctx.drawImage(images.ui, 0, 0, 1000, 1000);
    ctx.drawImage(images.grass, 15, 15, 745, 745);
    buttons.ui.level.draw();
    buttons.ui.instruction.draw();

    ctx.drawImage(instruction ? images.close : images.instruction, 410, 795, 340, 170);
    if (buttons.ui.instruction.inside) ctx.drawImage(images["trans-brown"], 410, 795, 340, 170);
}

// Draw the title screen
function drawTitle(){
    ctx.drawImage(images.title, 110, 130);
    buttons.title.start.draw();
}

// Draw level select screen
function drawSelect(){
    ctx.save();
    ctx.font = '90px eras';
    ctx.fillStyle = '#ffeb67';
    ctx.strokeStyle = '#113100';
    ctx.lineWidth = 4;

    ctx.fillText("Choose a Level", 47, 145);
    ctx.strokeText("Choose a Level", 47, 145);

    ctx.font = '70px eras';
    ctx.lineWidth = 2.5;

    let count = 0;
    // Print the numbers on the level buttons
    for (const key in buttons.level){
        let temp = buttons.level[key];
        count++;
        // If the current level is the hard/special level, make the letter red, else make it yellow
        ctx.fillStyle = (count % 4 == 0 || count == 11) ? "#ff0000" : '#ffeb67';
        temp.draw();
        ctx.fillText(count, temp.x + ((count < 10) ? 58 : 32), temp.y + 103);
        ctx.strokeText(count, temp.x + ((count < 10) ? 58 : 32), temp.y + 103);
        if (temp.inside) ctx.drawImage(images["trans-small"], temp.x, temp.y, 160, 160);
    }
    ctx.restore();
}

// Draw Instruction Panel
// Keyboard Sprites Credits: https://thoseawesomeguys.com/prompts/
function drawInstruction(){
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(15, 15, 745, 745);
    ctx.globalAlpha = 1.0;
    ctx.fillstyle = "#113100";
    ctx.fillRect(60, 60, 655, 655);
    ctx.fillStyle = "#176619";
    ctx.fillRect(65, 65, 645, 645);
    ctx.fillStyle = "#8dbe91";
    ctx.fillRect(70, 70, 635, 635);
    

    ctx.drawImage(images.inst, 130, 90);
    ctx.drawImage(images.iA, 100, 280);
    ctx.drawImage(images.iS, 180, 280);
    ctx.drawImage(images.iD, 260, 280);
    ctx.drawImage(images.iW, 180, 200);
    ctx.drawImage(images.iZ, 180, 380);
    ctx.drawImage(images.iR, 180, 480);
    ctx.drawImage(images.iSpace, 180, 570);

    ctx.font = '70px eras';
    ctx.fillStyle = '#ffeb67';
    ctx.strokeStyle = '#113100';
    ctx.lineWidth = 2.5;

    ctx.fillText('Move', 445, 350);
    ctx.strokeText('Move', 445, 350);
    ctx.fillText('Undo', 445, 450);
    ctx.strokeText('Undo', 445, 450);
    ctx.fillText('Reset', 440, 550);
    ctx.strokeText('Reset', 440, 550);
    ctx.fillText('Use Item', 330, 650);
    ctx.strokeText('Use Item', 330, 650);
    ctx.restore();
}

// Draw the winning screen
function drawWin(){
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(15, 15, 745, 745);
    ctx.globalAlpha = 1.0;

    ctx.font = '140px eras';
    ctx.fillStyle = '#ffeb67';
    ctx.strokeStyle = '#113100';
    ctx.lineWidth = 5;

    ctx.fillText('You Win!', 65, 400);
    ctx.strokeText('You Win!', 65, 400);
    ctx.restore();
}

// Draw the level
function drawLevel(level, size, length, spawn, flag, hb){
    let wizX, wizY;

    // Bomb (in item slot)
    if (hasBomb) ctx.drawImage(images.ub, 825, 160, 100, 100);

    // Spawner + flag
    if (spawn.x != 99) drawObject(spawn.x, spawn.y, length, "spawner");
    if (flag.x != 99) drawObject(flag.x, flag.y, length, "ff");

    // Hole with bridge (if any)
    if (hb.x != 99){
        drawObject(hb.x, hb.y, length, "@h");
        drawObject(hb.x, hb.y, length, "pb");
    }

    for (let y = 0; y < size; y++){
        for (let x = 0; x < size; x++){
            if (level[y][x] != '__') switch (level[y][x]){
                // Hole with bridge
                case '_h':
                    drawObject(x, y, length, "@h");
                    drawObject(x, y, length, "pb");
                    updateHB(x, y);
                    break;

                // Spawner
                case '_s':
                    drawObject(x, y, length, "spawner");
                    updateSpawn(x, y);
                    break;

                // Flag
                case 'ff':
                    drawObject(x, y, length, "ff");
                    updateFlag(x, y);
                    break;

                // Wizard
                case 'ww':
                    wizX = x;
                    wizY = y;
                break;

                default:
                    drawObject(x, y, length, level[y][x]);
                    break;
            }
        }
    }

    // Draw wizard
    if (wizX != undefined) drawObject(wizX, wizY, length, level[wizY][wizX]);

    return { x: wizX, y: wizY };
}

// Draw a game object
function drawObject(x, y, length, slug){
    ctx.drawImage(images[slug], 24 + x * length, 24 + y * length, length, length);
}

export {drawUI, drawTitle, drawSelect, drawInstruction, drawObject, drawLevel, drawWin};