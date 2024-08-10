class Button{
    constructor(slug, x, y, width, height, img, highlight){
        this.slug = slug;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.highlight = highlight;

        this.ctx = document.querySelector('canvas').getContext('2d');
        this.inside = false;
    }

    // Draw the button on the screen
    draw(){
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        // If the player is hovering over the button, highlight it
        if (this.inside) this.ctx.drawImage(this.highlight, this.x, this.y, this.width, this.height);
    }

    // Check if the mouse is inside the button
    isInside(pos){
        return pos.x > this.x - 5 
            && pos.y > this.y - 5
            && pos.x < this.x + this.width - 11 
            && pos.y < this.y + this.height - 11; 
    }

    // Print the button possition
    printPos(){
        console.log(this.x, this.y);
    }
}

export {Button};
// credit: https://stackoverflow.com/questions/24384368/simple-button-in-html5-canvas
//         https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault