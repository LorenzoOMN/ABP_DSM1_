const ID_MODULO = 4;
const SCROLL_OFFSET = 150;

const corvoPorAto = {
  ampulheta: {
    titulo: "A Sprint precisa respirar",
    texto:
      "Trabalho iniciado não é trabalho concluído. Antes de acelerar, o time precisa enxergar onde o fluxo travou.",
  },
  kanban: {
    titulo: "Kanban revela o caminho",
    texto:
      "Kanban visualiza o fluxo. Quando muitos cartões param na mesma coluna, existe um gargalo. O limite de WIP ajuda a reduzir sobrecarga.",
  },
  dod: {
    titulo: "Pronto precisa ter acordo",
    texto:
      "Definition of Done define quando um incremento está realmente pronto. Sem esse acordo, qualidade vira opinião.",
  },
  cicd: {
    titulo: "Integrar exige testar",
    texto:
      "Integração Contínua testa o código com frequência. Entrega Contínua torna o caminho de deploy mais confiável.",
  },
  divida: {
    titulo: "Atalhos cobram juros",
    texto:
      "Dívida técnica nasce quando uma decisão apressada facilita o presente, mas cria retrabalho no futuro. Refatoração reduz esse peso.",
  },
  metricas: {
    titulo: "Métrica é bússola",
    texto:
      "Burndown, Burnup, Velocity, Lead Time e Cycle Time servem para aprender sobre o fluxo, não para punir a equipe.",
  },
  stakeholders: {
    titulo: "Nem toda urgência é valor",
    texto:
      "Feedback deve alimentar o Product Backlog. Aceitar toda urgência sem avaliar valor pode quebrar o foco da Sprint.",
  },
  melhoria: {
    titulo: "O time melhora o processo",
    texto:
      "Retrospectiva e melhoria contínua ajudam a equipe a ajustar como trabalha. Qualidade é responsabilidade compartilhada.",
  },
};

const fluxoKanban = ["a-fazer", "desenvolvimento", "teste", "concluido"];
const fluxoPipeline = ["integrar", "testar", "entregar"];
const pipelineConcluido = new Set();
let corvoFeedbackLiberadoEm = 0;

const metricasData = {
  burndown: {
    titulo: "Burndown mostra o restante",
    texto:
      "Burndown Chart mostra quanto trabalho ainda falta ao longo do tempo. Ele ajuda o time a enxergar se o plano da Sprint está se aproximando do fim.",
  },
  burnup: {
    titulo: "Burnup mostra o acumulado",
    texto:
      "Burnup Chart mostra o trabalho concluído acumulado. Ele deixa claro o quanto já foi entregue e como o escopo evolui.",
  },
  velocity: {
    titulo: "Velocity é previsão interna",
    texto:
      "Velocity ajuda a própria equipe a prever capacidade futura. Ela não deve ser usada para comparar equipes diferentes.",
  },
  "lead-time": {
    titulo: "Lead Time começa no pedido",
    texto:
      "Lead Time mede o tempo total desde a solicitação até a entrega. Ele mostra a experiência completa de espera.",
  },
  "cycle-time": {
    titulo: "Cycle Time começa no início do trabalho",
    texto:
      "Cycle Time mede quanto tempo um item leva desde que começa a ser desenvolvido até ser concluído.",
  },
};

function obterToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

function obterColunaDoCartao(cartao) {
  return cartao.closest(".kanban-column");
}

function obterProximaColuna(colunaAtual) {
  const colunaAtualId = colunaAtual?.dataset.column;
  const indiceAtual = fluxoKanban.indexOf(colunaAtualId);
  const proximaColunaId = fluxoKanban[indiceAtual + 1];

  if (!proximaColunaId) return null;

  return document.querySelector(`[data-column="${proximaColunaId}"]`);
}

function colunaPodeReceberCartao(coluna) {
  const limiteWip = Number(coluna.dataset.wipLimit);

  if (!limiteWip) return true;

  const totalCartoes = coluna.querySelectorAll(".kanban-card").length;

  return totalCartoes < limiteWip;
}

function atualizarAmpulheta(estado, titulo, texto) {
  const ampulheta = document.getElementById("ampulhetaEstado");

  if (!ampulheta) return;

  const tituloElemento = ampulheta.querySelector("strong");
  const textoElemento = ampulheta.querySelector("p");

  ampulheta.dataset.estado = estado;

  if (tituloElemento) {
    tituloElemento.textContent = titulo;
  }

  if (textoElemento) {
    textoElemento.textContent = texto;
  }
}

function atualizarEstadoWipKanban() {
  const colunasComLimite = document.querySelectorAll("[data-wip-limit]");
  let existeColunaSobrecarregada = false;

  colunasComLimite.forEach((coluna) => {
    const limiteWip = Number(coluna.dataset.wipLimit);
    const totalCartoes = coluna.querySelectorAll(".kanban-card").length;
    const contador = coluna.querySelector("[data-wip-counter]");
    const passouDoLimite = totalCartoes > limiteWip;

    if (contador) {
      contador.textContent = `WIP ${totalCartoes}/${limiteWip}`;
    }

    coluna.classList.toggle("kanban-column--over-limit", passouDoLimite);

    if (passouDoLimite) {
      existeColunaSobrecarregada = true;
    }
  });

  if (existeColunaSobrecarregada) {
    atualizarAmpulheta(
      "sobrecarregada",
      "Sobrecarregada",
      "Há trabalho demais em andamento. A areia tenta cair, mas o gargalo segura o tempo.",
    );
    return;
  }

  atualizarAmpulheta(
    "fluindo",
    "Fluindo",
    "O limite de WIP voltou a ser respeitado. A areia começa a cair no ritmo do trabalho.",
  );
}

function moverCartaoParaProximaColuna(cartao) {
  const colunaAtual = obterColunaDoCartao(cartao);
  const proximaColuna = obterProximaColuna(colunaAtual);

  if (!proximaColuna) {
    mostrarCartaoCorvo(
      "Este item já chegou ao fim",
      "Quando um cartão está em Concluído, ele atravessou o fluxo. O próximo passo é garantir que ele respeitou a qualidade esperada.",
    );
    return;
  }

  if (!colunaPodeReceberCartao(proximaColuna)) {
    mostrarCartaoCorvo(
      "WIP bloqueou a entrada",
      "A coluna Em Desenvolvimento já atingiu seu limite de WIP. Começar mais trabalho agora aumentaria a sobrecarga e esconderia o gargalo.",
    );
    return;
  }

  proximaColuna.appendChild(cartao);
  atualizarEstadoWipKanban();
  cartao.classList.add("kanban-card--moved");

  if (proximaColuna.dataset.column === "concluido") {
    cartao.classList.add("kanban-card--done");
  }

  setTimeout(() => {
    cartao.classList.remove("kanban-card--moved");
  }, 450);

  mostrarCartaoCorvo(
    "O fluxo avançou",
    "Mover um cartão para a próxima coluna mostra o trabalho atravessando o Kanban. O objetivo é reduzir acúmulos e fazer os itens chegarem a Concluído.",
  );
}

function rolarParaElemento(seletor, offset = SCROLL_OFFSET) {
  const alvo = document.querySelector(seletor);

  if (!alvo) return;

  const posicaoAlvo = alvo.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: posicaoAlvo,
    behavior: "smooth",
  });
}

function configurarScrollParaBotoes() {
  document.querySelectorAll("[data-scroll-to]").forEach((botao) => {
    botao.addEventListener("click", () => {
      rolarParaElemento(botao.dataset.scrollTo);
    });
  });
}

function ajustarScrollPorHashInicial() {
  const hash = window.location.hash;

  if (!hash) return;

  setTimeout(() => {
    rolarParaElemento(hash);
  }, 250);
}

function configurarRevealNoScroll() {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
      });
    },
    { threshold: 0.18 },
  );

  elementos.forEach((el) => observer.observe(el));
}

function atualizarCartaoCorvo(step) {
  const card = document.getElementById("cartaoCorvo");
  const conteudo = corvoPorAto[step];

  if (Date.now() < corvoFeedbackLiberadoEm) return;

  if (!card || !conteudo) return;

  mostrarCartaoCorvo(conteudo.titulo, conteudo.texto, false);
}

function mostrarCartaoCorvo(titulo, texto, fixarFeedback = true) {
  const card = document.getElementById("cartaoCorvo");

  if (!card) return;

  if (fixarFeedback) {
    corvoFeedbackLiberadoEm = Date.now() + 3200;
  }

  card.innerHTML = `
    <img class="corvo-card__image" src="/assets/img/corvo_sem_sombra.png" alt="Corvo guia da dungeon" />
    <div class="corvo-card__content">
      <span class="corvo-card__eyebrow">Cartão do Corvo</span>
      <h2>${titulo}</h2>
      <p>${texto}</p>
    </div>
  `;
}

function configurarFeedbackKanban() {
  const cartoes = document.querySelectorAll(".kanban-card");

  atualizarEstadoWipKanban();

  cartoes.forEach((cartao) => {
    cartao.addEventListener("click", () => {
      if (cartao.classList.contains("kanban-card--blocked")) {
        mostrarCartaoCorvo(
          "WIP demais trava o fluxo",
          "Este cartão representa trabalho tentando entrar em uma coluna que já passou do limite. O limite de WIP protege o time contra sobrecarga e ajuda a revelar gargalos.",
        );
        return;
      }

      moverCartaoParaProximaColuna(cartao);
    });
  });
}

function obterChecksDod() {
  return Array.from(document.querySelectorAll("[data-dod-check]"));
}

function validarDefinitionOfDone() {
  const forja = document.querySelector(".dod-forge");
  const checks = obterChecksDod();
  const totalChecks = checks.length;
  const checksMarcados = checks.filter((check) => check.checked).length;

  if (checksMarcados < totalChecks) {
    if (forja) {
      forja.classList.remove("dod-forge--complete");
    }

    mostrarCartaoCorvo(
      "Quase pronto ainda não é pronto",
      `A Definition of Done precisa estar completa. Por enquanto, ${checksMarcados}/${totalChecks} critérios foram atendidos. A forja não libera incrementos incompletos.`,
    );
    return;
  }

  if (forja) {
    forja.classList.add("dod-forge--complete");
  }

  mostrarCartaoCorvo(
    "Incremento pronto",
    "Todos os critérios da Definition of Done foram atendidos. Agora o incremento tem uma definição visível de qualidade, não apenas uma sensação de estar pronto.",
  );
}

function configurarForjaDod() {
  const botaoValidar = document.getElementById("btnValidarDod");

  if (!botaoValidar) return;

  botaoValidar.addEventListener("click", validarDefinitionOfDone);
}

function atualizarStatusPipeline(texto) {
  const status = document.getElementById("pipelineStatus");

  if (!status) return;

  status.textContent = texto;
}

function obterProximaEtapaPipeline() {
  return fluxoPipeline[pipelineConcluido.size];
}

function concluirEtapaPipeline(botao) {
  const etapa = botao.dataset.pipelineStep;

  pipelineConcluido.add(etapa);
  botao.classList.add("pipeline-step--complete");

  if (etapa === "integrar") {
    atualizarStatusPipeline("Código integrado. Agora a ponte exige testes automatizados.");
  }

  if (etapa === "testar") {
    atualizarStatusPipeline("Testes executados. A entrega pode ser preparada com mais confiança.");
  }

  if (etapa === "entregar") {
    atualizarStatusPipeline("Pipeline completo. A ponte está estável para a entrega.");
    document.querySelector(".pipeline-bridge")?.classList.add("pipeline-bridge--complete");
  }
}

function executarEtapaPipeline(botao) {
  const etapa = botao.dataset.pipelineStep;
  const proximaEtapa = obterProximaEtapaPipeline();

  if (pipelineConcluido.has(etapa)) {
    mostrarCartaoCorvo(
      "Etapa já executada",
      "Esta runa do pipeline já foi ativada. Em CI/CD, repetir sinais sem necessidade não melhora o fluxo; o importante é seguir o caminho confiável.",
    );
    return;
  }

  if (etapa !== proximaEtapa) {
    mostrarCartaoCorvo(
      "A ponte rejeitou o atalho",
      "O pipeline precisa seguir a ordem: integrar, testar e só então preparar a entrega. Pular testes automatizados aumenta o risco de espalhar defeitos.",
    );
    atualizarStatusPipeline("A ponte tremeu: uma etapa obrigatória foi pulada.");
    return;
  }

  concluirEtapaPipeline(botao);

  mostrarCartaoCorvo(
    "Pipeline avançou",
    "CI/CD reduz risco quando o time integra, testa e prepara a entrega em um caminho confiável. A automação protege o fluxo.",
  );
}

function configurarPonteCicd() {
  document.querySelectorAll("[data-pipeline-step]").forEach((botao) => {
    botao.addEventListener("click", () => executarEtapaPipeline(botao));
  });
}

function configurarRefatoracaoDivida() {
  const botaoRefatorar = document.getElementById("btnRefatorarDivida");
  const painelDivida = document.querySelector(".technical-debt");

  if (!botaoRefatorar || !painelDivida) return;

  botaoRefatorar.addEventListener("click", () => {
    painelDivida.classList.add("technical-debt--refactored");
    document.querySelectorAll(".debt-chain").forEach((corrente) => {
      corrente.classList.add("debt-chain--released");
    });

    botaoRefatorar.disabled = true;
    botaoRefatorar.textContent = "Dívida reduzida";

    mostrarCartaoCorvo(
      "Refatoração soltou as correntes",
      "Refatorar melhora a estrutura interna do código sem mudar o comportamento externo. O usuário vê o mesmo produto, mas o time ganha um caminho mais seguro para evoluir.",
    );
  });
}

function configurarMetricas() {
  const status = document.getElementById("metricStatus");
  const botoes = document.querySelectorAll("[data-metric]");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const metrica = metricasData[botao.dataset.metric];

      if (!metrica) return;

      botoes.forEach((item) => item.classList.remove("metric-rune--active"));
      botao.classList.add("metric-rune--active");

      if (status) {
        status.textContent = metrica.texto;
      }

      mostrarCartaoCorvo(metrica.titulo, metrica.texto);
    });
  });
}

function atualizarStatusStakeholders() {
  const status = document.getElementById("stakeholderStatus");
  const total = document.querySelectorAll(".stakeholder-request").length;
  const resolvidos = document.querySelectorAll(".stakeholder-request--resolved").length;

  if (!status) return;

  status.textContent =
    resolvidos === total
      ? "Todos os pedidos foram tratados sem quebrar o foco da Sprint."
      : `${resolvidos}/${total} pedidos classificados com decisão consciente.`;
}

function configurarStakeholders() {
  document.querySelectorAll("[data-stakeholder-action]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const pedido = botao.closest(".stakeholder-request");

      if (!pedido || pedido.classList.contains("stakeholder-request--resolved")) return;

      const acaoEscolhida = botao.dataset.stakeholderAction;
      const acaoCorreta = pedido.dataset.correctAction;

      if (acaoEscolhida !== acaoCorreta) {
        pedido.classList.add("stakeholder-request--wrong");
        mostrarCartaoCorvo(
          "Decisão apressada",
          "Nem toda urgência é valor. Antes de interromper o fluxo, o Product Owner precisa avaliar impacto, foco e valor percebido.",
        );
        return;
      }

      pedido.classList.remove("stakeholder-request--wrong");
      pedido.classList.add("stakeholder-request--resolved");
      pedido.querySelectorAll("button").forEach((item) => {
        item.disabled = true;
      });

      atualizarStatusStakeholders();

      mostrarCartaoCorvo(
        "Pedido bem tratado",
        "Feedback saudável alimenta o Product Backlog sem transformar toda urgência em interrupção. Proteger foco também é proteger valor.",
      );
    });
  });

  atualizarStatusStakeholders();
}

function obterRespostasRetrospectiva() {
  return Array.from(document.querySelectorAll("[data-retro-answer]"));
}

function validarRetrospectiva() {
  const bau = document.querySelector(".retro-chest");
  const botao = document.getElementById("btnAbrirBauMelhoria");
  const status = document.getElementById("retroStatus");
  const respostas = obterRespostasRetrospectiva();
  const respostasPreenchidas = respostas.filter((campo) => campo.value.trim().length >= 4);

  if (respostasPreenchidas.length < respostas.length) {
    const pendentes = respostas.length - respostasPreenchidas.length;

    if (status) {
      status.textContent =
        pendentes === 1
          ? "Ainda falta uma resposta para transformar aprendizado em melhoria."
          : `Ainda faltam ${pendentes} respostas para transformar aprendizado em melhoria.`;
    }

    mostrarCartaoCorvo(
      "Retrospectiva incompleta",
      "A melhoria contínua precisa de reflexão concreta. Responda o que funcionou, o que atrapalhou e qual experimento o time vai testar na próxima Sprint.",
    );
    return;
  }

  if (bau) {
    bau.classList.add("retro-chest--complete");
  }

  if (botao) {
    botao.disabled = true;
    botao.textContent = "Baú aberto";
  }

  if (status) {
    status.textContent =
      "Baú aberto. A retrospectiva virou uma melhoria concreta para o próximo ciclo.";
  }

  atualizarAmpulheta(
    "restaurada",
    "Restaurada",
    "A areia volta a cair com calma. O time aprendeu com o ciclo e escolheu uma melhoria para testar.",
  );

  mostrarCartaoCorvo(
    "Melhoria contínua desbloqueada",
    "Retrospectiva não é reunião para culpar pessoas. É o momento em que o time aprende com o próprio processo e escolhe um ajuste pequeno para evoluir.",
  );
}

function configurarRetrospectiva() {
  const botao = document.getElementById("btnAbrirBauMelhoria");

  if (!botao) return;

  botao.addEventListener("click", validarRetrospectiva);
}

function configurarProgressoVisual() {
  const secoes = document.querySelectorAll(".capitulo4-ato[data-step]");
  const marcadores = document.querySelectorAll(".chapter-progress .progress-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const step = entry.target.dataset.step;

        marcadores.forEach((marcador) => {
          marcador.classList.toggle("active", marcador.dataset.step === step);
        });

        atualizarCartaoCorvo(step);
      });
    },
    { threshold: 0.45 },
  );

  secoes.forEach((secao) => observer.observe(secao));
}

async function concluirHistoria() {
  const token = obterToken();
  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const portaBoss = document.getElementById("portaBossScene");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (btnConcluir) {
    btnConcluir.disabled = true;
    btnConcluir.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon está registrando sua jornada...";
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
      throw new Error(data.message || "Não foi possível registrar o progresso.");
    }

    if (status) {
      status.textContent =
        "História concluída. A quarta porta foi liberada. Aproxime-se dela para entrar.";
    }

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (portaBoss) {
      portaBoss.classList.add("porta-liberada");
      portaBoss.setAttribute("role", "button");
      portaBoss.setAttribute("tabindex", "0");
      portaBoss.setAttribute("aria-label", "Entrar no desafio do modulo 4");
    }
  } catch (error) {
    console.error(error);

    if (status) {
      status.textContent = "Erro ao registrar progresso. Tente novamente.";
    }

    if (btnConcluir) {
      btnConcluir.disabled = false;
      btnConcluir.textContent = "Tentar concluir novamente";
    }
  }
}

function configurarConclusaoHistoria() {
  const btnConcluir = document.getElementById("btnConcluirHistoria");

  if (btnConcluir) {
    btnConcluir.addEventListener("click", concluirHistoria);
  }
}

function configurarPortaDesafio() {
  const portaBoss = document.getElementById("portaBossScene");

  if (!portaBoss) return;

  function entrarNoDesafio() {
    if (!portaBoss.classList.contains("porta-liberada")) return;

    localStorage.setItem("moduloAtual", ID_MODULO);
    window.location.href = "/desafio1";
  }

  portaBoss.addEventListener("click", entrarNoDesafio);
  portaBoss.addEventListener("keydown", (event) => {
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

    if (!response.ok) return;

    const modulo = data.modulos.find((m) => Number(m.id_modulo) === ID_MODULO);

    if (!modulo || !modulo.historia_concluida) return;

    const btnConcluir = document.getElementById("btnConcluirHistoria");
    const portaBoss = document.getElementById("portaBossScene");
    const status = document.getElementById("statusHistoria");

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (status) {
      status.textContent =
        "História concluída. A quarta porta foi liberada. Aproxime-se dela para entrar.";
    }

    if (portaBoss) {
      portaBoss.classList.add("porta-liberada");
      portaBoss.setAttribute("role", "button");
      portaBoss.setAttribute("tabindex", "0");
      portaBoss.setAttribute("aria-label", "Entrar no desafio do modulo 4");
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();
  await carregarEstadoHistoria();

  atualizarCartaoCorvo("ampulheta");
  configurarScrollParaBotoes();
  ajustarScrollPorHashInicial();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarFeedbackKanban();
  configurarForjaDod();
  configurarPonteCicd();
  configurarRefatoracaoDivida();
  configurarMetricas();
  configurarStakeholders();
  configurarRetrospectiva();
  configurarConclusaoHistoria();
  configurarPortaDesafio();

  if (typeof verificarEAtualizarNavbar === "function") {
    verificarEAtualizarNavbar();
  }
});
