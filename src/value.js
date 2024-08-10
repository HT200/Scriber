function value(x = 99, y = 99, oldVal = "", newVal = ""){
    return{
        x: x,
        y: y,
        oldVal: oldVal,
        newVal: newVal
    }
}

function mValue(x = 99, y = 99, oldVal = "", newVal = "", dir){
    return{
        x: x,
        y: y,
        oldVal: oldVal,
        newVal: newVal,
        dir: dir
    }
}

function cValue(begin, end, dir){
    return{
        begin: begin,
        end: end,
        dir: dir
    }
}

export { value, mValue, cValue };