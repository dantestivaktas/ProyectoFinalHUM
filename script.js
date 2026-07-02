/* ============================================
   EL TRONO DE LA VERDAD EFECTIVA
   Lógica del simulador – script.js
   ============================================ */

// ──────────────────────────────────────────────
// 1. DATOS: Los 4 escenarios del simulador
// ──────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1,
    title: "Escenario I: La Rebelión de los Campesinos",
    text: "El invierno ha sido cruel y las cosechas se han perdido. Miles de campesinos hambrientos marchan hacia la capital exigiendo la abolición de los impuestos. Sus líderes amenazan con tomar los graneros del palacio si no se les escucha. Tus consejeros están divididos: algunos piden clemencia; otros, mano dura.",
    optionA: {
      label: "Ética Cristiana",
      text: "Abrir los graneros reales, perdonar las deudas de los campesinos y compartir las reservas de alimento del palacio con el pueblo hambriento.",
      consequence: "El pueblo te aclama con lágrimas de gratitud. Sin embargo, las reservas del palacio se agotan peligrosamente y tu ejército murmura sobre la debilidad del príncipe. La dignidad del pueblo se fortalece.",
      dignityChange: +5
    },
    optionB: {
      label: "Razón de Estado",
      text: "Enviar a la guardia real para dispersar a los manifestantes por la fuerza, arrestar a los líderes de la revuelta y ejecutarlos públicamente como ejemplo.",
      consequence: "El orden se restaura con rapidez. Los campesinos regresan a sus tierras aterrorizados. Pero el resentimiento crece en silencio y las familias de los ejecutados juran venganza. La dignidad del pueblo se ha quebrantado.",
      dignityChange: -30
    }
  },
  {
    id: 2,
    title: "Escenario II: La Amenaza del Reino Vecino",
    text: "El Duque de Milán ha reunido un ejército de 10,000 hombres en la frontera y exige que le cedas la provincia de Lombardía como tributo. Si no accedes, amenaza con una invasión total. Tu ejército apenas cuenta con 4,000 soldados y las arcas están casi vacías tras el duro invierno.",
    optionA: {
      label: "Ética Cristiana",
      text: "Enviar embajadores con una propuesta de paz y alianza matrimonial. Ofrecer un tratado comercial justo y buscar la mediación del Papa para evitar el derramamiento de sangre.",
      consequence: "Las negociaciones avanzan lentamente. El Duque acepta dialogar, pero interpreta tu diplomacia como debilidad. Exige más concesiones. Tu pueblo te ve como un príncipe sabio y justo, aunque vulnerable.",
      dignityChange: +5
    },
    optionB: {
      label: "Razón de Estado",
      text: "Reclutar forzosamente a campesinos para el ejército, confiscar las riquezas de la Iglesia local para financiar la guerra y lanzar un ataque preventivo sorpresa contra el campamento enemigo.",
      consequence: "Tu audacia toma por sorpresa al Duque y su ejército se retira. Eres aclamado como estratega brillante. Pero los campesinos reclutados a la fuerza maldicen tu nombre, y la Iglesia te declara impío.",
      dignityChange: -30
    }
  },
  {
    id: 3,
    title: "Escenario III: Las Arcas Vacías del Reino",
    text: "La guerra y el invierno han dejado al reino en la ruina. No hay dinero para pagar a los soldados ni para reparar los caminos destruidos. Los mercaderes extranjeros abandonan tus puertos y los banqueros florentinos se niegan a prestarte más oro. Tu reino está al borde del colapso económico.",
    optionA: {
      label: "Ética Cristiana",
      text: "Reducir los lujos del palacio, vender las joyas de la corona y vivir con austeridad, invitando a los nobles a hacer lo mismo. Crear un fondo comunitario administrado por representantes del pueblo.",
      consequence: "Tu ejemplo de humildad inspira a algunos nobles a contribuir. La recuperación será lenta, pero el pueblo respeta a un príncipe que comparte su sufrimiento. Sin embargo, los nobles más poderosos conspiran contra lo que llaman \"debilidad real\".",
      dignityChange: +5
    },
    optionB: {
      label: "Razón de Estado",
      text: "Imponer un impuesto extraordinario de guerra a todos los ciudadanos, confiscar los bienes de los nobles sospechosos de deslealtad y obligar a los comerciantes a operar bajo precios fijados por la corona.",
      consequence: "El oro fluye de nuevo hacia las arcas reales. Los caminos se reparan, los soldados cobran su paga. Pero las familias empobrecidas pasan hambre, y los comerciantes huyen a reinos vecinos. El pueblo siente que su príncipe los exprime sin piedad.",
      dignityChange: -30
    }
  },
  {
    id: 4,
    title: "Escenario IV: La Traición del Ministro",
    text: "Tu consejero más cercano, el Conde Visconti —a quien considerabas un hermano—, ha sido descubierto conspirando con el Duque de Milán para derrocarte. Tiene en su poder documentos secretos del reino y controla a una facción importante de la nobleza. Si actúas mal, podrías desencadenar una guerra civil.",
    optionA: {
      label: "Ética Cristiana",
      text: "Confrontar al Conde en privado, ofrecerle la oportunidad de confesar y exiliarse con honor. Perdonarle la vida en nombre de los años de servicio y de la misericordia cristiana.",
      consequence: "El Conde acepta el exilio, pero desde el extranjero sigue intrigando. Algunos nobles admiran tu clemencia; otros la ven como ingenuidad peligrosa. El pueblo, sin embargo, ve en ti a un gobernante justo que valora la vida humana.",
      dignityChange: +5
    },
    optionB: {
      label: "Razón de Estado",
      text: "Arrestar al Conde Visconti y a toda su familia en secreto durante la noche. Juzgarlos en un tribunal militar y ejecutarlos públicamente por alta traición, confiscando todas sus propiedades.",
      consequence: "El mensaje es claro: nadie traiciona al príncipe y vive para contarlo. Los nobles conspiradores tiemblan y abandonan cualquier plan sedicioso. Pero el pueblo contempla horrorizado cómo incluso los hijos del Conde son castigados.",
      dignityChange: -30
    }
  }
];

// ──────────────────────────────────────────────
// 2. ESTADO DEL JUEGO
// ──────────────────────────────────────────────
let dignity      = 100;   // Dignidad del pueblo (0-100)
let currentScene = 0;     // Índice del escenario actual
let gamePhase    = 'intro'; // intro | playing | consequence | ended

// ──────────────────────────────────────────────
// 3. REFERENCIAS AL DOM
// ──────────────────────────────────────────────
const dignitySection    = document.getElementById('dignity-section');
const dignityPercentage = document.getElementById('dignity-percentage');
const dignityFill       = document.getElementById('dignity-fill');
const scenarioIndicator = document.getElementById('scenario-indicator');
const storyPanel        = document.getElementById('story-panel');
const storyTitle        = document.getElementById('story-title');
const storyText         = document.getElementById('story-text');
const decisionsDiv      = document.getElementById('decisions');
const btnOptionA        = document.getElementById('btn-option-a');
const btnOptionB        = document.getElementById('btn-option-b');
const btnOptionAText    = document.getElementById('btn-option-a-text');
const btnOptionBText    = document.getElementById('btn-option-b-text');
const consequencePanel  = document.getElementById('consequence-panel');
const consequenceText   = document.getElementById('consequence-text');
const btnContinue       = document.getElementById('btn-continue');
const endScreen         = document.getElementById('end-screen');
const introScreen       = document.getElementById('intro-screen');
const btnStart          = document.getElementById('btn-start');

// ──────────────────────────────────────────────
// 4. FUNCIONES PRINCIPALES
// ──────────────────────────────────────────────

/**
 * Actualiza la barra de dignidad visualmente.
 */
function updateDignityBar() {
  // Limitar entre 0 y 100
  dignity = Math.max(0, Math.min(100, dignity));

  dignityPercentage.textContent = dignity + '%';
  dignityFill.style.width = dignity + '%';

  // Cambiar color según nivel
  dignityFill.classList.remove('warning', 'danger');
  if (dignity <= 30) {
    dignityFill.classList.add('danger');
  } else if (dignity <= 50) {
    dignityFill.classList.add('warning');
  }
}

/**
 * Actualiza los puntos indicadores de escenario.
 */
function updateScenarioDots() {
  const dots = document.querySelectorAll('.scenario-dot');
  dots.forEach((dot, index) => {
    dot.classList.remove('active', 'completed');
    if (index < currentScene) {
      dot.classList.add('completed');
    } else if (index === currentScene) {
      dot.classList.add('active');
    }
  });
}

/**
 * Muestra un escenario en pantalla.
 */
function showScenario(index) {
  const scenario = SCENARIOS[index];

  // Actualizar narrativa
  storyTitle.textContent = scenario.title;
  storyText.textContent  = scenario.text;

  // Actualizar botones
  btnOptionAText.textContent = scenario.optionA.text;
  btnOptionBText.textContent = scenario.optionB.text;

  // Mostrar elementos de juego, ocultar otros
  storyPanel.classList.remove('hidden');
  decisionsDiv.classList.remove('hidden');
  consequencePanel.classList.add('hidden');
  endScreen.classList.add('hidden');
  introScreen.classList.add('hidden');

  // Animación de entrada
  storyPanel.classList.remove('fade-in');
  decisionsDiv.classList.remove('fade-in');
  // Forzar reflow para re-lanzar la animación
  void storyPanel.offsetWidth;
  storyPanel.classList.add('fade-in');
  decisionsDiv.classList.add('fade-in');

  updateScenarioDots();
  gamePhase = 'playing';
}

/**
 * Muestra la consecuencia de la decisión tomada.
 */
function showConsequence(text) {
  consequenceText.textContent = text;
  decisionsDiv.classList.add('hidden');
  consequencePanel.classList.remove('hidden');

  consequencePanel.classList.remove('fade-in');
  void consequencePanel.offsetWidth;
  consequencePanel.classList.add('fade-in');

  gamePhase = 'consequence';
}

/**
 * Verifica si el juego termina por dignidad en 0%.
 */
function checkGameOver() {
  if (dignity <= 0) {
    showEndScreen('defeat');
    return true;
  }
  return false;
}

/**
 * Muestra la pantalla final (victoria o derrota).
 */
function showEndScreen(result) {
  storyPanel.classList.add('hidden');
  decisionsDiv.classList.add('hidden');
  consequencePanel.classList.add('hidden');
  scenarioIndicator.classList.add('hidden');

  const endIcon    = document.getElementById('end-icon');
  const endTitle   = document.getElementById('end-title');
  const endMessage = document.getElementById('end-message');

  if (result === 'defeat') {
    endIcon.textContent    = '⚔️';
    endTitle.textContent   = '¡El Pueblo se ha Levantado!';
    endMessage.textContent = 'Al no respetar los derechos básicos y la dignidad de tu pueblo, la ira popular ha estallado en una revolución sangrienta. Las calles arden, los nobles huyen y el trono ha sido derrocado. Tu reinado ha terminado en la vergüenza y el caos. La historia te recordará como un tirano.';
  } else {
    endIcon.textContent    = '👑';
    endTitle.textContent   = '¡Has Sobrevivido al Trono!';
    endMessage.textContent = 'Has navegado los turbulentos mares de la política renacentista y tu reino sigue en pie. Cada decisión tuvo un precio, pero lograste mantener un equilibrio entre el poder y la dignidad del pueblo. La historia aún no ha terminado de escribirse, pero hoy, el trono es tuyo.';
  }

  endScreen.classList.remove('hidden');
  endScreen.classList.remove('fade-in');
  void endScreen.offsetWidth;
  endScreen.classList.add('fade-in');

  gamePhase = 'ended';
}

/**
 * Procesa la decisión del jugador.
 * @param {'A'|'B'} choice - La opción elegida.
 */
function makeChoice(choice) {
  if (gamePhase !== 'playing') return;

  const scenario = SCENARIOS[currentScene];
  const option   = choice === 'A' ? scenario.optionA : scenario.optionB;

  // Aplicar cambio de dignidad
  dignity += option.dignityChange;
  updateDignityBar();

  // Mostrar consecuencia
  showConsequence(option.consequence);

  // Verificar game over inmediato
  if (checkGameOver()) return;
}

/**
 * Avanza al siguiente escenario o muestra la pantalla final.
 */
function continueGame() {
  if (gamePhase !== 'consequence') return;

  currentScene++;

  if (currentScene >= SCENARIOS.length) {
    // El jugador ha sobrevivido a los 4 escenarios
    showEndScreen('victory');
  } else {
    showScenario(currentScene);
  }
}

/**
 * Reinicia el simulador a su estado inicial.
 */
function restartGame() {
  dignity      = 100;
  currentScene = 0;
  gamePhase    = 'intro';

  updateDignityBar();

  // Ocultar todo, mostrar intro
  storyPanel.classList.add('hidden');
  decisionsDiv.classList.add('hidden');
  consequencePanel.classList.add('hidden');
  endScreen.classList.add('hidden');
  scenarioIndicator.classList.remove('hidden');
  introScreen.classList.remove('hidden');

  introScreen.classList.remove('fade-in');
  void introScreen.offsetWidth;
  introScreen.classList.add('fade-in');

  updateScenarioDots();
}

/**
 * Inicia el juego desde la pantalla de introducción.
 */
function startGame() {
  gamePhase = 'playing';
  introScreen.classList.add('hidden');
  dignitySection.classList.remove('hidden');
  scenarioIndicator.classList.remove('hidden');
  showScenario(0);
}

// ──────────────────────────────────────────────
// 5. EVENT LISTENERS
// ──────────────────────────────────────────────
btnOptionA.addEventListener('click', () => makeChoice('A'));
btnOptionB.addEventListener('click', () => makeChoice('B'));
btnContinue.addEventListener('click', continueGame);
document.getElementById('btn-restart').addEventListener('click', restartGame);
btnStart.addEventListener('click', startGame);

// ──────────────────────────────────────────────
// 6. INICIALIZACIÓN
// ──────────────────────────────────────────────
updateDignityBar();
updateScenarioDots();
