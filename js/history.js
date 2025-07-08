// history.js - History Management Module

// Extend the ScientificCalculator class with history methods
ScientificCalculator.prototype.addToHistory = function(expression, result) {
  const historyItem = {
    expression,
    result,
    timestamp: new Date().toLocaleString()
  };
  
  this.calculationHistory.unshift(historyItem);
  if (this.calculationHistory.length > 50) {
    this.calculationHistory.pop();
  }
  
  this.saveHistory();
  this.updateHistoryDisplay();
};

ScientificCalculator.prototype.updateHistoryDisplay = function() {
  if (this.calculationHistory.length === 0) {
    this.historyContent.innerHTML = '<p>No calculations yet.</p>';
    return;
  }

  this.historyContent.innerHTML = '';
  this.calculationHistory.forEach(item => {
    const historyElement = document.createElement('div');
    historyElement.className = 'history-item';
    historyElement.innerHTML = `
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">= ${item.result}</div>
      <div class="history-time">${item.timestamp}</div>
    `;
    
    historyElement.addEventListener('click', () => {
      this.currentExpression = item.expression;
      this.updateDisplay();
      this.historyPanel.classList.remove('active');
    });
    
    this.historyContent.appendChild(historyElement);
  });
};

ScientificCalculator.prototype.saveHistory = function() {
  localStorage.setItem('calculatorHistory', JSON.stringify(this.calculationHistory));
};

ScientificCalculator.prototype.loadHistory = function() {
  const saved = localStorage.getItem('calculatorHistory');
  if (saved) {
    this.calculationHistory = JSON.parse(saved);
    this.updateHistoryDisplay();
  }
};

ScientificCalculator.prototype.clearHistory = function() {
  this.calculationHistory = [];
  this.saveHistory();
  this.updateHistoryDisplay();
  this.showMessage('History cleared');
};
