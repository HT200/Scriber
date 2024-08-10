let sounds = {};

addSound('sounds/walk.mp3',"walk");
addSound('sounds/error.mp3',"error");
addSound('sounds/explosion.mp3',"explosion");
addSound('sounds/button.mp3',"button");

// Add sound to the sounds object
function addSound(url, ref){
    let audio = new Audio(url);
    sounds[ref] = audio;
}

export {sounds};