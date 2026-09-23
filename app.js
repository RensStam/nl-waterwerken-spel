const TOPICS = [
  // Zuiderzeewerken
  { code: "afsluitdijk", name: "Afsluitdijk", short: "Afsluitdijk", letter: "a", cat: 1 },
  { code: "gooimeer", name: "Gooimeer", short: "Gooimeer", letter: "b", cat: 1 },
  { code: "houtribdijk", name: "Houtribdijk", short: "Houtribdijk", letter: "c", cat: 1 },
  { code: "markermeer", name: "Markermeer", short: "Markermeer", letter: "d", cat: 1 },
  { code: "noordoostpolder", name: "Noordoostpolder", short: "N.O.polder", letter: "e", cat: 1 },
  { code: "flevoland-oost", name: "Oostelijk Flevoland", short: "O. Flevoland", letter: "f", cat: 1 },
  { code: "veluwemeer", name: "Veluwemeer", short: "Veluwemeer", letter: "g", cat: 1 },
  { code: "wieringermeerpolder", name: "Wieringermeerpolder", short: "Wieringermeer", letter: "h", cat: 1 },
  { code: "ijmeer", name: "IJmeer", short: "IJmeer", letter: "i", cat: 1 },
  { code: "ijsselmeer", name: "IJsselmeer", short: "IJsselmeer", letter: "j", cat: 1 },
  { code: "flevoland-zuid", name: "Zuidelijk Flevoland", short: "Z. Flevoland", letter: "k", cat: 1 },
  // Deltawerken
  { code: "brouwersdam", name: "Brouwersdam", short: "Brouwersdam", letter: "A", cat: 2 },
  { code: "grevelingen", name: "Grevelingen", short: "Grevelingen", letter: "B", cat: 2 },
  { code: "haringvlietdam", name: "Haringvlietdam", short: "Haringvlietdam", letter: "C", cat: 2 },
  { code: "maeslantkering", name: "Maeslantkering", short: "Maeslantkering", letter: "D", cat: 2 },
  { code: "oosterschelde", name: "Oosterschelde", short: "Oosterschelde", letter: "E", cat: 2 },
  { code: "oosterscheldekering", name: "Oosterscheldekering", short: "O.schelde-kering", letter: "F", cat: 2 },
  { code: "westerschelde", name: "Westerschelde", short: "Westerschelde", letter: "G", cat: 2 },
  // Rivieren
  { code: "lek", name: "Lek", short: "Lek", letter: "1", cat: 3 },
  { code: "maas", name: "Maas", short: "Maas", letter: "2", cat: 3 },
  { code: "rijn", name: "Rijn", short: "Rijn", letter: "3", cat: 3 },
  { code: "waal", name: "Waal", short: "Waal", letter: "4", cat: 3 },
  { code: "ijssel", name: "IJssel", short: "IJssel", letter: "5", cat: 3 },
  // Landschappen (Fysisch Geografische Regio's, PDOK/RVO)
  { code: "zeeklei", name: "Zeekleigebied", short: "Zeeklei", letter: "zk", cat: 4, multi: true },
  { code: "rivierklei", name: "Rivierengebied", short: "Rivierklei", letter: "ri", cat: 4, multi: true },
  { code: "laagveen", name: "Laagveengebied", short: "Laagveen", letter: "lv", cat: 4, multi: true },
  { code: "duin", name: "Duinen", short: "Duinen", letter: "du", cat: 4, multi: true },
  { code: "zand", name: "Hogere Zandgronden", short: "Zandgronden", letter: "hz", cat: 4, multi: true },
  { code: "heuvelland", name: "Heuvelland", short: "Heuvelland", letter: "hl", cat: 4, multi: true },
  { code: "zeearm", name: "Afgesloten Zeearmen", short: "Zeearmen", letter: "az", cat: 4, multi: true },
  { code: "getijde", name: "Getijdengebied", short: "Getijdengebied", letter: "gg", cat: 4, multi: true },
];

const sortedTopics = [...TOPICS].sort((a, b) => a.name.localeCompare(b.name));
const topicByCode = Object.fromEntries(TOPICS.map((topic) => [topic.code, topic]));
const STORAGE_KEY = "nl-waterwerken-selectie";
const LABELS_STORAGE_KEY = "nl-waterwerken-namen";
const PLAYER_STORAGE_KEY = "nl-waterwerken-speler";
const MODE_STORAGE_KEY = "nl-waterwerken-modus";
const HARD_TOPICS_STORAGE_KEY = "nl-waterwerken-moeilijke-onderdelen";
const SVG_NS = "http://www.w3.org/2000/svg";
const APP_VERSION = "1.4.1";

const batches = [
  {
    title: "Groep 1",
    label: "Zuiderzeewerken",
    codes: TOPICS.filter((t) => t.cat === 1).map((t) => t.code),
  },
  {
    title: "Groep 2",
    label: "Deltawerken",
    codes: TOPICS.filter((t) => t.cat === 2).map((t) => t.code),
  },
  {
    title: "Groep 3",
    label: "Rivieren",
    codes: TOPICS.filter((t) => t.cat === 3).map((t) => t.code),
  },
  {
    title: "Groep 4",
    label: "Landschappen",
    codes: TOPICS.filter((t) => t.cat === 4).map((t) => t.code),
  },
].map((batch) => ({
  ...batch,
  states: batch.codes.map((code) => topicByCode[code]),
}));
const batchByCode = new Map(
  batches.flatMap((batch, index) => batch.codes.map((code) => [code, index + 1]))
);

const ui = {
  batchGrid: document.querySelector("#batchGrid"),
  clearBtn: document.querySelector("#clearBtn"),
  exitFullscreenBtn: document.querySelector("#exitFullscreenBtn"),
  labelToggle: document.querySelector("#labelToggle"),
  mapGrid: document.querySelector("#mapGrid"),
  playerForm: document.querySelector("#playerForm"),
  playerGreeting: document.querySelector("#playerGreeting"),
  playerNameInput: document.querySelector("#playerNameInput"),
  practiceModeInputs: document.querySelectorAll('input[name="practiceMode"]'),
  progressText: document.querySelector("#progressText"),
  promptText: document.querySelector("#promptText"),
  repeatBtn: document.querySelector("#repeatBtn"),
  roundLabel: document.querySelector("#roundLabel"),
  scoreText: document.querySelector("#scoreText"),
  searchInput: document.querySelector("#searchInput"),
  selectAllBtn: document.querySelector("#selectAllBtn"),
  selectedCount: document.querySelector("#selectedCount"),
  selectedTags: document.querySelector("#selectedTags"),
  selectionText: document.querySelector("#selectionText"),
  shuffleBtn: document.querySelector("#shuffleBtn"),
  startBtn: document.querySelector("#startBtn"),
  stateList: document.querySelector("#stateList"),
  streakText: document.querySelector("#streakText"),
  typedAnswer: document.querySelector("#typedAnswer"),
  typingForm: document.querySelector("#typingForm"),
  typingMessage: document.querySelector("#typingMessage"),
  typingSubmit: document.querySelector("#typingSubmit"),
};

let selected = new Set(loadSelection());
let labelsVisible = loadLabelPreference();
let playerName = loadPlayerName();
let practiceMode = loadPracticeMode();
let hardTopics = new Set(loadHardTopics());
let searchTerm = "";
let feedback = null;
let typingMessage = "";
let session = createEmptySession();
let mapSvg = null;
let mapElements = new Map();
let audioContext = null;

function createEmptySession() {
  return {
    active: false,
    order: [],
    index: 0,
    correct: 0,
    attempts: 0,
    isReview: false,
    streak: 0,
    done: new Set(),
    firstTryCorrect: new Set(),
    missedInRound: new Set(),
  };
}

function loadSelection() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const validCodes = new Set(TOPICS.map((topic) => topic.code));
    const cleaned = saved.filter((code) => validCodes.has(code));

    if (cleaned.length) {
      return cleaned;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return batches[0].codes;
}

function saveSelection() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
}

function loadHardTopics() {
  try {
    const saved = JSON.parse(localStorage.getItem(HARD_TOPICS_STORAGE_KEY) || "[]");
    const validCodes = new Set(TOPICS.map((topic) => topic.code));
    return saved.filter((code) => validCodes.has(code));
  } catch {
    localStorage.removeItem(HARD_TOPICS_STORAGE_KEY);
    return [];
  }
}

function saveHardTopics() {
  localStorage.setItem(HARD_TOPICS_STORAGE_KEY, JSON.stringify([...hardTopics]));
}

function selectedHardCodes() {
  return [...hardTopics].filter((code) => selected.has(code));
}

function loadLabelPreference() {
  return localStorage.getItem(LABELS_STORAGE_KEY) !== "off";
}

function saveLabelPreference() {
  localStorage.setItem(LABELS_STORAGE_KEY, labelsVisible ? "on" : "off");
}

function loadPlayerName() {
  return localStorage.getItem(PLAYER_STORAGE_KEY)?.trim() || "";
}

function savePlayerName() {
  if (playerName) {
    localStorage.setItem(PLAYER_STORAGE_KEY, playerName);
  } else {
    localStorage.removeItem(PLAYER_STORAGE_KEY);
  }
}

function loadPracticeMode() {
  const savedMode = localStorage.getItem(MODE_STORAGE_KEY);
  return savedMode === "type" ? "type" : "click";
}

function savePracticeMode() {
  localStorage.setItem(MODE_STORAGE_KEY, practiceMode);
}

function updatePracticeMode() {
  ui.practiceModeInputs.forEach((input) => {
    input.checked = input.value === practiceMode;
  });

  ui.typingForm.classList.toggle("typing-hidden", practiceMode !== "type");
  ui.mapGrid.classList.toggle("typing-mode", practiceMode === "type");
}

function updateLabelVisibility() {
  ui.mapGrid.classList.toggle("labels-hidden", !labelsVisible);

  if (ui.labelToggle) {
    ui.labelToggle.checked = labelsVisible;
  }
}

function renderPlayer() {
  if (ui.playerGreeting) {
    ui.playerGreeting.textContent = playerName
      ? `Veel succes, ${playerName}!`
      : "Wie speelt er vandaag?";
  }

  if (ui.playerNameInput && document.activeElement !== ui.playerNameInput) {
    ui.playerNameInput.value = playerName;
  }
}

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({ frequency, start, duration, type = "sine", volume = 0.08 }) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startTime = context.currentTime + start;
  const endTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

function playCorrectSound() {
  playTone({ frequency: 587.33, start: 0, duration: 0.11, volume: 0.1 });
  playTone({ frequency: 783.99, start: 0.08, duration: 0.14, volume: 0.11 });
  playTone({ frequency: 1174.66, start: 0.2, duration: 0.22, volume: 0.1 });
}

function playWrongSound() {
  playTone({ frequency: 220, start: 0, duration: 0.22, type: "sawtooth", volume: 0.18 });
  playTone({ frequency: 146.83, start: 0.13, duration: 0.3, type: "triangle", volume: 0.16 });
}

function currentCode() {
  return session.order[session.index] || null;
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
}

function typoAllowance(value) {
  if (value.length <= 4) return 1;
  if (value.length <= 7) return 2;
  return 3;
}

function damerauLevenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[a.length][b.length];
}

function findClosestTopic(value) {
  const normalized = normalizeAnswer(value);

  if (!normalized) {
    return null;
  }

  let best = null;

  TOPICS.forEach((topic) => {
    const name = normalizeAnswer(topic.name);
    const distance = damerauLevenshtein(normalized, name);

    if (!best || distance < best.distance) {
      best = { topic, distance };
    }
  });

  return best;
}

function isTypedAnswerCorrect(value, targetCode) {
  const normalized = normalizeAnswer(value);
  const target = topicByCode[targetCode];

  if (!normalized || !target) {
    return false;
  }

  const targetName = normalizeAnswer(target.name);

  if (normalized === targetName) {
    return true;
  }

  const distance = damerauLevenshtein(normalized, targetName);
  return distance <= typoAllowance(targetName) && Math.abs(normalized.length - targetName.length) <= typoAllowance(targetName);
}

function setSelection(codes) {
  selected = new Set(codes);
  session = createEmptySession();
  feedback = null;
  typingMessage = "";
  saveSelection();
  render();
}

function toggleBatchSelection(codes) {
  const batchIsSelected = codes.every((code) => selected.has(code));

  if (batchIsSelected) {
    codes.forEach((code) => selected.delete(code));
  } else {
    codes.forEach((code) => selected.add(code));
  }

  session = createEmptySession();
  feedback = null;
  typingMessage = "";
  saveSelection();
  render();
}

function toggleTopic(code) {
  if (selected.has(code)) {
    selected.delete(code);
  } else {
    selected.add(code);
  }

  session = createEmptySession();
  feedback = null;
  typingMessage = "";
  saveSelection();
  render();
}

function startSessionWith(codes, isReview = false) {
  const cleanCodes = codes.filter((code) => topicByCode[code]);

  if (!cleanCodes.length) {
    ui.promptText.textContent = "Kies eerst minimaal 1 onderdeel.";
    return;
  }

  session = {
    active: true,
    order: shuffle(cleanCodes),
    index: 0,
    correct: 0,
    attempts: 0,
    isReview,
    streak: 0,
    done: new Set(),
    firstTryCorrect: new Set(),
    missedInRound: new Set(),
  };
  feedback = null;
  typingMessage = "";
  ui.typedAnswer.value = "";
  render();
  enterMobileFullscreenIfNeeded();

  if (practiceMode === "type") {
    ui.typedAnswer?.focus();
  }
}

function enterMobileFullscreenIfNeeded() {
  if (window.matchMedia("(max-width: 760px)").matches) {
    document.body.classList.add("round-fullscreen");
  }
}

function exitMobileFullscreen() {
  document.body.classList.remove("round-fullscreen");
}

function startSession() {
  startSessionWith([...selected], false);
}

function startReviewSession() {
  const reviewCodes = selectedHardCodes();

  if (!reviewCodes.length) {
    ui.roundLabel.textContent = "Geen herhaalronde nodig";
    ui.promptText.textContent = "Deze gekozen onderdelen zitten er al goed in.";
    return;
  }

  startSessionWith(reviewCodes, true);
}

function markCorrect(code) {
  const hadMistake = session.missedInRound.has(code);
  session.attempts += 1;
  session.correct += 1;
  session.streak += 1;
  session.done.add(code);
  if (!hadMistake) {
    session.firstTryCorrect.add(code);
  }
  if (!hadMistake) {
    hardTopics.delete(code);
    saveHardTopics();
  }
  feedback = { code, type: "correct", hintCode: null };
  typingMessage = "Yes, goed.";
  ui.typedAnswer.value = "";
  playCorrectSound();
  render();

  window.setTimeout(() => {
    session.index += 1;
    feedback = null;
    typingMessage = "";

    if (session.index >= session.order.length) {
      session.active = false;
    }

    render();
  }, 620);
}

function markWrong(code, target, message = "Bijna. Kijk nog eens goed.") {
  session.attempts += 1;
  session.streak = 0;
  session.missedInRound.add(target);
  hardTopics.add(target);
  saveHardTopics();
  feedback = { code: code || target, type: "wrong", hintCode: target };
  typingMessage = message;
  playWrongSound();
  render();

  window.setTimeout(() => {
    if (feedback?.type === "wrong" && feedback?.hintCode === target) {
      feedback = null;
      typingMessage = "";
      render();
    }
  }, 1300);
}

function answer(code) {
  if (!session.active) {
    toggleTopic(code);
    return;
  }

  if (practiceMode !== "click") {
    typingMessage = "Je staat op Typen. Gebruik het antwoordveld.";
    renderStatus();
    return;
  }

  const target = currentCode();

  if (!target) {
    return;
  }

  if (code === target) {
    markCorrect(code);
  } else {
    markWrong(code, target);
  }
}

function submitTypedAnswer(event) {
  event.preventDefault();

  if (practiceMode !== "type") {
    typingMessage = "Kies eerst Typen als oefenstand.";
    renderStatus();
    return;
  }

  if (!session.active) {
    typingMessage = "Start eerst een ronde.";
    renderStatus();
    return;
  }

  const target = currentCode();
  const typedValue = ui.typedAnswer.value;
  const closestTopic = findClosestTopic(typedValue)?.topic;

  if (!target || !typedValue.trim()) {
    typingMessage = "Typ eerst iets in.";
    renderStatus();
    return;
  }

  if (isTypedAnswerCorrect(typedValue, target)) {
    markCorrect(target);
    return;
  }

  const message = closestTopic
    ? `Dat is ${closestTopic.name}. Zoek het gemarkeerde onderdeel.`
    : "Dat herken ik niet. Probeer het nog eens.";
  markWrong(closestTopic?.code || null, target, message);
}

async function loadRealMap() {
  try {
    mapSvg = ui.mapGrid.querySelector("svg");

    if (!mapSvg) {
      throw new Error("De kaart bevat geen SVG.");
    }

    mapSvg.classList.add("nl-map");
    mapSvg.setAttribute("role", "img");
    mapSvg.setAttribute("aria-label", "Kaart van Nederland met Zuiderzeewerken, Deltawerken en rivieren");
    mapSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    mapElements = new Map();

    TOPICS.forEach((topic) => {
      const elements = topic.multi
        ? [...mapSvg.querySelectorAll(`.lz-${topic.code} path`)]
        : [...mapSvg.querySelectorAll(`#${topic.code}`)];

      if (!elements.length) {
        return;
      }

      elements.forEach((element) => {
        element.classList.add(topic.multi ? "state-region" : "state", `region-${batchByCode.get(topic.code)}`);
        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", topic.name);
        element.setAttribute("data-code", topic.code);
        element.setAttribute("data-name", topic.name);
        element.setAttribute("data-region", String(batchByCode.get(topic.code)));
        element.querySelector("title")?.remove();

        const title = document.createElementNS(SVG_NS, "title");
        title.textContent = topic.name;
        element.prepend(title);

        element.addEventListener("click", () => answer(topic.code));
        element.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            answer(topic.code);
          }
        });
      });

      mapElements.set(topic.code, elements);
    });

    addTopicLabels();
    updateLabelVisibility();
    renderMap();
  } catch (error) {
    ui.mapGrid.innerHTML = `
      <div class="map-loading">
        De kaart kon niet laden. Herlaad de pagina.
      </div>
    `;
    console.error(error);
  }
}

function addTopicLabels() {
  const oldLayer = mapSvg.querySelector("#topicLabels");
  oldLayer?.remove();

  const labelLayer = document.createElementNS(SVG_NS, "g");
  labelLayer.setAttribute("id", "topicLabels");

  TOPICS.forEach((topic) => {
    if (topic.multi) {
      return;
    }

    const elements = mapElements.get(topic.code);

    if (!elements || !elements.length) {
      return;
    }

    const boxes = elements.map((element) => element.getBBox());
    const box = boxes.reduce((largest, current) =>
      current.width * current.height > largest.width * largest.height ? current : largest
    );
    const label = document.createElementNS(SVG_NS, "text");
    label.classList.add("state-label", `region-${batchByCode.get(topic.code)}`);

    label.setAttribute("data-code", topic.code);
    label.setAttribute("x", String(box.x + box.width / 2));
    label.setAttribute("y", String(box.y + box.height / 2));
    label.textContent = topic.letter;
    labelLayer.append(label);
  });

  mapSvg.append(labelLayer);
}

function renderBatches() {
  ui.batchGrid.replaceChildren(
    ...batches.map((batch) => {
      const active = batch.codes.every((code) => selected.has(code));
      const button = document.createElement("button");
      button.type = "button";
      button.className = `batch-btn${active ? " active" : ""}`;
      button.innerHTML = `
        <span><strong>${batch.title}</strong><br>${batch.label}</span>
        <span>${active ? "aan" : batch.codes.length}</span>
      `;
      button.addEventListener("click", () => toggleBatchSelection(batch.codes));
      return button;
    })
  );
}

function renderStateList() {
  const normalized = searchTerm.trim().toLowerCase();
  const rows = sortedTopics
    .filter((topic) => {
      return !normalized || topic.name.toLowerCase().includes(normalized);
    })
    .map((topic) => {
      const button = document.createElement("button");
      const isSelected = selected.has(topic.code);
      button.type = "button";
      button.className = `state-row${isSelected ? " selected" : ""}`;
      button.setAttribute("aria-pressed", String(isSelected));
      button.innerHTML = `
        <span class="state-main">
          <strong>${topic.name}</strong>
          <span class="state-code">${topic.letter}</span>
        </span>
        <span class="check" aria-hidden="true"></span>
      `;
      button.addEventListener("click", () => toggleTopic(topic.code));
      return button;
    });

  ui.stateList.replaceChildren(...rows);
}

function renderMap() {
  TOPICS.forEach((topic) => {
    const elements = mapElements.get(topic.code);

    if (!elements || !elements.length) {
      return;
    }

    const isSelected = selected.has(topic.code);
    const isDone = session.done.has(topic.code);
    const isFeedback = feedback?.code === topic.code;
    const isHint = feedback?.hintCode === topic.code;
    const isTypingTarget =
      session.active && practiceMode === "type" && currentCode() === topic.code;

    elements.forEach((element) => {
      element.classList.toggle("selected", isSelected);
      element.classList.toggle("dimmed", !isSelected && selected.size > 0);
      element.classList.toggle("done", isDone);
      element.classList.toggle("correct", isFeedback && feedback.type === "correct");
      element.classList.toggle("wrong", isFeedback && feedback.type === "wrong");
      element.classList.toggle("hint", isHint);
      element.classList.toggle("typing-target", isTypingTarget);
    });

    const label = mapSvg?.querySelector(`.state-label[data-code="${topic.code}"]`);
    label?.classList.toggle("typing-target-label", isTypingTarget);
    label?.classList.toggle("dimmed-label", !isSelected && selected.size > 0 && !isTypingTarget);
    label?.classList.toggle("done-label", isDone && !isFeedback);
    label?.classList.toggle("correct-label", isFeedback && feedback.type === "correct");
    label?.classList.toggle("wrong-label", (isFeedback && feedback.type === "wrong") || isHint);
  });
}

function renderStatus() {
  const total = session.order.length || selected.size;
  const progress = session.done.size;
  const activeCode = currentCode();
  const activeTopic = activeCode ? topicByCode[activeCode] : null;
  const selectedTopics = sortedTopics.filter((topic) => selected.has(topic.code));
  const firstTry = session.firstTryCorrect.size;
  const needsPractice = selectedHardCodes().length;

  ui.selectedCount.textContent = `${selected.size} gekozen`;
  ui.progressText.textContent = `Gedaan ${progress}/${total}`;
  ui.scoreText.textContent = `Direct goed ${firstTry}`;
  ui.streakText.textContent = `Nog lastig ${needsPractice}`;

  ui.startBtn.textContent = session.active ? "Herstart" : "Start ronde";
  ui.shuffleBtn.disabled = !selected.size;
  ui.repeatBtn.classList.toggle("is-hidden", needsPractice === 0);
  ui.repeatBtn.disabled = session.active || needsPractice === 0;
  ui.repeatBtn.textContent = `Herhaal moeilijke onderdelen${needsPractice ? ` (${needsPractice})` : ""}`;
  ui.typedAnswer.disabled = !session.active || practiceMode !== "type";
  ui.typingSubmit.disabled = !session.active || practiceMode !== "type";
  ui.typingMessage.textContent =
    typingMessage ||
    (session.active && practiceMode === "type"
      ? "Typ de naam van het gemarkeerde onderdeel. Spelling mag een beetje afwijken."
      : "");

  if (session.active && activeTopic) {
    const modeLabel = practiceMode === "type" ? "Typen" : "Klikken";
    ui.roundLabel.textContent = `${modeLabel} - ${session.index + 1} van ${session.order.length}`;
    ui.promptText.textContent =
      practiceMode === "type"
        ? "Welk gemarkeerd onderdeel is dit?"
        : `Zoek: ${activeTopic.name}`;
  } else if (session.order.length && session.index >= session.order.length) {
    ui.roundLabel.textContent = "Ronde klaar";
    if (session.isReview && needsPractice > 0) {
      ui.promptText.textContent = `Nog ${needsPractice} lastige over. Nog een keer?`;
    } else if (session.isReview) {
      ui.promptText.textContent = "Mooi, je hebt er weer een paar gefixt.";
    } else if (needsPractice > 0) {
      ui.promptText.textContent = `Deze onderdelen oefenen we nog even: ${needsPractice}`;
    } else {
      ui.promptText.textContent = "Goed bezig. Alles zit erin.";
    }
  } else if (selected.size) {
    ui.roundLabel.textContent = "Klaar voor een ronde?";
    ui.promptText.textContent = "Kies klikken of typen en ga ervoor.";
  } else {
    ui.roundLabel.textContent = "Geen onderdelen gekozen";
    ui.promptText.textContent = "Kies een paar onderdelen en bouw je ronde.";
  }

  if (selectedTopics.length) {
    const firstFew = selectedTopics.slice(0, 4).map((topic) => topic.name).join(", ");
    const rest = selectedTopics.length > 4 ? ` +${selectedTopics.length - 4}` : "";
    ui.selectionText.textContent = `Je oefent nu ${selectedTopics.length}: ${firstFew}${rest}.`;
  } else {
    ui.selectionText.textContent = "Nog geen onderdelen in deze set.";
  }

  ui.selectedTags.replaceChildren(
    ...(selectedTopics.length <= 8
      ? selectedTopics.map((topic) => {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = topic.letter;
          tag.title = topic.name;
          return tag;
        })
      : [])
  );
}

function render() {
  renderBatches();
  renderStateList();
  renderMap();
  renderPlayer();
  renderStatus();
  updatePracticeMode();
  updateLabelVisibility();
}

ui.startBtn.addEventListener("click", startSession);
ui.shuffleBtn.addEventListener("click", startSession);
ui.repeatBtn.addEventListener("click", startReviewSession);
ui.selectAllBtn.addEventListener("click", () => setSelection(TOPICS.map((topic) => topic.code)));
ui.clearBtn.addEventListener("click", () => setSelection([]));
ui.labelToggle?.addEventListener("change", (event) => {
  labelsVisible = event.target.checked;
  saveLabelPreference();
  updateLabelVisibility();
});
ui.practiceModeInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (!event.target.checked) {
      return;
    }

    practiceMode = event.target.value;
    feedback = null;
    typingMessage = "";
    ui.typedAnswer.value = "";
    savePracticeMode();
    render();

    if (practiceMode === "type" && session.active) {
      ui.typedAnswer.focus();
    }
  });
});
ui.playerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = ui.playerNameInput.value.trim();
  savePlayerName();
  renderPlayer();
  ui.startBtn.focus();
});
ui.typingForm?.addEventListener("submit", submitTypedAnswer);
ui.searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderStateList();
});
ui.exitFullscreenBtn?.addEventListener("click", exitMobileFullscreen);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
}

document.querySelectorAll("#appVersion, #appVersionTop").forEach((el) => {
  el.textContent = `v${APP_VERSION}`;
});

render();
loadRealMap();
