import {currentLevel} from "./state.js";
import {scanLetterHorizontal, scanLetterVertical, scanLetter} from "./scan.js";
import {Log} from "./Log.js";
import {changeWin} from "./index.js";
import {value, mValue, cValue} from "./value.js";
import {sounds} from "./sound.js";

let loaded = false;
let layout, level;
let size, length;

let wiz = { x: 0, y: 0 };
let spawn = { x: 0, y: 0 };
let flag = { x: 0, y: 0 };
let hb = { x: 99, y: 99 };

let currentDir;
let spawnables = ["pb", "pv", "ub"];
let spawnCode = ["BRIDGE", "BEAVER", "BOMB"];
let cooldown;

let hasBomb, spawned;
let foundSpelled = {
    pb: false,
    pv: false
}

let log = new Log();

function moving(dir){
    spawned = false;
    let ahead = { x: wiz.x, y: wiz.y }
    let count = 0; // The amount of tiles the player can interact with
    let prevType = "__"; // Save the previously checked tile
    let hasLetter = false;
    let nonLetter = "";

    // Check to see if the player can move and how many blocks the player will be able to push
    while (count < size){
        // Get the next tile's coordination
        ahead.x += dir.x;
        ahead.y += dir.y;

        // If the tile is out of bound, stop and reset counting
        if (ahead.x < 0 || ahead.x > size - 1 || ahead.y < 0 || ahead.y > size - 1){
            count = 0;
            break; 
        }

        // If the previous tile can interact on the current tile, stop counting
        if (nonLetter != ""){
            if ((level[ahead.y][ahead.x] == "@h" && nonLetter == "pb") || (level[ahead.y][ahead.x] == "il" && nonLetter == "pv")){
                count++;
                break;
            }
        }

        let type = level[ahead.y][ahead.x].charAt(0); // Get the tile's type

        // If the tile ahead is an immovable object
        // If the player is at the edge and the tile ahead is not empty
        // If the tile ahead is the flag and the current tile is a pushable block
        if ((type == '@' || type == 'i')
            || ((ahead.x + dir.x > size || ahead.x + dir.x < 0 || ahead.y + dir.y > size || ahead.y + dir.y < 0 ) && (type != "_" && type != "f"))
            || ((prevType == "b" || prevType == "p") && type == "f")){
            // Stop and reset counting
            count = 0;
            break; 
        }

        let end = false;

        switch (type){
            // If the ahead tile is a pushable block, keep counting
            case "b":
                hasLetter = true; // Found a letter tile
                prevType = type;
                nonLetter = "";
                break;

            case "p":
                prevType = type;
                nonLetter = level[ahead.y][ahead.x]; // Found a non-letter pushable tile
                break;

            // If the ahead tile is empty or a flag, stop counting
            case "_":
            case "f":
                end = true;
                break;

            // If the ahead tile is an item, reset counting if the player is pushing other objects too, else stop counting
            case "u":
                if (count > 0) count = 0;
                log.add(toggleBombCommand(true));
                end = true;
                break;
        }
        count++;

        if (end) break;
    }

    // If the player moves at all
    if (count > 0){
        let bridged = false;
        let beavered = false;

        scanBoard();

        if (level[ahead.y][ahead.x] == "@h") bridged = true;
        else if (level[ahead.y][ahead.x] == "il") beavered = true;

        // Update the player's tile
        log.add(replaceCommand(value(wiz.x, wiz.y, "ww", "__")));

        // If the player moved horizontally
        if (dir.x != 0){
            currentDir = "horizontal";
            // Update the level array based on the direction the player moved
            for (let x = ahead.x; x * dir.x > wiz.x * dir.x + 1; x -= dir.x)
                log.add(shiftCommand(mValue(x - dir.x, wiz.y, level[wiz.y][x], level[wiz.y][x - dir.x], dir))); 
            
            // Move the wizard in the array
            log.add(replaceCommand(value(wiz.x + dir.x, wiz.y + dir.y, level[wiz.y + dir.y][wiz.x + dir.x], "ww")));

            log.execute();
            
            // If the player pushed a letter, check to see if a new word is formed
            if (hasLetter && level[spawn.y][spawn.x].charAt(0) == "_")
                if (dir.x == -1){
                    for (let x = wiz.x - 2; x >= ahead.x; x--){
                        if (spawned) break;
                        if (level[wiz.y][x].charAt(0) == "b") scanLetter(x, wiz.y);
                    }
                } 
                else for (let x = wiz.x + 2; x <= ahead.x; x++){
                    if (spawned) break;
                    if (level[wiz.y][x].charAt(0) == "b") scanLetter(x, wiz.y);
                }

        // If the player moved vertically
        }else{
            currentDir = "vertical";
            // Update the level array based on the direction the player moved
            for (let y = ahead.y; y * dir.y > wiz.y * dir.y + 1; y -= dir.y) 
                log.add(shiftCommand(mValue(wiz.x, y - dir.y, level[y][wiz.x], level[y - dir.y][wiz.x], dir)));

            // Move the wizard in the array
            log.add(replaceCommand(value(wiz.x + dir.x, wiz.y + dir.y, level[wiz.y + dir.y][wiz.x + dir.x], "ww"))); 

            log.execute();

            // If the player pushed a letter, check to see if a new word is formed
            if (hasLetter && level[spawn.y][spawn.x].charAt(0) == "_")
                if (dir.y == -1){
                    for (let y = wiz.y - 2; y >= ahead.y; y--){
                        if (spawned) break;
                        if (level[y][wiz.x].charAt(0) == "b") scanLetter(wiz.x, y);
                    } 
                } 
                else for (let y = wiz.y + 2; y <= ahead.y; y++){
                    if (spawned) break;
                    if (level[y][wiz.x].charAt(0) == "b") scanLetter(wiz.x, y);
                }  
        }

        // If the player bridged a hole
        if (bridged){
            log.add(replaceCommand(value(ahead.x, ahead.y, "@h", "_h")));
            log.add(bridgeCommand({newVal: { x: ahead.x, y: ahead.y }, oldVal: hb}));
        }
        else if (beavered) log.add(replaceCommand(value(ahead.x, ahead.y, "il", "pv")));

        log.addExecute();
     
        // Update the wizard's coordination
        wiz.x = wiz.x + dir.x;
        wiz.y = wiz.y + dir.y;

        // If the player is on top of the flag, they win
        if (wiz.x == flag.x && wiz.y == flag.y) changeWin();

        // Play walking sound
        if (!sounds.walk.paused){
            sounds.walk.pause();
            sounds.walk.currentTime = 0;
        }
        sounds.walk.play();
    }
    // Player error sound
    else{
        if (!sounds.error.paused){
            sounds.error.pause();
            sounds.error.currentTime = 0;
        }
        sounds.error.play();
    }
}

// Scan the whole board to see if any spelt word is still being spelt
function scanBoard(){
    for (const key in foundSpelled){
        if (foundSpelled[key]){
            if (cooldown[key].begin.x == 99) foundSpelled[key] = false;
            else{
                let current;
                let temp = cooldown[key];
                // Check if the pushed letter makes a coherent spawnable word horizontally
                if (temp.begin.x == temp.end.x) current = scanLetterVertical(temp.begin.x, temp.begin.y + 1);
                else current = scanLetterHorizontal(temp.begin.x + 1, temp.begin.y);
                for (let i = 0; i < spawnCode.length; i++) if (current.code == spawnCode[i]) return;
                foundSpelled[key] = false;
            }
        }
    }
}

// Check if the player only moved the spelt word without creating a new one
// If statement checks for if the spelt word is within the boundary of where the old spelt word could have been moved to
// It also checks if the old spelt word is still in the level
function isInside(code, current){
    if (current.begin.x >= cooldown[code].begin.x - 1 && current.begin.y >= cooldown[code].begin.y - 1
        && current.end.x <= cooldown[code].end.x + 1 && current.end.y <= cooldown[code].end.y + 1 
        && currentDir == cooldown[code].dir
        && foundSpelled[code]) return true;
    else return false;
}

// Spawn the object on the level
function spawnObject(code, current){
    let reminder = true;
    // If the player only moved the spelt word without creating a new one, return false
    if (isInside(code, current)) reminder = false;

    // Update the cooldown object
    log.add(cooldownCommand({
        newVal: cValue(current.begin, current.end, (current.begin.x == current.end.x) ? "vertical" : "horizontal"),
        oldVal: cValue(cooldown[code].begin, cooldown[code].end, cooldown[code].dir),
        code: code
    }));
    if (!reminder) return false;

    // If the object is on the board, remove it
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            if (level[j][i] == code) { 
                log.add(replaceCommand(value(i, j, code, "__")));
                break; 
            }

    // Update object logger
    log.add(spawnItemCommand(code));
    foundSpelled[code] = true;
    spawned = true;
    return true;
}

// Check if the spelt word is meaningful, and spawn object if it is
function checkLetter(current){
    switch (current.code){
        case "BRIDGE":
            if (!spawnObject("pb", current)) return false;

            // Remove the bridged hole if there's any
            if (hb.x != 99){
                log.add(replaceCommand(value(hb.x, hb.y, level[hb.y][hb.x], "@h")));
                log.add(bridgeCommand({newVal: { x: 99, y: 99 }, oldVal: hb}));
            }
            return true;

        case "BEAVER":
            if (!spawnObject("pv", current)) return false;
            return true;

        case "BOMB":
            log.add(toggleBombCommand(false));
            if (!spawnObject("ub", current)) return false;
            return true;
    }

    return false;
}

// Use bomb
function useBomb(){
    if (!hasBomb) return;

    // Check the surrounding tiles - if the tile contains an explodable object, delete it
    if (wiz.y != 0) if (level[wiz.y - 1][wiz.x] == "ir" || level[wiz.y - 1][wiz.x] == "pc") log.add(replaceCommand(value(wiz.x, wiz.y - 1, level[wiz.y - 1][wiz.x], "__")));
    if (wiz.y != size - 1) if (level[wiz.y + 1][wiz.x] == "ir" || level[wiz.y + 1][wiz.x] == "pc") log.add(replaceCommand(value(wiz.x, wiz.y + 1, level[wiz.y + 1][wiz.x], "__")));
    if (wiz.x != 0) if (level[wiz.y][wiz.x - 1] == "ir" || level[wiz.y][wiz.x - 1] == "pc") log.add(replaceCommand(value(wiz.x - 1, wiz.y, level[wiz.y][wiz.x - 1], "__")));
    if (wiz.x != size - 1) if (level[wiz.y][wiz.x + 1] == "ir" || level[wiz.y][wiz.x + 1] == "pc") log.add(replaceCommand(value(wiz.x + 1, wiz.y, level[wiz.y][wiz.x + 1], "__")));
    log.add(toggleBombCommand(false));

    // Play explosion sound
    if (!sounds.explosion.paused){
        sounds.explosion.pause();
        sounds.explosion.currentTime = 0;
    }
    sounds.explosion.volume = 0.5;
    sounds.explosion.play();

    log.execute();
}

// Initiate cooldown object
function resetCooldown(){
    let temp = {};
    spawnables.forEach(o => { temp[o] = cValue({ x: 99, y: 99 }, { x: 99, y: 99 }, "")});
    cooldown = temp;
}

function initLevel(){
    // Deep copy array
    level = JSON.parse(JSON.stringify(layout)); 
    
    // Reset stats
    log = new Log();
    hasBomb = (currentLevel == "eight") ? true : false;
    hb = { x: 99, y: 99 };
    currentDir = "n/a";
    resetCooldown();
    for (const key in foundSpelled) foundSpelled[key] = false;
}

// load the JSON file
const loadLevel = json => {
    localStorage.setItem("hdt7280-level", JSON.stringify(json[currentLevel]));
    getLevel();
};

// Get level data
function getLevel(){
    loaded = true;
    layout = JSON.parse(localStorage.getItem("hdt7280-level"));
    initLevel();

    // Get level array data;
    size = level.length;
    length = Math.floor(730 / size);
}

// Caller function for other scripts
function changeLoaded(){ loaded = false; }
function changeWiz(value){ wiz = value; }
function updateHB(newX, newY){ hb = { x: newX, y: newY }; }
function updateFlag(newX, newY){ flag = { x: newX, y: newY }; }
function updateSpawn(newX, newY){ spawn = { x: newX, y: newY }; }


// #region Command Pattern
// Credits: https://www.dofactory.com/javascript/design-patterns/command
// Maintains a history of executed commands
class Command{
    constructor(execute, undo, value){
        this.execute = execute;
        this.undo = undo;
        this.value = value;
    }
};

/*---------------*/

//  value {
//      x: X coordinate
//      y: Y coordinate
//      oldVal: level[y][x]
//      newVal: level[y + Y-Coefficient][x + X-Coefficient]
//      dir: X and Y coefficients
//  }
//  Shift the tile to the direction mentioned on the function
function shift(value){ level[value.y + value.dir.y][value.x + value.dir.x] = value.newVal; }
function undoShift(value){ level[value.y + value.dir.y][value.x + value.dir.x] = value.oldVal; }

//  value {
//      newVal: new bridge coordinate
//      oldVal: old bridge coordinate
//  }
//  Change the bridge coordination
function bridge(value){ hb = value.newVal; }
function undoBridge(value){ hb = value.oldVal; }

//  value {
//      newVal: new spell coordinate, including XY coordinate and direction
//      oldVal: old spell coordinate, including XY coordinate and direction
//      code: the type of object
//  }
//  Change the cooldown property
function changeCooldown(value){
    cooldown[value.code].begin = value.newVal.begin;
    cooldown[value.code].end = value.newVal.end;
    cooldown[value.code].dir = value.newVal.dir;
}
function undoChangeCooldown(value){
    cooldown[value.code].begin = value.oldVal.begin;
    cooldown[value.code].end = value.oldVal.end;
    cooldown[value.code].dir = value.oldVal.dir;
}

//  value {
//      x: X coordinate where the tile was spotted, =99 if this type of tile is not on the board yet
//      y: Y coordinate where the tile was spotted, =99 if this type of tile is not on the board yet
//      oldVal: old level[y][x]
//      newVal: replacing old level[y][x]
//  }
//  Replace a tile
function replace(value){ level[value.y][value.x] = value.newVal; }
function undoReplace(value){ level[value.y][value.x] = value.oldVal; }

//  value: type of object
//  Spawn an object onto the level
function spawnItem(value){ level[spawn.y][spawn.x] = value; }
function undoSpawnItem(){ level[spawn.y][spawn.x] = "__"; }

// Toggle hasBomb
function toggleBomb(value){ hasBomb = value; }
function undoToggleBomb(value){ hasBomb = !value; }

/*---------------*/

// Caller function for commands
let shiftCommand = (value) => { return new Command(shift, undoShift, value); };
let spawnItemCommand = (value) => { return new Command(spawnItem, undoSpawnItem, value); };
let replaceCommand = (value) => { return new Command(replace, undoReplace, value); };
let bridgeCommand = (value) => { return new Command(bridge, undoBridge, value); };
let cooldownCommand = (value) => { return new Command(changeCooldown, undoChangeCooldown, value); };
let toggleBombCommand = (value) => {return new Command(toggleBomb, undoToggleBomb, value); };
// #endregion

export { updateHB, updateFlag, updateSpawn, checkLetter, changeLoaded, changeWiz, loadLevel, moving, initLevel, useBomb, level, size, length, spawn, flag, hb, loaded, log, hasBomb, wiz }; 