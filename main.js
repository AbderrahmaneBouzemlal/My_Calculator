const calculate = require('./calculator.js')
let buttons = document.querySelectorAll('.buttons > div');
let screen = document.querySelector('.screen');

let Expression = '';
let output = 0;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', showInTheScreen = function (event)
  {
    if (this.className == "orange") {
      output = calculate(Expression);
    }
    else {
      screen.innerText += this.innerText;
      Expression += this.innerText;
    }
  });
}
