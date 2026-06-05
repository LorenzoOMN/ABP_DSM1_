if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const ID_MODULO = 5;

const ETAPAS_CAPITULO_5 = [
  "duplo",
  "stakeholder",
  "necrobranch",
  "bug-infernal",
  "forja-mvp",
];

const etapasConcluidas = new Set();

const ENCONTROS_CAPITULO_5 = {
  duplo: { stageId: "encounter-duplo" },
  stakeholder: { stageId: "encounter-stakeholder" },
  necrobranch: { stageId: "encounter-necrobranch" },
  "bug-infernal": { stageId: "encounter-bug" },
  "forja-mvp": { stageId: "encounter-forja" },
  "porta-final": { stageId: "encounter-porta" },
};

let etapaAtualCapitulo5 = "duplo";

const STORAGE_CAPITULO5 = "scrum_dungeon_capitulo5_estado";
const STORAGE_CAPITULO5_ENTRADA = "scrum_dungeon_capitulo5_entrada";

const estadoForja = {
  slots: {
    aval: false,
    ampulheta: false,
    bau: false,
  },
  concluida: false,
};

function salvarEstadoCapitulo5Local() {
  localStorage.setItem(
    STORAGE_CAPITULO5,
    JSON.stringify({
      etapaAtualCapitulo5,
      etapasConcluidas: [...etapasConcluidas],
      estadoForja,
    }),
  );
}

function restaurarEstadoCapitulo5Local() {
  const bruto = localStorage.getItem(STORAGE_CAPITULO5);
  if (!bruto) return;

  try {
    const estado = JSON.parse(bruto);

    if (Array.isArray(estado.etapasConcluidas)) {
      etapasConcluidas.clear();
      estado.etapasConcluidas.forEach((etapa) => etapasConcluidas.add(etapa));
    }

    if (typeof estado.etapaAtualCapitulo5 === "string") {
      etapaAtualCapitulo5 = estado.etapaAtualCapitulo5;
    }

    if (estado.estadoForja?.slots) {
      estadoForja.slots.aval = !!estado.estadoForja.slots.aval;
      estadoForja.slots.ampulheta = !!estado.estadoForja.slots.ampulheta;
      estadoForja.slots.bau = !!estado.estadoForja.slots.bau;
    }

    estadoForja.concluida = !!estado.estadoForja?.concluida;
  } catch (erro) {
    console.error("Erro ao restaurar estado local do capítulo 5:", erro);
  }
}

function resetarJornadaCapitulo5() {
  localStorage.removeItem(STORAGE_CAPITULO5);
  localStorage.removeItem(STORAGE_CAPITULO5_ENTRADA);
  window.location.reload();
}

function salvarEntradaCapitulo5() {
  localStorage.setItem(STORAGE_CAPITULO5_ENTRADA, "true");
}

function restaurarEntradaCapitulo5() {
  const capitulo5Page = document.getElementById("capitulo5Page");
  const btnEntrarNaPonte = document.getElementById("btnEntrarNaPonte");

  const entrou = localStorage.getItem(STORAGE_CAPITULO5_ENTRADA) === "true";

  if (!entrou) return;

  if (capitulo5Page) {
    capitulo5Page.classList.remove("capitulo5-page--locked");
    capitulo5Page.classList.add("capitulo5-page--entered");
  }

 if (btnEntrarNaPonte) {
  btnEntrarNaPonte.disabled = false;
  btnEntrarNaPonte.classList.add("concluida");
  btnEntrarNaPonte.classList.remove("ativando");
}
}

const stakeholderTurnos = [
  {
    titulo: "Turno 1 — Ruído sem prioridade",
    imagem: "/assets/img/capitulo_5/stake-holder-selvagem-icon.png",
    pergunta:
      "O Stakeholder Selvagem rosna: “Quero tudo. Agora. Não me importa a ordem. Só entreguem.” O Bardo sente as cordas do alaúde desafinarem. Como o grupo deve responder?",
    opcoes: [
      "Aceitar tudo de imediato para reduzir a tensão.",
      "Organizar e priorizar as demandas no Product Backlog, deixando claro o que gera mais valor agora.",
      "Deixar o time decidir sozinho, sem alinhamento com ninguém.",
    ],
    correta: 1,
    feedback:
      "A resposta devolve ritmo ao grupo. O Bardo reorganiza as primeiras exigências em uma melodia compreensível.",
  },
  {
    titulo: "Turno 2 — Pressão sem transparência",
    imagem: "/assets/img/capitulo_5/stakeholder-transformation1.png",
    pergunta:
      "A criatura insiste: “Não quero contexto. Não quero explicações. Só quero velocidade.” As vozes atingem o Bardo outra vez. Como responder?",
    opcoes: [
      "Remover alinhamento e seguir mais rápido, mesmo sem clareza.",
      "Explicar com transparência o impacto das mudanças e mostrar que velocidade sem clareza gera mais caos.",
      "Ignorar a cobrança e continuar sem responder.",
    ],
    correta: 1,
    feedback:
      "A música muda. O Bardo encontra firmeza na transparência, e o Stakeholder perde parte da sua ferocidade.",
  },
  {
    titulo: "Turno 3 — Expectativa sem alinhamento",
    imagem: "/assets/img/capitulo_5/stake-holder-icon.png",
    pergunta:
      "A criatura já parece menos feroz, mas ainda hesita: “E se eu mudar de ideia amanhã? Como saberei que vocês entenderam o que eu preciso?” Como responder?",
    opcoes: [
      "Explicar que o alinhamento contínuo e a organização das prioridades permitem adaptação sem cair no caos.",
      "Prometer que qualquer mudança será aceita sem impacto nenhum.",
      "Pedir que o Stakeholder pare de opinar no produto.",
    ],
    correta: 0,
    feedback:
      "O grupo devolve ordem à ponte. O Bardo toca uma melodia segura, guiada por entendimento, valor e alinhamento.",
  },
];

const bugPontosAnalise = {
  esperado: {
    titulo: "Comportamento esperado",
    texto:
      "O primeiro passo é entender o que deveria acontecer. Sem clareza sobre o comportamento esperado, o time corre o risco de corrigir algo sem saber se o resultado faz sentido.",
  },
  atual: {
    titulo: "Comportamento atual",
    texto:
      "Agora o grupo observa o que realmente está acontecendo. Registrar o comportamento atual ajuda a separar suposição de evidência e impede que o bug continue se escondendo.",
  },
  validacao: {
    titulo: "Validação da correção",
    texto:
      "Não basta alterar o código. É preciso validar se a correção resolveu o problema sem causar novos danos, garantindo segurança antes de seguir em frente.",
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

function configurarRevealNoScroll() {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
      });
    },
    {
      threshold: 0.18,
    },
  );

  elementos.forEach((el) => observer.observe(el));
}

async function concluirHistoria() {
  const token = obterToken();

  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const btnEntrarDesafio = document.getElementById("btnEntrarDesafio");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (btnConcluir) {
    btnConcluir.disabled = true;
    btnConcluir.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon está registrando sua jornada final...";
  }

  try {
    const response = await fetch(
      `/api/progresso/historia/${ID_MODULO}/concluir`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Não foi possível registrar o progresso.",
      );
    }

    if (status) {
      status.textContent = "História concluída. A porta final foi liberada.";
    }

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (btnEntrarDesafio) {
      btnEntrarDesafio.classList.remove("hidden");
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

async function carregarEstadoHistoria() {
  const token = obterToken();

  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const btnEntrarDesafio = document.getElementById("btnEntrarDesafio");
  const status = document.getElementById("statusHistoria");

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

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (btnEntrarDesafio) {
      btnEntrarDesafio.classList.remove("hidden");
    }

    if (status) {
      status.textContent = "História concluída. A porta final foi liberada.";
    }
  } catch (error) {
    console.error(error);
  }
}

function configurarPortaFinal() {
  const btnIrPortaFinal = document.getElementById("btnIrPortaFinal");
  const portaFinalStage =
    document.getElementById("encounter-porta") ||
    document.getElementById("portaFinalStage");

  const portaFinalLockZone = document.getElementById("portaFinalLockZone");
  const portaFinalImgFechada = document.getElementById("portaFinalImgFechada");
  const portaFinalImgAberta = document.getElementById("portaFinalImgAberta");
  const portaFinalFeedback = document.getElementById("portaFinalFeedback");
  const portaBloqueada = document.getElementById("portaBloqueada");
  const btnConcluirHistoria = document.getElementById("btnConcluirHistoria");
  const statusHistoria = document.getElementById("statusHistoria");

  function abrirSalaDaPortaFinal() {
    if (!portaFinalStage) {
      console.warn("Stage da porta final não encontrado.");
      return;
    }

    document.querySelectorAll(".encounter-stage").forEach((stage) => {
      stage.classList.add("hidden");
    });

    portaFinalStage.classList.remove("hidden");
    portaFinalStage.classList.add("visible");

    etapaAtualCapitulo5 = "porta-final";

    atualizarNavegacaoCapitulo5();
    atualizarMapaPonte();
    atualizarPreviewsPonte();

    portaFinalStage.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /*
    Importante:
    o botão de ir para a porta é configurado mesmo se algum elemento
    interno da fechadura estiver faltando.
  */
  if (btnIrPortaFinal) {
    btnIrPortaFinal.addEventListener("click", abrirSalaDaPortaFinal);
  }

  if (
    !portaFinalStage ||
    !portaFinalLockZone ||
    !portaFinalImgFechada ||
    !portaFinalImgAberta ||
    !portaFinalFeedback ||
    !btnConcluirHistoria
  ) {
    console.warn(
      "A sala da porta pode abrir, mas algum elemento da interação da fechadura está faltando.",
    );
    return;
  }

  let portaFoiAberta = false;

  function historia5ProntaParaConclusao() {
    return (
      etapasConcluidas.has("forja-mvp") ||
      estadoForja.concluida
    );
  }

  function mostrarFeedbackPorta(mensagem) {
    portaFinalFeedback.textContent = mensagem;
    portaFinalFeedback.classList.remove("hidden");
  }

  function abrirPortaFinal() {
    portaFoiAberta = true;

    portaFinalStage.classList.add("porta-final-aberta");
    portaFinalStage.classList.add("is-unlocked");

    portaFinalImgFechada.classList.add("hidden");
    portaFinalImgAberta.classList.remove("hidden");

    portaFinalLockZone.classList.add("hidden");

    if (portaBloqueada) {
      portaBloqueada.textContent =
        "A Chave MVP girou na fechadura. A porta reconhece o fluxo e permite registrar a conclusão da história.";
      portaBloqueada.classList.add("liberada");
    }

    mostrarFeedbackPorta(
      "A fechadura aceita a Chave MVP. Agora salve a conclusão da história para liberar o último desafio.",
    );

    btnConcluirHistoria.classList.remove("hidden");

    if (statusHistoria) {
      statusHistoria.textContent =
        "Porta aberta. Falta apenas registrar a conclusão da história.";
    }
  }

  portaFinalLockZone.addEventListener("dragover", (event) => {
    event.preventDefault();

    if (portaFoiAberta) return;

    portaFinalLockZone.classList.add("is-over");
  });

  portaFinalLockZone.addEventListener("dragleave", () => {
    portaFinalLockZone.classList.remove("is-over");
  });

  portaFinalLockZone.addEventListener("drop", (event) => {
    event.preventDefault();

    portaFinalLockZone.classList.remove("is-over");

    if (portaFoiAberta) return;

    if (!historia5ProntaParaConclusao()) {
      mostrarFeedbackPorta(
        "A porta permanece imóvel. Antes de abri-la, a Forja precisa reconhecer o MVP.",
      );
      return;
    }

    const artefatoRecebido = event.dataTransfer.getData("text/plain");

    if (artefatoRecebido !== "chave-mvp") {
      mostrarFeedbackPorta(
        "A fechadura não responde. Apenas a Chave MVP, forjada a partir da entrega real, pode abrir esta porta.",
      );
      return;
    }

    abrirPortaFinal();
  });
}

function configurarConclusaoHistoria() {
  const btnConcluir = document.getElementById("btnConcluirHistoria");

  if (btnConcluir) {
    btnConcluir.addEventListener("click", concluirHistoria);
  }
}

function configurarEntradaDesafio() {
  const btnEntrarDesafio = document.getElementById("btnEntrarDesafio");

  if (!btnEntrarDesafio) return;

  btnEntrarDesafio.addEventListener("click", () => {
    localStorage.setItem("moduloAtual", ID_MODULO);
    window.location.href = "/desafio1";
  });
}

function atualizarProgressoCapitulo() {
  const totalConcluidas = ETAPAS_CAPITULO_5.filter((etapa) =>
    etapasConcluidas.has(etapa),
  ).length;

  const totalEtapas = ETAPAS_CAPITULO_5.length;

  const portaBloqueada = document.getElementById("portaBloqueada");
  const btnConcluirHistoria = document.getElementById("btnConcluirHistoria");

  const todasConcluidas = ETAPAS_CAPITULO_5.every((etapa) =>
    etapasConcluidas.has(etapa),
  );

  if (portaBloqueada) {
    portaBloqueada.textContent = todasConcluidas
      ? "O MVP foi forjado. A porta reconhece que o time está pronto, mas ainda espera a Chave MVP tocar sua fechadura."
      : `A porta ainda observa sua jornada. Resolva os obstáculos e forje o MVP. Progresso: ${totalConcluidas}/${totalEtapas}.`;

    portaBloqueada.classList.toggle("liberada", todasConcluidas);
  }

  /*
    Importante:
    este botão agora só aparece depois da interação da fechadura,
    dentro da função abrirPortaFinal().
  */
  if (btnConcluirHistoria) {
    btnConcluirHistoria.classList.add("hidden");
  }

  atualizarNavegacaoCapitulo5();
}

function concluirEtapaCapitulo5(step) {
  etapasConcluidas.add(step);

  const stage = document.querySelector(`.encounter-stage[data-step="${step}"]`);
  if (stage) {
    stage.classList.add("etapa-concluida");
  }

  const indiceAtual = obterIndiceEtapa(step);
  const proximaEtapa =
    indiceAtual < ETAPAS_CAPITULO_5.length - 1
      ? ETAPAS_CAPITULO_5[indiceAtual + 1]
      : "porta-final";

  if (proximaEtapa && etapaEstaLiberada(proximaEtapa)) {
    etapaAtualCapitulo5 = proximaEtapa;
  }

  atualizarProgressoCapitulo();
  salvarEstadoCapitulo5Local();
}

function animarAvancoNoMapa(proximaEtapa, abrirStageDepois = true) {
  const mapa = document.getElementById("mapaPonte");

  if (mapa) {
    mapa.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  setTimeout(() => {
    etapaAtualCapitulo5 = proximaEtapa;
    atualizarNavegacaoCapitulo5();
    atualizarMapaPonte();
    atualizarPreviewsPonte();
    atualizarMochila();
  }, 700);

  if (abrirStageDepois) {
    setTimeout(() => {
      abrirStageCapitulo5(proximaEtapa);
    }, 1600);
  }
}

function configurarDesafioDuplo() {
  const btnMostrarDesafioDuplo = document.getElementById(
    "btnMostrarDesafioDuplo",
  );
  const duploDesafioWrap = document.getElementById("duploDesafioWrap");
  const duploRoleCards = document.querySelectorAll(".duplo-role-card");
  const duploRoleTitulo = document.getElementById("duploRoleTitulo");
  const duploRoleTexto = document.getElementById("duploRoleTexto");
  const duploRoleOpcoes = document.getElementById("duploRoleOpcoes");

  const duploMedalhaoStage = document.getElementById("duploMedalhaoStage");
  const btnConcluirDuploNarrativa = document.getElementById(
    "btnConcluirDuploNarrativa",
  );

  function marcarRoleResolvida(roleKey) {
    if (duploRoleProgress[roleKey]) return;

    duploRoleProgress[roleKey] = true;

    const card = document.querySelector(
      `.duplo-role-card[data-role="${roleKey}"]`,
    );
    const status = document.getElementById(`status-${roleKey}`);

    if (card) card.classList.add("resolvido");
    if (status) status.textContent = "Resolvido";

    const concluiuTudo = Object.values(duploRoleProgress).every(Boolean);

    if (concluiuTudo && duploMedalhaoStage) {
      duploMedalhaoStage.classList.remove("hidden");

      duploMedalhaoStage.classList.add("energizado");

      document.body.classList.add("mochila-highlight-medalhao");
      
      const mochilaCallout = document.getElementById("mochilaCallout");
      if (mochilaCallout) {
        mochilaCallout.classList.remove("hidden");
      }

      const medalhao = document.querySelector('[data-artefato="medalhao"]');
      if (medalhao) {
        medalhao.classList.add("convocado");
        medalhao.setAttribute("draggable", "true");
        medalhao.id = "artefatoMedalhao";
      }

      setTimeout(() => {
        duploMedalhaoStage.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    }
  }

  if (btnMostrarDesafioDuplo && duploDesafioWrap) {
    btnMostrarDesafioDuplo.addEventListener("click", () => {
      duploDesafioWrap.classList.remove("hidden");
      duploDesafioWrap.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  if (duploRoleCards.length) {
    duploRoleCards.forEach((card) => {
      card.addEventListener("click", () => {
        duploRoleCards.forEach((item) => item.classList.remove("active"));
        card.classList.add("active");

        const roleKey = card.dataset.role;
        renderizarRoleDuplo(
          roleKey,
          duploRoleTitulo,
          duploRoleTexto,
          duploRoleOpcoes,
          marcarRoleResolvida,
        );
      });
    });

    renderizarRoleDuplo(
      "po",
      duploRoleTitulo,
      duploRoleTexto,
      duploRoleOpcoes,
      marcarRoleResolvida,
    );
  }

  if (btnConcluirDuploNarrativa) {
    btnConcluirDuploNarrativa.addEventListener("click", () => {
      concluirEtapaCapitulo5("duplo");
      animarAvancoNoMapa("stakeholder", true);
    });
  }
}

function configurarDropMedalhaoDuplo() {
  const duploMedalhaoDropzone = document.getElementById(
    "duploMedalhaoDropzone",
  );
  const duploRevelacaoStage = document.getElementById("duploRevelacaoStage");
  const duploMedalhaoStage = document.getElementById("duploMedalhaoStage");

  if (!duploMedalhaoDropzone) return;

  function obterMedalhaoAtual() {
    return document.getElementById("artefatoMedalhao");
  }

  document.addEventListener("dragstart", (event) => {
    const medalhao = obterMedalhaoAtual();
    if (!medalhao) return;
    if (event.target !== medalhao && !medalhao.contains(event.target)) return;

    event.dataTransfer.setData("text/plain", "medalhao");
  });

  duploMedalhaoDropzone.addEventListener("dragenter", () => {
    duploMedalhaoDropzone.classList.add("is-over");
  });
  duploMedalhaoDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    duploMedalhaoDropzone.classList.add("is-over");
  });

  duploMedalhaoDropzone.addEventListener("dragleave", () => {
    duploMedalhaoDropzone.classList.remove("is-over");
  });

  duploMedalhaoDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    duploMedalhaoDropzone.classList.remove("is-over");

    const artefato = event.dataTransfer.getData("text/plain");
    if (artefato !== "medalhao") return;

    const medalhao = obterMedalhaoAtual();
    if (medalhao) {
      medalhao.classList.add("hidden");
      medalhao.removeAttribute("draggable");
      medalhao.removeAttribute("id");
    }

    document.body.classList.remove("mochila-highlight-medalhao");
    if (duploMedalhaoStage) {
      duploMedalhaoStage.classList.remove("energizado");
    }

    const itemMedalhao = document.querySelector('[data-artefato="medalhao"]');
    if (itemMedalhao) {
      itemMedalhao.classList.remove("destacado", "convocado");
    }

    if (duploRevelacaoStage) {
      const duploRevealCopy = document.getElementById("duploRevealCopy");
      const btnConcluirDuploNarrativa = document.getElementById(
        "btnConcluirDuploNarrativa",
      );

      duploRevelacaoStage.classList.remove("hidden");

      setTimeout(() => {
        duploRevelacaoStage.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 260);

      setTimeout(() => {
        duploRevelacaoStage.classList.add("revealed");
      }, 520);

      setTimeout(() => {
        if (duploRevealCopy) {
          duploRevealCopy.classList.add("show");
        }
      }, 1200);

      setTimeout(() => {
        if (btnConcluirDuploNarrativa) {
          btnConcluirDuploNarrativa.classList.remove("hidden");
        }
      }, 1750);
    }
  });
}

function configurarDesafioStakeholder() {
  const btnIniciarStakeholder = document.getElementById(
    "btnIniciarStakeholder",
  );
  const stakeholderTurnosWrap = document.getElementById(
    "stakeholderTurnosWrap",
  );
  const stakeholderBacklogStage = document.getElementById(
    "stakeholderBacklogStage",
  );
  const stakeholderRevelacaoStage = document.getElementById(
    "stakeholderRevelacaoStage",
  );
  const stakeholderTurnoImagem = document.getElementById(
    "stakeholderTurnoImagem",
  );
  const stakeholderTurnoLabel = document.getElementById(
    "stakeholderTurnoLabel",
  );
  const stakeholderTurnoTitulo = document.getElementById(
    "stakeholderTurnoTitulo",
  );
  const stakeholderTurnoPergunta = document.getElementById(
    "stakeholderTurnoPergunta",
  );
  const stakeholderTurnoOpcoes = document.getElementById(
    "stakeholderTurnoOpcoes",
  );
  const stakeholderFeedback = document.getElementById("stakeholderFeedback");
  const btnConcluirStakeholderNarrativa = document.getElementById(
    "btnConcluirStakeholderNarrativa",
  );

  if (
    !btnIniciarStakeholder ||
    !stakeholderTurnosWrap ||
    !stakeholderBacklogStage ||
    !stakeholderRevelacaoStage ||
    !stakeholderTurnoImagem ||
    !stakeholderTurnoLabel ||
    !stakeholderTurnoTitulo ||
    !stakeholderTurnoPergunta ||
    !stakeholderTurnoOpcoes ||
    !stakeholderFeedback
  ) {
    return;
  }

  let turnoAtual = 0;

  function trocarTurnoStakeholder(callbackAtualizacao) {
    const content = document.getElementById("stakeholderTurnoContent");

    if (!content) {
      callbackAtualizacao();
      return;
    }

    content.classList.add("is-switching");

    setTimeout(() => {
      callbackAtualizacao();

      requestAnimationFrame(() => {
        content.classList.remove("is-switching");
      });
    }, 220);
  }

  function renderizarTurnoStakeholder() {
    const turno = stakeholderTurnos[turnoAtual];
    if (!turno) return;

    stakeholderTurnoImagem.src = turno.imagem;
    stakeholderTurnoLabel.textContent = `Turno ${turnoAtual + 1} de ${stakeholderTurnos.length}`;
    stakeholderTurnoTitulo.textContent = turno.titulo;
    stakeholderTurnoPergunta.textContent = turno.pergunta;
    stakeholderTurnoOpcoes.innerHTML = "";
    stakeholderFeedback.className = "stakeholder-feedback hidden";
    stakeholderFeedback.textContent = "";

    turno.opcoes.forEach((opcao, index) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "stakeholder-opcao-btn";
      botao.textContent = opcao;

      botao.addEventListener("click", () => {
        const botoes = stakeholderTurnoOpcoes.querySelectorAll(
          ".stakeholder-opcao-btn",
        );
        botoes.forEach((b) => (b.disabled = true));

        if (index === turno.correta) {
          botao.classList.add("correta");
          stakeholderFeedback.className = "stakeholder-feedback sucesso";
          stakeholderFeedback.textContent = turno.feedback;
          stakeholderFeedback.classList.remove("hidden");

          setTimeout(() => {
            turnoAtual += 1;

            if (turnoAtual < stakeholderTurnos.length) {
              trocarTurnoStakeholder(() => {
                renderizarTurnoStakeholder();
              });
            } else {
              stakeholderTurnosWrap.classList.add("hidden");
              stakeholderBacklogStage.classList.remove("hidden");
              document.body.classList.add("mochila-highlight-backlog");

              const backlogItem = document.querySelector(
                '[data-artefato="backlog"]',
              );
              if (backlogItem) {
                backlogItem.classList.add("convocado");
                backlogItem.setAttribute("draggable", "true");
              }

              stakeholderBacklogStage.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 1400);
        } else {
          botao.classList.add("errada");
          stakeholderFeedback.className = "stakeholder-feedback erro";
          stakeholderFeedback.textContent =
            "Essa resposta mantém o caos. O grupo precisa proteger o Bardo com clareza, transparência e prioridade.";
          stakeholderFeedback.classList.remove("hidden");

          setTimeout(() => {
            botoes.forEach((b) => {
              b.disabled = false;
              b.classList.remove("errada");
            });
          }, 1200);
        }
      });

      stakeholderTurnoOpcoes.appendChild(botao);
    });
  }

  btnIniciarStakeholder.addEventListener("click", () => {
    stakeholderTurnosWrap.classList.remove("hidden");
    stakeholderTurnosWrap.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    renderizarTurnoStakeholder();
  });

  if (btnConcluirStakeholderNarrativa) {
    btnConcluirStakeholderNarrativa.addEventListener("click", () => {
      concluirEtapaCapitulo5("stakeholder");
      animarAvancoNoMapa("necrobranch", true);
    });
  }
}

function configurarDropBacklogStakeholder() {
  const dropzone = document.getElementById("stakeholderBacklogDropzone");
  const stakeholderBacklogStage = document.getElementById(
    "stakeholderBacklogStage",
  );
  const stakeholderRevelacaoStage = document.getElementById(
    "stakeholderRevelacaoStage",
  );

  if (!dropzone || !stakeholderBacklogStage || !stakeholderRevelacaoStage)
    return;

  document.addEventListener("dragstart", (event) => {
    const backlog = document.querySelector(
      '[data-artefato="backlog"][draggable="true"]',
    );
    if (!backlog) return;
    if (event.target !== backlog && !backlog.contains(event.target)) return;

    event.dataTransfer.setData("text/plain", "backlog");
  });

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("is-over");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("is-over");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-over");

    const artefato = event.dataTransfer.getData("text/plain");
    if (artefato !== "backlog") return;

    const backlog = document.querySelector(
      '.mochila-item[data-artefato="backlog"]',
    );
    const aval = document.querySelector('.mochila-item[data-artefato="aval"]');

    if (backlog) {
      backlog.classList.add("hidden");
      backlog.classList.remove("convocado", "destacado", "ativo");
      backlog.removeAttribute("draggable");
    }

    if (aval) {
      aval.classList.remove("hidden");
      aval.classList.add("flash-artefato");
      setTimeout(() => aval.classList.remove("flash-artefato"), 1200);
    }

    document.body.classList.remove("mochila-highlight-backlog");

    stakeholderBacklogStage.classList.add("hidden");
    stakeholderRevelacaoStage.classList.remove("hidden");

    const stakeholderRevealCopy = document.getElementById(
      "stakeholderRevealCopy",
    );
    if (stakeholderRevealCopy) {
      setTimeout(() => stakeholderRevealCopy.classList.add("show"), 250);
    }

    stakeholderRevelacaoStage.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function configurarDesafioNecrobranch() {
  const btnIniciarNecrobranch = document.getElementById(
    "btnIniciarNecrobranch",
  );
  const necroAnaliseWrap = document.getElementById("necroAnaliseWrap");
  const necroAnaliseFeedback = document.getElementById("necroAnaliseFeedback");
  const necroRitualStage = document.getElementById("necroRitualStage");
  const necroAmpulhetaDropzone = document.getElementById(
    "necroAmpulhetaDropzone",
  );
  const necroAmpulhetaAtivacao = document.getElementById(
    "necroAmpulhetaAtivacao",
  );
  const necroAmpulhetaIcon = document.getElementById("necroAmpulhetaIcon");
  const necroRevelacaoStage = document.getElementById("necroRevelacaoStage");
  const btnSelarNecrobranch = document.getElementById("btnSelarNecrobranch");
  const btnConcluirNecrobranchNarrativa = document.getElementById(
    "btnConcluirNecrobranchNarrativa",
  );

  const botoesCausa = document.querySelectorAll(".necro-causa-btn");

  if (
    !btnIniciarNecrobranch ||
    !necroAnaliseWrap ||
    !necroAnaliseFeedback ||
    !necroRitualStage ||
    !necroRevelacaoStage ||
    !btnSelarNecrobranch ||
    !btnConcluirNecrobranchNarrativa ||
    !botoesCausa.length
  ) {
    return;
  }

  const causasRegistradas = new Set();

  document.addEventListener("dragstart", (event) => {
    const ampulhetaItem = document.querySelector(
      '[data-artefato="ampulheta"][draggable="true"]',
    );
    if (!ampulhetaItem) return;

    if (
      event.target !== ampulhetaItem &&
      !ampulhetaItem.contains(event.target)
    ) {
      return;
    }

    event.dataTransfer.setData("text/plain", "ampulheta");
  });

  if (necroAmpulhetaDropzone) {
    necroAmpulhetaDropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      necroAmpulhetaDropzone.classList.add("is-over");
    });

    necroAmpulhetaDropzone.addEventListener("dragleave", () => {
      necroAmpulhetaDropzone.classList.remove("is-over");
    });

    necroAmpulhetaDropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      necroAmpulhetaDropzone.classList.remove("is-over");

      const artefato = event.dataTransfer.getData("text/plain");
      if (artefato !== "ampulheta") return;

      necroAmpulhetaDropzone.classList.add("hidden");

      if (necroAmpulhetaAtivacao) {
        necroAmpulhetaAtivacao.classList.remove("hidden");
      }

      document.body.classList.remove("mochila-highlight-ampulheta");

      const ampulhetaItem = document.querySelector(
        '[data-artefato="ampulheta"]',
      );
      if (ampulhetaItem) {
        ampulhetaItem.classList.remove("convocado");
      }
    });
  }

  btnIniciarNecrobranch.addEventListener("click", () => {
    necroAnaliseWrap.classList.remove("hidden");
    necroAnaliseWrap.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  botoesCausa.forEach((botao) => {
    botao.addEventListener("click", () => {
      const causa = botao.dataset.causaBtn;
      if (!causa) return;

      causasRegistradas.add(causa);
      botao.disabled = true;
      botao.classList.add("registrado");

      const card = botao.closest(".necro-causa-card");
      if (card) {
        card.classList.add("resolvida");
      }

      necroAnaliseFeedback.classList.remove("hidden");
      necroAnaliseFeedback.textContent = `Causas analisadas: ${causasRegistradas.size}/3.`;

      if (causasRegistradas.size === 3) {
        necroAnaliseFeedback.className = "necro-analise-feedback sucesso";
        necroAnaliseFeedback.textContent =
          "O grupo compreende a origem do colapso: é possível restaurar a ponte com segurança.";

        setTimeout(() => {
          document.body.classList.add("mochila-highlight-ampulheta");

          const ampulhetaItem = document.querySelector(
            '[data-artefato="ampulheta"]',
          );
          if (ampulhetaItem) {
            ampulhetaItem.classList.add("convocado");
            ampulhetaItem.setAttribute("draggable", "true");
          }

          necroRitualStage.classList.remove("hidden");
          necroRitualStage.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 900);
      }
    });
  });

  btnSelarNecrobranch.addEventListener("click", () => {
    if (necroAmpulhetaIcon) {
      necroAmpulhetaIcon.classList.add("girando");
    }

    setTimeout(() => {
      necroRitualStage.classList.add("hidden");
      necroRevelacaoStage.classList.remove("hidden");

      const necroRevealCopy = document.getElementById("necroRevealCopy");
      if (necroRevealCopy) {
        setTimeout(() => {
          necroRevealCopy.classList.add("show");
        }, 250);
      }

      necroRevelacaoStage.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 850);
  });

  btnConcluirNecrobranchNarrativa.addEventListener("click", () => {
    concluirEtapaCapitulo5("necrobranch");
    animarAvancoNoMapa("bug-infernal", true);
  });
}



function configurarDesafioBugInfernal() {
  const btnIniciarBug = document.getElementById("btnIniciarBug");
  const bugAnaliseWrap = document.getElementById("bugAnaliseWrap");
  const bugAnaliseTitulo = document.getElementById("bugAnaliseTitulo");
  const bugAnaliseTexto = document.getElementById("bugAnaliseTexto");
  const bugAnaliseProgresso = document.getElementById("bugAnaliseProgresso");
  const bugRevelacaoStage = document.getElementById("bugRevelacaoStage");
  const bugCreatureWrap = document.getElementById("bugCreatureWrap");
  const bugArrasteWrap = document.getElementById("bugArrasteWrap");
  const bugResumoAnalise = document.getElementById("bugResumoAnalise");
  const bugDicaBauCreature = document.getElementById("bugDicaBauCreature");
const bauItem = document.querySelector('[data-artefato="bau"]');
const bugFlipCard = document.getElementById("bugFlipCard");

  const bugMiniaturaArrastavel = document.getElementById(
    "bugMiniaturaArrastavel",
  );

  const btnConcluirBugNarrativa = document.getElementById(
    "btnConcluirBugNarrativa",
  );

  const hotspots = document.querySelectorAll(".bug-hotspot");
  const bugBubbles = document.querySelectorAll("[data-bug-bubble]");

  if (
    !btnIniciarBug ||
    !bugAnaliseWrap ||
    !bugAnaliseTitulo ||
    !bugAnaliseTexto ||
    !bugAnaliseProgresso ||
    !bugRevelacaoStage ||
    !bugCreatureWrap ||
    !bugArrasteWrap ||
    !bugResumoAnalise ||
    !bugMiniaturaArrastavel ||
    !btnConcluirBugNarrativa ||
    !hotspots.length
  ) {
    console.warn("Algum elemento do desafio Bug Infernal não foi encontrado.");
    return;
  }

  const pontosLidos = new Set();

  function esconderCaixasSuspensasBug() {
    bugBubbles.forEach((bubble) => {
      bubble.classList.add("hidden");
    });
  }

  function resetarArenaBug() {
    pontosLidos.clear();

    delete bugCreatureWrap.dataset.etapaBug;

    bugCreatureWrap.classList.remove("estado-final");
    bugArrasteWrap.classList.add("hidden");

    bugMiniaturaArrastavel.classList.remove("hidden");
    bugMiniaturaArrastavel.setAttribute("draggable", "true");

    hotspots.forEach((hotspot) => {
      hotspot.classList.remove("analisado");
    });

    esconderCaixasSuspensasBug();

    bugResumoAnalise.classList.add("hidden");

    bugAnaliseProgresso.classList.remove("is-completo");
    bugAnaliseProgresso.setAttribute("aria-expanded", "false");
    bugAnaliseProgresso.textContent = "Pontos analisados: 0/3";

    document.body.classList.remove("mochila-highlight-bau");

    const bauItem = document.querySelector('[data-artefato="bau"]');

    if (bauItem) {
      bauItem.classList.remove("convocado");
      bauItem.classList.remove("is-over");
    }

    bugAnaliseTitulo.textContent = "Selecione um ponto da criatura";
    bugAnaliseTexto.textContent =
      "Cada parte analisada revela como o time pode investigar melhor o bug, reduzir incerteza e conter a ameaça com segurança.";
  }

  function revelarCaixaSuspensaBug(chave) {
    esconderCaixasSuspensasBug();

    const bubble = document.querySelector(`[data-bug-bubble="${chave}"]`);

    if (!bubble) return;

    bubble.classList.remove("hidden");
  }

  function concluirAnaliseBug() {
    bugCreatureWrap.classList.add("estado-final");
    bugArrasteWrap.classList.remove("hidden");

    bugMiniaturaArrastavel.classList.remove("hidden");
    bugMiniaturaArrastavel.setAttribute("draggable", "true");

    document.body.classList.add("mochila-highlight-bau");

    const bauItem = document.querySelector('[data-artefato="bau"]');

    if (bauItem) {
      bauItem.classList.add("convocado");
    }

    bugAnaliseTitulo.textContent = "Criatura reduzida";
    bugAnaliseTexto.textContent =
      "Após identificar os códigos que davam força ao bug, o grupo conseguiu enfraquecê-lo. Agora ele pode ser contido no Baú da Iteração.";

    setTimeout(() => {
      esconderCaixasSuspensasBug();

      bugAnaliseProgresso.classList.add("is-completo");
      bugAnaliseProgresso.textContent = "Análise concluída";
      bugAnaliseProgresso.setAttribute("aria-expanded", "false");
    }, 1200);
  }

  if (bugFlipCard) {
  bugFlipCard.classList.remove("is-flipped");
  bugFlipCard.setAttribute("aria-pressed", "false");
}

  btnIniciarBug.addEventListener("click", () => {
    resetarArenaBug();

    bugAnaliseWrap.classList.remove("hidden");

    bugAnaliseWrap.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      const chave = hotspot.dataset.bugHotspot;
      const ponto = bugPontosAnalise[chave];

      if (!chave || !ponto || pontosLidos.has(chave)) return;

      pontosLidos.add(chave);
      hotspot.classList.add("analisado");

      revelarCaixaSuspensaBug(chave);

      bugAnaliseTitulo.textContent = ponto.titulo;
      bugAnaliseTexto.textContent = ponto.texto;
      bugAnaliseProgresso.textContent = `Pontos analisados: ${pontosLidos.size}/3`;

      bugCreatureWrap.dataset.etapaBug = String(pontosLidos.size);

      if (pontosLidos.size === 3) {
        setTimeout(() => {
          concluirAnaliseBug();
        }, 400);
      }
    });
  });

  bugAnaliseProgresso.addEventListener("click", () => {
    if (!bugAnaliseProgresso.classList.contains("is-completo")) return;

    const resumoEstaAberto = !bugResumoAnalise.classList.contains("hidden");

    if (resumoEstaAberto) {
      bugResumoAnalise.classList.add("hidden");
      bugAnaliseProgresso.setAttribute("aria-expanded", "false");
      return;
    }

    bugResumoAnalise.classList.remove("hidden");
    bugAnaliseProgresso.setAttribute("aria-expanded", "true");
  });

  bugMiniaturaArrastavel.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "bug-infernal");
  });

  if (bugFlipCard) {
  bugFlipCard.addEventListener("click", () => {
    const cartaVirada = bugFlipCard.classList.toggle("is-flipped");

    bugFlipCard.setAttribute("aria-pressed", String(cartaVirada));
  });
}

  btnConcluirBugNarrativa.addEventListener("click", () => {
    concluirEtapaCapitulo5("bug-infernal");
    animarAvancoNoMapa("forja-mvp", true);
  });

  if (bauItem && bugDicaBauCreature) {
  bauItem.setAttribute("draggable", "true");

  bauItem.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "bau");
  });

  bugCreatureWrap.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  bugCreatureWrap.addEventListener("drop", (event) => {
    event.preventDefault();

    const tipoArrastado = event.dataTransfer.getData("text/plain");

    if (tipoArrastado !== "bau") return;

    bugDicaBauCreature.classList.remove("hidden");

    setTimeout(() => {
      bugDicaBauCreature.classList.add("hidden");
    }, 3200);
  });
}
}
function configurarDropBugNoBau() {
  const bugMiniaturaArrastavel = document.getElementById(
    "bugMiniaturaArrastavel",
  );

  const bugArrasteWrap = document.getElementById("bugArrasteWrap");
  const bugRevelacaoStage = document.getElementById("bugRevelacaoStage");
  const bugRevealCopy = document.querySelector(".bug-reveal-copy");
  const bauItem = document.querySelector('[data-artefato="bau"]');

  if (
    !bugMiniaturaArrastavel ||
    !bugArrasteWrap ||
    !bugRevelacaoStage ||
    !bauItem
  ) {
    return;
  }

  bugMiniaturaArrastavel.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "bug-infernal");
    bugMiniaturaArrastavel.classList.add("is-dragging");
  });

  bugMiniaturaArrastavel.addEventListener("dragend", () => {
    bugMiniaturaArrastavel.classList.remove("is-dragging");
    bauItem.classList.remove("is-over");
  });

  bauItem.addEventListener("dragover", (event) => {
    event.preventDefault();
    bauItem.classList.add("is-over");
  });

  bauItem.addEventListener("dragleave", () => {
    bauItem.classList.remove("is-over");
  });

  bauItem.addEventListener("drop", (event) => {
    event.preventDefault();

    const tipoArrastado = event.dataTransfer.getData("text/plain");

    if (tipoArrastado !== "bug-infernal") return;

    bauItem.classList.remove("is-over");
    bauItem.classList.remove("convocado");
    document.body.classList.remove("mochila-highlight-bau");

    bugArrasteWrap.classList.add("hidden");

    bugRevelacaoStage.classList.remove("hidden");

    setTimeout(() => {
      if (bugRevealCopy) {
        bugRevealCopy.classList.add("show");
      }

      bugRevelacaoStage.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  });
}

function configurarFornalhasDaForja() {
  const fornalhas = document.querySelectorAll(".forja-fornalha");
  const btnLiberarMontagemForja = document.getElementById("btnLiberarMontagemForja");
  const forjaDropStage = document.getElementById("forjaDropStage");
  const forjaDicaFinal = document.getElementById("forjaDicaFinal");

  if (!fornalhas.length || !btnLiberarMontagemForja || !forjaDropStage) {
    return;
  }

  const fornalhasAcesas = new Set();

  function atualizarEstadoFornalhas(fornalhaAtiva) {
    fornalhas.forEach((btn) => {
      btn.classList.toggle("is-ativa", btn === fornalhaAtiva);
    });
  }

  fornalhas.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chave = btn.dataset.fornalha;
      if (!chave) return;

      atualizarEstadoFornalhas(btn);

      fornalhasAcesas.add(chave);
      btn.classList.add("is-acesa");

      if (fornalhasAcesas.size === 3) {
        btnLiberarMontagemForja.classList.remove("hidden");

        if (forjaDicaFinal) {
          forjaDicaFinal.classList.remove("hidden");
        }
      }
    });
  });

  btnLiberarMontagemForja.addEventListener("click", () => {
    forjaDropStage.classList.remove("hidden");
    forjaDropStage.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function configurarForjaMvp() {
  const btnIniciarForja = document.getElementById("btnIniciarForja");
  const forjaAulaWrap = document.getElementById("forjaAulaWrap");
  const forjaDropStage = document.getElementById("forjaDropStage");
  const forjaRevelacaoStage = document.getElementById("forjaRevelacaoStage");
  const forjaFeedback = document.getElementById("forjaFeedback");
  const btnForjarMvp = document.getElementById("btnForjarMvp");
  const btnResetCapitulo5 = document.getElementById("btnResetCapitulo5");

  const slotAval = document.getElementById("forjaSlotAval");
  const slotOrb = document.getElementById("forjaSlotOrb");
  const slotEscudo = document.getElementById("forjaSlotEscudo");

  if (
    !btnIniciarForja ||
    !forjaAulaWrap ||
    !forjaDropStage ||
    !forjaRevelacaoStage ||
    !forjaFeedback ||
    !btnForjarMvp ||
    !slotAval ||
    !slotOrb ||
    !slotEscudo
  ) {
    return;
  }

  const ordemForja = ["aval", "ampulheta", "bau"];

  const artefatosForja = {
    aval: {
      nome: "Aval de Aprovação",
      slot: slotAval,
      slotPai: slotAval.closest(".forja-slot"),
      sucesso:
        "O Selo do Valor foi aceso. Antes de construir, o time precisa saber qual valor será entregue.",
      dicaErro:
        "O primeiro receptáculo pede o Aval de Aprovação: ele representa valor validado, prioridade e alinhamento.",
    },

    ampulheta: {
      nome: "Orb Main Funcional",
      slot: slotOrb,
      slotPai: slotOrb.closest(".forja-slot"),
      sucesso:
        "O Núcleo do Incremento despertou. Agora existe uma entrega funcional que pode ser observada e melhorada.",
      dicaErro:
        "O segundo receptáculo pede o Orb Main Funcional: ele representa uma entrega funcionando, validável e pronta para gerar aprendizado.",
    },

    bau: {
      nome: "Escudo Mágico",
      slot: slotEscudo,
      slotPai: slotEscudo.closest(".forja-slot"),
      sucesso:
        "A Guarda da Qualidade foi erguida. O time protege o aprendizado, valida a solução e reduz novos impedimentos.",
      dicaErro:
        "O terceiro receptáculo pede o Escudo Mágico: ele representa proteção da entrega, qualidade e remoção de impedimentos.",
    },
  };

  function definirFeedbackForja(mensagem, tipo = "neutro") {
    forjaFeedback.className = "forja-feedback forja-feedback--epico";

    if (tipo === "erro") {
      forjaFeedback.classList.add("erro");
    }

    if (tipo === "sucesso") {
      forjaFeedback.classList.add("sucesso");
    }

    forjaFeedback.textContent = mensagem;
  }

  function contarArtefatosPosicionados() {
    return Object.values(estadoForja.slots).filter(Boolean).length;
  }

  function obterProximoArtefatoEsperado() {
    return ordemForja.find((artefato) => !estadoForja.slots[artefato]);
  }

  function criarMarcadorForja(nomeArtefato) {
    const marcador = document.createElement("div");

    marcador.className = "forja-slot-preenchido";
    marcador.textContent = nomeArtefato;

    return marcador;
  }

  function renderizarSlotForja(chaveArtefato) {
    const config = artefatosForja[chaveArtefato];

    if (!config) return;

    config.slot.innerHTML = "";

    if (!estadoForja.slots[chaveArtefato]) {
      config.slot.removeAttribute("aria-label");

      if (config.slotPai) {
        config.slotPai.classList.remove("forja-slot--concluido");
      }

      return;
    }

    const marcador = criarMarcadorForja(config.nome);

    config.slot.appendChild(marcador);
    config.slot.setAttribute(
      "aria-label",
      `Receptáculo preenchido com ${config.nome}`,
    );

    if (config.slotPai) {
      config.slotPai.classList.add("forja-slot--concluido");
      config.slotPai.classList.remove("forja-slot--proximo");
    }
  }

  function atualizarDestaqueProximoSlot() {
    const proximoArtefato = obterProximoArtefatoEsperado();

    ordemForja.forEach((chaveArtefato) => {
      const config = artefatosForja[chaveArtefato];

      if (!config?.slotPai) return;

      config.slotPai.classList.toggle(
        "forja-slot--proximo",
        chaveArtefato === proximoArtefato,
      );
    });
  }

  function atualizarInterfaceForja() {
    ordemForja.forEach((chaveArtefato) => {
      renderizarSlotForja(chaveArtefato);
    });

    atualizarDestaqueProximoSlot();

    const totalPreenchidos = contarArtefatosPosicionados();

    if (totalPreenchidos === 0) {
      definirFeedbackForja(
        "Arraste os artefatos transformados da mochila para os receptáculos da Forja.",
      );
    }

    if (totalPreenchidos > 0 && totalPreenchidos < 3) {
      const proximoArtefato = obterProximoArtefatoEsperado();
      const nomeProximo = artefatosForja[proximoArtefato]?.nome;

      definirFeedbackForja(
        `Artefatos posicionados: ${totalPreenchidos}/3. Próximo artefato esperado: ${nomeProximo}.`,
        "sucesso",
      );
    }

    if (totalPreenchidos === 3) {
      btnForjarMvp.classList.remove("hidden");

      definirFeedbackForja(
        "A Forja reconhece a sequência correta. O MVP pode ser criado.",
        "sucesso",
      );
    } else {
      btnForjarMvp.classList.add("hidden");
    }
  }

  function esconderArtefatoDaMochila(chaveArtefato) {
    const item = document.querySelector(
      `.mochila-item[data-artefato="${chaveArtefato}"]`,
    );

    if (!item) return;

    item.classList.add("hidden");
    item.classList.remove("destacado", "convocado", "is-over");
    item.removeAttribute("draggable");
  }

  function obterMensagemErroForja(artefatoArrastado, artefatoAceito) {
    const configAceito = artefatosForja[artefatoAceito];
    const configArrastado = artefatosForja[artefatoArrastado];

    if (!configArrastado) {
      return "Esse item não faz parte da montagem final do MVP. A Forja espera apenas os artefatos transformados da jornada.";
    }

    if (configAceito) {
      return configAceito.dicaErro;
    }

    return "A ordem da Forja importa. Observe qual receptáculo está pedindo cada artefato.";
  }

  function tentarPosicionarArtefato(artefatoArrastado, artefatoAceito) {
    const configAceito = artefatosForja[artefatoAceito];

    if (!configAceito) return;

    if (estadoForja.slots[artefatoAceito]) {
      definirFeedbackForja(
        "Esse receptáculo já foi aceso. Procure o próximo ponto da Forja.",
      );
      return;
    }

    const proximoArtefatoEsperado = obterProximoArtefatoEsperado();

    if (artefatoArrastado !== artefatoAceito) {
      definirFeedbackForja(
        obterMensagemErroForja(artefatoArrastado, artefatoAceito),
        "erro",
      );
      return;
    }

    if (artefatoArrastado !== proximoArtefatoEsperado) {
      const nomeEsperado = artefatosForja[proximoArtefatoEsperado]?.nome;

      definirFeedbackForja(
        `A Forja segue uma sequência. Antes deste artefato, posicione: ${nomeEsperado}.`,
        "erro",
      );
      return;
    }

    estadoForja.slots[artefatoAceito] = true;

    esconderArtefatoDaMochila(artefatoAceito);

    renderizarSlotForja(artefatoAceito);
    atualizarMochila();
    atualizarInterfaceForja();

    definirFeedbackForja(configAceito.sucesso, "sucesso");

    salvarEstadoCapitulo5Local();
  }

  btnIniciarForja.addEventListener("click", () => {
  forjaAulaWrap.classList.remove("hidden");
  forjaDropStage.classList.add("hidden");

  atualizarMochila();
  atualizarInterfaceForja();

  forjaAulaWrap.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

  document.addEventListener("dragstart", (event) => {
    const itemArrastavel = event.target.closest(
      ".mochila-item[draggable='true']",
    );

    if (!itemArrastavel) return;

    const artefato = itemArrastavel.dataset.artefato;

    if (!artefato) return;

    event.dataTransfer.setData("text/plain", artefato);
    event.dataTransfer.effectAllowed = "move";
  });

  Object.entries(artefatosForja).forEach(([artefatoAceito, config]) => {
    const slot = config.slot;

    slot.addEventListener("dragover", (event) => {
      event.preventDefault();
      slot.classList.add("is-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("is-over");
    });

    slot.addEventListener("drop", (event) => {
      event.preventDefault();

      slot.classList.remove("is-over");

      const artefatoArrastado = event.dataTransfer.getData("text/plain");

      tentarPosicionarArtefato(artefatoArrastado, artefatoAceito);
    });
  });

  btnForjarMvp.addEventListener("click", () => {
    const totalPreenchidos = contarArtefatosPosicionados();

    if (totalPreenchidos < 3) {
      definirFeedbackForja(
        "A Forja ainda não está completa. Acenda os três receptáculos antes de criar o MVP.",
        "erro",
      );
      return;
    }

    estadoForja.concluida = true;

    concluirEtapaCapitulo5("forja-mvp");
    atualizarMochila();
    atualizarMapaPonte();
    atualizarPreviewsPonte();

    forjaRevelacaoStage.classList.remove("hidden");

    const forjaRevealCopy = document.getElementById("forjaRevealCopy");

    if (forjaRevealCopy) {
      setTimeout(() => {
        forjaRevealCopy.classList.add("show");
      }, 250);
    }

    setTimeout(() => {
      animarAvancoNoMapa("porta-final", true);
    }, 900);

    salvarEstadoCapitulo5Local();
  });

  if (btnResetCapitulo5) {
    btnResetCapitulo5.addEventListener("click", resetarJornadaCapitulo5);
  }

  atualizarInterfaceForja();

  if (estadoForja.concluida) {
    forjaRevelacaoStage.classList.remove("hidden");

    const forjaRevealCopy = document.getElementById("forjaRevealCopy");

    if (forjaRevealCopy) {
      forjaRevealCopy.classList.add("show");
    }
  }
}

function obterIndiceEtapa(step) {
  if (step === "porta-final") return ETAPAS_CAPITULO_5.length;
  return ETAPAS_CAPITULO_5.indexOf(step);
}

function etapaEstaLiberada(step) {
  if (step === "duplo") return true;

  if (step === "porta-final") {
    return etapasConcluidas.has("forja-mvp") || estadoForja.concluida;
  }

  const indice = ETAPAS_CAPITULO_5.indexOf(step);
  if (indice <= 0) return true;

  const etapaAnterior = ETAPAS_CAPITULO_5[indice - 1];

  return etapasConcluidas.has(etapaAnterior);
}

function atualizarBridgeViews() {
  const progresso = Math.min(etapasConcluidas.size + 1, 5);

  document.querySelectorAll(".bridge-view").forEach((view) => {
    const numero = Number(view.dataset.bridgeView);
    view.classList.toggle("active", numero === progresso);
  });
}

function atualizarNavegacaoCapitulo5() {
  document.querySelectorAll(".progress-item").forEach((item) => {
    const step = item.dataset.step;
    if (!step) return;

    const liberada = etapaEstaLiberada(step);
    const ativa = etapaAtualCapitulo5 === step;
    const concluida = etapasConcluidas.has(step);

    item.disabled = !liberada;
    item.classList.toggle("locked", !liberada);
    item.classList.toggle("active", ativa);
    item.classList.toggle("concluida", concluida);
  });

  document.querySelectorAll(".ponte-node").forEach((node) => {
    const step = node.dataset.step;
    if (!step) return;

    const liberada = etapaEstaLiberada(step);
    const ativa = etapaAtualCapitulo5 === step;
    const concluida = etapasConcluidas.has(step);

    node.disabled = !liberada;
    node.classList.toggle("locked", !liberada);
    node.classList.toggle("active", ativa);
    node.classList.toggle("concluido", concluida);
  });

  atualizarBridgeViews();
}

function reiniciarSequenciaIntro(introCard) {
  if (!introCard) return;

  introCard.classList.remove("intro-sequencia-ativa");

  // Força o navegador a recalcular o estado sem a classe.
  // Isso permite reiniciar a animação quando clicamos no mesmo desafio.
  void introCard.offsetWidth;

  introCard.classList.add("intro-sequencia-ativa");
}

function ativarSequenciaIntroDoStage(stage) {
  if (!stage) return;

  const introCard = stage.querySelector(".intro-sequencia");
  reiniciarSequenciaIntro(introCard);
}

function configurarSequenciaIntroNoScroll() {
  const cards = document.querySelectorAll(".intro-sequencia");

  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;

        if (card.dataset.sequenciaVista === "true") return;

        reiniciarSequenciaIntro(card);
        card.dataset.sequenciaVista = "true";
      });
    },
    {
      threshold: 0.35,
    },
  );

  cards.forEach((card) => observer.observe(card));
}


function abrirStageCapitulo5(step) {
  const encontro = ENCONTROS_CAPITULO_5[step];
  if (!encontro) return;

  document.querySelectorAll(".encounter-stage").forEach((stage) => {
    stage.classList.add("hidden");
  });

  const stageAtivo = document.getElementById(encontro.stageId);
  if (!stageAtivo) return;

  stageAtivo.classList.remove("hidden");

  stageAtivo.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  setTimeout(() => {
    ativarSequenciaIntroDoStage(stageAtivo);
  }, 120);
}

function reiniciarTextoSopradoBug() {
  const bugIntroCard = document.getElementById("bugIntroCard");

  if (!bugIntroCard) return;

  bugIntroCard.classList.remove("sopro-ativo");

  // Força o navegador a recalcular o layout.
  // Isso permite que a animação rode de novo mesmo se já tiver rodado antes.
  void bugIntroCard.offsetWidth;

  bugIntroCard.classList.add("sopro-ativo");
}

function selecionarEtapaCapitulo5(step, abrirStage = false) {
  if (!etapaEstaLiberada(step)) return;

  etapaAtualCapitulo5 = step;
  atualizarNavegacaoCapitulo5();
  atualizarMochila();
  atualizarMapaPonte();
  atualizarPreviewsPonte();

  if (abrirStage) {
    abrirStageCapitulo5(step);
  }
}

function configurarNavegacaoCapitulo5() {
  document.querySelectorAll(".progress-item, .ponte-node").forEach((botao) => {
    botao.addEventListener("click", () => {
      const step = botao.dataset.step;
      if (!step) return;
      selecionarEtapaCapitulo5(step, true);
    });
  });

  const btnAbrirDesafioAtual = document.getElementById("btnAbrirDesafioAtual");
  if (btnAbrirDesafioAtual) {
    btnAbrirDesafioAtual.addEventListener("click", () => {
      abrirStageCapitulo5(etapaAtualCapitulo5);
    });
  }

  const btnEntrarNaPonte = document.getElementById("btnEntrarNaPonte");
  if (btnEntrarNaPonte) {
    btnEntrarNaPonte.addEventListener("click", () => {
      const capitulo5Page = document.getElementById("capitulo5Page");
      const mapa = document.getElementById("mapaPonte");

      if (capitulo5Page) {
        capitulo5Page.classList.remove("capitulo5-page--locked");
        capitulo5Page.classList.add("capitulo5-page--entered");
      }
      salvarEntradaCapitulo5();

      btnEntrarNaPonte.disabled = false;
      btnEntrarNaPonte.classList.add("concluida");
      btnEntrarNaPonte.classList.add("ativando");
      setTimeout(() => {
        if (mapa) {
          mapa.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setTimeout(() => {
  btnEntrarNaPonte.classList.remove("ativando");
}, 900);
        }
      }, 520);
    });
  }
}

function configurarMochila() {
  const btnMochila = document.getElementById("btnMochila");
  const mochilaPainel = document.getElementById("mochilaPainel");
  const mochilaCallout = document.getElementById("mochilaCallout");

  if (!btnMochila || !mochilaPainel) return;

  btnMochila.addEventListener("click", () => {
    const aberta = !mochilaPainel.classList.contains("hidden");

    mochilaPainel.classList.toggle("hidden", aberta);
    btnMochila.setAttribute("aria-expanded", String(!aberta));

    if (mochilaCallout && !aberta) {
      mochilaCallout.classList.add("hidden");
    }
  });
}

function atualizarMochila() {
  const backlog = document.querySelector('[data-artefato="backlog"]');
  const aval = document.querySelector('[data-artefato="aval"]');
  const medalhao = document.querySelector('[data-artefato="medalhao"]');
  const ampulheta = document.querySelector('[data-artefato="ampulheta"]');
  const bau = document.querySelector('[data-artefato="bau"]');

  const todos = [backlog, aval, medalhao, ampulheta, bau].filter(Boolean);

  const btnMochila = document.getElementById("btnMochila");
  const mochilaPainel = document.getElementById("mochilaPainel");

  todos.forEach((item) => {
    item.classList.remove("ativo", "destacado", "convocado", "flash-artefato");
    item.classList.remove("hidden");
  });

  if (btnMochila) {
    btnMochila.classList.remove("destacada-forja");
  }

  if (mochilaPainel && etapaAtualCapitulo5 !== "forja-mvp") {
    mochilaPainel.classList.add("hidden");
    if (btnMochila) btnMochila.setAttribute("aria-expanded", "false");
  }

  // Estado base
  if (backlog) {
    const img = backlog.querySelector("img");
    const tooltip = backlog.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/artefatos/product-backlog-icon.png";
      img.alt = "Product Backlog";
    }
    if (tooltip) {
      tooltip.textContent =
        "Product Backlog — organiza prioridades e orienta o que gera mais valor.";
    }
    backlog.classList.add("ativo");
  }

  if (aval) {
    const img = aval.querySelector("img");
    const tooltip = aval.querySelector(".mochila-item-tooltip");

    if (img) {
      img.src = "/assets/img/capitulo_5/aval-aprovacao-icon.png";
      img.alt = "Aval de Aprovação";
    }

    if (tooltip) {
      tooltip.textContent =
        "Aval de Aprovação — símbolo de que o valor foi compreendido e as expectativas foram alinhadas.";
    }

    aval.classList.add("hidden");
  }

  if (medalhao) {
    const img = medalhao.querySelector("img");
    const tooltip = medalhao.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/artefatos/medalhao-icon.png";
      img.alt = "Medalhão dos Papéis";
    }
    if (tooltip) {
      tooltip.textContent =
        "Medalhão dos Papéis — revela e organiza responsabilidades do time.";
    }
    medalhao.classList.add("ativo");
  }

  if (ampulheta) {
    const img = ampulheta.querySelector("img");
    const tooltip = ampulheta.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/artefatos/ampulheta-icon.png";
      img.alt = "Ampulheta da Sprint";
    }
    if (tooltip) {
      tooltip.textContent =
        "Ampulheta da Sprint — representa ciclos curtos, foco e adaptação.";
    }
    ampulheta.classList.add("ativo");
  }

  if (bau) {
    const img = bau.querySelector("img");
    const tooltip = bau.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/artefatos/bau-iteracao-icon.png";
      img.alt = "Baú da Iteração";
    }
    if (tooltip) {
      tooltip.textContent =
        "Baú da Iteração — guarda aprendizados e reforça a evolução contínua.";
    }
    bau.classList.add("ativo");
  }

  // Duplo concluído -> medalhão vira paladina
  if (etapasConcluidas.has("duplo") && medalhao) {
    medalhao.classList.add("hidden");
    medalhao.removeAttribute("draggable");
  }

  if (etapasConcluidas.has("stakeholder")) {
    if (backlog) {
      backlog.classList.add("hidden");
    }

    if (aval) {
      const img = aval.querySelector("img");
      const tooltip = aval.querySelector(".mochila-item-tooltip");

      aval.classList.remove("hidden");
      aval.classList.add("ativo");

      if (img) {
        img.src = "/assets/img/capitulo_5/aval-aprovacao-icon.png";
        img.alt = "Aval de Aprovação";
      }

      if (tooltip) {
        tooltip.textContent =
          "Aval de Aprovação — símbolo de que o valor foi compreendido e as expectativas foram alinhadas.";
      }
    }
  }

  // Necrobranch concluído -> a Dev Lendária cai com o medalhão; a ampulheta se transforma em Orb Main Funcional
  if (etapasConcluidas.has("necrobranch")) {
    if (medalhao) {
      medalhao.classList.add("hidden");
      medalhao.removeAttribute("draggable");
    }

    if (ampulheta) {
      const img = ampulheta.querySelector("img");
      const tooltip = ampulheta.querySelector(".mochila-item-tooltip");

      if (img) {
        img.src = "/assets/img/capitulo_5/orb-main-funcional-icon.png";
        img.alt = "Orb Main Funcional";
      }

      if (tooltip) {
        tooltip.textContent =
          "Orb Main Funcional — representa a recuperação do fluxo e da versão estável.";
      }
    }
  }

  // Bug concluído -> baú vira escudo mágico
  if (etapasConcluidas.has("bug-infernal") && bau) {
    const img = bau.querySelector("img");
    const tooltip = bau.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/capitulo_5/escudo-magico-icon.png";
      img.alt = "Escudo Mágico";
    }
    if (tooltip) {
      tooltip.textContent =
        "Escudo Mágico — símbolo de um incremento testado e protegido.";
    }
  }

  // Destaques por etapa
  const duploMedalhaoStage = document.getElementById("duploMedalhaoStage");

  if (
    etapaAtualCapitulo5 === "duplo" &&
    duploMedalhaoStage &&
    !duploMedalhaoStage.classList.contains("hidden") &&
    medalhao &&
    !etapasConcluidas.has("duplo")
  ) {
    medalhao.classList.add("convocado");
  }
 
  if (etapaAtualCapitulo5 === "forja-mvp") {
    if (btnMochila) {
  btnMochila.classList.add("destacada-forja");
  btnMochila.setAttribute("aria-expanded", "false");
}

if (mochilaPainel) {
  mochilaPainel.classList.add("hidden");
}

    if (backlog) backlog.classList.add("hidden");
    if (medalhao) medalhao.classList.add("hidden");

    if (aval) {
      aval.classList.remove("hidden");
      aval.classList.add("destacado");
      aval.setAttribute("draggable", estadoForja.slots.aval ? "false" : "true");
      if (estadoForja.slots.aval) aval.classList.add("hidden");
    }

    if (ampulheta) {
      const img = ampulheta.querySelector("img");
      const tooltip = ampulheta.querySelector(".mochila-item-tooltip");

      if (img) {
        img.src = "/assets/img/capitulo_5/orb-main-funcional-icon.png";
        img.alt = "Orb Main Funcional";
      }

      if (tooltip) {
        tooltip.textContent =
          "Orb Main Funcional — representa um incremento funcional e utilizável.";
      }

      ampulheta.classList.add("destacado");
      ampulheta.setAttribute(
        "draggable",
        estadoForja.slots.ampulheta ? "false" : "true",
      );
      if (estadoForja.slots.ampulheta) ampulheta.classList.add("hidden");
    }

    if (bau) {
      const img = bau.querySelector("img");
      const tooltip = bau.querySelector(".mochila-item-tooltip");

      if (img) {
        img.src = "/assets/img/capitulo_5/escudo-magico-icon.png";
        img.alt = "Escudo Mágico";
      }

      if (tooltip) {
        tooltip.textContent =
          "Escudo Mágico — protege a entrega e reforça sua confiabilidade.";
      }

      bau.classList.add("destacado");
      bau.setAttribute("draggable", estadoForja.slots.bau ? "false" : "true");
      if (estadoForja.slots.bau) bau.classList.add("hidden");
    }
  }

  // Após concluir a Forja -> só resta o MVP
  if (etapasConcluidas.has("forja-mvp")) {
    if (backlog) backlog.classList.add("hidden");
    if (medalhao) medalhao.classList.add("hidden");
    if (ampulheta) ampulheta.classList.add("hidden");

    if (bau) {
  bau.classList.remove("hidden", "ativo", "destacado", "convocado");
  bau.classList.add("destacado");

  bau.dataset.artefato = "chave-mvp";
  bau.setAttribute("draggable", "true");

  const img = bau.querySelector("img");
  const tooltip = bau.querySelector(".mochila-item-tooltip");

  if (img) {
    img.src = "/assets/img/capitulo_5/chave-mvp.png";
    img.alt = "Chave MVP";
  }

  if (tooltip) {
    tooltip.textContent =
      "Chave MVP — a menor versão funcional de uma entrega que já gera valor real e pode abrir a última porta.";
  }
}

   if (btnMochila) {
  btnMochila.classList.add("destacada-forja");
  btnMochila.setAttribute("aria-expanded", "false");
}

if (mochilaPainel) {
  mochilaPainel.classList.add("hidden");
}
  }
}

function atualizarMapaPonte() {
  const ponteImg = document.querySelector(".ponte-mapa-img");
  const nodeDuplo = document.querySelector(
    '.ponte-node[data-step="duplo"] img',
  );
  const nodeStakeholder = document.querySelector(
    '.ponte-node[data-step="stakeholder"] img',
  );
  const nodeForja = document.querySelector(
    '.ponte-node[data-step="forja-mvp"] img',
  );

  if (ponteImg) {
    const necrobranchAtivo =
      etapaAtualCapitulo5 === "necrobranch" &&
      !etapasConcluidas.has("necrobranch");

    ponteImg.src = necrobranchAtivo
      ? "/assets/img/capitulo_5/ponte-mapa-quebrada.png"
      : "/assets/img/capitulo_5/ponte-mapa.png";
  }

  if (nodeDuplo) {
    if (etapasConcluidas.has("duplo") && !etapasConcluidas.has("necrobranch")) {
      nodeDuplo.src = "/assets/img/capitulo_5/paladina-icon.png";
      nodeDuplo.alt = "Dev Lendária";
    } else if (etapasConcluidas.has("necrobranch")) {
      nodeDuplo.classList.add("sumido");
      nodeDuplo.alt = "";
    } else {
      nodeDuplo.src = "/assets/img/capitulo_5/duplo-icon.png";
      nodeDuplo.alt = "Duplo";
      nodeDuplo.classList.remove("sumido");
    }
  }

  if (nodeStakeholder) {
    if (etapasConcluidas.has("stakeholder")) {
      nodeStakeholder.src = "/assets/img/capitulo_5/stake-holder-icon.png";
      nodeStakeholder.alt = "Stakeholder Amigável";
    } else {
      nodeStakeholder.src =
        "/assets/img/capitulo_5/stake-holder-selvagem-icon.png";
      nodeStakeholder.alt = "Stakeholder Selvagem";
    }
  }

  if (nodeForja) {
    if (etapasConcluidas.has("forja-mvp")) {
      nodeForja.src = "/assets/img/capitulo_5/mvp-icon.png";
      nodeForja.alt = "MVP";
    } else {
      nodeForja.src = "/assets/img/capitulo_5/forja-icon.png";
      nodeForja.alt = "Forja do MVP";
    }
  }

  atualizarPosicaoJogador();
}

function configurarCliquePreviewsPonte() {
  const previews = document.querySelectorAll(".bridge-view");
  if (!previews.length) return;

  previews.forEach((preview) => {
    preview.addEventListener("click", () => {
      const step = preview.dataset.step;

      if (!step) return;
      if (preview.disabled) return;
      if (preview.classList.contains("is-locked")) return;
      if (!etapaEstaLiberada(step)) return;

      selecionarEtapaCapitulo5(step, true);
    });
  });
}

function atualizarPreviewsPonte() {
  const previews = document.querySelectorAll(".bridge-view");
  if (!previews.length) return;

  previews.forEach((preview) => {
    const step = preview.dataset.step;
    if (!step) return;

    const liberado = etapaEstaLiberada(step);
    const ativo = etapaAtualCapitulo5 === step;

    preview.classList.toggle("is-unlocked", liberado);
    preview.classList.toggle("is-locked", !liberado);
    preview.classList.toggle("active", ativo);

    preview.disabled = !liberado;
    preview.setAttribute("aria-disabled", String(!liberado));
  });
}

function configurarCliqueArtefatosMochila() {
  document.querySelectorAll(".mochila-item").forEach((item) => {
    item.addEventListener("click", () => {
      const artefato = item.dataset.artefato;

      if (artefato === "medalhao" && etapaAtualCapitulo5 === "duplo") {
        abrirStageCapitulo5("duplo");
      }

      if (artefato === "backlog" && etapaAtualCapitulo5 === "stakeholder") {
        abrirStageCapitulo5("stakeholder");
      }

      if (artefato === "ampulheta" && etapaAtualCapitulo5 === "necrobranch") {
        abrirStageCapitulo5("necrobranch");
      }

      if (artefato === "bau" && etapaAtualCapitulo5 === "bug-infernal") {
        abrirStageCapitulo5("bug-infernal");
      }
    });
  });
}

function destacarArtefatoTemporariamente(nomeArtefato) {
  if (!nomeArtefato) return;

  const item = document.querySelector(`[data-artefato="${nomeArtefato}"]`);
  if (!item) return;

  item.classList.remove("flash-artefato");
  void item.offsetWidth;
  item.classList.add("flash-artefato");
}

function atualizarPosicaoJogador() {
  const pontePlayer = document.getElementById("pontePlayer");
  if (!pontePlayer) return;

  pontePlayer.className = "ponte-player";

  const necrobranchQuebrada =
    etapaAtualCapitulo5 === "necrobranch" &&
    !etapasConcluidas.has("necrobranch");

  if (necrobranchQuebrada) {
    pontePlayer.classList.add("ponte-player--necrobranch-quebrada");
    return;
  }

  const mapaClasse = {
    duplo: "ponte-player--duplo",
    stakeholder: "ponte-player--stakeholder",
    necrobranch: "ponte-player--necrobranch",
    "bug-infernal": "ponte-player--bug-infernal",
    "forja-mvp": "ponte-player--forja-mvp",
    "porta-final": "ponte-player--porta-final",
  };

  const classeAtual = mapaClasse[etapaAtualCapitulo5] || "ponte-player--duplo";
  pontePlayer.classList.add(classeAtual);
}

const duploRolesData = {
  po: {
    titulo: "Product Owner Caótico",
    texto:
      "Na presença do Duplo, o Product Owner muda prioridades a cada conversa, aceita pedidos soltos e o time nunca sabe o que realmente precisa entregar. O que fazer?",
    opcoes: [
      {
        texto:
          "Organizar e priorizar o backlog com clareza, alinhando o que realmente gera valor.",
        correta: true,
      },
      {
        texto:
          "Aceitar todas as mudanças imediatamente para agradar todo mundo.",
        correta: false,
      },
      {
        texto:
          "Deixar o time decidir sozinho o que é prioridade sem alinhamento.",
        correta: false,
      },
    ],
  },

  sm: {
    titulo: "Falso Scrum Master",
    texto:
      "Diante do Duplo, o Scrum Master apenas observa a confusão crescer. Os papéis ficam nebulosos, os impedimentos não são tratados e o time perde o foco. O que fazer?",
    opcoes: [
      {
        texto:
          "Facilitar o alinhamento, reforçar os papéis e ajudar o time a remover a confusão.",
        correta: true,
      },
      {
        texto: "Tomar todas as decisões sozinho para acelerar o processo.",
        correta: false,
      },
      {
        texto:
          "Ignorar a situação porque cada integrante deve se virar sozinho.",
        correta: false,
      },
    ],
  },

  dev: {
    titulo: "Time Silencioso",
    texto:
      "Sob o efeito do Duplo, o time de desenvolvimento trabalha em silêncio, sem coordenação e sem clareza sobre responsabilidades. Cada um anda para um lado. O que fazer?",
    opcoes: [
      {
        texto:
          "Distribuir responsabilidades com clareza e colaborar em torno de um objetivo comum.",
        correta: true,
      },
      {
        texto:
          "Cada pessoa pega qualquer tarefa, mesmo sem alinhamento com o restante do grupo.",
        correta: false,
      },
      {
        texto:
          "Esperar que apenas o Product Owner resolva toda a organização do trabalho.",
        correta: false,
      },
    ],
  },
};

const duploRoleProgress = {
  po: false,
  sm: false,
  dev: false,
};

function renderizarRoleDuplo(
  roleKey,
  duploRoleTitulo,
  duploRoleTexto,
  duploRoleOpcoes,
  onAcerto,
) {
  const role = duploRolesData[roleKey];
  if (!role || !duploRoleTitulo || !duploRoleTexto || !duploRoleOpcoes) return;

  duploRoleTitulo.textContent = role.titulo;
  duploRoleTexto.textContent = role.texto;
  duploRoleOpcoes.innerHTML = "";

  role.opcoes.forEach((opcao) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "duplo-opcao-btn";
    btn.textContent = opcao.texto;

    btn.addEventListener("click", () => {
      duploRoleOpcoes.querySelectorAll(".duplo-opcao-btn").forEach((b) => {
        b.classList.remove("correta", "errada");
      });

      if (opcao.correta) {
        btn.classList.add("correta");
        if (typeof onAcerto === "function") {
          onAcerto(roleKey);
        }
      } else {
        btn.classList.add("errada");
      }
    });

    duploRoleOpcoes.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();
  restaurarEstadoCapitulo5Local();
  restaurarEntradaCapitulo5();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  await carregarEstadoHistoria();

  configurarRevealNoScroll();
  configurarSequenciaIntroNoScroll();
  configurarNavegacaoCapitulo5();

  configurarDesafioDuplo();
  configurarDropMedalhaoDuplo();
  configurarDesafioStakeholder();
  configurarDropBacklogStakeholder();
  configurarDesafioNecrobranch();
  configurarDesafioBugInfernal();
  configurarDropBugNoBau();
  configurarFornalhasDaForja();
  configurarForjaMvp();
  configurarMochila();
  atualizarMochila();
  configurarCliqueArtefatosMochila();
  configurarPortaFinal();
  configurarConclusaoHistoria();
  configurarEntradaDesafio();

  atualizarProgressoCapitulo();
  atualizarMapaPonte();
  configurarCliquePreviewsPonte();
  atualizarPreviewsPonte();

  document.querySelectorAll(".encounter-stage").forEach((stage) => {
    stage.classList.add("hidden");
  });

  const stageInicial = document.getElementById(
    ENCONTROS_CAPITULO_5[etapaAtualCapitulo5]?.stageId,
  );

  if (stageInicial) {
    stageInicial.classList.remove("hidden");
  }
});
