import { calculate } from './calculator.js';

class Calculator {
  constructor() {
    this.buttons = document.querySelectorAll('.buttons > div');
    this.screen = document.querySelector('.screen');
    this.history = document.querySelector('.history');
    this.deleteButton = document.querySelector('#delete-history');
    this.expression = '';
    this.result = 0;
    this.id = 0;
    this.lastClick = false;
    this.screen.value = '';
    this.previewElement = document.querySelector('.preview-result');
    this.validationElement = document.querySelector('.validation-status');
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
    this.deleteButton.addEventListener('click', () => this.deleteAll());
    this.screen.addEventListener('input', this.handleScreenInput.bind(this));
    document.addEventListener('keydown', this.handleKeyboardInput.bind(this));
    this.keepFocus();
  }

  handleScreenInput(event) {
    this.expression = this.screen.value;
    this.validateAndPreCalculate();
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
      '*': () => this.updateExpression('×'),
      '/': () => this.updateExpression('÷'),
      ',': () => this.updateExpression('.')
    };

    if (specialMappings[key]) {
      specialMappings[key]();
      event.preventDefault();
    } else if (allowedPattern.test(key) && key !== "Backspace") {
      this.updateExpression(key);
      event.preventDefault();
    }
    this.keepFocus();
  }


  validateAndPreCalculate() {
    const expression = this.screen.value.trim();

    if (expression.length === 0) {
      this.clearValidationFeedback();
      return;
    }

    const validationResults = this.expressionValidation(expression);

    if (validationResults.isValid) {
      try {
        const previewResult = calculate(expression);

        if (isNaN(previewResult)) {
          this.showValidationFeedback('warning', 'Incomplete calculation');
          this.clearPreviewResult();
        } else {
          this.showValidationFeedback('success', 'Valid expression');
          this.showPreviewResult(previewResult);
        }
      } catch (error) {
        this.showValidationFeedback('error', 'Cannot calculate');
        this.clearPreviewResult();
      }
    } else {
      this.showValidationFeedback('error', validationResults.message);
      this.clearPreviewResult();
    }
  }


  expressionValidation(expression) {
    const checks = [
      {
        test: () => expression.length === 0,
        message: 'Empty expression'
      },
      {
        test: () => /[+\-×÷^%]$/.test(expression),
        message: 'Expression cannot end with an operator'
      },
      {
        test: () => /\($/.test(expression),
        message: 'Unclosed parenthesis'
      },
      {
        test: () => {
          const openParens = (expression.match(/\(/g) || []).length;
          const closeParens = (expression.match(/\)/g) || []).length;
          return openParens !== closeParens;
        },
        message: 'Mismatched parentheses'
      },
      {
        test: () => /\.{2,}/.test(expression),
        message: 'Multiple consecutive decimal points'
      }
    ];

    for (let check of checks) {
      if (check.test()) {
        return { isValid: false, message: check.message };
      }
    }

    return { isValid: true, message: 'Valid expression' };
  }

  showValidationFeedback(status, message) {
    if (!this.validationElement) return;
    this.validationElement.textContent = message;
    this.validationElement.className = `validation-status ${status}`;
  }

  clearValidationFeedback() {
    if (!this.validationElement) return;
    this.validationElement.textContent = '';
    this.validationElement.className = 'validation-status';
  }

  showPreviewResult(result) {
    if (!this.previewElement) return;
    this.previewElement.textContent = `= ${result}`;
    this.previewElement.style.display = 'block';
  }

  clearPreviewResult() {
    if (!this.previewElement) return;
    this.previewElement.textContent = '';
    this.previewElement.style.display = 'none';
  }


  clearCalculator() {
    this.expression = '';
    this.screen.value = '';
    this.lastClick = false;
    this.keepFocus();
  }

  calculateResult() {
    if (this.expression === '') return;
  
    // if (!this.isValidExpression(this.expression)) return;

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
      historyDivElement.className = 'history-div-element';
    historyDivElement.innerHTML = `
      <span class="history-expression" id="${this.id}">${this.expression}</span>
      <span class="equal">=</span>
      <span class="history-result" id="${this.id}">${this.result}</span>
    `;
    this.history.appendChild(historyDivElement);
    this.history.scrollTop = this.history.scrollHeight;
    this.screen.value = this.result;
    this.expression = this.result.toString();
    this.lastClick = true;
    this.id++;
  } catch (error) {
    this.handleError('Calculation Error');
  }

  this.keepFocus();
  }

  deleteAll() {
    const elements = document.querySelectorAll('.history-div-element');
    for (let element of elements) {
      element.remove();
    }
    elements.remove();
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
    this.validateAndPreCalculate();
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
    this.screen.value = '';
    this.expression = '';
    this.lastClick = false;
    this.screen.focus();
  }
}

const calculator = new Calculator();