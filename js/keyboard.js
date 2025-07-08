// keyboard.js - Keyboard Input Handling Module

// Extend the ScientificCalculator class with keyboard methods
ScientificCalculator.prototype.handleKeyboard = function(e) {
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
    this.handleNumber(e.key);
  } else {
    switch (e.key) {
      case '+': 
        e.preventDefault(); 
        this.handleAction('add'); 
        break;
      case '-': 
        e.preventDefault(); 
        this.handleAction('subtract'); 
        break;
      case '*': 
        e.preventDefault(); 
        this.handleAction('multiply'); 
        break;
      case '/': 
        e.preventDefault(); 
        this.handleAction('divide'); 
        break;
      case '.': 
        e.preventDefault(); 
        this.handleAction('decimal'); 
        break;
      case 'Enter':
      case '=': 
        e.preventDefault(); 
        this.handleAction('equals'); 
        break;
      case 'Escape': 
        e.preventDefault(); 
        this.handleAction('clear'); 
        break;
      case 'Backspace': 
        e.preventDefault(); 
        this.handleAction('del'); 
        break;
      case '(': 
      case ')': 
        e.preventDefault(); 
        this.handleAction('parentheses'); 
        break;
      case '^':
        e.preventDefault();
        this.addOperator('^');
        break;
      case '%':
        e.preventDefault();
        this.addPercent();
        break;
      default:
        // Handle function keys
        this.handleFunctionKeys(e);
        break;
    }
  }
};

ScientificCalculator.prototype.handleFunctionKeys = function(e) {
  // Handle function keys with modifiers
  if (e.ctrlKey) {
    switch (e.key.toLowerCase()) {
      case 'h':
        e.preventDefault();
        this.toggleHistory();
        break;
      case 's':
        e.preventDefault();
        this.toggleStepByStep();
        break;
      case 'm':
        e.preventDefault();
        this.memoryStore();
        break;
      case 'r':
        e.preventDefault();
        this.memoryRecall();
        break;
    }
  } else if (e.altKey) {
    switch (e.key.toLowerCase()) {
      case 's':
        e.preventDefault();
        this.handleFunction('sin');
        break;
      case 'c':
        e.preventDefault();
        this.handleFunction('cos');
        break;
      case 't':
        e.preventDefault();
        this.handleFunction('tan');
        break;
      case 'l':
        e.preventDefault();
        this.handleFunction('ln');
        break;
      case 'g':
        e.preventDefault();
        this.handleFunction('log');
        break;
      case 'q':
        e.preventDefault();
        this.handleFunction('sqrt');
        break;
      case 'p':
        e.preventDefault();
        this.addConstant('π');
        break;
      case 'e':
        e.preventDefault();
        this.addConstant('e');
        break;
    }
  }
};

// Add keyboard shortcuts help
ScientificCalculator.prototype.showKeyboardHelp = function() {
  const helpMessage = `
    Keyboard Shortcuts:
    Numbers: 0-9
    Operations: +, -, *, /
    Functions: Alt+S (sin), Alt+C (cos), Alt+T (tan)
    Logarithms: Alt+L (ln), Alt+G (log)
    Constants: Alt+P (π), Alt+E (e)
    Memory: Ctrl+M (store), Ctrl+R (recall)
    Other: Enter (=), Escape (clear), Backspace (delete)
    History: Ctrl+H, Step-by-step: Ctrl+S
  `;
  this.showMessage(helpMessage);
};
