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
console.log(data, data.length);