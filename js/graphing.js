// graphing.js - Graphing and Visualization Module

// Extend the ScientificCalculator class with graphing methods
ScientificCalculator.prototype.initializeGraph = function() {
  this.graphCanvas = document.getElementById('graphCanvas') || document.getElementById('graph-canvas');
  this.graphContext = this.graphCanvas ? this.graphCanvas.getContext('2d') : null;
  this.graphSettings = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    gridSize: 1,
    showGrid: true,
    showAxes: true
  };
};

ScientificCalculator.prototype.plotFunction = function(functionString, color = '#667eea') {
  if (!this.graphContext) {
    this.showMessage('Graph canvas not available');
    return;
  }
  
  try {
    const func = this.parseFunction(functionString);
    this.drawGraph(func, color);
    this.showMessage(`Function ${functionString} plotted`);
  } catch (error) {
    this.showMessage('Error plotting function');
    console.error('Plotting error:', error);
  }
};

ScientificCalculator.prototype.parseFunction = function(functionString) {
  let processedFunction = functionString
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/ln/g, 'Math.log')
    .replace(/log/g, 'Math.log10')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/abs/g, 'Math.abs')
    .replace(/exp/g, 'Math.exp')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/\^/g, '**');
  
  return new Function('x', `return ${processedFunction}`);
};

ScientificCalculator.prototype.xToCanvas = function(x) {
  const { xMin, xMax } = this.graphSettings;
  return ((x - xMin) / (xMax - xMin)) * this.graphCanvas.width;
};

ScientificCalculator.prototype.yToCanvas = function(y) {
  const { yMin, yMax } = this.graphSettings;
  return this.graphCanvas.height - ((y - yMin) / (yMax - yMin)) * this.graphCanvas.height;
};

// Legacy graphing code for backward compatibility
const canvas = document.getElementById('graph-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Resize canvas dynamically
function resizeCanvas() {
  if (canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

// Graph state
let graphExpr = '';
let zoom = 40; // pixels per unit
let originX = canvas.width / 2;
let originY = canvas.height / 2;

// Draw axes
function drawAxes() {
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;

  // X Axis
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(canvas.width, originY);
  ctx.stroke();

  // Y Axis
  ctx.beginPath();
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, canvas.height);
  ctx.stroke();
}

// Convert screen coordinates to graph coordinates
function screenToGraph(x, y) {
  return [
    (x - originX) / zoom,
    (originY - y) / zoom
  ];
}

// Evaluate expression
function safeEval(expr, x) {
  try {
    const replaced = expr
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/ln/g, 'Math.log')
      .replace(/√/g, 'Math.sqrt')
      .replace(/e\^/g, 'Math.exp')
      .replace(/(\d|\))\s*\^(\d|\()/g, '$1**$2') // Replace ^ with **
      .replace(/x/g, `(${x})`);

    return eval(replaced);
  } catch {
    return NaN;
  }
}

// Plot the expression
function plotGraph(expr) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();

  ctx.beginPath();
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;

  let firstPoint = true;
  for (let px = 0; px <= canvas.width; px++) {
    const [x, _] = screenToGraph(px, 0);
    const yVal = safeEval(expr, x);
    const py = originY - yVal * zoom;

    if (!isNaN(yVal) && isFinite(yVal)) {
      if (firstPoint) {
        ctx.moveTo(px, py);
        firstPoint = false;
      } else {
        ctx.lineTo(px, py);
      }
    } else {
      firstPoint = true;
    }
  }

  ctx.stroke();
}

// Handle button clicks
let currentInput = '';

document.querySelectorAll('#graphing-mode button').forEach(button => {
  button.addEventListener('click', function () {
    const value = this.value;

    if (value === "clear-graph") {
      currentInput = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAxes();
    } else if (value === "graph-it") {
      graphExpr = currentInput;
      plotGraph(graphExpr);
    } else if (value === "zoom-in") {
      zoom *= 1.2;
      plotGraph(graphExpr);
    } else if (value === "zoom-out") {
      zoom /= 1.2;
      plotGraph(graphExpr);
    } else if (value === "pan-left") {
      originX += 20;
      plotGraph(graphExpr);
    } else if (value === "pan-right") {
      originX -= 20;
      plotGraph(graphExpr);
    } else if (value === "pan-up") {
      originY += 20;
      plotGraph(graphExpr);
    } else if (value === "pan-down") {
      originY -= 20;
      plotGraph(graphExpr);
    } else {
      // Insert function or value
      currentInput += value;
    }
  });
});

// Draw initial empty graph
drawAxes();
