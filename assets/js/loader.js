var textarea = $('.term'); 

var typingSpeed = 130; // velocidad de tecleo primera línea
var text = 'node alejogastonrecc.js';
var i = 0;

var keySound = 'assets/sounds/keystroke.ogg';
var enterSound = new Audio('assets/sounds/enter.wav'); 
enterSound.volume = 0.5;

var output = [
  "Loading system kernel v10.28...",
  "Checking dependencies...",
  "✓ HTML5 module loaded",
  "✓ CSS3 styles initialized",
  "✓ JavaScript engine running smoothly",
  "Connecting to alejogastonrecc.js...",
  "Verifying developer identity... [OK]",
  "Compiling creativity.dll...",
  "Loading projects → /portfolio",
  "Mounting assets → /img, /code, /design",
  "Checking caffeine levels... [HIGH]",
  "Optimizing code for clarity and awesomeness...",
  "Setting up responsive layouts...",
  "Establishing connection to imagination server...",
  "System check: All components operational ✅",
  "Launching Portfolio v1.0.0",
  "---------------------------------------------",
  "Initialization complete.",
  "Now booting → A. Recalde Personal Portfolio",
  "---------------------------------------------",
  "Access via http://localhost:3000 or scroll down to explore",
  "Enjoy your stay 👨‍💻✨",
  ""
];

// Función para reproducir sonido de tecla (solo para la primera línea)
function playKeySound() {
    var audio = new Audio(keySound);
    audio.volume = 0.3;
    audio.play().catch(()=>{});
}

function playEnterSound() {
    enterSound.currentTime = 0;
    enterSound.play().catch(()=>{});
}

// Listener del botón
$('#start-portfolio').on('click', function() {
    $(this).hide();
    runner(); // iniciar primera línea
});

// animación tecleo de la primera línea
function runner() {
    textarea.append(text.charAt(i));
    playKeySound();
    textarea.scrollTop(textarea[0].scrollHeight);
    i++;

    setTimeout(function() {
        if (i < text.length) {
            runner();
        } else {
            playEnterSound();
            textarea.append("<br>");
            i = 0;
            // iniciar kernel sin sonido, más rápido
            setTimeout(() => feedbackerLetterByLetter(0, 0), 300);
        }
    }, typingSpeed);
}

// función que escribe cada línea letra por letra, sin sonido y más rápido
function feedbackerLetterByLetter(lineIndex, charIndex) {
    if (lineIndex >= output.length) {
        textarea.append("<br>Initialising...<br>");
        playEnterSound();
        textarea.scrollTop(textarea[0].scrollHeight);

        setTimeout(function() {
            $(".load").fadeOut(1000, function() {
                $('body').css('overflow', 'auto');
            });
        }, 800);
        return;
    }

    const line = output[lineIndex];
    const fastSpeed = 5; // velocidad más rápida para las demás líneas

    if (charIndex < line.length) {
        textarea.append(line.charAt(charIndex));
        textarea.scrollTop(textarea[0].scrollHeight);
        setTimeout(() => feedbackerLetterByLetter(lineIndex, charIndex + 1), fastSpeed);
    } else {
        textarea.append("<br>");
        setTimeout(() => feedbackerLetterByLetter(lineIndex + 1, 0), 50); // siguiente línea
    }
}
