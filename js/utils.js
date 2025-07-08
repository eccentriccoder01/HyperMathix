ScientificCalculator.prototype.formatNumber = function(number, precision = 10) {
  if (isNaN(number) || !isFinite(number)) {
    return 'Error';
  }
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(number) >= 1e10 || (Math.abs(number) < 1e-6 && number !== 0)) {
    return number.toExponential(precision);
  }
  
  // Format regular numbers
  const formatted = parseFloat(number.toFixed(precision));
  return formatted.toString();
};

ScientificCalculator.prototype.validateExpression = function(expression) {
  // Basic validation checks
  if (!expression || expression === '') {
    return false;
  }
  
  // Check for balanced parentheses
  let openCount = 0;
  for (let char of expression) {
    if (char === '(') openCount++;
    if (char === ')') openCount--;
    if (openCount < 0) return false;
  }
  
  return openCount === 0;
};

ScientificCalculator.prototype.sanitizeInput = function(input) {
  // Remove unwanted characters and normalize input
  return input
    .replace(/[^\d+\-*/^().πe!√%°,\s]/g, '')
    .replace(/\s+/g, '');
};

// Conversion utilities
ScientificCalculator.prototype.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

ScientificCalculator.prototype.radToDeg = function(radians) {
  return radians * 180 / Math.PI;
};

// Precision handling
ScientificCalculator.prototype.roundToPrecision = function(number, precision = 10) {
  return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
};

// Error handling utilities
ScientificCalculator.prototype.handleError = function(error, context = '') {
  console.error(`Calculator Error${context ? ` in ${context}` : ''}:`, error);
  this.showMessage('Calculation error occurred');
  return 'Error';
};

// Theme and appearance utilities
ScientificCalculator.prototype.toggleTheme = function() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('calculatorTheme', isDark ? 'dark' : 'light');
  this.showMessage(`${isDark ? 'Dark' : 'Light'} theme activated`);
};

ScientificCalculator.prototype.loadTheme = function() {
  const savedTheme = localStorage.getItem('calculatorTheme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
};

// Export/Import functionality
ScientificCalculator.prototype.exportHistory = function() {
  const data = {
    history: this.calculationHistory,
    exported: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calculator-history.json';
  a.click();
  
  URL.revokeObjectURL(url);
  this.showMessage('History exported');
};

ScientificCalculator.prototype.importHistory = function(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.history && Array.isArray(data.history)) {
        this.calculationHistory = data.history;
        this.saveHistory();
        this.updateHistoryDisplay();
        this.showMessage('History imported successfully');
      } else {
        this.showMessage('Invalid history file format');
      }
    } catch (error) {
      this.showMessage('Error importing history');
    }
  };
  reader.readAsText(file);
};

ScientificCalculator.prototype.convertToPolar = function() {
  const parts = this.currentExpression.split(',');
  if (parts.length === 2) {
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (!isNaN(x) && !isNaN(y)) {
      const r = Math.sqrt(x*x + y*y);
      const theta = Math.atan2(y, x) * (this.angleMode === 'deg' ? 180/Math.PI : 1);
      this.currentExpression = `${this.formatNumber(r)},${this.formatNumber(theta)}`;
      this.updateDisplay();
      this.showMessage('Converted to polar coordinates');
    }
  } else {
    this.showMessage('Enter coordinates as x,y');
  }
};

ScientificCalculator.prototype.convertToRectangular = function() {
  const parts = this.currentExpression.split(',');
  if (parts.length === 2) {
    const r = parseFloat(parts[0]);
    const theta = parseFloat(parts[1]) * (this.angleMode === 'deg' ? Math.PI/180 : 1);
    if (!isNaN(r) && !isNaN(theta)) {
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      this.currentExpression = `${this.formatNumber(x)},${this.formatNumber(y)}`;
      this.updateDisplay();
      this.showMessage('Converted to rectangular coordinates');
    }
  } else {
    this.showMessage('Enter coordinates as r,θ');
  }
};

ScientificCalculator.prototype.convertToDMS = function() {
  const value = parseFloat(this.currentExpression);
  if (!isNaN(value)) {
    const degrees = Math.floor(Math.abs(value));
    const minutes = Math.floor((Math.abs(value) - degrees) * 60);
    const seconds = ((Math.abs(value) - degrees) * 60 - minutes) * 60;
    const sign = value < 0 ? '-' : '';
    this.currentExpression = `${sign}${degrees}°${minutes}'${this.formatNumber(seconds)}"`;
    this.updateDisplay();
    this.showMessage('Converted to DMS format');
  } else {
    this.showMessage('Enter a valid number');
  }
};

ScientificCalculator.prototype.calculateStandardDeviation = function() {
  const numbers = this.currentExpression.split(',').map(n => parseFloat(n.trim()));
  if (numbers.every(n => !isNaN(n))) {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    this.currentExpression = this.formatNumber(stdDev);
    this.updateDisplay();
    this.showMessage('Standard deviation calculated');
  } else {
    this.showMessage('Enter comma-separated numbers');
  }
};
