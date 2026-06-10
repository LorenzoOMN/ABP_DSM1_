const ID_MODULO = 4;
const SCROLL_OFFSET = 88;
const INTRO_SCROLL_HINT_DELAY = 2000;

const kanbanFlow = ["todo", "doing", "test", "done"];
const completedMinigames = new Set();
let introHourglassForced = false;

if (typeof document !== "undefined") {
  document.documentElement.classList.add("capitulo4-motion");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calcularProgressoBlackoutHero(scrollY, heroTop, heroHeight) {
  if (heroHeight <= 0) {
    return scrollY > heroTop ? 1 : 0;
  }

  return clamp((scrollY - heroTop) / heroHeight, 0, 1);
}

function calcularLimiaresLinhasIntro(totalLines = 5, firstThreshold = 0.15) {
  return Array.from({ length: totalLines }, (_, index) => firstThreshold * (index + 1));
}

function calcularEstadoIntroNarrativa(blackoutProgress, introProgress = 0, introStarted = false) {
  const progress = clamp(blackoutProgress, 0, 1);
  const intro = clamp(introProgress, 0, 1);
  const preludeStart = 0.86;
  const preludeOpacity = clamp((progress - preludeStart) / (1 - preludeStart), 0, 1);
  const outroStart = 0.86;
  const outro = clamp((intro - outroStart) / (1 - outroStart), 0, 1);
  const lineThresholds = calcularLimiaresLinhasIntro();
  const isIntroStarted = introStarted || intro > 0;
  const showPrelude = preludeOpacity > 0 && outro < 1;
  const showHourglass = (progress >= 1 || isIntroStarted) && outro < 1;
  const visibleLines = showHourglass
    ? lineThresholds.filter((threshold) => intro >= threshold).length
    : 0;
  const activeLineIndex = visibleLines > 0 ? visibleLines - 1 : -1;

  let phase = "hidden";

  if (progress >= 1 || isIntroStarted) {
    if (outro < 1) {
      phase = intro >= outroStart ? "outro" : "full";
    }
  } else if (progress > 0) {
    phase = "prelude";
  }

  return {
    introOpacity: showHourglass ? 1 - outro : preludeOpacity,
    phase,
    showHourglass,
    showPrelude,
    activeLineIndex,
    visibleLines,
  };
}

function obterToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

function tocarSomArcano() {

  if (!efeitosSonorosAtivos()) {
    return;
  }

  const som = new Audio("/assets/audio/arcano.mp3");

  som.volume = 0.3;

  som.play().catch((erro) => {
    console.error("Erro ao tocar áudio:", erro);
  });
}

function rolarParaElemento(selector, offset = SCROLL_OFFSET) {
  const target = document.querySelector(selector);

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
}

function calcularScrollParaAmpulheta(introSpaceTop) {
  return Math.ceil(introSpaceTop);
}

function deveManterAmpulhetaForcada(forced, scrollY, introSpaceTop, previousScrollY) {
  if (!forced) return false;
  if (scrollY >= Math.floor(introSpaceTop)) return false;
  if (scrollY < previousScrollY) return false;

  return true;
}

function rolarAteAmpulhetaIntro() {
  const introSpace = document.getElementById("introScrollSpace");

  if (!introSpace) return;

  introHourglassForced = true;

  const rect = introSpace.getBoundingClientRect();
  const top = calcularScrollParaAmpulheta(rect.top + window.scrollY);

  window.scrollTo({ top, behavior: "smooth" });
}

function atualizarBloqueiosHistoria() {
  document.querySelectorAll("[data-locked-by]").forEach((section) => {
    const lockedBy = section.dataset.lockedBy;
    const locked = !completedMinigames.has(lockedBy);

    section.classList.toggle("is-locked", locked);
    section.setAttribute("aria-disabled", String(locked));
  });

  document.querySelectorAll(".progress-item[data-scroll-to]").forEach((button) => {
    const target = document.querySelector(button.dataset.scrollTo);
    const locked = Boolean(target?.classList.contains("is-locked"));

    button.classList.toggle("progress-item--locked", locked);
    button.setAttribute("aria-disabled", String(locked));

    if (locked) {
      button.title = "Cadeado: conclua o desafio anterior para liberar este trecho.";
    } else {
      button.removeAttribute("title");
    }
  });
}

function concluirMinigame(minigame, options = {}) {
  if (completedMinigames.has(minigame)) return;

  const sectionsToUnlock = Array.from(document.querySelectorAll(`[data-locked-by="${minigame}"]`));
  sectionsToUnlock.forEach((section) => section.classList.add("is-unlocking"));

  completedMinigames.add(minigame);
  atualizarBloqueiosHistoria();

  const nextSectionSelector = options.scrollTo || (sectionsToUnlock[0] ? `#${sectionsToUnlock[0].id}` : "");

  if (nextSectionSelector) {
    setTimeout(() => rolarParaElemento(nextSectionSelector), 700);
  }

  setTimeout(() => {
    sectionsToUnlock.forEach((section) => section.classList.remove("is-unlocking"));
  }, 1200);
}

function configurarBloqueiosHistoria() {
  atualizarBloqueiosHistoria();
}

function configurarScrollGuiado() {
  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      rolarParaElemento(button.dataset.scrollTo);

      const target = document.querySelector(button.dataset.scrollTo);
      const lock = target?.querySelector(".scene-lock");

      if (target?.classList.contains("is-locked") && lock) {
        lock.classList.remove("scene-lock--pulse");
        void lock.offsetWidth;
        lock.classList.add("scene-lock--pulse");
      }
    });
  });

  document.querySelectorAll("[data-scroll-to-hourglass]").forEach((button) => {
    button.addEventListener("click", rolarAteAmpulhetaIntro);
  });
}

function configurarBlackoutDaHero() {
  const hero = document.querySelector(".capitulo-hero");
  const introSpace = document.getElementById("introScrollSpace");
  const blackout = document.getElementById("viewportBlackout");
  const intro = document.getElementById("capitulo4IntroNarrativa");
  const prelude = document.getElementById("introPrelude");
  const scrollHint = document.getElementById("introScrollHint");
  const lines = Array.from(document.querySelectorAll("[data-intro-line]"));

  if (!hero || !blackout) return;

  let heroTop = 0;
  let heroHeight = 0;
  let introSpaceTop = 0;
  let introSpaceHeight = 0;
  let lastScrollY = window.scrollY;
  let scrollHintTimer = null;
  let scrollHintEligible = false;
  let ticking = false;

  function esconderLegendaScrollIntro() {
    if (!intro) return;

    intro.classList.remove("show-scroll-hint");
  }

  function agendarLegendaScrollIntro() {
    if (!scrollHint || !intro) return;

    window.clearTimeout(scrollHintTimer);
    esconderLegendaScrollIntro();

    if (!scrollHintEligible) return;

    scrollHintTimer = window.setTimeout(() => {
      if (scrollHintEligible) {
        intro.classList.add("show-scroll-hint");
      }
    }, INTRO_SCROLL_HINT_DELAY);
  }

  function atualizarElegibilidadeLegendaScrollIntro(eligible) {
    if (scrollHintEligible === eligible) return;

    scrollHintEligible = eligible;
    agendarLegendaScrollIntro();
  }

  function medirHero() {
    const rect = hero.getBoundingClientRect();
    heroTop = rect.top + window.scrollY;
    heroHeight = hero.offsetHeight;

    if (introSpace) {
      const introRect = introSpace.getBoundingClientRect();
      introSpaceTop = introRect.top + window.scrollY;
      introSpaceHeight = introSpace.offsetHeight;
    }
  }

  function aplicarBlackout() {
    const blackoutProgress = calcularProgressoBlackoutHero(window.scrollY, heroTop, heroHeight);
    const introScroll = Math.max(0, window.scrollY - introSpaceTop);
    const introProgress = introSpaceHeight > 0
      ? clamp(introScroll / introSpaceHeight, 0, 1)
      : 0;
    const introReached = window.scrollY >= Math.floor(introSpaceTop);
    introHourglassForced = deveManterAmpulhetaForcada(
      introHourglassForced,
      window.scrollY,
      introSpaceTop,
      lastScrollY,
    );
    const introStarted = introHourglassForced || introReached;
    const blackoutOutro = introProgress > 0.88
      ? clamp((introProgress - 0.88) / 0.12, 0, 1)
      : 0;

    blackout.style.opacity = String(introStarted || blackoutProgress >= 1
      ? 1 - blackoutOutro
      : blackoutProgress);

    if (intro && prelude && lines.length > 0) {
      const introState = calcularEstadoIntroNarrativa(
        introStarted ? 1 : blackoutProgress,
        introProgress,
        introStarted,
      );

      intro.classList.toggle("is-prelude", introState.phase === "prelude");
      intro.classList.toggle("is-full", introState.phase === "full" || introState.phase === "outro");
      intro.classList.toggle("is-outro", introState.phase === "outro");
      intro.style.opacity = introState.phase === "hidden"
        ? "0"
        : String(introState.introOpacity);
      prelude.style.opacity = introState.showPrelude ? "" : "0";

      lines.forEach((line, index) => {
        line.classList.toggle("is-active", index === introState.activeLineIndex);
      });

      atualizarElegibilidadeLegendaScrollIntro(
        introState.phase === "full" || introState.phase === "outro",
      );
    }

    ticking = false;
    lastScrollY = window.scrollY;
  }

  function agendarAtualizacao() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(aplicarBlackout);
  }

  medirHero();
  aplicarBlackout();

  window.addEventListener("scroll", agendarAtualizacao, { passive: true });
  window.addEventListener("scroll", agendarLegendaScrollIntro, { passive: true });
  window.addEventListener("resize", () => {
    medirHero();
    agendarAtualizacao();
  });
}

function configurarRevealNoScroll() {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 },
  );

  elements.forEach((element) => observer.observe(element));
}

function configurarProgressoDeCena() {
  const scenes = document.querySelectorAll(".film-scene[data-scene]");
  const progressItems = document.querySelectorAll(".chapter-progress .progress-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const scene = entry.target.dataset.scene;

        progressItems.forEach((item) => {
          item.classList.toggle("active", item.dataset.sceneTarget === scene);
        });
      });
    },
    { threshold: 0.42 },
  );

  scenes.forEach((scene) => observer.observe(scene));
}

function obterColunaDoCartao(card) {
  return card.closest(".kanban-column");
}

function obterProximaColuna(column) {
  const current = column?.dataset.column;
  const next = kanbanFlow[kanbanFlow.indexOf(current) + 1];

  if (!next) return null;

  return document.querySelector(`[data-column="${next}"]`);
}

function colunaPodeReceberCartao(column) {
  const limit = Number(column.dataset.wipLimit);

  if (!limit) return true;

  return column.querySelectorAll(".kanban-card").length < limit;
}

function atualizarStatusKanban(message, variant = "info") {
  const status = document.getElementById("kanbanStatus");

  if (!status) return;

  status.textContent = message;
  status.classList.remove("kanban-status--info", "kanban-status--warning", "kanban-status--success");
  status.classList.add(`kanban-status--${variant}`);
}

function limparDestaqueProximaColuna() {
  document.querySelectorAll(".kanban-column--next").forEach((column) => {
    column.classList.remove("kanban-column--next");
  });
}

function destacarProximaColuna(card) {
  limparDestaqueProximaColuna();

  const nextColumn = obterProximaColuna(obterColunaDoCartao(card));

  if (nextColumn && colunaPodeReceberCartao(nextColumn)) {
    nextColumn.classList.add("kanban-column--next");
  }
}

function atualizarKanban() {
  let overloadedColumn = null;

  document.querySelectorAll("[data-wip-limit]").forEach((column) => {
    const limit = Number(column.dataset.wipLimit);
    const total = column.querySelectorAll(".kanban-card").length;
    const counter = column.querySelector("[data-wip-counter]");

    if (counter) {
      counter.textContent = `WIP ${total}/${limit}`;
    }

    column.classList.toggle("kanban-column--over-limit", total > limit);

    if (total > limit) {
      overloadedColumn = { total, limit };
    }
  });

  if (overloadedColumn) {
    atualizarStatusKanban(
      `Gargalo detectado: Em Desenvolvimento está acima do WIP ${overloadedColumn.total}/${overloadedColumn.limit}. Mova um cartão para Teste antes de puxar mais trabalho.`,
      "warning",
    );
  }
}

function todosCartoesKanbanConcluidos() {
  const cards = Array.from(document.querySelectorAll("[data-kanban-card]"));

  return cards.length > 0 && cards.every((card) => obterColunaDoCartao(card)?.dataset.column === "done");
}

function moverCartao(card) {
  const column = obterColunaDoCartao(card);
  const nextColumn = obterProximaColuna(column);

  if (!nextColumn) {
    atualizarStatusKanban("Este item já chegou em Concluído.", "success");
    return;
  }

  if (!colunaPodeReceberCartao(nextColumn)) {
    nextColumn.classList.add("kanban-column--next");
    atualizarStatusKanban("Limite WIP atingido. Termine algo antes de iniciar mais trabalho.", "warning");
    return;
  }

  limparDestaqueProximaColuna();
  nextColumn.appendChild(card);
  card.classList.toggle("kanban-card--done", nextColumn.dataset.column === "done");
  card.classList.add("kanban-card--moved");
  atualizarKanban();

  if (todosCartoesKanbanConcluidos()) {
    atualizarStatusKanban("Todos os cartões chegaram em Concluído. O fluxo está saudável.", "success");
    concluirMinigame("kanban");
  } else if (!document.querySelector(".kanban-column--over-limit")) {
    atualizarStatusKanban("Gargalo reduzido. Continue movendo os cartões até Concluído.", "success");
  }

  setTimeout(() => card.classList.remove("kanban-card--moved"), 420);

}

function configurarKanban() {
  atualizarKanban();

  document.querySelectorAll(".kanban-card").forEach((card) => {
    card.addEventListener("click", () => moverCartao(card));
    card.addEventListener("mouseenter", () => destacarProximaColuna(card));
    card.addEventListener("focus", () => destacarProximaColuna(card));
    card.addEventListener("mouseleave", limparDestaqueProximaColuna);
    card.addEventListener("blur", limparDestaqueProximaColuna);
  });
}

function configurarDod() {
  const button = document.getElementById("btnValidarDod");
  const panel = document.querySelector(".dod-forge");
  const door = document.querySelector(".dod-door");
  const checks = Array.from(document.querySelectorAll("[data-dod-check]"));
  const status = panel?.querySelector(".dod-status");

  if (!button || !panel || checks.length === 0) return;

  atualizarCriteriosDod();
  atualizarBotaoDod(button, checks);

  checks.forEach((check) => {
    check.addEventListener("change", () => {
      atualizarCriteriosDod();
      atualizarBotaoDod(button, checks);

      if (status && !panel.classList.contains("dod-forge--complete")) {
        const checked = checks.filter((item) => item.checked).length;
        status.textContent = checked === checks.length
          ? "Tudo pronto. A porta reconhece o acordo do time."
          : `${checked}/${checks.length} critérios acesos. A porta ainda não abre.`;
      }
    });
  });

  button.addEventListener("click", () => {
    const checked = checks.filter((check) => check.checked).length;

    if (checked < checks.length) {
      panel.classList.remove("dod-forge--complete");
      panel.classList.add("stakeholder-request--wrong");
      destacarCriteriosDodFaltantes(checks);
      button.textContent = "Revise os critérios apagados";
      if (status) {
        status.textContent = `Ainda faltam ${checks.length - checked} critérios. Marque as placas apagadas antes de abrir a porta.`;
      }
      setTimeout(() => {
        panel.classList.remove("stakeholder-request--wrong");
        atualizarBotaoDod(button, checks);
      }, 760);
      return;
    }

    button.classList.remove("dod-button--ready");
    button.classList.add("dod-button--unlocking");
    button.disabled = true;
    button.textContent = "Liberando próximo trecho...";

    if (status) {
      tocarSomArcano()
      status.textContent = "DoD completa. O próximo trecho está sendo liberado.";
    }

    setTimeout(() => {
      panel.classList.add("dod-forge--complete");
      button.classList.remove("dod-button--unlocking");
      button.textContent = "Trecho liberado";

      if (status) {
        status.textContent = "A porta reconheceu o incremento pronto. Continue para a próxima cena.";
      }

      concluirMinigame("dod", { scrollTo: "#cena-ponte" });
    }, 520);
  });
}

function atualizarCriteriosDod() {
  document.querySelectorAll("[data-dod-check]").forEach((check) => {
    const criterion = document.querySelector(`[data-dod-criterion="${check.dataset.dodCheck}"]`);

    if (criterion) {
      criterion.classList.toggle("dod-criterion--lit", check.checked);
      if (check.checked) {
        criterion.classList.remove("dod-criterion--missing");
      }
    }
  });
}

function atualizarBotaoDod(button, checks) {
  const checked = checks.filter((check) => check.checked).length;
  const missing = checks.length - checked;
  const ready = missing === 0;

  button.classList.toggle("dod-button--ready", ready);
  button.setAttribute("aria-label", ready
    ? "Abrir a porta da Definition of Done"
    : `Faltam ${missing} critérios para abrir a porta`);

  if (button.disabled) return;

  if (ready) {
    button.textContent = "Abrir a porta";
    return;
  }

  button.textContent = missing === 1
    ? "Falta 1 critério"
    : `Faltam ${missing} critérios`;
}

function destacarCriteriosDodFaltantes(checks) {
  checks.forEach((check) => {
    const criterion = document.querySelector(`[data-dod-criterion="${check.dataset.dodCheck}"]`);

    if (!criterion || check.checked) return;

    criterion.classList.remove("dod-criterion--missing");
    void criterion.offsetWidth;
    criterion.classList.add("dod-criterion--missing");
  });
}

function configurarPipelineDecisoesAntigo() {
  const status = document.getElementById("pipelineStatus");
  const panel = document.querySelector(".pipeline-panel");
  const scene = document.querySelector(".pipeline-scene");
  const stepLabel = document.getElementById("commitStep");
  const title = document.getElementById("commitTitle");
  const description = document.getElementById("commitDescription");
  const actionButtons = Array.from(document.querySelectorAll("[data-pipeline-action]"));
  let currentDecision = 0;
  let pipelineBusy = false;
  const decisions = [
    {
      id: "tela",
      step: "Leia o commit. Escolha a ação.",
      title: "Nova tela validada",
      description: "Os critérios foram atendidos e o teste local passou. Este código pode entrar na Integração Contínua.",
      action: "integrar-testar",
      message: "Correto. A CI integrou o código e rodou testes antes da entrega.",
    },
    {
      id: "atalho",
      step: "Leia o commit. Escolha a ação.",
      title: "Ajuste rápido sem teste",
      description: "A mudança parece resolver o problema, mas não foi validada. Se atravessar agora, pode virar retrabalho.",
      action: "corrigir",
      message: "Correto. O defeito foi barrado antes de contaminar o fluxo.",
    },
    {
      id: "build",
      step: "Leia o commit. Escolha a ação.",
      title: "Build verde",
      description: "Integração e testes foram concluídos. O caminho está confiável para automatizar o deploy.",
      action: "deploy",
      message: "Correto. A CD automatizou o deploy com o caminho validado.",
    },
  ];

  if (!status || !stepLabel || !title || !description || actionButtons.length === 0) return;

  function setPipelineStatus(message, variant = "info") {
    status.textContent = message;
    status.classList.remove("pipeline-status--success", "pipeline-status--error");

    if (variant !== "info") {
      status.classList.add(`pipeline-status--${variant}`);
    }
  }

  function setActionsDisabled(disabled) {
    actionButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function clearPickedAction() {
    actionButtons.forEach((button) => {
      button.classList.remove("pipeline-action--picked");
      button.classList.remove("pipeline-action--wrong");
    });
  }

  function renderDecision() {
    const decision = decisions[currentDecision];

    if (!decision) return;

    pipelineBusy = false;
    setActionsDisabled(false);
    clearPickedAction();
    stepLabel.textContent = decision.step;
    title.textContent = decision.title;
    description.textContent = decision.description;
  }

  function shakeBridge(button) {
    setPipelineStatus("Escolha novamente. Esta ação quebra o fluxo da ponte.", "error");

    if (button) {
      button.classList.remove("pipeline-action--wrong");
      void button.offsetWidth;
      button.classList.add("pipeline-action--wrong");
    }

    if (panel) {
      panel.classList.remove("pipeline-panel--shake");
      void panel.offsetWidth;
      panel.classList.add("pipeline-panel--shake");
      window.setTimeout(() => {
        panel.classList.remove("pipeline-panel--shake");
      }, 620);
    }
  }

  function completeBridge() {
    if (panel) {
      panel.classList.add("pipeline-panel--complete");
    }

    if (scene) {
      scene.classList.add("pipeline-scene--complete");
    }

    actionButtons.forEach((button) => {
      button.disabled = true;
    });

    setPipelineStatus("CI integrou e testou. CD automatizou a entrega. A ponte está estável.", "success");
    window.setTimeout(() => {
      concluirMinigame("pipeline", { scrollTo: "#cena-divida" });
    }, 1600);
  }

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (pipelineBusy) return;

      const decision = decisions[currentDecision];

      if (!decision || button.dataset.pipelineAction !== decision.action) {
        shakeBridge(button);
        return;
      }

      pipelineBusy = true;
      setActionsDisabled(true);
      clearPickedAction();
      button.classList.add("pipeline-action--picked");
      setPipelineStatus(decision.message, "success");
      currentDecision += 1;

      if (currentDecision >= decisions.length) {
        completeBridge();
        return;
      }

      window.setTimeout(renderDecision, 340);
    });
  });

  renderDecision();
}

function configurarPipelineDecisoes() {
  const status = document.getElementById("pipelineStatus");
  const panel = document.getElementById("pipelineVoid");
  const scene = document.querySelector(".pipeline-scene");
  const introCard = scene?.querySelector(".story-text");
  const gameStage = document.getElementById("pipelineVoid");
  const scrollBlackout = document.getElementById("pipelineScrollBlackout");
  const stepLabel = document.getElementById("commitStep");
  const title = document.getElementById("commitTitle");
  const description = document.getElementById("commitDescription");
  const replayButton = document.getElementById("btnRepetirPipeline");
  const progressBar = document.querySelector("[data-pipeline-progress]");
  const actionButtons = Array.from(document.querySelectorAll("[data-pipeline-step]"));
  const board = document.querySelector(".pipeline-neon-board");
  const sequence = [
    {
      id: "codigo",
      title: "Código",
      message: "O incremento saiu da DoD pronto para entrar no fluxo.",
    },
    {
      id: "integrar",
      title: "Integrar",
      message: "CI integra o código produzido frequentemente.",
    },
    {
      id: "testes",
      title: "Testes",
      message: "Testes automatizados validam o caminho antes da entrega.",
    },
    {
      id: "build",
      title: "Build",
      message: "Build verde confirma que o incremento segue estável.",
    },
    {
      id: "deploy",
      title: "Deploy",
      message: "CD automatiza o deploy quando o caminho está validado.",
    },
  ];
  let roundLength = 2;
  let inputIndex = 0;
  let started = false;
  let acceptingInput = false;
  let pipelineBusy = false;
  let completed = false;
  let playbackToken = 0;
  let scrollTicking = false;
  let layoutSeed = 0;

  if (!status || !stepLabel || !title || !description || actionButtons.length === 0) return;

  const wait = (duration) => new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

  function setPipelineStatus(message, variant = "info") {
    status.textContent = message;
    status.classList.remove("pipeline-status--success", "pipeline-status--error");

    if (variant !== "info") {
      status.classList.add(`pipeline-status--${variant}`);
    }
  }

  function setActionsDisabled(disabled) {
    actionButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function setReplayDisabled(disabled) {
    if (replayButton) {
      replayButton.disabled = disabled;
    }
  }

  function updateProgress(value) {
    if (progressBar) {
      progressBar.style.width = `${clamp(value, 0, 100)}%`;
    }
  }

  function shuffleItems(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const targetIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
    }

    return shuffled;
  }

  function setPipelineRandomLayout() {
    const compactLayout = typeof window.matchMedia === "function"
      && window.matchMedia("(max-width: 768px)").matches;
    const slots = shuffleItems([
      { col: 3, row: 1, compactCol: 2, compactRow: 1, x: "0.65rem", y: "0.2rem" },
      { col: 1, row: 2, compactCol: 1, compactRow: 2, x: "-0.2rem", y: "-0.35rem" },
      { col: 5, row: 2, compactCol: 3, compactRow: 2, x: "0.1rem", y: "0.45rem" },
      { col: 2, row: 3, compactCol: 1, compactRow: 3, x: "-0.55rem", y: "-0.2rem" },
      { col: 4, row: 3, compactCol: 3, compactRow: 3, x: "0.45rem", y: "-0.5rem" },
    ]);

    layoutSeed += 1;

    actionButtons.forEach((button, index) => {
      const slot = slots[index];
      const finalColumn = index + 1;
      const slotColumn = compactLayout ? slot.compactCol : slot.col;
      const slotRow = compactLayout ? slot.compactRow : slot.row;
      const assembleX = (slotColumn - finalColumn) * 104;
      const assembleY = (slotRow - 1) * 108;

      button.style.setProperty("--slot-col", String(slotColumn));
      button.style.setProperty("--slot-row", String(slotRow));
      button.style.setProperty("--piece-x", slot.x);
      button.style.setProperty("--piece-y", slot.y);
      button.style.setProperty("--piece-rot", "0deg");
      button.style.setProperty("--piece-start-x", slot.x);
      button.style.setProperty("--piece-start-y", slot.y);
      button.style.setProperty("--piece-start-rot", "0deg");
      button.style.setProperty("--assemble-x", `${assembleX}%`);
      button.style.setProperty("--assemble-y", `${assembleY}%`);
      button.style.setProperty("--assemble-rot", "0deg");
      button.style.setProperty("--entry-delay", `${index * 0.055}s`);
    });

    if (board) {
      board.classList.remove("pipeline-neon-board--ready");
      board.dataset.layoutSeed = String(layoutSeed);
      void board.offsetWidth;
      board.classList.add("pipeline-neon-board--ready");
    }
  }

  function clearPickedAction() {
    actionButtons.forEach((button) => {
      button.classList.remove("pipeline-action--picked");
      button.classList.remove("pipeline-action--correct");
      button.classList.remove("pipeline-action--wrong");
      button.classList.remove("pipeline-action--flash");
      button.classList.remove("pipeline-action--press");
    });
  }

  function getButtonByStep(stepId) {
    return actionButtons.find((button) => button.dataset.pipelineStep === stepId);
  }

  async function flashStep(stepId, token) {
    const button = getButtonByStep(stepId);
    const step = sequence.find((item) => item.id === stepId);

    if (!button || !step || token !== playbackToken) return;

    button.classList.add("pipeline-action--flash");
    title.textContent = step.title;
    description.textContent = step.message;

    await wait(860);
    button.classList.remove("pipeline-action--flash");
    await wait(180);
  }

  function shakeBridge(button) {
    setPipelineStatus("A ponte apagou. O fluxo foi quebrado. Observe a sequência novamente.", "error");

    if (button) {
      button.classList.remove("pipeline-action--wrong");
      void button.offsetWidth;
      button.classList.add("pipeline-action--wrong");
    }

    if (panel) {
      panel.classList.remove("pipeline-panel--shake");
      void panel.offsetWidth;
      panel.classList.add("pipeline-panel--shake");
    }
  }

  async function playSequence() {
    const token = playbackToken + 1;
    playbackToken = token;
    acceptingInput = false;
    pipelineBusy = true;
    inputIndex = 0;
    clearPickedAction();
    setActionsDisabled(true);
    setReplayDisabled(true);
    updateProgress(0);

    const currentRound = roundLength - 1;
    const totalRounds = sequence.length - 1;
    stepLabel.textContent = `Rodada ${currentRound}/${totalRounds}`;
    title.textContent = `Memorize ${roundLength} passos`;
    description.textContent = "A ponte vai piscar a ordem do processo. Depois repita sem pular etapas.";
    setPipelineStatus("Observe a sequência. Ainda não clique nas runas.");

    await wait(520);

    for (const step of sequence.slice(0, roundLength)) {
      if (token !== playbackToken || completed) return;
      await flashStep(step.id, token);
    }

    if (token !== playbackToken || completed) return;

    acceptingInput = true;
    pipelineBusy = false;
    setActionsDisabled(false);
    setReplayDisabled(false);
    stepLabel.textContent = `Sua vez: ${roundLength} passos`;
    title.textContent = "Repita o fluxo contínuo";
    description.textContent = "Clique nas runas na mesma ordem em que elas brilharam.";
    setPipelineStatus(`Repita os ${roundLength} passos na ordem correta.`);
  }

  async function startPipelineGame() {
    if (started || completed || scene?.classList.contains("is-locked")) return;

    started = true;
    setActionsDisabled(true);
    await playSequence();
  }

  function atualizarEscuridaoPipeline() {
    if (!gameStage) return;

    const stageRect = gameStage.getBoundingClientRect();
    const introRect = introCard?.getBoundingClientRect();
    const introTop = introRect ? introRect.top + window.scrollY : stageRect.top + window.scrollY;
    const introHeight = introCard?.offsetHeight || 0;
    const stageTop = introTop + introHeight / 2 - window.innerHeight * 0.82;
    const stageHeight = window.innerHeight;
    const darkness = calcularProgressoBlackoutHero(window.scrollY, stageTop, stageHeight);
    const gameOpacity = clamp((darkness - 0.88) / 0.12, 0, 1);
    const gameStageVisible = stageRect.top <= window.innerHeight * 0.72
      && stageRect.bottom >= window.innerHeight * 0.28;

    gameStage.style.setProperty("--pipeline-darkness", darkness.toFixed(3));
    gameStage.style.setProperty("--pipeline-game-opacity", gameOpacity.toFixed(3));

    if (scrollBlackout) {
      scrollBlackout.style.opacity = completed ? "0" : String(darkness);
    }

    if (!started && !completed && darkness < 0.82) {
      stepLabel.textContent = "A ponte desaparece";
      title.textContent = "Continue descendo";
      description.textContent = "A imagem da ponte ainda guarda o caminho. Deixe a escuridão revelar a sequência.";
      setPipelineStatus("Continue descendo até a tela ficar totalmente preta.");
    }

    if (darkness >= 0.96 && gameStageVisible && !started && !completed && !scene?.classList.contains("is-locked")) {
      startPipelineGame();
    }
  }

  function solicitarAtualizacaoEscuridao() {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      scrollTicking = false;
      atualizarEscuridaoPipeline();
    });
  }

  function completeBridge() {
    completed = true;
    acceptingInput = false;
    pipelineBusy = false;
    playbackToken += 1;

    if (panel) {
      panel.classList.add("pipeline-panel--complete");
    }

    if (scene) {
      scene.classList.add("pipeline-scene--complete");
    }

    actionButtons.forEach((button) => {
      button.disabled = true;
    });

    setReplayDisabled(true);
    updateProgress(100);
    stepLabel.textContent = "Sequência completa";
    title.textContent = "Ponte Contínua estabilizada";
    description.textContent = "Código, integração, testes, build e deploy seguiram a ordem certa.";

    if (replayButton) {
      replayButton.textContent = "Sequência concluída";
    }

    setPipelineStatus("CI integrou e testou. CD automatizou a entrega. A ponte está estável.", "success");

    if (scrollBlackout) {
      scrollBlackout.style.opacity = "0";
    }

    window.setTimeout(() => {
      concluirMinigame("pipeline", { scrollTo: "#cena-divida" });
    }, 1600);
  }

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!started) {
        startPipelineGame();
        return;
      }

      if (pipelineBusy || !acceptingInput || completed) return;

      const expectedStep = sequence[inputIndex];
      const selectedStep = button.dataset.pipelineStep;

      if (!expectedStep || selectedStep !== expectedStep.id) {
        shakeBridge(button);
        acceptingInput = false;
        pipelineBusy = true;
        setActionsDisabled(true);
        setReplayDisabled(true);
        window.setTimeout(() => {
          playSequence();
        }, 920);
        return;
      }

      button.classList.remove("pipeline-action--press");
      void button.offsetWidth;
      button.classList.add("pipeline-action--press");
      button.classList.add("pipeline-action--correct");
      window.setTimeout(() => {
        button.classList.remove("pipeline-action--press");
        button.classList.remove("pipeline-action--correct");
      }, 640);

      button.classList.add("pipeline-action--picked");
      inputIndex += 1;
      updateProgress((inputIndex / roundLength) * 100);
      setPipelineStatus(expectedStep.message, "success");

      if (inputIndex < roundLength) {
        return;
      }

      acceptingInput = false;
      pipelineBusy = true;
      setActionsDisabled(true);
      setReplayDisabled(true);

      if (roundLength >= sequence.length) {
        completeBridge();
        return;
      }

      roundLength += 1;
      stepLabel.textContent = "Fluxo expandido";
      title.textContent = "A ponte revelou mais uma etapa";
      description.textContent = "Memorize a sequência maior. CI prepara o caminho para CD.";
      setPipelineStatus("Correto. A ponte vai revelar uma sequência mais longa.", "success");

      window.setTimeout(() => {
        playSequence();
      }, 1050);
    });
  });

  if (replayButton) {
    replayButton.addEventListener("click", () => {
      if (completed) return;

      if (!started) {
        startPipelineGame();
        return;
      }

      if (pipelineBusy) return;

      playSequence();
    });
  }

  setActionsDisabled(true);
  setPipelineRandomLayout();
  atualizarEscuridaoPipeline();
  window.addEventListener("scroll", solicitarAtualizacaoEscuridao, { passive: true });
  window.addEventListener("resize", solicitarAtualizacaoEscuridao);

  if ("IntersectionObserver" in window && gameStage) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.38);

      if (visible && !started && !scene?.classList.contains("is-locked")) {
        atualizarEscuridaoPipeline();
      }

      if (visible && !started && !scene?.classList.contains("is-locked") && Number(gameStage.style.getPropertyValue("--pipeline-darkness")) >= 0.96) {
        startPipelineGame();
        observer.disconnect();
      }
    }, { threshold: [0.38, 0.62] });

    observer.observe(gameStage);
  }
}

async function concluirHistoria() {
  const token = obterToken();
  const button = document.getElementById("btnConcluirHistoria");
  const gate = document.getElementById("portaBossScene");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (button) {
    button.disabled = true;
    button.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon esta registrando sua jornada...";
  }

  try {
    const response = await fetch(`/api/progresso/historia/${ID_MODULO}/concluir`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Nao foi possivel registrar o progresso.");
    }

    liberarPortaDesafio();

    if (button) {
      button.classList.add("hidden");
    }

    if (status) {
      status.dataset.completed = "true";
      status.textContent = "Historia concluida. A quarta porta foi liberada. Aproxime-se dela para entrar.";
    }
  } catch (error) {
    console.error(error);

    if (status) {
      status.textContent = "Erro ao registrar progresso. Tente novamente.";
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Tentar concluir novamente";
    }
  }
}

function liberarPortaDesafio() {
  const gate = document.getElementById("portaBossScene");

  if (!gate) return;

  gate.classList.add("porta-liberada");
  gate.setAttribute("role", "button");
  gate.setAttribute("tabindex", "0");
  gate.setAttribute("aria-label", "Entrar no desafio do modulo 4");
}

function configurarConclusaoHistoria() {
  const button = document.getElementById("btnConcluirHistoria");

  if (button) {
    button.addEventListener("click", concluirHistoria);
  }
}

function configurarPortaDesafio() {
  const gate = document.getElementById("portaBossScene");

  if (!gate) return;

  function entrarNoDesafio() {
    if (!gate.classList.contains("porta-liberada")) return;

    localStorage.setItem("moduloAtual", ID_MODULO);
    window.location.href = "/desafio1";
  }

  gate.addEventListener("click", entrarNoDesafio);
  gate.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      entrarNoDesafio();
    }
  });
}

async function carregarEstadoHistoria() {
  const token = obterToken();

  if (!token) return;

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !Array.isArray(data.modulos)) return;

    const moduleState = data.modulos.find((module) => Number(module.id_modulo) === ID_MODULO);

    if (!moduleState?.historia_concluida) return;

    const button = document.getElementById("btnConcluirHistoria");
    const status = document.getElementById("statusHistoria");

    if (button) {
      button.classList.add("hidden");
    }

    if (status) {
      status.dataset.completed = "true";
      status.textContent = "Historia concluida. A quarta porta foi liberada. Aproxime-se dela para entrar.";
    }

    liberarPortaDesafio();
  } catch (error) {
    console.error(error);
  }
}

function ajustarScrollPorHashInicial() {
  if (!window.location.hash) return;

  setTimeout(() => rolarParaElemento(window.location.hash), 250);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    obterToken();
    await carregarEstadoHistoria();

    configurarScrollGuiado();
    configurarBlackoutDaHero();
    ajustarScrollPorHashInicial();
    configurarRevealNoScroll();
    configurarProgressoDeCena();
    configurarBloqueiosHistoria();
    configurarKanban();
    configurarDod();
    configurarPipelineDecisoes();
    configurarConclusaoHistoria();
    configurarPortaDesafio();

    if (typeof verificarEAtualizarNavbar === "function") {
      verificarEAtualizarNavbar();
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calcularEstadoIntroNarrativa,
    calcularLimiaresLinhasIntro,
    calcularProgressoBlackoutHero,
    calcularScrollParaAmpulheta,
    deveManterAmpulhetaForcada,
  };
}
