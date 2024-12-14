const { tokenize, parse, evaluate, recursiveParseParen, calculate } = require('./calculator.js');

describe('Calculator Tests', () => {
  test('Tokenization: simple addition', () => {
    const expression = '3 + 5';
    expect(tokenize(expression)).toStrictEqual(['3', '+', '5']);
  });


  test('Tokenization: complex expression', () => {
    const expression = '3 + 5 × (2 - 8)';
    expect(tokenize(expression)).toStrictEqual([
      '3', '+', '5', '×', '(', '2', '-', '8', ')'
    ]);
  });


  test('Parsing: simple addition', () => {
    const tokens = ['3', '+', '5'];
    const ast = parse(tokens);
    expect(ast).toStrictEqual({
      type: 'operator',
      value: '+',
      left: { type: 'number', value: 3 },
      right: { type: 'number', value: 5 }
    });
  });


  test('Parsing: expression with parentheses', () => {
    let tokens = ['3', '+', '5', '×', '(', '2', '-', '8', ')'];
    tokens = recursiveParseParen(tokens)
    expect(tokens).toStrictEqual(['3', '+', '5', '×', '-6']);
    const ast = parse(tokens);
    expect(ast).toStrictEqual({
      type: 'operator',
      value: '+',
      left: { type: 'number', value: 3 },
      right: {
        type: 'operator',
        value: '×',
        left: { type: 'number', value: 5 },
        right: { type: 'number', value: -6 }
      }
    });
  });

  test('Evaluation: simple addition', () => {
    const expression = '3 + 5';

    expect(calculate(expression)).toBe(8);
  });

  test('Evaluation: expression with parentheses and precedence', () => {
    const expression = '3 + 5 × (2 - 8)';
    expect(calculate(expression)).toBe(-27);
  });

  test('Evaluation: division and subtraction', () => {
    const expression = '(10 - 4) ÷ 2';
    expect(calculate(expression)).toBe(3);
  });

  test('Evaluation: complex expression', () => {
    const expression = '5 + 63 - 54 ÷ 9 + (6 × 3)';
    expect(calculate(expression)).toBe(80);
  });

  test('Evaluation: exponentiation', () => {
    const expression = '2 ^ 3';
    expect(calculate(expression)).toBe(8);
  });

  test('Evaluation: modulo operation', () => {
    const expression = '10 % 3';
    expect(calculate(expression)).toBe(1);
  });

  test('Evaluation: combination of operations', () => {
    const expression = '10 + (20 - 5) × 2 ÷ 5';
    expect(calculate(expression)).toBe(16);
  });

  test('Evaluation: of the power of 2', () => {
    const expression = '3 + 5²';
    let tokens = tokenize(expression);
    expect(tokens).toStrictEqual(['3', '+', '5', '²']);
    tokens = recursiveParseParen(tokens);
    const ast = parse(tokens);
    console.log(ast);
    expect(ast).toStrictEqual({
      type: 'operator',
      value: '+',
      left: { type: 'number', value: 3 },
      right: { type: 'number', value: 25 }
    });
    const result = evaluate(ast);
    expect(result).toBe(28);
  });


  test('Evaluation of Expression with negative number', () => {
    let expression = '5÷-1';
    expect(calculate(expression)).toBe(-5);
    let xpression = '-√4';
    expect(calculate(xpression)).toBe(-2);
  });


  test('Evaluation of float numbers',() => {
    const expression = '4.5 + 6.5';
    let tokens = tokenize(expression);
    expect(tokens).toStrictEqual(['4.5', '+' ,'6.5']);
    const ast = parse(tokens);
    expect(ast).toStrictEqual({
      type: 'operator',
      value: '+',
      left: { type: 'number', value: 4.5 },
      right: { type: 'number', value: 6.5 }
    });
    const result = evaluate(ast);
    expect(result).toBe(11);
  });
});


describe('parseParentheses Tests', () => {
  test("multiplication without the multiplication operand", () => {
    const expression = '5(20 - 10)';
    expect(calculate(expression)).toBe(50);
  });
  test("tokenize negative number", () => {
    const expression = '5+-10';
    expect(calculate(expression)).toBe(-5);
  });
  test("multiplication of parentheses with another parentheses", () => {
    const expression = '(5 - 4)*(6 + 5)';
    const tokens = tokenize(expression);
    let paren = recursiveParseParen(tokens);
    expect(paren).toStrictEqual(['1', '*', '11']);
    expect(calculate(expression)).toBe(11);
  });

  test("a parentheses squared", () => {
    const expression = '(-3)²';
    const tokens = tokenize(expression);
    console.log(recursiveParseParen(tokens));
    expect(calculate(expression)).toBe(9);
  });

  test('Square root of a parentheses', () => {
    const expression = '-√(4 + 5)';
    expect(calculate(expression)).toBe(-3);
  });
  test('Pi with numbers', () => {
    const expression = '3π/2';
    let tokens = tokenize(expression);
    expect(tokens).toStrictEqual(['3', 'π', '/' , '2']);
    expect(calculate(expression)).toBe(3 * Math.PI / 2);
  });

  test('simple parseParentheses', () => {
    const expression = '5 / 5 + (5 + 4) ';
    let tokens = tokenize(expression);
    expect(recursiveParseParen(tokens)).toStrictEqual(['5', '/', '5', '+', '9']);
    expect(calculate(expression)).toBe(10);
  });

  test('Nested parentheses evaluation', () => {
    const expression = '6 + 5 - (4 + 2 + 5²) * 6';
    let tokens = tokenize(expression);
    console.log(`tokens: ${tokens}`);
    let paren = recursiveParseParen(tokens);
    let ast = parse(paren);
    expect(calculate(expression)).toBe(-175);
  });
  test('try simple multiplcation', () => {
    const expression = '(6 + 1)* 8';
    expect(calculate(expression)).toBe(56);
  });
});
