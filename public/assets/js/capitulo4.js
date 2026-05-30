const ID_MODULO = 4;
const SCROLL_OFFSET = 88;

const kanbanFlow = ["todo", "doing", "test", "done"];
const pipelineFlow = ["integrar", "testar", "entregar"];
const completedPipelineSteps = new Set();
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

function calcularEstadoIntroNarrativa(blackoutProgress, introProgress = 0) {
  const progress = clamp(blackoutProgress, 0, 1);
  const intro = clamp(introProgress, 0, 1);
  const preludeStart = 0.86;
  const preludeOpacity = clamp((progress - preludeStart) / (1 - preludeStart), 0, 1);
  const outroStart = 0.86;
  const outro = clamp((intro - outroStart) / (1 - outroStart), 0, 1);
  const lineThresholds = [0.14, 0.3, 0.46, 0.62, 0.76];
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

function configurarScrollGuiado() {
  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      rolarParaElemento(button.dataset.scrollTo);
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

function configurarAmpulheta() {
  const button = document.getElementById("btnExaminarAmpulheta");
  const status = document.getElementById("ampulhetaEstado");

  if (!button || !status) return;

  button.addEventListener("click", () => {
    status.textContent =
      "A ampulheta reage: a Sprint não precisa de mais pressa, precisa de fluxo visível até Concluído.";
    button.classList.add("hourglass-relic--awake");

  });
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

function atualizarKanban() {
  document.querySelectorAll("[data-wip-limit]").forEach((column) => {
    const limit = Number(column.dataset.wipLimit);
    const total = column.querySelectorAll(".kanban-card").length;
    const counter = column.querySelector("[data-wip-counter]");

    if (counter) {
      counter.textContent = `WIP ${total}/${limit}`;
    }

    column.classList.toggle("kanban-column--over-limit", total > limit);
  });
}

function moverCartao(card) {
  const column = obterColunaDoCartao(card);
  const nextColumn = obterProximaColuna(column);

  if (card.classList.contains("kanban-card--blocked")) {
    return;
  }

  if (!nextColumn) {
    return;
  }

  if (!colunaPodeReceberCartao(nextColumn)) {
    return;
  }

  nextColumn.appendChild(card);
  card.classList.toggle("kanban-card--done", nextColumn.dataset.column === "done");
  card.classList.add("kanban-card--moved");
  atualizarKanban();

  setTimeout(() => card.classList.remove("kanban-card--moved"), 420);

}

function configurarKanban() {
  atualizarKanban();

  document.querySelectorAll(".kanban-card").forEach((card) => {
    card.addEventListener("click", () => moverCartao(card));
  });
}

function configurarDod() {
  const button = document.getElementById("btnValidarDod");
  const panel = document.querySelector(".dod-forge");

  if (!button || !panel) return;

  button.addEventListener("click", () => {
    const checks = Array.from(document.querySelectorAll("[data-dod-check]"));
    const checked = checks.filter((check) => check.checked).length;

    if (checked < checks.length) {
      panel.classList.remove("dod-forge--complete");
      panel.classList.add("stakeholder-request--wrong");
      setTimeout(() => panel.classList.remove("stakeholder-request--wrong"), 420);
      return;
    }

    panel.classList.add("dod-forge--complete");
  });
}

function proximaEtapaPipeline() {
  return pipelineFlow[completedPipelineSteps.size];
}

function configurarPipeline() {
  const status = document.getElementById("pipelineStatus");
  const panel = document.querySelector(".pipeline-panel");

  document.querySelectorAll("[data-pipeline-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.dataset.pipelineStep;

      if (completedPipelineSteps.has(step)) {
        return;
      }

      if (step !== proximaEtapaPipeline()) {
        if (status) {
          status.textContent = "A ponte tremeu: uma etapa obrigatoria foi pulada.";
        }

        if (panel) {
          panel.classList.remove("pipeline-panel--shake");
          void panel.offsetWidth;
          panel.classList.add("pipeline-panel--shake");
        }

        return;
      }

      completedPipelineSteps.add(step);
      button.classList.add("pipeline-step--complete");

      if (status) {
        const messages = {
          integrar: "Codigo integrado. Agora a ponte exige testes automatizados.",
          testar: "Testes executados. A entrega pode ser preparada com mais confianca.",
          entregar: "Pipeline completo. A ponte esta estavel para a entrega.",
        };
        status.textContent = messages[step];
      }

    });
  });
}

function configurarDividaTecnica() {
  const button = document.getElementById("btnRefatorarDivida");
  const panel = document.querySelector(".debt-panel");

  if (!button || !panel) return;

  button.addEventListener("click", () => {
    panel.classList.add("debt-panel--refactored");
    button.disabled = true;
    button.textContent = "Divida reduzida";

  });
}

function configurarMetricas() {
  const status = document.getElementById("metricStatus");
  const buttons = document.querySelectorAll("[data-metric]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const metric = metrics[button.dataset.metric];

      if (!metric) return;

      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (status) {
        status.textContent = metric.text;
      }

    });
  });
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
    configurarAmpulheta();
    configurarKanban();
    configurarDod();
    configurarPipeline();
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
    calcularProgressoBlackoutHero,
  };
}
