class ScientificCalculator {
  constructor() {
    this.expressionDisplay = document.getElementById('expression');
    this.resultDisplay = document.getElementById('result');
    this.stepsPanel = document.getElementById('stepsPanel');
    this.stepsContent = document.getElementById('stepsContent');
    this.historyPanel = document.getElementById('historyPanel');
    this.historyContent = document.getElementById('historyContent');
    this.advancedPanel = document.getElementById('advancedPanel');
    this.scientificPanel = document.getElementById('scientificPanel');
    this.statsPanel = document.getElementById('statsPanel');
    this.memoryPanel = document.getElementById('memoryPanel');
    
    this.currentExpression = '';
    this.lastResult = '0';
    this.answerValue = '0';
    this.memory = 0;
    this.isStepByStepMode = false;
    this.calculationHistory = [];
    this.openParentheses = 0;
    this.isShiftActive = false;
    this.isAlphaActive = false;
    this.angleMode = 'deg';
    this.numberBase = 'dec';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.loadHistory();
  }

  setupEventListeners() {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleNumber(e.target.dataset.number);
      });
    });

    // Action buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleAction(e.target.dataset.action);
      });
    });

    // Function buttons
    document.querySelectorAll('[data-function]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFunction(e.target.dataset.function);
      });
    });

    // Control buttons
    document.getElementById('stepByStep').addEventListener('click', () => {
      this.toggleStepByStep();
    });

    document.getElementById('toggleAdvanced').addEventListener('click', () => {
      this.togglePanel('advanced');
    });

    document.getElementById('toggleScientific').addEventListener('click', () => {
      this.togglePanel('scientific');
    });

    document.getElementById('toggleStats').addEventListener('click', () => {
      this.togglePanel('stats');
    });

    document.getElementById('toggleMemory').addEventListener('click', () => {
      this.togglePanel('memory');
    });

    document.getElementById('history').addEventListener('click', () => {
      this.toggleHistory();
    });

    document.getElementById('closeSteps').addEventListener('click', () => {
      this.stepsPanel.classList.remove('active');
    });

    document.getElementById('closeHistory').addEventListener('click', () => {
      this.historyPanel.classList.remove('active');
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  handleNumber(number) {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = number;
    } else {
      this.currentExpression += number;
    }
    this.updateDisplay();
  }

  handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'del':
        this.backspace();
        break;
      case 'add':
        this.addOperator('+');
        break;
      case 'subtract':
        this.addOperator('-');
        break;
      case 'multiply':
        this.addOperator('*');
        break;
      case 'divide':
        this.addOperator('/');
        break;
      case 'decimal':
        this.addDecimal();
        break;
      case 'equals':
        this.calculate();
        break;
      case 'sign':
        this.toggleSign();
        break;
      case 'parentheses':
        this.addParentheses();
        break;
      case 'ans':
        this.addAnswer();
        break;
      case 'shift':
        this.toggleShift();
        break;
      case 'alpha':
        this.toggleAlpha();
        break;
      case 'mode':
        this.showModeMenu();
        break;
      case 'comma':
        this.addComma();
        break;
      case 'exp10':
        this.addExp10();
        break;
      case 'eng':
        this.toggleEngineering();
        break;
    }
  }

  handleFunction(func) {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'sinh':
      case 'cosh':
      case 'tanh':
      case 'asinh':
      case 'acosh':
      case 'atanh':
        this.addTrigFunction(func);
        break;
      case 'ln':
      case 'log':
      case 'logab':
        this.addLogFunction(func);
        break;
      case 'sqrt':
      case 'cbrt':
      case 'nroot':
        this.addRootFunction(func);
        break;
      case 'pow2':
      case 'pow3':
      case 'powxy':
      case 'pow10':
        this.addPowerFunction(func);
        break;
      case 'exp':
        this.addFunction('exp');
        break;
      case 'abs':
        this.addFunction('abs');
        break;
      case 'factorial':
        this.addOperator('!');
        break;
      case 'pi':
        this.addConstant('π');
        break;
      case 'e':
        this.addConstant('e');
        break;
      case 'deg':
        this.addDegree();
        break;
      case 'percent':
        this.addPercent();
        break;
      case 'ncr':
        this.addOperator('C');
        break;
      case 'npr':
        this.addOperator('P');
        break;
      case 'random':
        this.addRandom();
        break;
      case 'dec':
      case 'hex':
      case 'bin':
      case 'oct':
        this.setNumberBase(func);
        break;
      case 'ms':
        this.memoryStore();
        break;
      case 'mr':
        this.memoryRecall();
        break;
      case 'mplus':
        this.memoryAdd();
        break;
      case 'mminus':
        this.memorySubtract();
        break;
      default:
        this.showMessage(`${func} function activated`);
        break;
    }
  }

  // Mathematical function helpers
  addTrigFunction(func) {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = func + '(';
    } else {
      this.currentExpression += func + '(';
    }
    this.openParentheses++;
    this.updateDisplay();
  }

  addLogFunction(func) {
    if (func === 'logab') {
      this.addFunction('log');
      this.addOperator(',');
    } else {
      this.addFunction(func);
    }
  }

  addRootFunction(func) {
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
  }

  addPowerFunction(func) {
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
  }

  // Memory functions
  memoryStore() {
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
  }

  memoryRecall() {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = this.memory.toString();
    } else {
      this.currentExpression += this.memory.toString();
    }
    this.updateDisplay();
  }

  memoryAdd() {
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
  }

  memorySubtract() {
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
  }

  // Number base functions
  setNumberBase(base) {
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
  }

  convertToBase(decimal, base) {
    const num = Math.floor(decimal);
    switch (base) {
      case 'bin': return '0b' + num.toString(2);
      case 'oct': return '0o' + num.toString(8);
      case 'hex': return '0x' + num.toString(16).toUpperCase();
      default: return num.toString();
    }
  }

  // Basic calculator functions
  addAnswer() {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = this.answerValue;
    } else {
      this.currentExpression += this.answerValue;
    }
    this.updateDisplay();
  }

  addComma() {
    this.currentExpression += ',';
    this.updateDisplay();
  }

  addExp10() {
    this.currentExpression += '×10^';
    this.updateDisplay();
  }

  addRandom() {
    const random = Math.random().toFixed(6);
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = random;
    } else {
      this.currentExpression += random;
    }
    this.updateDisplay();
  }

  addDegree() {
    this.currentExpression += '°';
    this.updateDisplay();
  }

  addPercent() {
    this.currentExpression += '%';
    this.updateDisplay();
  }

  addOperator(operator) {
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
  }

  addFunction(func) {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = func + '(';
    } else {
      this.currentExpression += func + '(';
    }
    this.openParentheses++;
    this.updateDisplay();
  }

  addConstant(constant) {
    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = constant;
    } else {
      this.currentExpression += constant;
    }
    this.updateDisplay();
  }

  addDecimal() {
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
  }

  addParentheses() {
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
  }

  toggleSign() {
    if (this.currentExpression.startsWith('-')) {
      this.currentExpression = this.currentExpression.substring(1);
    } else if (this.currentExpression !== '0' && this.currentExpression !== 'Error') {
      this.currentExpression = '-' + this.currentExpression;
    }
    this.updateDisplay();
  }

  backspace() {
    if (this.currentExpression.length > 1) {
      const removedChar = this.currentExpression.slice(-1);
      if (removedChar === '(') this.openParentheses--;
      if (removedChar === ')') this.openParentheses++;
      this.currentExpression = this.currentExpression.slice(0, -1);
    } else {
      this.currentExpression = '0';
    }
    this.updateDisplay();
  }

  clear() {
    this.currentExpression = '0';
    this.openParentheses = 0;
    this.updateDisplay();
  }

  calculate() {
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
  }

  evaluateExpression(expression) {
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
  }

  safeEval(expression) {
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
  }

  calculateTrig(func, value) {
    const val = this.safeEval(value);
    const radians = this.angleMode === 'deg' ? val * Math.PI / 180 : val;
    switch (func) {
      case 'sin': return Math.sin(radians);
      case 'cos': return Math.cos(radians);
      case 'tan': return Math.tan(radians);
      default: return val;
    }
  }

  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  calculateWithSteps(expression, steps) {
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
  }

  showSteps(steps, originalExpression, result) {
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
  }

  // UI Control functions
  togglePanel(panelType) {
    const panels = {
      advanced: this.advancedPanel,
      scientific: this.scientificPanel,
      stats: this.statsPanel,
      memory: this.memoryPanel
    };
    
    // Close all other panels
    Object.values(panels).forEach(panel => {
      if (panel !== panels[panelType]) {
        panel.classList.remove('active');
      }
    });
    
    // Toggle the selected panel
    panels[panelType].classList.toggle('active');
    
    // Update button state
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (panels[panelType].classList.contains('active')) {
      document.getElementById(`toggle${panelType.charAt(0).toUpperCase() + panelType.slice(1)}`).classList.add('active');
    }
  }

  showMessage(message) {
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
      document.body.removeChild(messageDiv);
    }, 2000);
  }

  addToHistory(expression, result) {
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
  }

  updateHistoryDisplay() {
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
  }

  toggleStepByStep() {
    this.isStepByStepMode = !this.isStepByStepMode;
    const btn = document.getElementById('stepByStep');
    btn.classList.toggle('active', this.isStepByStepMode);
  }

  toggleHistory() {
    this.historyPanel.classList.toggle('active');
  }

  updateDisplay() {
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
  }

  handleKeyboard(e) {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      this.handleNumber(e.key);
    } else {
      switch (e.key) {
        case '+': e.preventDefault(); this.handleAction('add'); break;
        case '-': e.preventDefault(); this.handleAction('subtract'); break;
        case '*': e.preventDefault(); this.handleAction('multiply'); break;
        case '/': e.preventDefault(); this.handleAction('divide'); break;
        case '.': e.preventDefault(); this.handleAction('decimal'); break;
        case 'Enter':
        case '=': e.preventDefault(); this.handleAction('equals'); break;
        case 'Escape': e.preventDefault(); this.handleAction('clear'); break;
        case 'Backspace': e.preventDefault(); this.handleAction('del'); break;
        case '(': 
        case ')': e.preventDefault(); this.handleAction('parentheses'); break;
      }
    }
  }

  saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(this.calculationHistory));
  }

  loadHistory() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
      this.calculationHistory = JSON.parse(saved);
      this.updateHistoryDisplay();
    }
  }

  // Placeholder methods for advanced features
  toggleShift() { 
    this.isShiftActive = !this.isShiftActive; 
    this.showMessage(this.isShiftActive ? 'Shift ON' : 'Shift OFF');
  }
  
  toggleAlpha() { 
    this.isAlphaActive = !this.isAlphaActive; 
    this.showMessage(this.isAlphaActive ? 'Alpha ON' : 'Alpha OFF');
  }
  
  showModeMenu() { this.showMessage('Mode menu opened'); }
  toggleEngineering() { this.showMessage('Engineering notation toggled'); }
}

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

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ScientificCalculator();
});
