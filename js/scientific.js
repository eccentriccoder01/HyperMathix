ScientificCalculator.prototype.addTrigFunction = function(func) {
  // Check if shift is active to use inverse functions
  let actualFunc = func;
  if (this.isShiftActive) {
    const inverseMap = {
      'sin': 'asin', 'cos': 'acos', 'tan': 'atan',
      'sinh': 'asinh', 'cosh': 'acosh', 'tanh': 'atanh'
    };
    actualFunc = inverseMap[func] || func;
    // Turn off shift after using inverse function
    this.isShiftActive = false;
    this.updateShiftedButtons();
    const shiftBtn = document.querySelector('[data-action="shift"]');
    if (shiftBtn) shiftBtn.classList.remove('active');
  }
  
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = actualFunc + '(';
  } else {
    this.currentExpression += actualFunc + '(';
  }
  this.openParentheses++;
  this.updateDisplay();
};

ScientificCalculator.prototype.addLogFunction = function(func) {
  if (func === 'logab') {
    this.addFunction('log');
    this.addOperator(',');
  } else {
    this.addFunction(func);
  }
};

ScientificCalculator.prototype.addRootFunction = function(func) {
  switch (func) {
    case 'sqrt':
      this.addFunction('sqrt');
      break;
    case 'cbrt':
      this.addFunction('cbrt');
      break;
    case 'nroot':
      this.addFunction('nroot');
      break;
  }
};

ScientificCalculator.prototype.addPowerFunction = function(func) {
  switch (func) {
    case 'pow2':
      this.addOperator('^2');
      break;
    case 'pow3':
      this.addOperator('^3');
      break;
    case 'powxy':
      this.addOperator('^');
      break;
    case 'pow10':
      this.currentExpression += '10^';
      break;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.addFunction = function(func) {
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = func + '(';
  } else {
    this.currentExpression += func + '(';
  }
  this.openParentheses++;
  this.updateDisplay();
};

// Number base functions
ScientificCalculator.prototype.setNumberBase = function(base) {
  this.numberBase = base;
  this.showMessage(`Number base: ${base.toUpperCase()}`);
  try {
    const result = this.evaluateExpression(this.currentExpression);
    if (isFinite(result) && !isNaN(result)) {
      this.currentExpression = this.convertToBase(result, base);
      this.updateDisplay();
    }
  } catch (error) {
    // Ignore conversion errors for invalid expressions
    console.warn('Base conversion failed:', error.message);
  }
};

ScientificCalculator.prototype.convertToBase = function(decimal, base) {
  const num = Math.floor(decimal);
  switch (base) {
    case 'bin': return '0b' + num.toString(2);
    case 'oct': return '0o' + num.toString(8);
    case 'hex': return '0x' + num.toString(16).toUpperCase();
    default: return num.toString();
  }
};

// Calculation and evaluation functions
ScientificCalculator.prototype.calculate = function() {
  try {
    const steps = [];
    let expression = this.currentExpression;
    
    while (this.openParentheses > 0) {
      expression += ')';
      this.openParentheses--;
    }

    if (this.isStepByStepMode) {
      const result = this.calculateWithSteps(expression, steps);
      this.showSteps(steps, expression, result);
      this.lastResult = result.toString();
      this.answerValue = this.lastResult;
    } else {
      const result = this.evaluateExpression(expression);
      this.lastResult = result.toString();
      this.answerValue = this.lastResult;
    }

    this.addToHistory(expression, this.lastResult);
    this.currentExpression = this.lastResult;
    this.updateDisplay();
  } catch (error) {
    this.currentExpression = 'Error';
    this.updateDisplay();
  }
};

ScientificCalculator.prototype.evaluateExpression = function(expression) {
  try {
    let processedExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, Math.PI.toString())
      .replace(/\be\b/g, Math.E.toString())
      .replace(/×10\^/g, '*Math.pow(10,')
      .replace(/%/g, '/100')
      .replace(/°/g, '*Math.PI/180');

    // Handle functions with safer evaluation
    processedExpression = processedExpression
      .replace(/sin\(([^)]+)\)/g, (match, p1) => this.calculateTrig('sin', p1))
      .replace(/cos\(([^)]+)\)/g, (match, p1) => this.calculateTrig('cos', p1))
      .replace(/tan\(([^)]+)\)/g, (match, p1) => this.calculateTrig('tan', p1))
      .replace(/ln\(([^)]+)\)/g, (match, p1) => Math.log(this.safeEval(p1)))
      .replace(/log\(([^)]+)\)/g, (match, p1) => Math.log10(this.safeEval(p1)))
      .replace(/sqrt\(([^)]+)\)/g, (match, p1) => Math.sqrt(this.safeEval(p1)))
      .replace(/abs\(([^)]+)\)/g, (match, p1) => Math.abs(this.safeEval(p1)))
      .replace(/exp\(([^)]+)\)/g, (match, p1) => Math.exp(this.safeEval(p1)))
      .replace(/(\d+)!/g, (match, p1) => this.factorial(parseInt(p1)))
      .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, (match, base, _, exponent) => Math.pow(parseFloat(base), parseFloat(exponent)))
      .replace(/(\d+(\.\d+)?)\^2/g, (match, base) => Math.pow(parseFloat(base), 2))
      .replace(/(\d+(\.\d+)?)\^3/g, (match, base) => Math.pow(parseFloat(base), 3));

    return Function('"use strict"; return (' + processedExpression + ')')();
  } catch (error) {
    return NaN;
  }
};

ScientificCalculator.prototype.safeEval = function(expression) {
  try {
    // Simple evaluation without recursion for nested functions
    let processedExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, Math.PI.toString())
      .replace(/\be\b/g, Math.E.toString())
      .replace(/×10\^/g, '*Math.pow(10,')
      .replace(/%/g, '/100')
      .replace(/°/g, '*Math.PI/180');

    return Function('"use strict"; return (' + processedExpression + ')')();
  } catch (error) {
    return parseFloat(expression) || 0;
  }
};

ScientificCalculator.prototype.calculateTrig = function(func, value) {
  const val = this.safeEval(value);
  const radians = this.angleMode === 'deg' ? val * Math.PI / 180 : val;
  switch (func) {
    case 'sin': return Math.sin(radians);
    case 'cos': return Math.cos(radians);
    case 'tan': return Math.tan(radians);
    default: return val;
  }
};

ScientificCalculator.prototype.factorial = function(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

ScientificCalculator.prototype.calculateWithSteps = function(expression, steps) {
  steps.push({
    step: 1,
    description: "Original expression",
    calculation: expression
  });

  let workingExpression = expression;
  let stepNumber = 2;

  if (workingExpression.includes('π')) {
    workingExpression = workingExpression.replace(/π/g, Math.PI.toString());
    steps.push({
      step: stepNumber++,
      description: "Replace π with its value",
      calculation: workingExpression
    });
  }

  if (workingExpression.includes('e')) {
    workingExpression = workingExpression.replace(/\be\b/g, Math.E.toString());
    steps.push({
      step: stepNumber++,
      description: "Replace e with its value",
      calculation: workingExpression
    });
  }

  const result = this.evaluateExpression(workingExpression);
  steps.push({
    step: stepNumber,
    description: "Final result",
    calculation: result.toString()
  });

  return result;
};