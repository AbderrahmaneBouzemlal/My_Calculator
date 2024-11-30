import { calculate } from './calculator.js';

class Calculator {
  constructor() {
    this.buttons = document.querySelectorAll('.buttons > div');
    this.screen = document.querySelector('.screen');
    this.history = document.querySelector('.history');
    this.expression = '';
    this.result = 0;
    this.lastClick = false;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.handleButtonClick(button));
    });
  }

  handleButtonClick(button) {
    const buttonText = button.innerText;
    
    if (buttonText === 'C') {
      this.clearCalculator();
      return;
    }

    if (button.className === "orange") {
      this.calculateResult();
      return;
    }

    this.updateExpression(button);
  }

  clearCalculator() {
    this.expression = '';
    this.screen.innerText = '';
    this.lastClick = false;
  }

  calculateResult() {
    if (this.expression === '') return;

    try {
      this.result = calculate(this.expression);
      
      if (isNaN(this.result)) {
        this.handleError('Math Error');
        return;
      }

      if (this.result === undefined) {
        this.handleError('Invalid Expression');
        return;
      }
      const historyDivElement = document.createElement("div");
      historyDivElement.innerText = `${this.expression} = ${this.result}`;
      this.history.appendChild(historyDivElement);
      this.screen.innerText = this.result;
      this.expression = '';
      this.lastClick = true;
    } catch (error) {
      this.handleError('Calculation Error');
    }
  }

  updateExpression(button) {
    let buttonText = button.innerText;
    if (button.innerText === 'x²') {
      buttonText = '²';
    }

    if (this.lastClick) {
      if (/\d/.test(buttonText)) {
        this.expression = buttonText;
        this.screen.innerText = buttonText;
      } else if (/[\+\-÷√×²%()^]/.test(buttonText)) {
        this.expression = this.result.toString() + buttonText;
        this.screen.innerText = this.expression;
      }
      this.lastClick = false;
    } else {
      this.screen.innerText += buttonText;
      this.expression += buttonText;
    }
  }

  handleError(message) {
    alert(message);
    this.screen.innerText = '';
    this.expression = '';
    this.lastClick = false;
  }
}

const calculator = new Calculator();