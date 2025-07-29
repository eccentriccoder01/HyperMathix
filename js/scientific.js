function parseExpression(expr) {
    let parsed = expr
        .replace(/÷/g, '/')
        .replace(/×/g, '*');
    parsed = parsed.replace(/([+-]?\d+\.?\d*(?:[eE][+-]?\d+)?)\s*i/g, 'new Complex(0,$1)');
    parsed = parsed.replace(/(?<![a-zA-Z0-9_\.])i(?![\d\.a-zA-Z])/g, 'new Complex(0,1)');
    const endOfTerm = `((?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?|\\)|\\bnew Complex\\([^)]*\\)|\\b[a-zA-Z_]\\w*\\([^)]*\\)))`;
    const startOfTerm = `((\\(|\\bnew Complex\\([^)]*\\)|\\b[a-zA-Z_]\\w*\\(|\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?))`;
    parsed = parsed.replace(/(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*(\(|\b[a-zA-Z_]\w+\()/g, '$1*$2');
    parsed = parsed.replace(/(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*(\bnew Complex\([^)]*\))/g, '$1*$2');
    parsed = parsed.replace(/(\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');
    parsed = parsed.replace(/(\bnew Complex\([^)]*\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');
    parsed = parsed.replace(/(\b[a-zA-Z_]\w+\([^)]*\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');
    parsed = parsed.replace(
        /((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))\\s*\\^((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))/g,
        'pow($1,$2)'
    );
    parsed = parsed
        .replace(/sin\u207B\u00B9/g, 'asin')
        .replace(/cos\u207B\u00B9/g, 'acos')
        .replace(/tan\u207B\u00B9/g, 'atan')
        .replace(/\bAbs\(/g, 'abs(')
        .replace(/\bArg\(/g, 'arg(')
        .replace(/\bConj\(/g, 'conj(')
        .replace(/\bln\b/g, 'log')
        .replace(/\blog\b/g, 'log10')
        .replace(/√/g, 'sqrt')
        .replace(/\bsin\b/g, 'sin')
        .replace(/\bcos\b/g, 'cos')
        .replace(/\btan\b/g, 'tan');

    const strictOperandPattern = `((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))`;
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\*\\s*${strictOperandPattern}`, 'g'), `mul($1,$2)`);
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\/\\s*${strictOperandPattern}`, 'g'), `div($1,$2)`);
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\+\\s*${strictOperandPattern}`, 'g'), `add($1,$2)`);
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\-\\s*${strictOperandPattern}`, 'g'), `sub($1,$2)`);

    return parsed;
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#scientific-mode button').forEach(button => {
        button.addEventListener("click", function() {
            const value = this.value;

            if (value === "clear") {
                currentExpression = "0";
                cursorPosition = 0;
            } else if (value === "backspace") {
                if (cursorPosition > 0) {
                    currentExpression = currentExpression.slice(0, cursorPosition - 1) + currentExpression.slice(cursorPosition);
                    cursorPosition--;
                }
                if (currentExpression === "") currentExpression = "0";
            } else if (value === "solve") {
                try {
                    const parsedExpr = parseExpression(currentExpression);
                    console.log("Parsed expression:", parsedExpr);
                    const result = eval(parsedExpr);
                    console.log("Evaluated Result Object:", result);
                    console.log("Result type:", typeof result);
                    console.log("Result instanceof Complex:", result instanceof Complex);
                    if (result instanceof Complex) {
                        console.log("Result Real:", result.real, "Imag:", result.imag);
                    }
                    if (result instanceof Complex) {
                        currentExpression = result.toString();
                    } else if (typeof result === 'number' && isNaN(result)) {
                        currentExpression = "Error";
                    } else if (typeof result === 'number' && !isFinite(result)) {
                        currentExpression = "Infinity";
                    }
                    else {
                        currentExpression = result.toString();
                    }
                    cursorPosition = currentExpression.length;
                } catch (error) {
                    console.error("Evaluation Error:", error);
                    currentExpression = "Error";
                    cursorPosition = currentExpression.length;
                }
            } else if (value === "sqrt") {
                currentExpression = insertAtCursor("√(");
                cursorPosition += 2;
            } else if (value === "log" || value === "ln") {
                currentExpression = insertAtCursor(`${value}(`);
                cursorPosition += value.length + 1;
            } else if (value === "sin" || value === "cos" || value === "tan" ||
                       value === "sin⁻¹" || value === "cos⁻¹" || value === "tan⁻¹") {
                let funcName = value;
                if (value === "sin⁻¹") funcName = "asin";
                else if (value === "cos⁻¹") funcName = "acos";
                else if (value === "tan⁻¹") funcName = "atan";

                currentExpression = insertAtCursor(`${funcName}(`);
                cursorPosition += funcName.length + 1;
            } else if (value === "abs") {
                currentExpression = insertAtCursor("Abs(");
                cursorPosition += 4;
            } else if (value === "arg") {
                currentExpression = insertAtCursor("Arg(");
                cursorPosition += 4;
            } else if (value === "conj") {
                currentExpression = insertAtCursor("Conj(");
                cursorPosition += 5;
            } else if (value === "i") {
                currentExpression = insertAtCursor("i");
                cursorPosition += 1;
            } else if (value === "left") {
                if (cursorPosition > 0) cursorPosition--;
            } else if (value === "right") {
                if (cursorPosition < currentExpression.length) cursorPosition++;
            } else { 
                if (currentExpression === "0" && value !== '.') {
                    currentExpression = value;
                    cursorPosition = value.length;
                } else {
                    currentExpression = insertAtCursor(value);
                    cursorPosition += value.length;
                }
            }

            updateDisplay();
        });
    });

    function handleKeyboardInput(event) {
        const key = event.key;

        if (
            key === ' ' ||
            key === 'Tab' ||
            event.ctrlKey ||
            event.altKey ||
            event.metaKey
        ) {
            return;
        }

        let buttonValue;
        switch (key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
            case '.':
                buttonValue = key;
                break;
            case '+': buttonValue = '+'; break;
            case '-': buttonValue = '-'; break;
            case '*': buttonValue = '×'; break;
            case '/': buttonValue = '÷'; break; 
            case '^': buttonValue = '^'; break;
            case 'Enter':
                buttonValue = 'solve';
                event.preventDefault();
                break;
            case 'Backspace': buttonValue = 'backspace'; break;
            case 'Escape': buttonValue = 'clear'; break;
            case 'i': buttonValue = 'i'; break;
            case '(': buttonValue = '('; break;
            case ')': buttonValue = ')'; break;
            case 'ArrowLeft':
                buttonValue = 'left';
                event.preventDefault();
                break;
            case 'ArrowRight':
                buttonValue = 'right';
                event.preventDefault();
                break;
            default:
                if (
                    (key >= '0' && key <= '9') ||
                    key === '.' || key === '+' || key === '-' ||
                    key === '*' || key === '/' || key === '(' ||
                    key === ')' || key === 'i' || key === '^'
                ) {
                    if (currentExpression === "0" && key !== '.') {
                        currentExpression = key;
                        cursorPosition = 1;
                    } else {
                        currentExpression = insertAtCursor(key);
                        cursorPosition += 1;
                    }
                    updateDisplay();
                    return;
                }
                return;
        }

        const matchingButton = document.querySelector(`#scientific-mode button[value="${buttonValue}"]`);
        if (matchingButton) {
            matchingButton.click();
        }
    }

    document.addEventListener('keydown', handleKeyboardInput);

    function handlePaste(event) {
        event.preventDefault();

        const pastedText = (event.clipboardData || window.clipboardData).getData('text/plain');

        if (pastedText) {
            const validCharsRegex = /[^0-9+\-*/().i√^loglnsincostanAbsArgConj\s]/g;
            const cleanedText = pastedText.replace(validCharsRegex, '');

            if (currentExpression === "0") {
                currentExpression = cleanedText;
                cursorPosition = cleanedText.length;
            } else {
                currentExpression = insertAtCursor(cleanedText);
                cursorPosition += cleanedText.length;
            }
            updateDisplay();
        }
    }
    document.addEventListener('paste', handlePaste);
});