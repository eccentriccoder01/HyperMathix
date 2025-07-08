ScientificCalculator.prototype.updateDisplay = function() {
  this.expressionDisplay.textContent = this.currentExpression || '0';
  
  try {
    if (this.currentExpression !== '0' && this.currentExpression !== 'Error' && 
        !this.currentExpression.endsWith('+') && !this.currentExpression.endsWith('-') && 
        !this.currentExpression.endsWith('*') && !this.currentExpression.endsWith('/') &&
        !this.currentExpression.endsWith('^') && !this.currentExpression.endsWith('(')) {
      
      let previewExpression = this.currentExpression;
      let openParens = this.openParentheses;
      while (openParens > 0) {
        previewExpression += ')';
        openParens--;
      }
      
      // Only try to evaluate if expression looks valid
      if (previewExpression.length > 0 && /[\d)πe]$/.test(previewExpression)) {
        const preview = this.evaluateExpression(previewExpression);
        if (isFinite(preview) && !isNaN(preview)) {
          this.resultDisplay.textContent = preview.toString();
        } else {
          this.resultDisplay.textContent = this.lastResult;
        }
      } else {
        this.resultDisplay.textContent = this.lastResult;
      }
    } else {
      this.resultDisplay.textContent = this.lastResult;
    }
  } catch (error) {
    this.resultDisplay.textContent = this.lastResult;
  }
};

ScientificCalculator.prototype.showMessage = function(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message-popup';
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    z-index: 10000;
    animation: fadeInOut 2s ease;
  `;
  
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    if (document.body.contains(messageDiv)) {
      document.body.removeChild(messageDiv);
    }
  }, 2000);
};

ScientificCalculator.prototype.showSteps = function(steps, originalExpression, result) {
  this.stepsContent.innerHTML = '';
  
  steps.forEach(step => {
    const stepElement = document.createElement('div');
    stepElement.className = 'step-item';
    stepElement.innerHTML = `
      <div class="step-number">Step ${step.step}</div>
      <div class="step-description">${step.description}</div>
      <div class="step-calculation">${step.calculation}</div>
    `;
    this.stepsContent.appendChild(stepElement);
  });

  this.stepsPanel.classList.add('active');
};

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;
document.head.appendChild(style);
