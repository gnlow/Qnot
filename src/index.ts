// Polyfill
interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
/* */
const key = {
    lower: Array.from("abcdefghijklmnopqrstuvwxyz"),
    upper: Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
};

function nextOf(char: string){
    return (key.lower.indexOf(char) == -1)?key.upper[key.upper.indexOf(char)+1]:key.lower[key.lower.indexOf(char)+1];
}
function lowOf(char: string){
    return key.lower[key.upper.indexOf(char)];
}

class Char {
    index: number;
    case: "lower" | "upper";
    constructor(char: string){
        if(key.lower.includes(char)){
            this.case = "lower";
            this.index = key.lower.indexOf(char);
        }else{
            this.case = "upper";
            this.index = key.upper.indexOf(char);
        }
    }
    get char() {
        return key[this.case][this.index];
    }
    lower(): this {
        this.case = "lower";
        return this;
    }
    upper(): this {
        this.case = "upper";
        return this;
    }
    next(): this {
        this.index++;
        return this;
    }
    prev(): this {
        this.index--;
        return this;
    }
    copy(): Char {
        return new Char(this.char);
    }
}

const random = (range: number) => {
    return Math.floor(Math.random() * range);
}
const run = (
        able: Char[], 
        index: number, 
        result: Char[], 
        length: number,
) => {
    let select = able[index];
    result.push(select);
    able.splice(index, 1);
    if(select.case == "upper"){
        if(select.index < length - 1){
            able.push(select.copy().next());
        }
        able.push(select.copy().lower());
    }
    let output: string[] = [];
    if(result.length == length * 2){
        output = [result.map(char => char.char).join("")];
    }
    able.forEach((x, index, list) => {
        output.push(...run(Array.from(list), index, Array.from(result), length));
    });
    return output;
}

const qnot = (length: number) => {
    return run([new Char("A")], 0, [], length);
}
var data = qnot(3);
var cr = (code: string) => {
    var crosses = [];
    for(var i=0;i<3;i++){
        crosses.push((code.match(new RegExp(`${key.upper[i]}(.*)${key.lower[i]}`)) as Array<any>)[1].length);
    }
    return crosses;
};

var sz = (code: string) => {
    let arr = [...code].map(str => new Char(str));
    let lows = arr.filter(char => char.case == "lower");
    let lineds: string[][] = [];
    let crosses: boolean[] = [];
    let expects: Array<"o" | "x" | "-"> = [];
    let curState: boolean[] = [];
    for(var i=0;i<code.length;i++){ // Initialize
        lineds.push([]);
        crosses.push(false);
        expects.push("-");
        curState.push(true);
    }
    var testOK = true;
    lows.forEach(low => {
        var upIndex = arr.findIndex(v => v.char == low.copy().upper().char);
        var lowIndex = arr.findIndex(v => v.char == low.char);
        if(curState[upIndex] != curState[lowIndex]){
            testOK = false;
        }
        if(lineds[upIndex].length){
            crosses[lowIndex] = true;
        }
        console.log(low.copy().upper().char, upIndex, lowIndex)
        for(var i=upIndex+1;i<lowIndex;i++){
            lineds[i].push(low.char);
            curState[i] = !curState[i];
        }
    });
    
    let state = true;
    let states: boolean[] = [];
    for(var i=0;i<code.length;i++){ // Check
        if(crosses[i]){
            state = !state;
        }
        states.push(state);
    }
    let ok = true;
    lows.forEach(low => {
        var upIndex = arr.findIndex(v => v.char == low.copy().upper().char);
        var lowIndex = arr.findIndex(v => v.char == low.char);
        if(lineds[upIndex].length){
            expects[lowIndex] = "-";
        }else{
            expects[lowIndex] = states[upIndex]?"o":"x";
            if(states[lowIndex] != states[upIndex]){
                ok = false;
            }
        }
    });
    console.log(
`
code  : ${code}
lines : ${lineds.map(x=>x.length).join("")}
cross : ${crosses.map(x=>x?"x":" ").join("")}
state : ${states.map(o=>o?"o":"x").join("")}
expect: ${expects.join("")}
ok?   : ${ok}
tOK?  : ${testOK}
`)
    return lineds;
};

var cz = (code: string) => {
    let lines = Array(3*2).fill(0);
    let state = false;
    let states: boolean[] = [];
    let expects: string = "";
    let lc: number[] = [];
    let possible = true;
    for(var [index, charStr] of [...code].entries()){
        let char = new Char(charStr);
        if(char.case == "lower"){
            var upperI = code.indexOf(char.copy().upper().char);
            var expect = states[upperI];
            if(lines[upperI]){
                if(lines[upperI]%2 == 1){
                    state = !state;
                    expect = !expect;
                }
            }
            lc.push(lines[upperI]);
            expects += +expect;
            if(state != expect){
                possible = false;
            }
            for(var i=upperI;i<index+1;i++){
                lines[i]++;
            }
        }else{
            expects += " ";
            lc.push(0);
        }
        states.push(state);
    }
    return `\n${states.map(b => +b).join("")}\n${lc.join("")}\n${expects}\n${possible}\n`;
};
data.forEach((x, i) => (sz(x)));