const { tokenize, parse, evaluate, parseParentheses, calculate } = require('./calculator.js');

describe('Calculator Tests', () => {
  // test('Tokenization: simple addition', () => {
  //   const expression = '3 + 5';
  //   expect(tokenize(expression)).toStrictEqual(['3', '+', '5']);
  // });

  // test('Tokenization: complex expression', () => {
  //   const expression = '3 + 5 × (2 - 8)';
  //   expect(tokenize(expression)).toStrictEqual([
  //     '3', '+', '5', '×', '(', '2', '-', '8', ')'
  //   ]);
  // });

  // test('Parsing: simple addition', () => {
  //   const tokens = ['3', '+', '5'];
  //   const ast = parse(tokens);
  //   expect(ast).toStrictEqual({
  //     type: 'operator',
  //     value: '+',
  //     left: { type: 'number', value: 3 },
  //     right: { type: 'number', value: 5 }
  //   });
  // });
  // test('Parsing: expression with parentheses', () => {
  //   let tokens = ['3', '+', '5', '×', '(', '2', '-', '8', ')'];
  //   tokens = parseParentheses(tokens)
  //   expect(tokens).toStrictEqual(['3', '+', '5', '×', '-6']);
  //   const ast = parse(tokens);
  //   console.log(ast);
  //   expect(ast).toStrictEqual({
  //     type: 'operator',
  //     value: '+',
  //     left: { type: 'number', value: 3 },
  //     right: {
  //       type: 'operator',
  //       value: '×',
  //       left: { type: 'number', value: 5 },
  //       right: { type: 'number', value: -6 }
  //     }
  //   });
  // });

  // test('Evaluation: simple addition', () => {
  //   const expression = '3 + 5';

  //   expect(calculate(expression)).toBe(8);
  // });

  // test('Evaluation: expression with parentheses and precedence', () => {
  //   const expression = '3 + 5 × (2 - 8)';
  //   expect(calculate(expression)).toBe(-27);
  // });

  // test('Evaluation: division and subtraction', () => {
  //   const expression = '(10 - 4) ÷ 2';
  //   expect(calculate(expression)).toBe(3);
  // });

  // test('Evaluation: complex expression', () => {
  //   const expression = '5 + 63 - 54 ÷ 9 + (6 × 3)';

  //   expect(calculate(expression)).toBe(80);
  // });

  // test('Evaluation: exponentiation', () => {
  //   const expression = '2 ^ 3';
  //   expect(calculate(expression)).toBe(8);
  // });

  // test('Evaluation: modulo operation', () => {
  //   const expression = '10 % 3';
  //   expect(calculate(expression)).toBe(1);
  // });

  // test('Evaluation: combination of operations', () => {
  //   const expression = '10 + (20 - 5) × 2 ÷ 5';
  //   expect(calculate(expression)).toBe(16);
  // });
  test('Evaluation: of the power of 2', () => {
    const expression = '3 + 5²';
    let tokens = tokenize(expression);
    expect(tokens).toStrictEqual(['3', '+', '5', '²']);
    const ast = parse(tokens);
    console.log(ast);
    expect(ast).toStrictEqual({
      type: 'operator',
      value: '+',
      left: { type: 'number', value: 3 },
      right: { type: 'number', value: 25 }
    });
  });
});
