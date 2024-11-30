function calculate(expression) {
  let tokens = tokenize(expression);
  if (tokens.includes('(')) {
    tokens = parseParentheses(tokens);
  }
  const ast = parse(tokens);
  const result = evaluate(ast);
  return result;
}

function tokenize(e) {
  const regexpMath = /\s*([\+\-÷√×²%()^]|\d+\.?\d*|\.\d+|[a-zA-Z_]\w*\(\d+\.?\d*\)|\(\.\d+\))\s*/g;
  let tokens = [];
  let match;

  while ((match = regexpMath.exec(e)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

function parseParentheses(tokens) {
  let output = [];
  let stack = [];
  let betweenPerenthesis = [];
  let flag = 0;

  for (let token of tokens) {
    if (token === '(') {
      flag = 1;
    } else if (token === ')') {
      flag = 0;
      const result = evaluate(parse(betweenPerenthesis));
      betweenPerenthesis = [];
      output.push(String(result));
    } else {
      if (flag === 1) {
        betweenPerenthesis.push(token)
      }
      else {
        output.push(token);
      }
    }
  }
  return output;
}

function parse(tokens) {
  function parseExp(index = 0) {
    let [left, nextIndex] = parseTerm(index);
    while (nextIndex < tokens.length && ['+', '-'].includes(tokens[nextIndex])) {
      const operator = tokens[nextIndex++];
      const [right, next] = parseTerm(nextIndex);
      left = {type: 'operator', value: operator, left, right};
      nextIndex = next;
    }
    return [left, nextIndex];
  }
  function parseTerm(index) {
    let [left, nextIndex] = parseFactor(index);

    while (nextIndex < tokens.length && ['×', '÷', '√', '^', '%'].includes(tokens[nextIndex])) {
      const operator = tokens[nextIndex++];
      const [right, next] = parseFactor(nextIndex);
      left = { type: "operator", value: operator, left, right };
      nextIndex = next;
    }
    return [left, nextIndex];
  }

  function parseFactor(index) {
    const token = tokens[index];
    if (token === undefined) {
      throw new Error('Unexpected end of expression');
    }
    
    if (token === '²') {
      const [prevToken, prevIndex] = parseFactor(index - 1);
      console.log(prevToken, prevIndex);
      return [{ type: "number", value: Math.pow(Number(prevToken.value), 2) }, index + 1];
    }
    return [{ type: "number", value: Number(token) }, index + 1];
  }

  return parseExp()[0];

}


function evaluate(ast) {
  if (ast.type === "number") {
    return ast.value;
  } else if (ast.type === "operator") {
    const left = evaluate(ast.left);
    const right = evaluate(ast.right);
    switch (ast.value) {
      case "+": return left + right;
      case "-": return left - right;
      case "×": return left * right;
      case "^": return Math.pow(left, right);
      case "²": return Math.pow(left, 2);
      case "√":
        if (left === '') {
          left = 1;
        }
        return left * Math.sqrt(right);
      case "%": return left % right;
      case "÷": 
        if (right === 0) {
          throw new Error ("Division by zero is forbidden in mathmatic");
        }
        return left / right;
      default:
        throw new Error(`Unsupported operator: ${ast.value}`);
    }
  }
}
module.exports = {
  tokenize,
  parse,
  evaluate,
  parseParentheses,
  calculate
};
