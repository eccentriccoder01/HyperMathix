// scientific.js - Final Version
// Arithmetic mode specific functionality

function parseExpression(expr) {
    let parsed = expr
        // Step 1: Replace common operators to internal JS operators
        .replace(/÷/g, '/')
        .replace(/×/g, '*');

    // Step 2: Convert numbers followed by 'i' to new Complex(0, number)
    // E.g., "5i", "-3.2i" -> "new Complex(0,5)", "new Complex(0,-3.2)"
    // This is applied *before* implicit multiplication
    parsed = parsed.replace(/([+-]?\d+\.?\d*(?:[eE][+-]?\d+)?)\s*i/g, 'new Complex(0,$1)');

    // Step 3: Convert lone 'i' to new Complex(0,1)
    // Ensure 'i' is not part of another word or number
    parsed = parsed.replace(/(?<![a-zA-Z0-9_\.])i(?![\d\.a-zA-Z])/g, 'new Complex(0,1)');

    // Step 4: Handle implicit multiplication - This is the most crucial and tricky part
    // We need to insert '*' in various scenarios:
    // A. Number/closing parenthesis/complex object/function call followed by opening parenthesis
    //    e.g., 2(x+y), (x+y)(a+b), Complex(..)(a+b), sin(x)(a+b)
    // B. Number/closing parenthesis/function call followed by a 'new Complex(...)' object
    //    e.g., 2new Complex(...), (x+y)new Complex(...), sin(x)new Complex(...)
    // C. 'new Complex(...)' followed by a number or function call
    //    e.g., new Complex(...)2, new Complex(...)sin(x)

    // Regex for patterns that could end a term (left side of implicit multiplication)
    const endOfTerm = `((?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?|\\)|\\bnew Complex\\([^)]*\\)|\\b[a-zA-Z_]\\w*\\([^)]*\\)))`;
    // Regex for patterns that could start a term (right side of implicit multiplication)
    const startOfTerm = `((\\(|\\bnew Complex\\([^)]*\\)|\\b[a-zA-Z_]\\w*\\(|\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?))`;

    // Apply implicit multiplication rules. Order matters for overlapping patterns.
    // Generally, apply patterns that are more specific or might create new tokens first.

    // Scenario 1: Number immediately followed by '(' or a function call
    // e.g., 2(x+y) -> 2*(x+y)
    parsed = parsed.replace(/(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*(\(|\b[a-zA-Z_]\w+\()/g, '$1*$2');

    // Scenario 2: Number immediately followed by 'new Complex(...)'
    // e.g., 4new Complex(0,3) -> 4*new Complex(0,3)
    parsed = parsed.replace(/(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*(\bnew Complex\([^)]*\))/g, '$1*$2');

    // Scenario 3: Closing parenthesis ')' immediately followed by number, '(', 'new Complex', or function call
    // e.g., (x+y)2, (x+y)(a+b), (x+y)new Complex(...), (x+y)sin(z)
    parsed = parsed.replace(/(\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');

    // Scenario 4: 'new Complex(...)' immediately followed by number, '(', 'new Complex', or function call
    // e.g., (2+i)3, (2+i)(a+b), (2+i)new Complex(...), (2+i)sin(z)
    parsed = parsed.replace(/(\bnew Complex\([^)]*\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');

    // Scenario 5: Function call immediately followed by number, '(', 'new Complex', or another function call
    // e.g., sin(x)2, sin(x)(y+z), sin(x)new Complex(...), sin(x)cos(y)
    parsed = parsed.replace(/(\b[a-zA-Z_]\w+\([^)]*\))\s*(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\(|\bnew Complex\([^)]*\)|\b[a-zA-Z_]\w+\()/g, '$1*$2');


    // Step 5: Convert power operator (^) to pow(base, exponent) function calls
    // Base/Exponent can be a number, 'new Complex(...)', or a parenthesized expression.
    // This needs to be applied after implicit multiplication.
    parsed = parsed.replace(
        /((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))\\s*\\^((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))/g,
        'pow($1,$2)'
    );


    // Step 6: Replace function names with our custom wrappers
    // IMPORTANT: Order matters here, longer names first, then shorter, to avoid partial matches.
    parsed = parsed
        .replace(/sin\u207B\u00B9/g, 'asin')
        .replace(/cos\u207B\u00B9/g, 'acos')
        .replace(/tan\u207B\u00B9/g, 'atan')
        .replace(/\bAbs\(/g, 'abs(')
        .replace(/\bArg\(/g, 'arg(')
        .replace(/\bConj\(/g, 'conj(')
        .replace(/\bln\b/g, 'log') // natural log (mapped to 'log' in core.js)
        .replace(/\blog\b/g, 'log10') // common log (mapped to 'log10' in core.js)
        .replace(/√/g, 'sqrt')
        .replace(/\bsin\b/g, 'sin')
        .replace(/\bcos\b/g, 'cos')
        .replace(/\btan\b/g, 'tan');

    // Step 7: Explicitly wrap arithmetic operations for Complex numbers using the global helper functions.
    // This is applied in order of precedence: mul/div first, then add/sub.
    // The operand pattern needs to be robust enough to capture full terms (numbers, new Complex, function calls, parenthesized expressions).
    // Using a non-greedy `.*?` for parenthesized expressions helps.

    const strictOperandPattern = `((?:(?:\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)|(?:\\bnew Complex\\([^)]*\\))|(?:\\b[a-zA-Z_]\\w*\\([^)]*\\))|\\([^()]*?\\)))`;

    // Multiplication and Division (higher precedence)
    // Replace all occurrences using global flag
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\*\\s*${strictOperandPattern}`, 'g'), `mul($1,$2)`);
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\/\\s*${strictOperandPattern}`, 'g'), `div($1,$2)`);

    // Addition and Subtraction (lower precedence)
    // Replace all occurrences using global flag
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\+\\s*${strictOperandPattern}`, 'g'), `add($1,$2)`);
    parsed = parsed.replace(new RegExp(`${strictOperandPattern}\\s*\\-\\s*${strictOperandPattern}`, 'g'), `sub($1,$2)`);

    return parsed;
}

// Ensure the calculator element is ready before attaching event listeners
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
                    console.log("Parsed expression:", parsedExpr); // Keep for debugging!
                    const result = eval(parsedExpr);

                    // Added verbose logging for debugging complex results
                    console.log("Evaluated Result Object:", result);
                    console.log("Result type:", typeof result);
                    console.log("Result instanceof Complex:", result instanceof Complex);
                    if (result instanceof Complex) {
                        console.log("Result Real:", result.real, "Imag:", result.imag);
                    }

                    // Handle result display for complex numbers and potential NaN cases
                    if (result instanceof Complex) {
                        currentExpression = result.toString();
                    } else if (typeof result === 'number' && isNaN(result)) {
                        currentExpression = "Error"; // Or "NaN" if you prefer
                    } else if (typeof result === 'number' && !isFinite(result)) { // Handle Infinity
                        currentExpression = "Infinity";
                    }
                    else {
                        currentExpression = result.toString();
                    }
                    cursorPosition = currentExpression.length;
                } catch (error) {
                    console.error("Evaluation Error:", error); // Log the actual error for debugging
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

                currentExpression = insertAtCursor(`${funcName}(`); // Insert the correct function name
                cursorPosition += funcName.length + 1; // Adjust cursor position
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
            } else { // Generic character/number input
                if (currentExpression === "0" && value !== '.') {
                    currentExpression = value;
                    cursorPosition = value.length; // Set cursor to end of new input
                } else {
                    currentExpression = insertAtCursor(value);
                    cursorPosition += value.length;
                }
            }

            updateDisplay();
        });
    });

    // --- Keyboard Input Handling ---
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
            case '*': buttonValue = '×'; break; // Map to your display character
            case '/': buttonValue = '÷'; break; // Map to your display character
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
                // For other valid input characters not mapped to specific buttons, allow direct insertion
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
                    return; // Handled, prevent default
                }
                return; // Ignore unhandled keys
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