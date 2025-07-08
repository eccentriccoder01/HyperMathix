// equations.js - Equation Solving Module

// Extend the ScientificCalculator class with equation solving methods
ScientificCalculator.prototype.solveLinearEquation = function(a, b) {
  // Solve ax + b = 0
  if (a === 0) {
    return b === 0 ? 'Infinite solutions' : 'No solution';
  }
  return -b / a;
};

ScientificCalculator.prototype.solveQuadraticEquation = function(a, b, c) {
  // Solve ax² + bx + c = 0
  if (a === 0) {
    return this.solveLinearEquation(b, c);
  }
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) {
    return 'No real solutions';
  } else if (discriminant === 0) {
    return -b / (2 * a);
  } else {
    const sqrt_discriminant = Math.sqrt(discriminant);
    return [
      (-b + sqrt_discriminant) / (2 * a),
      (-b - sqrt_discriminant) / (2 * a)
    ];
  }
};

ScientificCalculator.prototype.parseEquation = function(equationString) {
  // Parse equation string and extract coefficients
  const parts = equationString.split('=');
  if (parts.length !== 2) {
    throw new Error('Invalid equation format');
  }
  
  const leftSide = this.extractCoefficients(parts[0]);
  const rightSide = this.extractCoefficients(parts[1]);
  
  const coefficients = {};
  for (const [variable, coeff] of Object.entries(leftSide)) {
    coefficients[variable] = coeff - (rightSide[variable] || 0);
  }
  for (const [variable, coeff] of Object.entries(rightSide)) {
    if (!coefficients[variable]) {
      coefficients[variable] = -coeff;
    }
  }
  
  return coefficients;
};

ScientificCalculator.prototype.extractCoefficients = function(expression) {
  const coefficients = {};
  expression = expression.replace(/\s/g, '');
  
  const terms = expression.split(/(?=[+-])/).filter(term => term !== '');
  
  for (const term of terms) {
    const match = term.match(/([+-]?\d*\.?\d*)([a-zA-Z]*)(\^?\d*)/);
    if (match) {
      let coeff = match[1] || '1';
      const variable = match[2] || 'constant';
      const power = match[3] ? parseInt(match[3].substring(1)) : (variable ? 1 : 0);
      
      if (coeff === '+' || coeff === '') coeff = '1';
      if (coeff === '-') coeff = '-1';
      
      const key = variable + (power > 1 ? `^${power}` : '');
      coefficients[key] = (coefficients[key] || 0) + parseFloat(coeff);
    }
  }
  
  return coefficients;
};

// Legacy equation solver functions for backward compatibility
function normalizeExponents(expr) {
    return expr
      .replace(/x²/g, 'x^2')
      .replace(/x³/g, 'x^3')
      .replace(/(\d)²/g, '$1^2')
      .replace(/(\d)³/g, '$1^3');
  }  
function solveEquation(expr) {
    expr = normalizeExponents(expr);
    let sides = expr.split('=');
    if (sides.length !== 2) {
      try {
        const result = eval(expr);
        currentExpression = result instanceof Complex ? result.toString() : result.toString();
      } catch {
        currentExpression = "Invalid Expression";
      }
      cursorPosition = currentExpression.length;
      updateDisplay();
      return;
    }
  
    let left = sides[0].replace(/ /g, '');
    let right = sides[1].replace(/ /g, '');
  
    left = left.replace(/\*\*/g, '^')
               .replace(/x\*x/g, 'x^2')
               .replace(/(\d)x/g, '$1*x');
    
    right = right.replace(/\*\*/g, '^')
                 .replace(/x\*x/g, 'x^2')
                 .replace(/(\d)x/g, '$1*x');
  
    let equation = left;
    if (right !== '0') {
      equation += `-(${right})`;
    }
  
    if (equation.includes('x^2')) {
      solveQuadratic(equation);
    } else {
      solveLinear(equation);
    }
  }
  
  function solveQuadratic(equation) {
    let a = 0, b = 0, c = 0;
    
    equation = equation.replace(/\s+/g, '');
    equation = equation.replace(/\*/g, '');
    equation = equation.replace(/([^-])-/g, '$1+-');
    
    let terms = equation.split(/(?=[+-])/);
    
    terms.forEach(term => {
      term = term.replace(/\+$/, '');
      
      if (term.includes('x^2')) {
        let coef = term.replace('x^2', '');
        if (coef === '' || coef === '+') coef = '1';
        if (coef === '-') coef = '-1';
        a += parseFloat(coef);
      } 
      else if (term.includes('x') && !term.includes('^')) {
        let coef = term.replace('x', '');
        if (coef === '' || coef === '+') coef = '1';
        if (coef === '-') coef = '-1';
        b += parseFloat(coef);
      } 
      else if (!term.includes('x') && term !== '') {
        c += parseFloat(term);
      }
    });
  
    if (a !== 0) {
      let discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-discriminant) / (2 * a);
        const root1 = new Complex(realPart, imagPart);
        const root2 = new Complex(realPart, -imagPart);
        currentExpression = `x = ${root1.toString()}, ${root2.toString()}`;
      } else {
        let root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        let sortedRoots = [root1, root2].sort((x, y) => x - y);
        currentExpression = `x = ${sortedRoots[0].toFixed(3)}, ${sortedRoots[1].toFixed(3)}`;
      }
    } else {
      solveLinear(equation);
      return;
    }
  
    cursorPosition = currentExpression.length;
    updateDisplay();
  }
  
  function solveLinear(equation) {
    let tempEquation = equation.replace(/x/g, '(1*x)');
  
    try {
      let constantPart = eval(tempEquation.replace(/x/g, '0'));
      let xPart = eval(tempEquation.replace(/x/g, '1')) - constantPart;
  
      if (xPart === 0) {
        currentExpression = constantPart === 0 ? "All real numbers" : "No solution";
      } else {
        let x = -constantPart / xPart;
        currentExpression = `x = ${x.toFixed(3)}`;
      }
    } catch (error) {
      currentExpression = "Error";
    }
  
    cursorPosition = currentExpression.length;
    updateDisplay();
  }
  
  // Equation mode button handlers
  document.querySelectorAll('#equations-mode button').forEach(button => {
    button.addEventListener("click", function() {
      const value = this.value;
  
      if (value === "clear") {
        currentExpression = "0";
        cursorPosition = 0;
      } else if (value === "backspace") {
        if (cursorPosition > 0) {
          currentExpression = currentExpression.slice(0, cursorPosition - 1) + currentExpression.slice(cursorPosition);
          cursorPosition--;
        }
        if (currentExpression === "") currentExpression = "0";
      } else if (value === "solve-eq") {
        try {
          const parsedExpr = parseExpression(currentExpression);
          solveEquation(parsedExpr);
        } catch (error) {
          currentExpression = "Error";
          cursorPosition = currentExpression.length;
        }
      } else if (value === "left") {
        if (cursorPosition > 0) cursorPosition--;
      } else if (value === "right") {
        if (cursorPosition < currentExpression.length) cursorPosition++;
      } else if (value === "log" || value === "ln") {
        currentExpression = insertAtCursor(`${value}(`);
        cursorPosition += value.length + 1;
      } else if (value === "i") {
        currentExpression = insertAtCursor("i");
        cursorPosition += 1;
      } else {
        if (currentExpression === "0") {
          currentExpression = value;
          cursorPosition = 1;
        } else {
          currentExpression = insertAtCursor(value);
          cursorPosition += value.length;
        }
      }
  
      updateDisplay();
    });
  });
  
  ScientificCalculator.prototype.openEquationSolver = function() {
    const equation = prompt('Enter equation to solve (format: ax+b=0 or ax²+bx+c=0):');
    if (equation) {
      try {
        const result = this.parseEquation(equation);
        if (result) {
          this.currentExpression = result.toString();
          this.updateDisplay();
          this.showMessage('Equation solved');
        }
      } catch (error) {
        this.showMessage('Invalid equation format');
      }
    }
  };