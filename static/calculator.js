export function calculate(expression) {
  let tokens = tokenize(expression);
  tokens = recursiveParseParen(tokens);
  const ast = parse(tokens);
  const result = evaluate(ast);
  return result;
}


function tokenize(expression) {
  const tokens = [];
  const tokenRegex = /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?|π|[+\-÷*/√×%()^²]|[a-zA-Z_]\w*)/g;
  
  let match;
  while ((match = tokenRegex.exec(expression)) !== null) {
    const token = match[0];
    
    tokens.push(token);
  }
  
  return tokens;
}


function recursiveParseParen(tokens) {
  function parseNested(start = 0) {
    const results = [];
    let depth = 0;
    let currentGroup = [];
    let flag = 0;

    for (let i = start; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === '(') {
        depth++;
        if (depth > 1) {
          currentGroup.push(token);
        }
      } else if (token === ')') {
        depth--;
        if (tokens[i+1] === '²' && flag === 0) {
          if (depth === 0) {
            if (currentGroup.length > 0) {
              const nestedResult = recursiveParseParen(currentGroup);
              results.push(String(evaluate(parse([...nestedResult, '*', ...nestedResult]))));
              flag = 1;
              currentGroup = [];
            }
          }
        } else if (depth === 0) {
          if (currentGroup.length > 0) {
            const nestedResult = recursiveParseParen(currentGroup);
            results.push(String(evaluate(parse(nestedResult))));
            currentGroup = [];
          }
        } else if (depth > 0) {
          if (token === '²' && flag === 1) {
            tokens.splice(i, 1);
            flag = 0;
            continue;
          }
          currentGroup.push(token);
        }
      } else if (depth > 0) {
        if (token === '²' && flag === 1) {
          tokens.splice(i, 1);
          flag = 0;
          continue;
        }
        currentGroup.push(token);
      } else if (depth === 0) {
        if (token === '²' && flag === 1) {
          tokens.splice(i, 1);
          flag = 0;
          continue;
        }
        results.push(token);
      }
    }
    if (depth !== 0) {
      throw new Error('Mismatched parentheses');
    }

    return results;
  }

  return parseNested();
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
    while (nextIndex < tokens.length) {
      const nextToken = tokens[nextIndex];      
      const isImplicitMultiplication = 
        nextToken === 'π' ||
        !isNaN(Number(nextToken)) ||
        nextToken === '(' ||
        /^[a-zA-Z]/.test(nextToken);

      const iSquare = nextToken === '²';

      if (iSquare) {
        left = {
          type: "number",
          value: Math.pow(Number(left.value), 2)
        }
        tokens.splice(nextIndex, 1);
      }

      if (isImplicitMultiplication) {
        const [right, next] = parseFactor(nextIndex);

        left = { 
          type: "operator", 
          value: '*', 
          left, 
          right 
        };
        nextIndex = next;
      } else {
        break;
      }
    }

    while (nextIndex < tokens.length && ['×', '*', '/', '÷', '^', '%'].includes(tokens[nextIndex])) {
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
    if (token === 'π') {
      return [{ type: "number", value: Math.PI}, index + 1];
    }

    if (token === '√') {
      const [right, nextIndex] = parseFactor(index + 1);
      return [{
        type: 'operator',
        value: '√',
        left: { type: 'number', value: 1 },
        right: right
      }, nextIndex];
    }

    if (['+', '-'].includes(token)) {
      const [factor, nextIndex] = parseFactor(index + 1);
      return [{
        type: 'operator', 
        value: token === '-' ? '-' : '+', 
        left: { type: 'number', value: 0 }, 
        right: factor
      }, nextIndex];
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
      case "*": return left * right;
      case "/":
        if (right === 0) {
          throw new Error ("Division by zero is forbidden in mathmatic");
        }
        return left / right;
      case "^": return Math.pow(left, right);
      case "√":
        let base = left === '' || left === '+' ? 1 : left;
        if (base === '-') {
          return -Math.sqrt(right);
        }
        return base * Math.sqrt(right);
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

// module.exports = {
//   tokenize,
//   parse,
//   evaluate,
//   recursiveParseParen,
//   calculate
// };
