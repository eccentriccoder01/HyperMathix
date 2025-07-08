ScientificCalculator.prototype.addOperator = function(operator) {
  const lastChar = this.currentExpression.slice(-1);
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    if (operator === '-') {
      this.currentExpression = '-';
    }
  } else if (['+', '-', '*', '/', '^'].includes(lastChar)) {
    this.currentExpression = this.currentExpression.slice(0, -1) + operator;
  } else {
    this.currentExpression += operator;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.addDecimal = function() {
  const parts = this.currentExpression.split(/[+\-*/^()]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes('.')) {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = '0.';
    } else {
      this.currentExpression += '.';
    }
    this.updateDisplay();
  }
};

ScientificCalculator.prototype.addParentheses = function() {
  const lastChar = this.currentExpression.slice(-1);
  if (this.currentExpression === '0' || this.currentExpression === 'Error' || 
      ['+', '-', '*', '/', '^', '('].includes(lastChar)) {
    this.currentExpression += '(';
    this.openParentheses++;
  } else if (this.openParentheses > 0) {
    this.currentExpression += ')';
    this.openParentheses--;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.toggleSign = function() {
  if (this.currentExpression.startsWith('-')) {
    this.currentExpression = this.currentExpression.substring(1);
  } else if (this.currentExpression !== '0' && this.currentExpression !== 'Error') {
    this.currentExpression = '-' + this.currentExpression;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.backspace = function() {
  if (this.currentExpression.length > 1) {
    const removedChar = this.currentExpression.slice(-1);
    if (removedChar === '(') this.openParentheses--;
    if (removedChar === ')') this.openParentheses++;
    this.currentExpression = this.currentExpression.slice(0, -1);
  } else {
    this.currentExpression = '0';
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.clear = function() {
  this.currentExpression = '0';
  this.lastResult = '0';
  this.openParentheses = 0;
  this.updateDisplay();
  // Explicitly clear the result display
  if (this.resultDisplay) {
    this.resultDisplay.textContent = '0';
  }
};

ScientificCalculator.prototype.addConstant = function(constant) {
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = constant;
  } else {
    this.currentExpression += constant;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.addAnswer = function() {
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = this.answerValue;
  } else {
    this.currentExpression += this.answerValue;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.addComma = function() {
  this.currentExpression += ',';
  this.updateDisplay();
};

ScientificCalculator.prototype.addExp10 = function() {
  this.currentExpression += '×10^';
  this.updateDisplay();
};

ScientificCalculator.prototype.addRandom = function() {
  const random = Math.random().toFixed(6);
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = random;
  } else {
    this.currentExpression += random;
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.addDegree = function() {
  this.currentExpression += '°';
  this.updateDisplay();
};

ScientificCalculator.prototype.addPercent = function() {
  this.currentExpression += '%';
  this.updateDisplay();
};