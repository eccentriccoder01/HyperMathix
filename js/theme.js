document.addEventListener('DOMContentLoaded', () => {
    console.log("Theme enhancements script loaded.");
    let audioContext;
    let clickBuffer, modeChangeBuffer, calculateBuffer;
    async function loadSound(url) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading sound:', url, error);
            return null;
        }
    }

    function playSound(buffer, volume = 0.5) {
        if (buffer && audioContext) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(0);
        }
    }

    document.body.addEventListener('click', async () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            clickBuffer = await loadSound('https://storage.googleapis.com/immersive-document-assets/click.mp3');
            modeChangeBuffer = await loadSound('https://storage.googleapis.com/immersive-document-assets/mode_change.mp3');
            calculateBuffer = await loadSound('https://storage.googleapis.com/immersive-document-assets/calculate.mp3');
        }
    }, { once: true });

    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('btn-equals') || button.classList.contains('btn-solve') || button.classList.contains('btn-calculate')) {
                playSound(calculateBuffer, 0.7);
            } else {
                playSound(clickBuffer, 0.3);
            }
        });
    });

    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(modeChangeBuffer, 0.5);
        });
    });

    const displayElement = document.getElementById('display');
    const graphDisplayElement = document.getElementById('graph-display');

    function applyGlitch(element, duration = 100, intensity = 0.05) {
        if (!element) return;

        const originalText = element.textContent;
        const originalColor = element.style.color;
        const originalTextShadow = element.style.textShadow;

        let glitchInterval;
        let glitchTimeout;

        function startGlitch() {
            glitchInterval = setInterval(() => {
                let glitchedText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < intensity) {
                        glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94)); 
                    } else {
                        glitchedText += originalText[i];
                    }
                }
                element.textContent = glitchedText;
                element.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                element.style.textShadow = `0 0 ${Math.random() * 10}px rgba(0,255,255,0.8), 0 0 ${Math.random() * 20}px rgba(255,0,128,0.6)`;
            }, 50);

            glitchTimeout = setTimeout(() => {
                clearInterval(glitchInterval);
                element.textContent = originalText;
                element.style.color = originalColor;
                element.style.textShadow = originalTextShadow;
            }, duration);
        }

        startGlitch();
    }
    setInterval(() => {
        applyGlitch(displayElement, 200); 
    }, 5000);
    setInterval(() => {
        applyGlitch(graphDisplayElement, 150, 0.03);
    }, 8000);

    const neuralNetwork = document.querySelector('.neural-network');
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');
        neuralNetwork.appendChild(particle);

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;

        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationName = 'floatAndFade';
        particle.style.animationTimingFunction = 'ease-in-out';
        particle.style.animationIterationCount = 'infinite';
    }

    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        .floating-particle {
            position: absolute;
            background: rgba(0, 255, 255, 0.6); /* Quantum blue */
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
            opacity: 0; /* Start invisible */
            pointer-events: none;
            z-index: -1;
        }

        @keyframes floatAndFade {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(calc(var(--rand-x) * 100px), calc(var(--rand-y) * 100px)) scale(1.2); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    document.querySelectorAll('.floating-particle').forEach(p => {
        p.style.setProperty('--rand-x', (Math.random() - 0.5) * 0.5);
        p.style.setProperty('--rand-y', (Math.random() - 0.5) * 0.5);
    });
});
