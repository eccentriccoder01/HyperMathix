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