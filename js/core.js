const calculator = document.querySelector("#calculator");
const display = calculator.querySelector(".display");

let cursorPosition = 0;
let currentExpression = "0";

function updateDisplay() {
  let text = currentExpression.slice(0, cursorPosition) + "|" + currentExpression.slice(cursorPosition);
  display.innerHTML = text || "0";
}

function insertAtCursor(content) {
  return currentExpression.slice(0, cursorPosition) + content + currentExpression.slice(cursorPosition);
}

class Complex {
  constructor(real, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  toString(precision = 10) {
    const real = parseFloat(this.real.toFixed(precision));
    const imag = parseFloat(this.imag.toFixed(precision));

    if (imag === 0) return real.toString();
    if (real === 0) {
        if (imag === 1) return 'i';
        if (imag === -1) return '-i';
        return `${imag}i`;
    }
    return `${real}${imag >= 0 ? '+' : ''}${imag}i`;
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

function parseComplex(str) {
  try {
    str = str.replace(/\s+/g, '');
    if (str === 'i') return new Complex(0, 1);
    if (str === '-i') return new Complex(0, -1);
    const pureImagMatch = str.match(/^([+-]?\d*\.?\d*(?:[eE][+-]?\d+)?)i$/);
    if (pureImagMatch) {
        const imagPart = pureImagMatch[1];
        if (imagPart === '+' || imagPart === '') return new Complex(0, 1);
        if (imagPart === '-') return new Complex(0, -1);
        return new Complex(0, Number(imagPart));
    }
    if (!str.includes('i')) {
        return new Complex(Number(str), 0);
    }

    let realPart = 0;
    let imagPart = 0;

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

function _toComplexIfNumber(val) {
    if (typeof val === 'number') {
        return new Complex(val, 0);
    }
    return val;
}

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

updateDisplay();