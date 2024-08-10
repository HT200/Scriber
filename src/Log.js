// Command receiver
class Log{
    constructor(){
        this.current = [];
        this.commands = [];
    }

    // Add command to the list
    add(command){
        this.current.push(command);
    }

    // Run all the saved commands
    execute(){
        if (this.current.length == 0) return;
        this.current.forEach(c => {if (c.execute != undefined) c.execute(c.value)});
        this.commands.push(this.current);
        this.current = [];
    }

    // Run all the new saved commands after execute ran
    addExecute(){
        if (this.current.length == 0) return;
        this.current.forEach(c => {
            if (c.execute != undefined) c.execute(c.value);
            this.commands[this.commands.length - 1].push(c)
        });
        this.current = [];
    }

    // Undo all commands
    undo(){
        if (this.commands.length == 0) return;
        this.current = this.commands.pop();
        for (let i = this.current.length - 1; i >= 0 ; i--) if (this.current[i].undo != undefined) this.current[i].undo(this.current[i].value)
        this.current = [];
    }
}

export { Log };