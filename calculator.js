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

  for (let token of tokens) {
    if (token === '(') {
      stack.push(output.length);
    } else if (token === ')') {
      let beginParenthesis = stack.pop();
      const betweenPerenthesis = tokens.slice(++beginParenthesis, ++output.length);
      const result = evaluate(parse(betweenPerenthesis));
      output.push(result);
    } else {
      output.push(token);
      console.log(output);
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

    while (nextIndex < tokens.length && ['*', '/'].includes(tokens[nextIndex])) {
      const operator = tokens[nextIndex++];
      const [right, next] = parseFactor(nextIndex);
      left = { type: "operator", value: operator, left, right };
      nextIndex = next;
    }
    return [left, nextIndex];
  }

  function parseFactor(index) {
    const token = tokens[index];
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
      case "÷": return left / right;
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