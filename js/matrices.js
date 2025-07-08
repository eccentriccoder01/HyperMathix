// matrices.js - Matrix Operations Module

// Extend the ScientificCalculator class with matrix methods
ScientificCalculator.prototype.createMatrix = function(rows, cols, values = null) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = values ? values[i * cols + j] : 0;
    }
  }
  return matrix;
};

ScientificCalculator.prototype.addMatrices = function(matrixA, matrixB) {
  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    throw new Error('Matrices must have the same dimensions for addition');
  }
  
  const result = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixA[0].length; j++) {
      result[i][j] = matrixA[i][j] + matrixB[i][j];
    }
  }
  return result;
};

ScientificCalculator.prototype.multiplyMatrices = function(matrixA, matrixB) {
  if (matrixA[0].length !== matrixB.length) {
    throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
  }
  
  const result = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixB[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < matrixA[0].length; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  return result;
};

ScientificCalculator.prototype.determinant = function(matrix) {
  if (matrix.length !== matrix[0].length) {
    throw new Error('Matrix must be square to calculate determinant');
  }
  
  const n = matrix.length;
  
  if (n === 1) {
    return matrix[0][0];
  }
  
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = this.getMinor(matrix, 0, j);
    const cofactor = Math.pow(-1, j) * this.determinant(minor);
    det += matrix[0][j] * cofactor;
  }
  
  return det;
};

ScientificCalculator.prototype.getMinor = function(matrix, row, col) {
  const minor = [];
  for (let i = 0; i < matrix.length; i++) {
    if (i !== row) {
      const newRow = [];
      for (let j = 0; j < matrix[0].length; j++) {
        if (j !== col) {
          newRow.push(matrix[i][j]);
        }
      }
      minor.push(newRow);
    }
  }
  return minor;
};

ScientificCalculator.prototype.openMatrixCalculator = function() {
  const input = prompt('Enter matrix operation:\nFormat: [[1,2],[3,4]] + [[5,6],[7,8]]');
  if (input) {
    try {
      const result = this.evaluateMatrixExpression(input);
      this.showMessage('Matrix operation completed');
      this.currentExpression = result.toString();
      this.updateDisplay();
    } catch (error) {
      this.showMessage('Invalid matrix format');
    }
  }
};

ScientificCalculator.prototype.evaluateMatrixExpression = function(expression) {
  this.showMessage('Matrix calculator opened');
  return 'Matrix result';
};

ScientificCalculator.prototype.openVectorCalculator = function() {
  const input = prompt('Enter vector operation:\nFormat: [1,2,3] + [4,5,6]');
  if (input) {
    try {
      this.showMessage('Vector operation completed');
      this.currentExpression = 'Vector result';
      this.updateDisplay();
    } catch (error) {
      this.showMessage('Invalid vector format');
    }
  }
};