class Complex {
  constructor(real, imag) {
    this.real = real || 0;
    this.imag = imag || 0;
  }
  
  abs() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
  
  arg() {
    return Math.atan2(this.imag, this.real);
  }
  
  conj() {
    return new Complex(this.real, -this.imag);
  }
  
  toString() {
    if (this.imag === 0) return this.real.toString();
    if (this.real === 0) return this.imag === 1 ? 'i' : this.imag === -1 ? '-i' : this.imag + 'i';
    const sign = this.imag >= 0 ? '+' : '';
    const imagPart = this.imag === 1 ? 'i' : this.imag === -1 ? '-i' : this.imag + 'i';
    return `${this.real}${sign}${imagPart}`;
  }

  _toComplex(other) {
    if (other instanceof Complex) {
      return other;
    } else if (typeof other === 'number') {
      return new Complex(other, 0);
    }
    try {
      const parsed = parseComplex(String(other));
      if (isNaN(parsed.real) || isNaN(parsed.imag)) {
        throw new Error("Invalid number/complex string: " + other);
      }
      return parsed;
    } catch (e) {
      throw new Error("Invalid operand for complex operation: " + other + " - " + e.message);
    }
  }

  add(other) {
    other = this._toComplex(other);
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  sub(other) {
    other = this._toComplex(other);
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  mul(other) {
    other = this._toComplex(other);
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  div(other) {
    other = this._toComplex(other);
    const denom = other.real * other.real + other.imag * other.imag;
    if (denom === 0) {
      throw new Error("Division by zero in complex numbers.");
    }
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denom,
      (this.imag * other.real - this.real * other.imag) / denom
    );
  }

  exp() {
    const r = Math.exp(this.real);
    return new Complex(r * Math.cos(this.imag), r * Math.sin(this.imag));
  }

  log() {
    if (this.real === 0 && this.imag === 0) {
      return new Complex(NaN, NaN);
    }
    const r = this.abs();
    const theta = this.arg();
    return new Complex(Math.log(r), theta);
  }

  log10() {
    const lnZ = this.log();
    if (isNaN(lnZ.real) || isNaN(lnZ.imag)) {
        return new Complex(NaN, NaN);
    }
    const ln10 = Math.log(10);
    return new Complex(lnZ.real / ln10, lnZ.imag / ln10);
  }

  pow(p) {
    p = this._toComplex(p);
    if (this.real === 0 && this.imag === 0) {
        if (p.real > 0 && p.imag === 0) return new Complex(0,0);
        if (p.real === 0 && p.imag === 0) return new Complex(1,0);
        return new Complex(NaN, NaN);
    }
    const logZ = this.log();
    if (isNaN(logZ.real) || isNaN(logZ.imag)) {
        return new Complex(NaN, NaN);
    }
    const product = p.mul(logZ);
    return product.exp();
  }

  sqrt() {
    return this.pow(0.5);
  }

  sin() {
    const iz = new Complex(-this.imag, this.real);
    const minus_iz = new Complex(this.imag, -this.real);
    const e_iz = iz.exp();
    const e_minus_iz = minus_iz.exp();
    const numerator = e_iz.sub(e_minus_iz);
    const denominator = new Complex(0, 2);
    return numerator.div(denominator);
  }

  cos() {
    const iz = new Complex(-this.imag, this.real);
    const minus_iz = new Complex(this.imag, -this.real);
    const e_iz = iz.exp();
    const e_minus_iz = minus_iz.exp();
    const numerator = e_iz.add(e_minus_iz);
    const denominator = new Complex(2, 0);
    return numerator.div(denominator);
  }

  tan() {
    const sinZ = this.sin();
    const cosZ = this.cos();
    if (cosZ.abs() < 1e-15) {
        return new Complex(NaN, NaN);
    }
    return sinZ.div(cosZ);
  }

  asin() {
    const z_squared = this.mul(this);
    const one_minus_z_squared = new Complex(1, 0).sub(z_squared);
    const sqrt_one_minus_z_squared = one_minus_z_squared.sqrt();
    if (isNaN(sqrt_one_minus_z_squared.real) || isNaN(sqrt_one_minus_z_squared.imag)) {
        return new Complex(NaN, NaN);
    }
    const iz = new Complex(-this.imag, this.real);
    const sum_term = iz.add(sqrt_one_minus_z_squared);
    const ln_term = sum_term.log();
    if (isNaN(ln_term.real) || isNaN(ln_term.imag)) {
        return new Complex(NaN, NaN);
    }
    const minus_i = new Complex(0, -1);
    return minus_i.mul(ln_term);
  }

  acos() {
    const z_squared = this.mul(this);
    const one_minus_z_squared = new Complex(1, 0).sub(z_squared);
    const sqrt_one_minus_z_squared = one_minus_z_squared.sqrt();
    if (isNaN(sqrt_one_minus_z_squared.real) || isNaN(sqrt_one_minus_z_squared.imag)) {
        return new Complex(NaN, NaN);
    }
    const i_sqrt_term = new Complex(0, 1).mul(sqrt_one_minus_z_squared);
    const sum_term = this.add(i_sqrt_term);
    const ln_term = sum_term.log();
    if (isNaN(ln_term.real) || isNaN(ln_term.imag)) {
        return new Complex(NaN, NaN);
    }
    const minus_i = new Complex(0, -1);
    return minus_i.mul(ln_term);
  }

  atan() {
    const iz = new Complex(-this.imag, this.real);
    const one = new Complex(1, 0);
    const numerator = one.sub(iz);
    const denominator = one.add(iz);
    if (denominator.abs() < 1e-15) {
        return new Complex(NaN, NaN);
    }
    const fraction = numerator.div(denominator);
    const ln_term = fraction.log();
    if (isNaN(ln_term.real) || isNaN(ln_term.imag)) {
        return new Complex(NaN, NaN);
    }
    const i_half = new Complex(0, 0.5);
    return i_half.mul(ln_term);
  }
}

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
    this.updateShiftedButtons(); // Initialize button labels
  }

  setupEventListeners() {
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
    this.setupControlButtons();
    
    // Settings modal angle mode buttons
    document.querySelectorAll('[data-angle-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setAngleMode(e.target.dataset.angleMode);
        this.updateSettingsUI();
      });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  setupControlButtons() {
    const buttons = [
      { id: 'stepByStep', handler: () => this.toggleStepByStep() },
      { id: 'toggleAdvanced', handler: () => this.togglePanel('advanced') },
      { id: 'toggleScientific', handler: () => this.togglePanel('scientific') },
      { id: 'toggleStats', handler: () => this.togglePanel('stats') },
      { id: 'toggleMemory', handler: () => this.togglePanel('memory') },
      { id: 'history', handler: () => this.toggleHistory() },
      { id: 'closeSteps', handler: () => this.stepsPanel.classList.remove('active') },
      { id: 'closeHistory', handler: () => this.historyPanel.classList.remove('active') },
      { id: 'clearHistory', handler: () => this.clearHistory() },
      { id: 'settingsBtn', handler: () => this.showSettings() },
      { id: 'closeSettings', handler: () => this.closeSettings() },
      { id: 'lightTheme', handler: () => this.setTheme('light') },
      { id: 'darkTheme', handler: () => this.setTheme('dark') },
      { id: 'clearMemory', handler: () => this.clearMemoryFromSettings() }
    ];

    buttons.forEach(({ id, handler }) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', handler);
        // Additional event for better mobile support
        element.addEventListener('touchstart', handler);
      } else if (id === 'settingsBtn') {
        console.warn('Settings button not found in DOM');
      }
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
      case 'comma':
        this.addComma();
        break;
      case 'exp10':
        this.addExp10();
        break;
      case 'eng':
        this.toggleEngineering();
        break;
      case 'ans':
        this.addAnswer();
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
      case 'solve':
        this.openEquationSolver();
        break;
      case 'calc':
        this.calculate();
        break;
      case 'integral':
        this.addFunction('integral');
        break;
      case 'derivative':
        this.addFunction('derivative');
        break;
      case 'pol':
        this.convertToPolar();
        break;
      case 'rec':
        this.convertToRectangular();
        break;
      case 'dms':
        this.convertToDMS();
        break;
      case 'sdp':
        this.calculateStandardDeviation();
        break;
      case 'matrix':
        this.openMatrixCalculator();
        break;
      case 'vector':
        this.openVectorCalculator();
        break;
      case 'cmplx':
        this.toggleComplexMode();
        break;
      case 'base':
        this.openBaseConverter();
        break;
      default:
        this.showMessage(`${func} function activated`);
        break;
    }
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

  toggleStepByStep() {
    this.isStepByStepMode = !this.isStepByStepMode;
    const btn = document.getElementById('stepByStep');
    btn.classList.toggle('active', this.isStepByStepMode);
  }

  toggleHistory() {
    this.historyPanel.classList.toggle('active');
  }

  // Settings menu
  showSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.add('active');
      this.updateSettingsUI();
    }
  }

  closeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.remove('active');
    }
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('calculatorTheme', theme);
    this.updateSettingsUI();
    this.showMessage(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`);
  }

  clearMemoryFromSettings() {
    this.memory = 0;
    this.updateSettingsUI();
    this.showMessage('Memory cleared');
  }

  setAngleMode(mode) {
    this.angleMode = mode;
    this.showMessage(`Angle mode: ${mode.toUpperCase()}`);
    localStorage.setItem('calculatorAngleMode', mode);
  }

  updateSettingsUI() {
    // Update angle mode buttons
    document.querySelectorAll('[data-angle-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.angleMode === this.angleMode);
    });

    // Update number base buttons
    const baseButtons = {
      'dec': document.getElementById('decBtn'),
      'hex': document.getElementById('hexBtn'),
      'bin': document.getElementById('binBtn'),
      'oct': document.getElementById('octBtn')
    };
    
    Object.entries(baseButtons).forEach(([base, btn]) => {
      if (btn) {
        btn.classList.toggle('active', base === this.numberBase);
      }
    });

    // Update theme buttons
    const isDark = document.body.classList.contains('dark-theme');
    const lightBtn = document.getElementById('lightTheme');
    const darkBtn = document.getElementById('darkTheme');
    if (lightBtn) lightBtn.classList.toggle('active', !isDark);
    if (darkBtn) darkBtn.classList.toggle('active', isDark);

    // Update memory display
    const memoryDisplay = document.getElementById('memoryValue');
    if (memoryDisplay) {
      memoryDisplay.textContent = this.memory || '0';
    }
  }

  // Clear display only (different from AC which clears everything)
  clearDisplay() {
    this.currentExpression = '0';
    this.updateDisplay();
    this.showMessage('Display cleared');
  }

  // Placeholder methods for advanced features  
  toggleEngineering() { this.showMessage('Engineering notation toggled'); }
}

// Complex number parsing and utility functions
function parseComplex(str) {
  try {
    str = str.replace(/\s+/g, ''); // Remove all whitespace

    // Handle simple 'i'
    if (str === 'i') return new Complex(0, 1);
    if (str === '-i') return new Complex(0, -1);

    // Handle pure imaginary numbers like "5i", "-2.5i"
    const pureImagMatch = str.match(/^([+-]?\d*\.?\d*(?:[eE][+-]?\d+)?)i$/);
    if (pureImagMatch) {
        const imagPart = pureImagMatch[1];
        if (imagPart === '+' || imagPart === '') return new Complex(0, 1);
        if (imagPart === '-') return new Complex(0, -1);
        return new Complex(0, Number(imagPart));
    }

    // If no 'i', it's a real number
    if (!str.includes('i')) {
        return new Complex(Number(str), 0);
    }

    // Handle general complex numbers like "2+3i", "-1-i", "4+i"
    let realPart = 0;
    let imagPart = 0;

    // Regex to split parts while correctly handling signs for complex numbers
    // e.g., "2+3i" -> "2", "+3i"
    // "-1-i" -> "-1", "-i"
    // "4+i" -> "4", "+i"
    // This is crucial for eval() to correctly parse "1+i" where "i" is treated as "1i"
    const complexParts = str.match(/^([+-]?\d*\.?\d*(?:[eE][+-]?\d+)?)\s*([+-]?\d*\.?\d*(?:[eE][+-]?\d+)?i)?$/);
    if (complexParts) {
        realPart = Number(complexParts[1]);
        if (complexParts[2]) {
            const imagStr = complexParts[2].replace('i', '');
            if (imagStr === '+' || imagStr === '') imagPart = 1;
            else if (imagStr === '-') imagPart = -1;
            else imagPart = Number(imagStr);
        }
        return new Complex(realPart, imagPart);
    }

    // Fallback for more complex cases or if the above regex fails for some reason
    // This is less ideal as it might mishandle things like "i+1"
    const parts = str.split(/(?=[+-])(?![\d\.][eE][+-])/);

    parts.forEach(part => {
      part = part.trim();
      if (part.includes('i')) {
        const coeff = part.replace('i', '');
        if (coeff === '+' || coeff === '') imagPart += 1;
        else if (coeff === '-') imagPart -= 1;
        else imagPart += Number(coeff);
      } else {
        realPart += Number(part);
      }
    });

    return new Complex(realPart, imagPart);

  } catch (e) {
    console.error("Error parsing complex number string '" + str + "':", e);
    return new Complex(NaN, NaN);
  }
}


// --- Global helper functions for eval() context ---
// These functions act as wrappers that can handle both Complex objects and numbers
// and then dispatch to the appropriate Complex method or Math function.

function _toComplexIfNumber(val) {
    if (typeof val === 'number') {
        return new Complex(val, 0);
    }
    return val;
}

// Global arithmetic functions
function add(a, b) {
    a = _toComplexIfNumber(a);
    b = _toComplexIfNumber(b);
    if (a instanceof Complex && b instanceof Complex) return a.add(b);
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    return new Complex(NaN, NaN);
}

function sub(a, b) {
    a = _toComplexIfNumber(a);
    b = _toComplexIfNumber(b);
    if (a instanceof Complex && b instanceof Complex) return a.sub(b);
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return new Complex(NaN, NaN);
}

function mul(a, b) {
    a = _toComplexIfNumber(a);
    b = _toComplexIfNumber(b);
    if (a instanceof Complex && b instanceof Complex) return a.mul(b);
    if (typeof a === 'number' && typeof b === 'number') return a * b;
    return new Complex(NaN, NaN);
}

function div(a, b) {
    a = _toComplexIfNumber(a);
    b = _toComplexIfNumber(b);
    if (a instanceof Complex && b instanceof Complex) return a.div(b);
    if (typeof a === 'number' && typeof b === 'number') {
        if (b === 0) return NaN;
        return a / b;
    }
    return new Complex(NaN, NaN);
}


// Scientific/Complex functions (wrappers for Complex methods)
function abs(z) { z = _toComplexIfNumber(z); if (z instanceof Complex) return z.abs(); return NaN; }
function arg(z) { z = _toComplexIfNumber(z); if (z instanceof Complex) return z.arg(); return NaN; }
function conj(z) { z = _toComplexIfNumber(z); if (z instanceof Complex) return z.conj(); return z; }
function sqrt(z) { z = _toComplexIfNumber(z); return z.sqrt(); }
function log(z) { z = _toComplexIfNumber(z); return z.log(); }
function log10(z) { z = _toComplexIfNumber(z); return z.log10(); }
function sin(z) { z = _toComplexIfNumber(z); return z.sin(); }
function cos(z) { z = _toComplexIfNumber(z); return z.cos(); }
function tan(z) { z = _toComplexIfNumber(z); return z.tan(); }
function asin(z) { z = _toComplexIfNumber(z); return z.asin(); }
function acos(z) { z = _toComplexIfNumber(z); return z.acos(); }
function atan(z) { z = _toComplexIfNumber(z); return z.atan(); }

function pow(base, exponent) {
    base = _toComplexIfNumber(base);
    exponent = _toComplexIfNumber(exponent);
    if (base instanceof Complex) {
        return base.pow(exponent);
    }
    if (typeof base === 'number' && typeof exponent === 'number') {
        return Math.pow(base, exponent);
    }
    return new Complex(NaN, NaN);
}

// Close settings modal when clicking outside
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
          this.closeSettings();
        }
      });
    }
    