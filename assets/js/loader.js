var textarea = $('.term');

var typingSpeed = 30; // velocidad de tecleo primera línea
var text = 'node alejogastonrecc.js';
var i = 0;

var keySound = 'assets/sounds/keystroke.ogg';
var enterSound = new Audio('assets/sounds/enter.wav');
enterSound.volume = 0.5;

var output = [
    "Cargando kernel del sistema v10.28... ",
    "Revisando dependencias... 🛠️",
    "✓ Módulo HTML5 cargado",
    "✓ Estilos CSS3 inicializados",
    "✓ Motor de JavaScript funcionando sin problemas 🚀",
    "Conectando con alejogastonrecc.js...",
    "Verificando identidad del desarrollador... [OK] 👨‍💻",
    "Compilando creatividad.dll... ✨",
    "Cargando proyectos → /portfolio",
    "Montando assets → /img, /code, /design",
    "Optimizando código para claridad y genialidad... 😎",
    "Configurando layouts responsivos...",
    "Estableciendo conexión con el servidor...",
    "Chequeo del sistema: Todos los componentes operativos ✅",
    "Lanzando Portfolio v1.0.0",
    "---------------------------------------------",
    "Inicialización completa.",
    "Arrancando → Portafolio personal de A. Recalde",
    "---------------------------------------------",
    "¡Disfrutá tu visita! 👨‍💻✨",
    ""
];


// Función para reproducir sonido de tecla (solo para la primera línea)
function playKeySound() {
    var audio = new Audio(keySound);
    audio.volume = 0.3;
    audio.play().catch(() => { });
}

function playEnterSound() {
    enterSound.currentTime = 0;
    enterSound.play().catch(() => { });
}


// $('#start-portfolio').on('click', function () {
//     $(this).hide();
//     runner(); 
// });

// animación tecleo de la primera línea
function runner() {
    textarea.append(text.charAt(i));
    playKeySound();
    textarea.scrollTop(textarea[0].scrollHeight);
    i++;

    setTimeout(function () {
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

function feedbackerLetterByLetter(lineIndex) {
    if (lineIndex >= output.length) {
        textarea.append("<br>Inicializando...<br>");
        playEnterSound();
        textarea.scrollTop(textarea[0].scrollHeight);

        setTimeout(() => {
            $(".load").fadeOut(1000, () => {
                $('body').css('overflow', 'auto');
            });
        }, 800);
        return;
    }

    textarea.append(output[lineIndex] + "<br>");
    textarea.scrollTop(textarea[0].scrollHeight);

    // retraso mínimo entre líneas
    setTimeout(() => feedbackerLetterByLetter(lineIndex + 1), 40);
}

$(document).ready(function () {
    runner();
});
