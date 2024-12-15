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
    if (key.includes[['Shift', 'Control']]) {
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

  isValidExpression(expression) {
    expression = expression.trim();

    if (expression.length === 0) {
      this.handleError('Empty Expression');
      return false;
    }

    const incompletePatterns = [
      /[+\-×÷^%]$/,
      /\($/,
      /\.[+\-×÷^%]/,
    ];

    for (let pattern of incompletePatterns) {
      if (pattern.test(expression)) {
        this.handleError('Incomplete Expression');
        return false;
      }
    }

    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      this.handleError('Mismatched Parentheses');
      return false;
    }

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
  
    if (!this.isValidExpression(this.expression)) return;

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
    historyDivElement.innerHTML = `
      <span class="history-expression">${this.expression}</span>
      <span class="history-result">= ${this.result}</span>
    `;
    this.history.appendChild(historyDivElement);
    
    this.history.scrollTop = this.history.scrollHeight;

    this.screen.value = this.result;
    this.expression = this.result.toString();
    this.lastClick = true;
  } catch (error) {
    this.handleError('Calculation Error');
  }
  
  this.keepFocus();
  }

  updateExpression(buttonText) {
    const operators = ['+', '-', '×', '÷', '^', '%'];
    const lastChar = this.expression.slice(-1);

    if (operators.includes(lastChar) && operators.includes(buttonText)) {
      this.expression = this.expression.slice(0, -1) + buttonText;
      this.screen.value = this.expression;
      return;
    }

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
      this.expression += buttonText;
      this.screen.value += buttonText;
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
    const errorDisplay = document.body.createElement('div');
    errorDisplay.className = 'error-notification';
    errorDisplay.style.backgroundColor = 'red';
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