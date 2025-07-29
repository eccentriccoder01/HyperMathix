const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let graphExpr = '';
let zoom = 40;
let originX = canvas.width / 2;
let originY = canvas.height / 2;

function drawAxes() {
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(canvas.width, originY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, canvas.height);
  ctx.stroke();
}

function screenToGraph(x, y) {
  return [
    (x - originX) / zoom,
    (originY - y) / zoom
  ];
}
function safeEval(expr, x) {
  try {
    const replaced = expr
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/ln/g, 'Math.log')
      .replace(/√/g, 'Math.sqrt')
      .replace(/e\^/g, 'Math.exp')
      .replace(/(\d|\))\s*\^(\d|\()/g, '$1**$2') 
      .replace(/x/g, `(${x})`);

    return eval(replaced);
  } catch {
    return NaN;
  }
}

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
      currentInput += value;
    }
  });
});

drawAxes();
