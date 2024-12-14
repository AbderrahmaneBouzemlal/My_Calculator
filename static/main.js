import { calculate } from './calculator.js';

class Calculator {
  constructor() {
    this.buttons = document.querySelectorAll('.buttons > div');
    this.screen = document.querySelector('.screen');
    this.history = document.querySelector('.history');
    this.message = document.querySelector('.screen-container .message');
    this.expression = '';
    this.result = 0;
    this.lastClick = false;
    this.screen.value = '';
    this.screen.focus();
    this.initializeEventListeners();
  }

  keepFocus() {
    setTimeout(() => this.screen.focus(), 0);
  }

  initializeEventListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.handleButtonClick(button));
    });
    this.screen.addEventListener('input', this.handleScreenInput.bind(this));
    document.addEventListener('keydown', this.handleKeyboardInput.bind(this));
    this.keepFocus();
  }

  handleScreenInput(event) {
    this.expression = this.screen.value;
  }

  handleKeyboardInput(event) {
    const key = event.key;
    const allowedPattern = /[\d\.,\+\-÷\*√×%()^²]/;
    if (key.includes[['Shift', 'Controle']]) {
      this.shorCutsProcessing(event.key);
      return;
    }
    const specialMappings = {
      'Enter': () => this.calculateResult(),
      'Escape': () => this.clearCalculator(),
      '*': () => this.addToExpression('×'),
      '/': () => this.addToExpression('÷'),
      ',': () => this.addToExpression('.')
    };

    if (specialMappings[key]) {
      specialMappings[key]();
      event.preventDefault();
    } else if (allowedPattern.test(key) && key !== "Backspace") {
      this.addToExpression(key);
      event.preventDefault();
    }
  }

  addToExpression(character) {
    if (this.isValidInput(character)) {
      this.updateExpression(character);
    }
  }

  isValidInput(expression) {
    return true;
  }

  clearCalculator() {
    this.expression = '';
    this.screen.value = '';
    this.lastClick = false;
    this.keepFocus();
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
      this.screen.value = this.result;
      this.expression = '';
      this.lastClick = true;
    } catch (error) {
      this.handleError('Calculation Error');
    }
    this.keepFocus();
  }

  updateExpression(buttonText) {
    if (buttonText === 'x²') {
      buttonText = '²';
    }

    if (this.lastClick) {
      if (/\d/.test(buttonText)) {
        this.expression = buttonText;
        this.screen.value = buttonText;
      } else if (/[\+\-÷√×²%()^]/.test(buttonText)) {
        this.expression = this.result.toString() + buttonText;
        this.screen.value = this.expression;
      }
      this.lastClick = false;
    } else {
      this.screen.value += buttonText;
      this.expression += buttonText;
    }
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
    this.updateExpression(button.innerText);
    this.keepFocus();
  }


  handleError(message) {
    const errorDisplay = document.createElement('div');
    errorDisplay.classList.add('error-notification');
    errorDisplay.textContent = message;
    document.body.appendChild(errorDisplay);

    setTimeout(() => {
      document.body.removeChild(errorDisplay);
    }, 3000);

    this.screen.value = '';
    this.expression = '';
    this.lastClick = false;
    this.screen.focus();
  }
}

const calculator = new Calculator();