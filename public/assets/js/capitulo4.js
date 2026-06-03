const ID_MODULO = 4;
const SCROLL_OFFSET = 88;

const kanbanFlow = ["todo", "doing", "test", "done"];
const completedMinigames = new Set();
let retrospectiveUnlocked = false;

if (typeof document !== "undefined") {
  document.documentElement.classList.add("capitulo4-motion");
}

const metrics = {
  burndown: {
    title: "Burndown mostra o restante",
    text:
      "Burndown Chart mostra quanto trabalho ainda falta ao longo do tempo. Ele ajuda a enxergar se a Sprint se aproxima do fim.",
  },
  burnup: {
    title: "Burnup mostra o acumulado",
    text:
      "Burnup Chart mostra o trabalho concluido acumulado e deixa visivel como o escopo evolui.",
  },
  velocity: {
    title: "Velocity e previsao interna",
    text:
      "Velocity ajuda a propria equipe a prever capacidade futura. Ela nao deve comparar equipes diferentes.",
  },
  "lead-time": {
    title: "Lead Time comeca no pedido",
    text:
      "Lead Time mede o tempo total desde a solicitacao ate a entrega. Ele mostra a espera completa do ponto de vista do pedido.",
  },
  "cycle-time": {
    title: "Cycle Time comeca no trabalho",
    text:
      "Cycle Time mede quanto tempo um item leva desde que comeca a ser desenvolvido ate ser concluido.",
  },
};

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

function calcularEstadoIntroNarrativa(blackoutProgress, introProgress = 0) {
  const progress = clamp(blackoutProgress, 0, 1);
  const intro = clamp(introProgress, 0, 1);
  const preludeStart = 0.86;
  const preludeOpacity = clamp((progress - preludeStart) / (1 - preludeStart), 0, 1);
  const outroStart = 0.86;
  const outro = clamp((intro - outroStart) / (1 - outroStart), 0, 1);
  const lineThresholds = calcularLimiaresLinhasIntro();
  const showPrelude = preludeOpacity > 0 && outro < 1;
  const showHourglass = progress >= 1 && outro < 1;
  const visibleLines = showHourglass
    ? lineThresholds.filter((threshold) => intro >= threshold).length
    : 0;
  const activeLineIndex = visibleLines > 0 ? visibleLines - 1 : -1;

  let phase = "hidden";

  if (progress >= 1) {
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

function rolarParaElemento(selector, offset = SCROLL_OFFSET) {
  const target = document.querySelector(selector);

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

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
}

function configurarBlackoutDaHero() {
  const hero = document.querySelector(".capitulo-hero");
  const introSpace = document.getElementById("introScrollSpace");
  const blackout = document.getElementById("viewportBlackout");
  const intro = document.getElementById("capitulo4IntroNarrativa");
  const prelude = document.getElementById("introPrelude");
  const lines = Array.from(document.querySelectorAll("[data-intro-line]"));

  if (!hero || !blackout) return;

  let heroTop = 0;
  let heroHeight = 0;
  let introSpaceTop = 0;
  let introSpaceHeight = 0;
  let ticking = false;

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
    const blackoutOutro = introProgress > 0.88
      ? clamp((introProgress - 0.88) / 0.12, 0, 1)
      : 0;

    blackout.style.opacity = String(blackoutProgress >= 1
      ? 1 - blackoutOutro
      : blackoutProgress);

    if (intro && prelude && lines.length > 0) {
      const introState = calcularEstadoIntroNarrativa(
        blackoutProgress,
        introProgress,
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

    }

    ticking = false;
  }

  function agendarAtualizacao() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(aplicarBlackout);
  }

  medirHero();
  aplicarBlackout();

  window.addEventListener("scroll", agendarAtualizacao, { passive: true });
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

function configurarDividaTecnica() {
  const panel = document.querySelector(".debt-panel");
  const status = document.getElementById("debtStatus");
  const title = document.getElementById("debtTitle");
  const description = document.getElementById("debtDescription");
  const workbenchStep = document.getElementById("debtWorkbenchStep");
  const workbenchTitle = document.getElementById("debtWorkbenchTitle");
  const workbenchText = document.getElementById("debtWorkbenchText");
  const weightBar = document.getElementById("debtWeightBar");
  const beforeTitle = document.getElementById("debtBeforeTitle");
  const beforeText = document.getElementById("debtBeforeText");
  const afterTitle = document.getElementById("debtAfterTitle");
  const afterText = document.getElementById("debtAfterText");
  const transformStep = document.getElementById("debtTransformStep");
  const button = document.getElementById("btnAplicarRefatoracao");
  const station = document.querySelector(".debt-refactor-station");
  let currentStep = 0;
  const refactorings = [
    {
      before: "Duplicamos para terminar rápido.",
      beforeText: "O código funciona, mas a mesma regra aparece em lugares diferentes.",
      after: "Extrair função",
      afterText: "Uma função central mantém o comportamento e reduz manutenção.",
    },
    {
      before: "Pulamos testes.",
      beforeText: "A entrega parece rápida, mas qualquer mudança pode quebrar algo sem aviso.",
      after: "Cobrir comportamento",
      afterText: "O teste protege o resultado esperado sem mudar a entrega.",
    },
    {
      before: "Deixamos para arrumar depois.",
      beforeText: "A pendência vira custo invisível para a próxima Sprint.",
      after: "Resolver pendência",
      afterText: "O ajuste entra agora e reduz retrabalho futuro.",
    },
    {
      before: "Aceitamos código frágil.",
      beforeText: "O usuário vê a mesma tela, mas a estrutura interna dificulta evolução.",
      after: "Organizar estrutura",
      afterText: "A estrutura fica mais clara sem alterar o comportamento externo.",
    },
  ];

  if (!panel || !button || !station) return;

  const renderRefactoring = () => {
    const refactoring = refactorings[currentStep];
    const weight = Math.max(0, 100 - currentStep * 25);

    if (!refactoring) return;

    if (beforeTitle) beforeTitle.textContent = refactoring.before;
    if (beforeText) beforeText.textContent = refactoring.beforeText;
    if (afterTitle) afterTitle.textContent = refactoring.after;
    if (afterText) afterText.textContent = refactoring.afterText;
    if (transformStep) transformStep.textContent = `${currentStep + 1}/${refactorings.length}`;
    if (weightBar) weightBar.style.width = `${weight}%`;
    if (workbenchStep) {
      workbenchStep.textContent = currentStep === 0
        ? "Peso técnico: alto"
        : `Peso técnico: ${refactorings.length - currentStep} pontos`;
    }
  };

  button.addEventListener("click", () => {
    station.classList.remove("debt-refactor-station--applied");
    void station.offsetWidth;
    station.classList.add("debt-refactor-station--applied");

    currentStep += 1;
    const remaining = refactorings.length - currentStep;

    if (weightBar) {
      weightBar.style.width = `${Math.max(0, 100 - currentStep * 25)}%`;
    }

    if (status) {
      status.textContent = remaining === 0
        ? "Dívida reduzida. A estrutura melhorou sem mudar o comportamento externo."
        : `Refatoração aplicada. Restam ${remaining} ajustes internos.`;
    }

    if (title) {
      title.textContent = remaining === 0 ? "Caminho mais leve" : "Peso reduzido";
    }

    if (description) {
      description.textContent = remaining === 0
        ? "O comportamento continua igual, mas o time volta a avançar com menos retrabalho."
        : "O usuário recebe o mesmo resultado. Por dentro, o sistema ficou mais simples.";
    }

    if (currentStep >= refactorings.length) {
      panel.classList.add("debt-panel--refactored");
      button.disabled = true;
      button.textContent = "Dívida reduzida";
      if (workbenchStep) workbenchStep.textContent = "Peso técnico: baixo";
      if (workbenchTitle) workbenchTitle.textContent = "Refatoração concluída";
      if (workbenchText) workbenchText.textContent = "Atalhos viraram melhorias internas. Menos retrabalho para a próxima entrega.";
      concluirMinigame("divida-tecnica");
      return;
    }

    window.setTimeout(renderRefactoring, 260);
  });

  renderRefactoring();
}

function configurarPipelineDecisoes() {
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
    concluirMinigame("pipeline", { scrollTo: "#cena-divida" });
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

function configurarMetricas() {
  const status = document.getElementById("metricStatus");
  const panel = document.querySelector(".oracle-panel");
  const orbit = document.querySelector(".oracle-orbit");
  const instruments = Array.from(document.querySelectorAll("[data-metric-focus]"));
  const turnButtons = Array.from(document.querySelectorAll("[data-oracle-turn]"));
  const calibrationButtons = Array.from(document.querySelectorAll("[data-oracle-calibration]"));
  const step = document.getElementById("oracleStep");
  const title = document.getElementById("oracleTitle");
  const text = document.getElementById("oracleText");
  let currentIndex = 0;
  const seenMetrics = new Set();
  const metricKeys = ["burndown", "burnup", "velocity", "lead-time", "cycle-time"];

  if (!panel || !orbit || instruments.length === 0) return;

  const metricCopy = {
    burndown: {
      title: "Burndown",
      text: "Acompanha o trabalho restante ao longo do tempo.",
    },
    burnup: {
      title: "Burnup",
      text: "Mostra o progresso acumulado do trabalho concluído.",
    },
    velocity: {
      title: "Velocity",
      text: "Ajuda a própria equipe a prever capacidade futura. Não compara equipes.",
    },
    "lead-time": {
      title: "Lead Time",
      text: "Mede da solicitação até a entrega. Mostra a espera completa.",
    },
    "cycle-time": {
      title: "Cycle Time",
      text: "Mede do início do desenvolvimento até a conclusão.",
    },
  };

  function renderOracle() {
    const metricKey = metricKeys[currentIndex];
    const metric = metricCopy[metricKey];

    if (!metric) return;

    seenMetrics.add(metricKey);
    orbit.style.setProperty("--oracle-rotation", `${currentIndex * -72}deg`);

    instruments.forEach((instrument) => {
      const active = instrument.dataset.metricFocus === metricKey;
      instrument.classList.toggle("oracle-instrument--active", active);
      instrument.setAttribute("aria-pressed", String(active));
    });

    if (step) {
      step.textContent = `Instrumento ${currentIndex + 1}/5`;
    }

    if (title) {
      title.textContent = metric.title;
    }

    if (text) {
      text.textContent = metric.text;
    }

    if (status) {
      status.textContent = seenMetrics.size < metricKeys.length
        ? `Foco calibrado. ${seenMetrics.size}/5 instrumentos observados.`
        : "Todos os instrumentos foram observados. Calibre a intenção do time.";
    }

    panel.classList.toggle("oracle-panel--ready", seenMetrics.size === metricKeys.length);
  }

  function moveFocus(direction) {
    currentIndex = (currentIndex + direction + metricKeys.length) % metricKeys.length;
    renderOracle();
  }

  instruments.forEach((instrument) => {
    instrument.addEventListener("click", () => {
      const index = metricKeys.indexOf(instrument.dataset.metricFocus);

      if (index < 0) return;

      currentIndex = index;
      renderOracle();
    });
  });

  turnButtons.forEach((button) => {
    button.addEventListener("click", () => {
      moveFocus(button.dataset.oracleTurn === "previous" ? -1 : 1);
    });
  });

  calibrationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.remove("oracle-calibration--wrong", "oracle-calibration--right");
      void button.offsetWidth;

      if (seenMetrics.size < metricKeys.length) {
        button.classList.add("oracle-calibration--wrong");

        if (status) {
          status.textContent = "Observe os cinco instrumentos antes de calibrar o Oráculo.";
        }

        return;
      }

      if (button.dataset.oracleCalibration !== "aprender") {
        button.classList.add("oracle-calibration--wrong");
        panel.classList.remove("oracle-panel--distorted");
        void panel.offsetWidth;
        panel.classList.add("oracle-panel--distorted");

        if (status) {
          status.textContent = "Errado. Métrica usada para punir distorce os dados e destrói confiança.";
        }

        return;
      }

      button.classList.add("oracle-calibration--right");
      panel.classList.add("oracle-panel--complete");
      calibrationButtons.forEach((item) => {
        item.disabled = true;
      });

      if (status) {
        status.textContent = "Correto. Métrica é bússola: gera transparência e melhoria contínua.";
      }

      concluirMinigame("metricas");
    });
  });

  renderOracle();
}

function atualizarStakeholders() {
  const status = document.getElementById("stakeholderStatus");
  const total = document.querySelectorAll(".stakeholder-request").length;
  const resolved = document.querySelectorAll(".stakeholder-request--resolved").length;

  if (status) {
    status.textContent =
      resolved === total
        ? "Todos os pedidos foram tratados sem quebrar o foco da Sprint."
        : `${resolved}/${total} pedidos tratados com decisao consciente.`;
  }

  if (total > 0 && resolved === total) {
    concluirMinigame("stakeholders");
  }
}

function configurarStakeholders() {
  document.querySelectorAll("[data-stakeholder-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = button.closest(".stakeholder-request");

      if (!request || request.classList.contains("stakeholder-request--resolved")) return;

      if (button.dataset.stakeholderAction !== request.dataset.correctAction) {
        request.classList.add("stakeholder-request--wrong");
        setTimeout(() => request.classList.remove("stakeholder-request--wrong"), 420);

        return;
      }

      request.classList.add("stakeholder-request--resolved");
      request.querySelectorAll("button").forEach((item) => {
        item.disabled = true;
      });

      atualizarStakeholders();

    });
  });

  atualizarStakeholders();
}

function configurarRetrospectiva() {
  const button = document.getElementById("btnAbrirBauMelhoria");
  const status = document.getElementById("retroStatus");
  const panel = document.querySelector(".retro-panel");
  const chest = document.getElementById("bauMelhoria");

  if (!button) return;

  button.addEventListener("click", () => {
    const answers = Array.from(document.querySelectorAll("[data-retro-answer]"));
    const filled = answers.filter((answer) => answer.value.trim().length >= 4);

    if (filled.length < answers.length) {
      const missing = answers.length - filled.length;

      if (status) {
        status.textContent =
          missing === 1
            ? "Ainda falta uma resposta para transformar aprendizado em melhoria."
            : `Ainda faltam ${missing} respostas para transformar aprendizado em melhoria.`;
      }

      return;
    }

    if (status) {
      status.textContent = "Bau aberto. A retrospectiva virou melhoria concreta para a proxima Sprint.";
    }

    button.disabled = true;
    button.textContent = "Bau aberto";
    retrospectiveUnlocked = true;
    concluirMinigame("retrospectiva");

    if (panel) {
      panel.classList.add("retro-panel--open");
    }

    if (chest) {
      const label = chest.querySelector("strong");

      if (label) {
        label.textContent = "Bau aberto";
      }
    }

    habilitarConclusaoHistoria();

  });
}

function habilitarConclusaoHistoria() {
  const button = document.getElementById("btnConcluirHistoria");
  const status = document.getElementById("statusHistoria");

  if (!button) return;

  button.disabled = false;

  if (status && !status.dataset.completed) {
    status.textContent = "Retrospectiva completa. Agora registre a historia e libere a quarta porta.";
  }
}

async function concluirHistoria() {
  const token = obterToken();
  const button = document.getElementById("btnConcluirHistoria");
  const gate = document.getElementById("portaBossScene");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (!retrospectiveUnlocked) {
    if (status) {
      status.textContent = "Abra o Bau da Melhoria Continua antes de concluir a historia.";
    }

    rolarParaElemento("#cena-melhoria");
    return;
  }

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
    configurarDividaTecnica();
    configurarMetricas();
    configurarStakeholders();
    configurarRetrospectiva();
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
  };
}
