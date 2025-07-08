// memory.js - Memory Operations Module

// Extend the ScientificCalculator class with memory methods
ScientificCalculator.prototype.memoryStore = function() {
  try {
    const result = this.evaluateExpression(this.currentExpression);
    if (isFinite(result) && !isNaN(result)) {
      this.memory = result;
      this.showMessage('Memory stored');
    } else {
      this.showMessage('Memory store error');
    }
  } catch (error) {
    this.showMessage('Memory store error');
  }
};

ScientificCalculator.prototype.memoryRecall = function() {
  if (this.currentExpression === '0' || this.currentExpression === 'Error') {
    this.currentExpression = this.memory.toString();
  } else {
    this.currentExpression += this.memory.toString();
  }
  this.updateDisplay();
};

ScientificCalculator.prototype.memoryAdd = function() {
  try {
    const result = this.evaluateExpression(this.currentExpression);
    if (isFinite(result) && !isNaN(result)) {
      this.memory += result;
      this.showMessage('Added to memory');
    } else {
      this.showMessage('Memory add error');
    }
  } catch (error) {
    this.showMessage('Memory add error');
  }
};

ScientificCalculator.prototype.memorySubtract = function() {
  try {
    const result = this.evaluateExpression(this.currentExpression);
    if (isFinite(result) && !isNaN(result)) {
      this.memory -= result;
      this.showMessage('Subtracted from memory');
    } else {
      this.showMessage('Memory subtract error');
    }
  } catch (error) {
    this.showMessage('Memory subtract error');
  }
};

ScientificCalculator.prototype.memoryClear = function() {
  this.memory = 0;
  this.showMessage('Memory cleared');
};
