let btns = document.querySelectorAll('.btn');
let display = document.querySelector('.display');

const operators = ['add', 'subtract','multiply','divide','remainder'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//this uses the unique data value for each button to assign a function with the same value.
//the data value for the + icon is add and so is its function.

display.addEventListener('animationend', () => {
    display.style.animation = 'none';
});

btns.forEach(b => {
    console.log(b.getAttribute('data'));
    assignBtn(b);
});

let entry = [];

function assignBtn(b) {
    
    let atr = b.getAttribute('data');
    if(operators.includes(atr)) {
        b.addEventListener('click', insertOp);
    } else if(numbers.includes(atr)) {
        b.addEventListener('click', insertNum);
    }
}

function insertOp() {
    //console.log(this.getAttribute('data'));
    if(!operators.includes(entry[entry.length-1])) {
        entry.push(this.getAttribute('data'));
        updateDisplay();
    }
    else {
        console.log("You may not enter two operators in a row!");
        invalidInput();
    }
}

function insertNum() {
    //console.log(this.getAttribute('data'));
    entry.push(this.getAttribute('data'));
    updateDisplay();
}

function updateDisplay() {
    let toDisplay = entry.map(e => {
        
        switch(e) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '*';
            case 'divide': return '\u00F7';
            default: return e;
        }
    });
    display.textContent = toDisplay.join('');
}

function invalidInput() {
    display.style.animation = 'invalidShake .25s';
}