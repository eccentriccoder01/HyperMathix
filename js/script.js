document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new ScientificCalculator();
  window.calculator.loadModePreferences();
  window.calculator.setupModeListeners();
  window.calculator.initializeGraph();
});
