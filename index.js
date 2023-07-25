let btns = document.querySelectorAll('.btn');
let display = document.querySelector('.display');
let previous = document.querySelector('.previous');

const operators = ['power', 'multiply','divide','remainder', 'add', 'subtract'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const funcs = ['sqrt', 'factorial'];

//this uses the unique data value for each button to assign a function with the same value.
//the data value for the + icon is add and so is its function.

display.addEventListener('animationend', () => {
    display.style.animation = 'none';
});

btns.forEach(b => {
    //console.log(b.getAttribute('data'));
    assignBtn(b);
});

let entry = [];
let currentANS;

//okay this is fucking awesome just discovered this application of prototypes.
//everytime we push to array we can update the display
entry.push = function() {
    Array.prototype.push.apply(this, arguments);
    updateDisplay();
}

function assignBtn(b) {
    b.addEventListener('click', alterColor);
    b.addEventListener('animationend', () => {
        b.style.animation = 'none';
    });
    let atr = b.getAttribute('data');
    if(operators.includes(atr)) {
        b.addEventListener('click', insertOp);
    } else if(numbers.includes(atr)) {
        b.addEventListener('click', insertNum);
    } else if(atr == 'backspace') {
        b.addEventListener('click', removeLastEntry);
    } else if(atr =='clear') {
        b.addEventListener('click', clearDisplay);
    } else if(atr =='equal') {
        b.addEventListener('click', equals);
    } else if(atr == 'left-para') {
        b.addEventListener('click', insertLeftP);
    } else if(atr =='right-para') {
        b.addEventListener('click', insertRightP);
    } else if(atr =='ANS') {
        b.addEventListener('click', insertANS);
    } else if(funcs.includes(atr)) {
        b.addEventListener('click', insertFunc);
    } else if(atr == '.') {
        b.addEventListener('click', insertDecimal);
    }
}

function alterColor() {
    this.style.animation = 'darken .1s'
}

window.addEventListener('keydown', key => {
    console.log(key.code);
    let findBtn = name => Array.from(btns).filter(b => b.getAttribute('data') == name)[0];
    if(key.shiftKey) {
        switch(key.code) {
            case 'Digit9': findBtn('left-para').click(); break;
            case 'Digit0': findBtn('right-para').click(); break;
            case 'Digit5': findBtn('remainder').click(); break;
            case 'Digit1': findBtn('factorial').click(); break;
            case 'Digit6': findBtn('power').click(); break;       
            case 'Equal': findBtn('add').click(); break;           
            case 'Digit8': findBtn('multiply').click(); break;   
        }
    } else if(key.ctrlKey && key.code == 'KeyV') {
        findBtn('ANS').click();
    } else {
        switch(key.code) {
            case 'Enter': case 'NumpadEnter': case 'Equal': findBtn('equal').click(); break;
            case 'Minus': case 'NumpadSubtract': findBtn('subtract').click(); break;
            case 'NumpadAdd': findBtn('add').click(); break;
            case 'NumpadMultiply': findBtn('multiply').click(); break; 
            case 'NumpadDivide': case 'Slash': findBtn('divide').click(); break;
            case 'Period': case 'NumpadDecimal': findBtn('.').click(); break;
            case 'Backspace': findBtn('backspace').click(); break;
        }

        if(key.code.substring(0, key.code.length-1) == 'Digit'|| (key.code.substring(0, key.code.length-1) == 'Numpad' && !isNaN(key.code[key.code.length-1]))) {
            findBtn(key.code[key.code.length-1]).click();
        }
    }
});

function insertOp() {
    //console.log(this.getAttribute('data'));
    if(!operators.includes(entry[entry.length-1]) && entry.length != 0) {
        entry.push(this.getAttribute('data'));
    }
    else {
        console.log("You may not enter two operators in a row!");
        invalidInput();
    }
}

function insertNum() {
    //console.log(this.getAttribute('data'));
    if(!isNaN(entry[entry.length-1]) || (entry.length != 0 && entry[entry.length-1].includes('.'))) {
        entry[entry.length-1] += this.getAttribute('data');
        updateDisplay();
    } else {
        entry.push(this.getAttribute('data'));
    }
    
}

function insertDecimal() {
    if(entry.length != 0 && entry[entry.length-1].includes('.')) invalidInput();
    else if(!isNaN(entry[entry.length-1])) {
        entry[entry.length-1] += this.getAttribute('data');
        updateDisplay();
    } else {
        entry.push('0.');
    }
}

function insertFunc() {
    entry.push(this.getAttribute('data'));
    insertLeftP();
    
}

function insertANS(){
    if(currentANS != null)
        entry.push(this.getAttribute('data'));
    else invalidInput();
}

function insertLeftP() {
    entry.push('left-para');
}

function insertRightP() {
    let [lpCount, rpCount] = countPara();
    if(operators.includes(entry[entry.length-1]) || lpCount <= rpCount || entry[entry.length-1] == 'left-para') {
        invalidInput();
    } else {
        entry.push('right-para');
    }
}

function countPara() {
    let lpCount = 0;
    let rpCount = 0;
    entry.forEach(e => {
        if(e == 'left-para') lpCount++;
        else if(e == 'right-para') rpCount++; 
    })

    return [lpCount, rpCount];
}

function updateDisplay() {
    let toDisplay = entry.map(e => {
        
        switch(e) {
            case 'factorial': return '!';
            case 'sqrt': return '\u221A';
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '*';
            case 'divide': return '\u00F7';
            case 'remainder': return '%';
            case 'left-para':return '(';
            case 'right-para':return ')';
            case 'power': return '^';
            default: return e;
        }
    });
    display.textContent = toDisplay.join('');
}

function removeLastEntry() {
    //if the last index of the entry is a string of numbers that just delete that last index of the string
    //if it is just a value in the entry array we can just pop it
    if(entry[entry.length-1].length > 1 && !isNaN(entry[entry.length-1]))
        entry[entry.length-1] = entry[entry.length-1].substring(0, entry[entry.length-1].length-1);
    else
        entry.pop();
    updateDisplay();
}

function invalidInput() {
    display.style.animation = 'invalidShake .25s';
}

function clearDisplay() {
    entry.length = 0;
    updateDisplay();
}

function equals() {
    
    let [lpCount, rpCount] = countPara();

    if(operators.includes(entry[entry.length-1]) || entry.length == 0 || lpCount != rpCount) invalidInput();
    else {

        if(currentANS != null) {
            for(let i = 0; i < entry.length; i++) {
                entry[i] = entry[i] == 'ANS' ? currentANS : entry[i];
            }
        }
        calculate(entry);
        funcs.forEach(f => handleFunc(f, entry));
        operators.forEach(o => handleOperator(o, entry));

        if(entry.length == 1) {
            currentANS = entry[0];
            previous.textContent = 'ANS = ' + entry[0];
            entry.length = 0;
        }

        updateDisplay();
    }   
    
}

function calculate(array) {
    for(;;) {
        removeExtraDecimals(array);
        fillMultipliers(array);
        let [subArray, lP, rP] = findPara(array);
        if(subArray != 0) {
            for(;lP < rP; rP--) {
                array.splice(lP, 1);
            }
            array[lP] = calculate(subArray);        
        } else {
            funcs.forEach(f => handleFunc(f, array));
            operators.forEach(o => handleOperator(o, array));
            break;
        }
    }
    

    
    
    return array[0];
}

function handleFunc(func, array) {
    for(;array.includes(func);) {
        let fIndex = array.indexOf(func);

        let val = array[fIndex+1];

        switch(func) {
            case 'sqrt': result = Math.sqrt(val); break;
            case 'factorial': result = factorial(val);
            default: console.log('Unexpected func');
        }
        
        array.splice(fIndex, 1);
        array[fIndex] = result;
    }
    
}

const factorial = function(a, total = 1) {
	return a == 0 ? total : factorial(a - 1, total*a);
};

function handleOperator(operator, array) {
    for(;array.includes(operator);) {
        let op = array.indexOf(operator);   
        
        let a = array[op - 1];
        let b = array[op + 1];
        
        switch(operator) {
            case 'power': result = Math.pow(a,b); break;
            case 'multiply': result = a * b; break;
            case 'divide' : result = a / b; break;
            case 'remainder' : result = a % b; break;
            case 'add' : result = parseFloat(a) + parseFloat(b); break;
            case 'subtract' : result = parseFloat(a) - parseFloat(b); break;
            default: console.log('Unexpected operator'); break;
        }

        array.splice(op, 1);
        array.splice(op, 1);
        array[op-1] = result;
    }
}

function findPara(array) {
    let lContext = 0;
    let rContext = 0;
    for(let i = 0; i < array.length; i++) {
        if(array[i] == 'left-para') lContext = i;
        if(array[i] == 'right-para') rContext = i;
        if(rContext != 0) return [array.slice(lContext+1, rContext), lContext, rContext];
    }

    return [0,0,0];
}

function fillMultipliers(array) {
    for(let i = 0; i < array.length - 1; i++) {
        if((!isNaN(array[i]) || array[i] == 'ANS') && (!isNaN(array[i+1]) || array[i+1] == 'ANS')) {
            array.splice(i+1, 0, 'multiply');
        }
    }
}

function removeExtraDecimals(array) {
    for(let i = 0; i < array.length; i++) {
        if(array[i][array[i].length - 1] == '.')
            array[i] = array[i].substring(0, array[i].length - 1);
    }
}