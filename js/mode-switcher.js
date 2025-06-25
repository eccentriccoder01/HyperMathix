document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calculatorModes = document.querySelectorAll('.calculator-mode');
    
    modeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons and modes
        modeButtons.forEach(btn => btn.classList.remove('active'));
        calculatorModes.forEach(mode => mode.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show the corresponding calculator mode
        const mode = this.getAttribute('data-mode');
        document.getElementById(`${mode}-mode`).classList.add('active');
        
        // Clear display when switching modes
        document.querySelector('.display').textContent = '0';
      });
    });
  });