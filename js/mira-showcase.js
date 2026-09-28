/**
 * Marketing Mira chatbubble — layout showcase only.
 *
 * Q&A is the locked Arcanta door from the 2026-09-14 marketing copy
 * (site-global `miraShowcase`). Swap `MIRA_SHOWCASE` when Marketing revises.
 * Stat labels are layout labels for those pairs, not a second copy source.
 *
 * Not wired to a Mira API. Product chat inside Vecta/Specta is a separate change.
 */

export const MIRA_ROTATE_MS = 7000;

/** @typedef {{ type: "text" | "mark", value: string, highlight?: boolean }} MiraAnswerPart */

/** @param {string} answer */
export function parseMiraAnswer(answer) {
  /** @type {MiraAnswerPart[]} */
  const parts = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let highlightUsed = false;
  let match;
  while ((match = re.exec(answer))) {
    if (match.index > last) {
      parts.push({ type: "text", value: answer.slice(last, match.index) });
    }
    const highlight = !highlightUsed;
    highlightUsed = true;
    parts.push({ type: "mark", value: match[1], highlight });
    last = match.index + match[0].length;
  }
  if (last < answer.length) parts.push({ type: "text", value: answer.slice(last) });
  return parts.length > 0 ? parts : [{ type: "text", value: answer }];
}

/** @param {number} index @param {number} length */
export function nextMiraIndex(index, length) {
  if (length <= 0) return 0;
  return (index + 1) % length;
}

/**
 * Reduced motion still advances (instant / ≤150ms fade in CSS).
 * Hover and focus pause the advance.
 */
export function shouldRotateMira({ paused }) {
  return !paused;
}

/**
 * @param {{
 *   length: number,
 *   rotateMs: number,
 *   isPaused: () => boolean,
 *   onAdvance: (index: number) => void,
 * }} opts
 */
export function createShowcaseController(opts) {
  const setTimer = opts.setInterval || setInterval;
  const clearTimer = opts.clearInterval || clearInterval;
  let index = 0;
  let timer = null;

  function stop() {
    if (timer != null) clearTimer(timer);
    timer = null;
  }

  function start() {
    stop();
    if (!shouldRotateMira({ paused: opts.isPaused(), prefersReducedMotion: false })) return;
    timer = setTimer(() => {
      if (!shouldRotateMira({ paused: opts.isPaused(), prefersReducedMotion: false })) {
        stop();
        return;
      }
      index = nextMiraIndex(index, opts.length);
      opts.onAdvance(index);
    }, opts.rotateMs);
  }

  return {
    start,
    stop,
    sync: start,
    getIndex: () => index,
  };
}

export const MIRA_SHOWCASE = {
  en: {
    name: "MIRA",
    chip: "QUICK",
    inputPlaceholder: "Ask a question…",
    cta: "Questions about your numbers? Book a demo →",
    pairs: [
      {
        q: "Indexation lifts food ~+2.6% — what should selling prices do?",
        a: "To stay budget-neutral, selling prices need ~**+4.9%** — not the average of food, staff and management.",
        stats: [
          { value: "+2.6%", label: "Food index" },
          { value: "+4.9%", label: "Sell price" },
        ],
      },
      {
        q: "When does our restaurant really peak?",
        a: "Weekdays diverge hard: Tuesday often **+30–40%** vs a “typical day”; Friday is about half of Tuesday.",
        stats: [
          { value: "+30–40%", label: "Tuesday vs typical" },
          { value: "~½", label: "Friday vs Tuesday" },
        ],
      },
      {
        q: "Should we plan October/November differently?",
        a: "On captive sites, Oct/Nov usually sit **~7–10%** above the weekday baseline — plan on measurement, not assumption.",
        stats: [
          { value: "~7–10%", label: "Oct / Nov" },
          { value: "Weekday", label: "Baseline" },
        ],
      },
      {
        q: "Why is “their dashboard” not enough?",
        a: "As long as the operator’s report is the only source, the quarterly review stays their story. Your numbers, your bar.",
      },
      {
        q: "What does Vecta actually answer?",
        a: "What is sold, served and occupied — mix, catch rate and price drift next to the contract.",
      },
      {
        q: "Food cost feels high — where do I look first?",
        a: "Next to the agreement, not next to an average: usage vs contracted mix and volume.",
      },
    ],
  },
  nl: {
    name: "MIRA",
    chip: "QUICK",
    inputPlaceholder: "Stel een vraag…",
    cta: "Vragen over úw cijfers? Plan een demo →",
    pairs: [
      {
        q: "Indexatie food ≈ +2,6% — wat moet de verkoopprijs doen?",
        a: "Om budgetneutraal te blijven: ≈ **+4,9%** op de verkoopprijs — niet het gemiddelde van food, personeel en management.",
        stats: [
          { value: "+2,6%", label: "Foodindex" },
          { value: "+4,9%", label: "Verkoopprijs" },
        ],
      },
      {
        q: "Wanneer piekt ons restaurant echt?",
        a: "Weekdagen wijken sterk af: dinsdag vaak **+30–40%** vs een “gemiddelde dag”; vrijdag ongeveer de helft van dinsdag.",
        stats: [
          { value: "+30–40%", label: "Dinsdag vs gemiddeld" },
          { value: "~½", label: "Vrijdag vs dinsdag" },
        ],
      },
      {
        q: "Moeten we okt/nov anders plannen?",
        a: "In captive sites liggen okt/nov doorgaans **~7–10%** boven de weekdag-baseline — plan op meting, niet op aanname.",
        stats: [
          { value: "~7–10%", label: "Okt / nov" },
          { value: "Weekdag", label: "Baseline" },
        ],
      },
      {
        q: "Waarom volstaat “hun dashboard” niet?",
        a: "Zolang het rapport van de uitbater de enige bron is, blijft het kwartaalgesprek hun verhaal. Uw cijfers, uw lat.",
      },
      {
        q: "Wat beantwoordt Vecta concreet?",
        a: "Wat verkocht, geserveerd en bezet is — mix, catch rate en prijsdrift naast het contract.",
      },
      {
        q: "Food cost voelt hoog — waar kijk ik eerst?",
        a: "Naast de afspraak, niet naast een gemiddelde: verbruik vs gecontracteerde mix en volume.",
      },
    ],
  },
  fr: {
    name: "MIRA",
    chip: "QUICK",
    inputPlaceholder: "Posez une question…",
    cta: "Des questions sur vos chiffres ? Planifier une démo →",
    pairs: [
      {
        q: "L'indexation food ≈ +2,6 % — que faire du prix de vente ?",
        a: "Pour rester neutre au budget : ≈ **+4,9 %** sur le prix de vente — pas la moyenne food / personnel / management.",
        stats: [
          { value: "+2,6 %", label: "Index food" },
          { value: "+4,9 %", label: "Prix de vente" },
        ],
      },
      {
        q: "Quand notre restaurant picque-t-il vraiment ?",
        a: "Les jours ouvrés divergent fort : mardi souvent **+30–40 %** vs un « jour moyen » ; vendredi environ la moitié du mardi.",
        stats: [
          { value: "+30–40 %", label: "Mardi vs moyen" },
          { value: "~½", label: "Vendredi vs mardi" },
        ],
      },
      {
        q: "Faut-il planifier oct./nov. autrement ?",
        a: "Sur sites captive, oct./nov. sont en général **~7–10 %** au-dessus du baseline jours ouvrés — planifier sur la mesure, pas sur l'hypothèse.",
        stats: [
          { value: "~7–10 %", label: "Oct. / nov." },
          { value: "Jours ouvrés", label: "Baseline" },
        ],
      },
      {
        q: "Pourquoi leur tableau de bord ne suffit-il pas ?",
        a: "Tant que le rapport de l'exploitant est la seule source, la revue trimestrielle reste leur récit. Vos chiffres, votre barre.",
      },
      {
        q: "Que répond concrètement Vecta ?",
        a: "Ce qui est vendu, servi et occupé — mix, catch rate et dérive de prix à côté du contrat.",
      },
      {
        q: "Food cost élevé — où regarder d'abord ?",
        a: "À côté de l'accord, pas à côté d'une moyenne : consommation vs mix et volume contractés.",
      },
    ],
  },
};

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

/** @param {{ q: string, a: string, stats?: { value: string, label: string }[] }} pair */
export function renderPair(pair) {
  const answer = parseMiraAnswer(pair.a).map((part) => {
    if (part.type === "text") return esc(part.value);
    const cls = part.highlight ? "mira-key mira-highlight" : "mira-key";
    return `<strong class="${cls}">${esc(part.value)}</strong>`;
  }).join("");

  const stats = pair.stats || [];
  const statsHtml = stats.length
    ? `<div class="mini-stats">${stats.map((stat) => `<div class="mini-stat"><div class="mini-stat-value">${esc(stat.value)}</div><div class="mini-stat-label">${esc(stat.label)}</div></div>`).join("")}</div>`
    : "";

  return `<div class="mira-pair"><p class="bub q">${esc(pair.q)}</p><div class="bub a"><p>${answer}</p>${statsHtml}</div></div>`;
}

function currentPack() {
  const lang = document.documentElement.lang || "en";
  return MIRA_SHOWCASE[lang] || MIRA_SHOWCASE.en;
}

export function mountMiraShowcase(root) {
  const body = root.querySelector("[data-mira-body]");
  if (!body) return () => {};

  let index = 0;
  let hovered = false;
  let focused = false;
  let entered = false;

  function paint() {
    const pair = currentPack().pairs[index] || currentPack().pairs[0];
    body.dataset.enter = entered ? "animate" : "instant";
    body.innerHTML = renderPair(pair);
  }

  const controller = createShowcaseController({
    length: MIRA_SHOWCASE.en.pairs.length,
    rotateMs: MIRA_ROTATE_MS,
    isPaused: () => root.dataset.paused === "true",
    onAdvance: (next) => {
      index = next;
      entered = true;
      paint();
    },
  });

  function syncPause() {
    root.dataset.paused = hovered || focused ? "true" : "false";
    controller.sync();
  }

  root.addEventListener("mouseenter", () => { hovered = true; syncPause(); });
  root.addEventListener("mouseleave", () => { hovered = false; syncPause(); });
  root.addEventListener("focusin", () => { focused = true; syncPause(); });
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
      syncPause();
    }
  });

  const langObserver = new MutationObserver(() => {
    index = 0;
    entered = true;
    paint();
    controller.sync();
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  paint();
  controller.start();

  return () => {
    controller.stop();
    langObserver.disconnect();
  };
}

function boot() {
  const root = document.querySelector("[data-mira-showcase]");
  if (root) mountMiraShowcase(root);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}
