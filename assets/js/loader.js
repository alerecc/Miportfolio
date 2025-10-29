// loader.js - versión rápida y fluida

var textarea = $('.term'); 

// velocidad de tipeo inicial (más rápida que antes)
var typingSpeed = 40; 
var text = 'node alejogastonrecc.js';
var i = 0;

runner();

function runner() {
  textarea.append(text.charAt(i));
  textarea.scrollTop(textarea[0].scrollHeight);
  i++;

  // velocidad constante y más rápida
  setTimeout(function() {
    if (i < text.length) {
      runner();
    } else {
      textarea.append("<br>");
      i = 0;
      // breve pausa antes de iniciar la simulación del “boot”
      setTimeout(feedbacker, 500);
    }
  }, typingSpeed);
}

var count = 0;
var time = 1;

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

function feedbacker() {
  // simulamos pequeños delays aleatorios entre líneas
  time = Math.floor(Math.random() * 3) + 1; // 1-3
  var delayMs = time * 150; // rápido pero legible

  if (i < output.length) {
    textarea.append("[    " + (count / 1000).toFixed(3) + "] " + output[i] + "<br>");
    textarea.scrollTop(textarea[0].scrollHeight);
  }

  // a veces imprime 2 seguidas (como actividad intensa del sistema)
  if (Math.random() < 0.3 && i + 1 < output.length) {
    i++;
    textarea.append("[    " + (count / 1000).toFixed(3) + "] " + output[i] + "<br>");
    textarea.scrollTop(textarea[0].scrollHeight);
  }

  i++;
  count += time;

  setTimeout(function() {
    if (i < output.length - 1) {
      feedbacker();
    } else {
      textarea.append("<br>Initialising...<br>");
      textarea.scrollTop(textarea[0].scrollHeight);

      // fade-out suave del loader
      setTimeout(function() {
        $(".load").fadeOut(1000, function() {
          $('body').css('overflow', 'auto');
        });
      }, 800);
    }
  }, delayMs);
}
