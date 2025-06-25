// Arithmetic mode specific functionality
function parseExpression(expr) {
    let parsed = expr.replace(/÷/g, '/')
                    .replace(/×/g, '*')
                    .replace(/\^/g, '**')
                    .replace(/√/g, 'Math.sqrt')
                    .replace(/log/g, 'Math.log10')
                    .replace(/ln/g, 'Math.log')
                    .replace(/Abs\(/g, 'abs(')
                    .replace(/Arg\(/g, 'arg(')
                    .replace(/Conj\(/g, 'conj(');
  
    parsed = parsed.replace(/(Math\.sqrt\([^)]+\)|\d+\.?\d*)\*i/g, (_, coeff) => {
      return `new Complex(0,${coeff})`;
    });
  
    parsed = parsed.replace(/([+-]?Math\.sqrt\([^)]+\)|[+-]?\d*\.?\d*)([+-]Math\.sqrt\([^)]+\)|[+-]\d*\.?\d*)i/g, (_, real, imag) => {
      const r = real === '' ? '0' : real;
      const i = imag === '+' ? '1' : imag === '-' ? '-1' : imag;
      return `new Complex(${r},${i})`;
    });
  
    parsed = parsed.replace(/(^|[^a-zA-Z0-9])i([^a-zA-Z0-9]|$)/g, '$1new Complex(0,1)$2');
    parsed = parsed.replace(/(\d*\.?\d*)i/g, (_, coeff) => {
      return coeff === '' ? 'new Complex(0,1)' : `new Complex(0,${coeff})`;
    });
  
    return parsed;
  }
  
  // Arithmetic mode button handlers
  document.querySelectorAll('#arithmetic-mode button').forEach(button => {
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
      } else if (value === "solve") {
        try {
          const parsedExpr = parseExpression(currentExpression);
          const result = eval(parsedExpr);
          currentExpression = result.toString();
          cursorPosition = currentExpression.length;
        } catch (error) {
          currentExpression = "Error";
          cursorPosition = currentExpression.length;
        }
      } else if (value === "sqrt") {
        currentExpression = insertAtCursor("√(");
        cursorPosition += 2;
      } else if (value === "log" || value === "ln") {
        currentExpression = insertAtCursor(`${value}(`);
        cursorPosition += value.length + 1;
      } else if (value === "abs") {
        currentExpression = insertAtCursor("Abs(");
        cursorPosition += 4;
      } else if (value === "arg") {
        currentExpression = insertAtCursor("Arg(");
        cursorPosition += 4;
      } else if (value === "conj") {
        currentExpression = insertAtCursor("Conj(");
        cursorPosition += 5;
      } else if (value === "i") {
        currentExpression = insertAtCursor("i");
        cursorPosition += 1;
      } else if (value === "left") {
        if (cursorPosition > 0) cursorPosition--;
      } else if (value === "right") {
        if (cursorPosition < currentExpression.length) cursorPosition++;
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