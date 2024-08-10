import {images} from "./image.js";
import {Button} from "./Button.js";
import {sounds} from "./sound.js";

let instruction = false;
let active = true;
let gameState = 0;
let canvas = document.querySelector('canvas');
let onButton, currentLevel;

let buttons = {
    ui: {},
    title: {},
    level: {}
};

// Create buttons
addButton(buttons.title, "start", 210, 425, 340, 170, images.start, images["trans-big"]);
addButton(buttons.ui, "level", 40, 795, 340, 170, images.level, images["trans-brown"]);
addButton(buttons.ui, "instruction", 410, 795, 340, 170, images.empty, images["blank"]);
addButton(buttons.level, "one", 45, 220, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "two", 220, 220, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "three", 395, 220, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "four", 570, 220, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "five", 45, 395, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "six", 220, 395, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "seven", 395, 395, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "eight", 570, 395, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "nine", 45, 570, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "ten", 220, 570, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "eleven", 395, 570, 160, 160, images.elevel, images["blank"]);
addButton(buttons.level, "twelve", 570, 570, 160, 160, images.elevel, images["blank"]);

canvas.onmousemove = e => {
    let mousePos = getMousePos(e);
    onButton = "";

    e.preventDefault();
    e.stopPropagation();

    // If the mouse moves on top of the button, highlight the button
    mouseMoved(buttons.ui, mousePos);
    if (active){
        if (gameState == 0) mouseMoved(buttons.title, mousePos);
        else if (gameState == 1) mouseMoved(buttons.level, mousePos);
    }

    if (onButton == "") document.body.style.cursor = "auto";
};

// Button's functionality
canvas.onclick = () => { 
    if (onButton != ""){
        console.log(onButton);
        switch (onButton){
            // Show level selection screen and update cursor style
            case "start":
                document.body.style.cursor = "auto";
                gameState = 1;
                break;

            // Show level selection screen
            case "level":
                gameState = 1;
                instruction = false;
                active = true;
                break;

            // Toggle instruction panel based on the instruction state
            case "instruction":
                if (instruction){
                    instruction = false;
                    active = true;
                }
                else {
                    instruction = true;
                    active = false;
                }
                break;

            // Load level based on which level button is pressed
            case "one":
            case "two":
            case "three":
            case "four":
            case "five":
            case "six":
            case "seven":
            case "eight":
            case "nine":
            case "ten":
            case "eleven":
            case "twelve":
                document.body.style.cursor = "auto";
                currentLevel = onButton;
                gameState = 2;
                break;
        }

        // Play button sound
        if (!sounds.button.paused){
            sounds.button.pause();
            sounds.button.currentTime = 0;
        }
        sounds.button.volume = 0.5;
        sounds.button.play();
    }
}

// Get mouse position
function getMousePos(e){
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Toggle highlight on the button depend on the cursor's position with respect to the button
function mouseHelper(b, mousePos){
    if (b.isInside(mousePos)){
        b.inside = true;
        document.body.style.cursor = "pointer";
        onButton = b.slug;
    } else b.inside = false;
}

// Loop through all the available buttons
function mouseMoved(b, mousePos){
    for (const key in b) mouseHelper(b[key], mousePos);
}

// Add the button to the buttons object
function addButton(buttons, slug, x, y, width, height, img, highlight){
    let temp = new Button(slug, x, y, width, height, img, highlight);
    buttons[slug] = temp;
}

export {gameState, buttons, instruction, currentLevel};