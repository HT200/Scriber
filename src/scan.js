import { checkLetter, level, size } from "./game.js";

// Check if after pushing the letter, if anything can be spawned
function scanLetter(x, y){
    // Check if the pushed letter makes a coherent spawnable word horizontally
    let current = scanLetterHorizontal(x, y);

    // If there was no spawned object
    if (!checkLetter(current))
    {
        // Check if the pushed letter makes a coherent spawnable word vertically
        current = scanLetterVertical(x, y);
        checkLetter(current);
    }
}

// Scan if the pushed letter forms a coherent spawnable word horizontally
function scanLetterHorizontal(x, y){
    // Add the current letter to the word
    let code = level[y][x].charAt(1);
    let begin = { x: x, y: y };
    let end = { x: x, y: y };

    if (x > 0){
        begin.x--;

        // While there is still letter/space to the left of the current letter
        while (begin.x >= 0){
            // If it is a letter, add it at the beginning of the word
            if (level[y][begin.x].charAt(0) == "b") code = level[y][begin.x].charAt(1).concat(code);
            else{
                begin.x++;
                break;
            }
            begin.x--;
        }
    }
    if (begin.x == -1) begin.x = 0;
    
    if (x < size - 1){
        end.x++;

        // While there is still letter/space to the right of the current letter
        while (end.x < size){
            // If it is a letter, add it at the end of the word
            if (level[y][end.x].charAt(0) == "b") code = code.concat(level[y][end.x].charAt(1));
            else{
                end.x--;
                break;
            } 
            end.x++;
        }
    }
    if (end.x == size) end.x = size - 1;

    return {
        begin: begin,
        end: end,
        code: code
    };
}

// Scan if the pushed letter forms a coherent spawnable word vertically
function scanLetterVertical(x, y){
    // Add the current letter to the word
    let code = level[y][x].charAt(1);
    let begin = { x: x, y: y };
    let end = { x: x, y: y };

    if (y > 0){
        begin.y--;

        // While there is still letter/space to the left of the current letter
        while (begin.y >= 0){
            // If it is a letter, add it at the beginning of the word
            if (level[begin.y][x].charAt(0) == "b") code = level[begin.y][x].charAt(1).concat(code);
            else{
                begin.y++;
                break;
            }
            begin.y--;
        }
        if (begin.y == -1) begin.y = 0;
    }
    
    if (y < size - 1){
        end.y++;

        // While there is still letter/space to the right of the current letter
        while (end.y < size){
            // If it is a letter, add it at the end of the word
            if (level[end.y][x].charAt(0) == "b") code = code.concat(level[end.y][x].charAt(1));
            else{
                end.y--;
                break;
            }
            end.y++;
        }
        if (end.y == size) end.y = size - 1;
    }

    return {
        begin: begin,
        end: end,
        code: code
    };
}

export { scanLetterHorizontal, scanLetterVertical, scanLetter };