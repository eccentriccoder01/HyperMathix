// mode-switcher.js - Mode Switching and Configuration Module

// Extend the ScientificCalculator class with mode switching methods
ScientificCalculator.prototype.switchMode = function(mode) {
  this.currentMode = mode;
  this.showMessage(`Switched to ${mode} mode`);
  
  // Hide all mode-specific panels
  const panels = ['advancedPanel', 'scientificPanel', 'statsPanel', 'memoryPanel'];
  panels.forEach(panel => {
    if (this[panel]) {
      this[panel].classList.remove('active');
    }
  });
  
  // Update UI based on mode
  this.updateModeUI(mode);
};

ScientificCalculator.prototype.updateModeUI = function(mode) {
  // Remove all mode classes
  document.body.classList.remove('basic-mode', 'scientific-mode', 'graphing-mode', 'programming-mode');
  
  // Add the current mode class
  document.body.classList.add(`${mode}-mode`);
  
  // Show/hide relevant button groups
  const buttonGroups = {
    basic: ['.basic-functions'],
    scientific: ['.basic-functions', '.scientific-functions', '.trig-functions'],
    graphing: ['.basic-functions', '.scientific-functions', '.graphing-functions'],
    programming: ['.basic-functions', '.programming-functions', '.base-functions']
  };
  
  // Hide all button groups first
  document.querySelectorAll('.function-group').forEach(group => {
    group.style.display = 'none';
  });
  
  // Show relevant groups for current mode
  const relevantGroups = buttonGroups[mode] || buttonGroups.basic;
  relevantGroups.forEach(selector => {
    const groups = document.querySelectorAll(selector);
    groups.forEach(group => {
      group.style.display = 'block';
    });
  });
};

ScientificCalculator.prototype.setAngleMode = function(mode) {
  this.angleMode = mode;
  this.showMessage(`Angle mode: ${mode.toUpperCase()}`);
  
  // Update angle mode indicator
  const indicator = document.getElementById('angleModeIndicator');
  if (indicator) {
    indicator.textContent = mode.toUpperCase();
  }
  
  // Update button states
  document.querySelectorAll('.angle-mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`[data-angle-mode="${mode}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
};

ScientificCalculator.prototype.toggleAdvancedMode = function() {
  const isAdvanced = document.body.classList.contains('advanced-mode');
  
  if (isAdvanced) {
    document.body.classList.remove('advanced-mode');
    this.showMessage('Basic mode activated');
  } else {
    document.body.classList.add('advanced-mode');
    this.showMessage('Advanced mode activated');
  }
  
  // Save preference
  localStorage.setItem('calculatorAdvancedMode', !isAdvanced);
};

ScientificCalculator.prototype.loadModePreferences = function() {
  // Load angle mode
  const savedAngleMode = localStorage.getItem('calculatorAngleMode');
  if (savedAngleMode && ['deg', 'rad', 'grad'].includes(savedAngleMode)) {
    this.setAngleMode(savedAngleMode);
  }
  
  // Load advanced mode
  const savedAdvancedMode = localStorage.getItem('calculatorAdvancedMode');
  if (savedAdvancedMode === 'true') {
    document.body.classList.add('advanced-mode');
  }
  
  // Load number base
  const savedNumberBase = localStorage.getItem('calculatorNumberBase');
  if (savedNumberBase && ['dec', 'hex', 'bin', 'oct'].includes(savedNumberBase)) {
    this.setNumberBase(savedNumberBase);
  }
  
  // Load theme
  this.loadTheme();
};

ScientificCalculator.prototype.saveModePreferences = function() {
  localStorage.setItem('calculatorAngleMode', this.angleMode);
  localStorage.setItem('calculatorNumberBase', this.numberBase);
  localStorage.setItem('calculatorAdvancedMode', document.body.classList.contains('advanced-mode'));
};

// Setup mode switching event listeners
ScientificCalculator.prototype.setupModeListeners = function() {
  // Angle mode buttons
  document.querySelectorAll('[data-angle-mode]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.target.dataset.angleMode;
      this.setAngleMode(mode);
      this.saveModePreferences();
    });
  });
  
  // Advanced mode toggle
  const advancedToggle = document.getElementById('advancedModeToggle');
  if (advancedToggle) {
    advancedToggle.addEventListener('click', () => {
      this.toggleAdvancedMode();
      this.saveModePreferences();
    });
  }
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  }
};

// Complex mode toggle
ScientificCalculator.prototype.toggleComplexMode = function() {
  this.isComplexMode = !this.isComplexMode;
  this.showMessage(this.isComplexMode ? 'Complex mode ON' : 'Complex mode OFF');
};

// Base converter function
ScientificCalculator.prototype.openBaseConverter = function() {
  const value = this.currentExpression;
  const currentBase = this.numberBase;
  
  if (value && value !== '0') {
    let decimalValue;
    
    switch (currentBase) {
      case 'hex':
        decimalValue = parseInt(value, 16);
        break;
      case 'bin':
        decimalValue = parseInt(value, 2);
        break;
      case 'oct':
        decimalValue = parseInt(value, 8);
        break;
      default:
        decimalValue = parseInt(value, 10);
    }
    
    if (!isNaN(decimalValue)) {
      const conversions = {
        'DEC': decimalValue.toString(10),
        'HEX': decimalValue.toString(16).toUpperCase(),
        'BIN': decimalValue.toString(2),
        'OCT': decimalValue.toString(8)
      };
      
      let message = 'Base conversions:\n';
      for (let [base, val] of Object.entries(conversions)) {
        message += `${base}: ${val}\n`;
      }
      
      alert(message);
      this.showMessage('Base conversion completed');
    } else {
      this.showMessage('Invalid number for conversion');
    }
  } else {
    this.showMessage('Enter a number to convert');
  }
};

// Legacy mode switching for backward compatibility
document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calculatorModes = document.querySelectorAll('.calculator-mode');
    
    modeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons and modes
        modeButtons.forEach(btn => btn.classList.remove('active'));
        calculatorModes.forEach(mode => mode.classList.remove('active'));
        
        // Activate the clicked button and corresponding mode
        this.classList.add('active');
        const targetMode = this.dataset.mode;
        const targetModeElement = document.getElementById(targetMode);
        if (targetModeElement) {
          targetModeElement.classList.add('active');
        }
      });
    });
});