document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calculatorModes = document.querySelectorAll('.calculator-mode');
    
    modeButtons.forEach(button => {
      button.addEventListener('click', function() {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        calculatorModes.forEach(mode => mode.classList.remove('active'));
        this.classList.add('active');
        const mode = this.getAttribute('data-mode');
        document.getElementById(`${mode}-mode`).classList.add('active');
        document.querySelector('.display').textContent = '0';
      });
    });
  });