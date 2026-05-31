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
  duplo: {
    stageId: "encounter-duplo",
    titulo: "O Duplo",
    descricao: "Uma sombra que imita seus passos e desafia suas decisões.",
    artefato: "Medalhão dos Papéis",
    imagem: "/assets/img/capitulo_5/duplo-icon.png",
  },
  stakeholder: {
    stageId: "encounter-stakeholder",
    titulo: "Stakeholder Selvagem",
    descricao: "Vozes exigem mudanças e ameaçam quebrar o foco da travessia.",
    artefato: "Product Backlog",
    imagem: "/assets/img/capitulo_5/stake-holder-selvagem-icon.png",
  },
  necrobranch: {
    stageId: "encounter-necrobranch",
    titulo: "Necrobranch Commitada",
    descricao: "Uma branch instável retorna das sombras e ameaça a Main Funcional.",
    artefato: "Ampulheta da Sprint",
    imagem: "/assets/img/capitulo_5/necrobranch-icon-simples.png",
  },
  "bug-infernal": {
    stageId: "encounter-bug",
    titulo: "Bug Infernal",
    descricao: "Uma falha viva distorce a entrega e exige investigação antes da correção.",
    artefato: "Baú da Melhoria",
    imagem: "/assets/img/capitulo_5/bug-infernal-icon.png",
  },
  "forja-mvp": {
    stageId: "encounter-forja",
    titulo: "A Forja do MVP",
    descricao: "Os artefatos conquistados precisam se unir para formar a entrega final.",
    artefato: "MVP",
    imagem: "/assets/img/capitulo_5/base-artefato-bau.png",
  },
  "porta-final": {
    stageId: "encounter-porta",
    titulo: "A Porta Final",
    descricao: "A última porta aguarda aquele que entende o fluxo.",
    artefato: "Travessia Final",
    imagem: "/assets/img/capitulo_1/icones/porta.png",
  },
};

let etapaAtualCapitulo5 = "duplo";

const RESPOSTAS_DUPLO = {
  "po-caotico": "priorizar-backlog",
  "time-silencioso": "expor-impedimentos",
  "falso-scrum-master": "facilitar-autonomia",
};

const respostasDuplo = {};

const RESPOSTAS_STAKEHOLDER = {
  "pedido-confuso": "entender-necessidade",
  "mudanca-sprint": "avaliar-impacto",
  feedback: "adaptar-backlog",
  acordo: "formalizar-aval",
};

const respostasStakeholder = {};

const RESPOSTAS_NECROBRANCH = {
  "branch-desconhecida": "inspecionar-estado",
  "quadro-valor": "priorizar-impacto",
  "main-risco": "proteger-main",
  "integracao-final": "testar-integrar",
};

const respostasNecrobranch = {};

const RESPOSTAS_BUG = {
  "comportamento-esperado": "definir-esperado",
  "comportamento-atual": "registrar-atual",
  reproducao: "definir-passos",
  validacao: "validar-correcao",
};

const respostasBug = {};

const RESPOSTAS_FORJA = {
  "time-alinhado": "medalhao-papeis",
  "valor-validado": "aval-aprovacao",
  "incremento-funcionando": "main-funcional",
  "ciclo-encerrado": "ampulheta-quebrada",
  "produto-testado": "escudo-magico",
};

const respostasForja = {};

const impedimentosResolvidos = new Set();
const respostasImpedimentos = {};


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
  const totalConcluidas = etapasConcluidas.size;
  const totalEtapas = ETAPAS_CAPITULO_5.length;

  const indicador = document.querySelector(".capitulo5-progresso-texto");
  if (indicador) {
    indicador.textContent = `${totalConcluidas} / ${totalEtapas}`;
  }

  const portaBloqueada = document.getElementById("portaBloqueada");
  const btnConcluirHistoria = document.getElementById("btnConcluirHistoria");

  const todasConcluidas = totalConcluidas === totalEtapas;

  if (portaBloqueada) {
    portaBloqueada.textContent = todasConcluidas
      ? "O MVP foi forjado. A porta reconhece que o time está pronto para o desafio final."
      : `A porta ainda observa sua jornada. Resolva os obstáculos e forje o MVP. Progresso: ${totalConcluidas}/${totalEtapas}.`;

    portaBloqueada.classList.toggle("liberada", todasConcluidas);
  }

  if (btnConcluirHistoria) {
    btnConcluirHistoria.classList.toggle("hidden", !todasConcluidas);
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
    atualizarCardEncontroAtual(proximaEtapa);
  }

  atualizarProgressoCapitulo();
}

function configurarDesafioDuplo() {
  const botoesOpcao = document.querySelectorAll(".duplo-opcao");
  const btnResolver = document.getElementById("btnResolverDuplo");
  const feedback = document.getElementById("duploFeedback");
  const desafio = document.getElementById("duploDesafio");

  if (!botoesOpcao.length || !btnResolver) return;

  botoesOpcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cenario = botao.dataset.cenario;
      const resposta = botao.dataset.resposta;

      if (!cenario || !resposta) return;

      respostasDuplo[cenario] = resposta;

      document
        .querySelectorAll(`.duplo-opcao[data-cenario="${cenario}"]`)
        .forEach((opcao) => {
          opcao.classList.remove("ativo");
        });

      botao.classList.add("ativo");

      const totalRespondidas = Object.keys(respostasDuplo).length;
      const totalCenarios = Object.keys(RESPOSTAS_DUPLO).length;

      if (feedback) {
        feedback.textContent = `Memórias analisadas: ${totalRespondidas}/${totalCenarios}.`;
        feedback.className = "duplo-feedback";
      }
    });
  });

  btnResolver.addEventListener("click", () => {
    const cenarios = Object.keys(RESPOSTAS_DUPLO);
    const respondeuTudo = cenarios.every((cenario) => respostasDuplo[cenario]);

    if (!respondeuTudo) {
      if (feedback) {
        feedback.textContent =
          "O Duplo ainda se multiplica. Analise todas as memórias antes de usar o Medalhão.";
        feedback.className = "duplo-feedback erro";
      }

      return;
    }

    const acertouTudo = cenarios.every(
      (cenario) => respostasDuplo[cenario] === RESPOSTAS_DUPLO[cenario],
    );

    if (!acertouTudo) {
      if (feedback) {
        feedback.textContent =
          "A maldição resiste. Algumas escolhas ainda reforçam o Anti-Time. Revise as atitudes do Scrum Master.";
        feedback.className = "duplo-feedback erro";
      }

      return;
    }

    if (feedback) {
      feedback.textContent =
        "O Medalhão brilha. O Duplo perde sua forma sombria e se revela como um Dev Lendário perdido.";
      feedback.className = "duplo-feedback sucesso";
    }

    if (desafio) {
      desafio.classList.add("resolvido");
    }

    botoesOpcao.forEach((botao) => {
      botao.disabled = true;

      const cenario = botao.dataset.cenario;
      const respostaCorreta = RESPOSTAS_DUPLO[cenario];

      if (botao.dataset.resposta === respostaCorreta) {
        botao.classList.add("correta");
      }
    });

    btnResolver.disabled = true;
    btnResolver.classList.add("concluida");
    btnResolver.textContent = "Dev Lendário libertado";

    concluirEtapaCapitulo5("duplo");
  });
}

function configurarDesafioStakeholder() {
  const botoesOpcao = document.querySelectorAll(".stakeholder-opcao");
  const btnResolver = document.getElementById("btnResolverStakeholder");
  const feedback = document.getElementById("stakeholderFeedback");
  const desafio = document.getElementById("stakeholderDesafio");

  if (!botoesOpcao.length || !btnResolver) return;

  botoesOpcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cenario = botao.dataset.cenario;
      const resposta = botao.dataset.resposta;

      if (!cenario || !resposta) return;

      respostasStakeholder[cenario] = resposta;

      document
        .querySelectorAll(`.stakeholder-opcao[data-cenario="${cenario}"]`)
        .forEach((opcao) => {
          opcao.classList.remove("ativo");
        });

      botao.classList.add("ativo");

      const totalRespondidas = Object.keys(respostasStakeholder).length;
      const totalCenarios = Object.keys(RESPOSTAS_STAKEHOLDER).length;

      if (feedback) {
        feedback.textContent = `Caminhos alinhados: ${totalRespondidas}/${totalCenarios}.`;
        feedback.className = "stakeholder-feedback";
      }
    });
  });

  btnResolver.addEventListener("click", () => {
    const cenarios = Object.keys(RESPOSTAS_STAKEHOLDER);
    const respondeuTudo = cenarios.every(
      (cenario) => respostasStakeholder[cenario],
    );

    if (!respondeuTudo) {
      if (feedback) {
        feedback.textContent =
          "As vozes ainda estão confusas. Percorra todos os caminhos antes de entregar o Backlog.";
        feedback.className = "stakeholder-feedback erro";
      }

      return;
    }

    const acertouTudo = cenarios.every(
      (cenario) =>
        respostasStakeholder[cenario] === RESPOSTAS_STAKEHOLDER[cenario],
    );

    if (!acertouTudo) {
      if (feedback) {
        feedback.textContent =
          "O Stakeholder Selvagem ainda resiste. Algumas escolhas criam mais ruído do que alinhamento.";
        feedback.className = "stakeholder-feedback erro";
      }

      return;
    }

    if (feedback) {
      feedback.textContent =
        "O Backlog brilha. As vozes se organizam, o Stakeholder se acalma e entrega o Aval de Aprovação.";
      feedback.className = "stakeholder-feedback sucesso";
    }

    if (desafio) {
      desafio.classList.add("resolvido");
    }

    botoesOpcao.forEach((botao) => {
      botao.disabled = true;

      const cenario = botao.dataset.cenario;
      const respostaCorreta = RESPOSTAS_STAKEHOLDER[cenario];

      if (botao.dataset.resposta === respostaCorreta) {
        botao.classList.add("correta");
      }
    });

    btnResolver.disabled = true;
    btnResolver.classList.add("concluida");
    btnResolver.textContent = "Aval de Aprovação obtido";

    concluirEtapaCapitulo5("stakeholder");
  });
}

function configurarDesafioNecrobranch() {
  const botoesOpcao = document.querySelectorAll(".necrobranch-opcao");
  const btnResolver = document.getElementById("btnResolverNecrobranch");
  const feedback = document.getElementById("necrobranchFeedback");
  const desafio = document.getElementById("necrobranchDesafio");

  if (!botoesOpcao.length || !btnResolver) return;

  botoesOpcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cenario = botao.dataset.cenario;
      const resposta = botao.dataset.resposta;

      if (!cenario || !resposta) return;

      respostasNecrobranch[cenario] = resposta;

      document
        .querySelectorAll(`.necrobranch-opcao[data-cenario="${cenario}"]`)
        .forEach((opcao) => {
          opcao.classList.remove("ativo");
        });

      botao.classList.add("ativo");

      const totalRespondidas = Object.keys(respostasNecrobranch).length;
      const totalCenarios = Object.keys(RESPOSTAS_NECROBRANCH).length;

      if (feedback) {
        feedback.textContent = `Raízes estabilizadas: ${totalRespondidas}/${totalCenarios}.`;
        feedback.className = "necrobranch-feedback";
      }
    });
  });

  btnResolver.addEventListener("click", () => {
    const cenarios = Object.keys(RESPOSTAS_NECROBRANCH);
    const respondeuTudo = cenarios.every(
      (cenario) => respostasNecrobranch[cenario],
    );

    if (!respondeuTudo) {
      if (feedback) {
        feedback.textContent =
          "A Necrobranch ainda está instável. Analise todas as raízes antes de girar a Ampulheta.";
        feedback.className = "necrobranch-feedback erro";
      }

      return;
    }

    const acertouTudo = cenarios.every(
      (cenario) =>
        respostasNecrobranch[cenario] === RESPOSTAS_NECROBRANCH[cenario],
    );

    if (!acertouTudo) {
      if (feedback) {
        feedback.textContent =
          "A Necrobranch reage violentamente. Algumas escolhas aumentam risco, retrabalho ou instabilidade.";
        feedback.className = "necrobranch-feedback erro";
      }

      return;
    }

    if (feedback) {
      feedback.textContent =
        "A Ampulheta gira. O tempo da Sprint se dobra por um instante, a Main Funcional é recuperada e o Dev Lendário segura a Necrobranch até desaparecer na luz.";
      feedback.className = "necrobranch-feedback sucesso";
    }

    if (desafio) {
      desafio.classList.add("resolvido");
    }

    botoesOpcao.forEach((botao) => {
      botao.disabled = true;

      const cenario = botao.dataset.cenario;
      const respostaCorreta = RESPOSTAS_NECROBRANCH[cenario];

      if (botao.dataset.resposta === respostaCorreta) {
        botao.classList.add("correta");
      }
    });

    btnResolver.disabled = true;
    btnResolver.classList.add("concluida");
    btnResolver.textContent = "Main Funcional recuperada";

    concluirEtapaCapitulo5("necrobranch");
  });
}

function configurarDesafioBugInfernal() {
  const botoesOpcao = document.querySelectorAll(".bug-opcao");
  const btnResolver = document.getElementById("btnResolverBug");
  const feedback = document.getElementById("bugFeedback");
  const desafio = document.getElementById("bugDesafio");

  if (!botoesOpcao.length || !btnResolver) return;

  botoesOpcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cenario = botao.dataset.cenario;
      const resposta = botao.dataset.resposta;

      if (!cenario || !resposta) return;

      respostasBug[cenario] = resposta;

      document
        .querySelectorAll(`.bug-opcao[data-cenario="${cenario}"]`)
        .forEach((opcao) => {
          opcao.classList.remove("ativo");
        });

      botao.classList.add("ativo");

      const totalRespondidas = Object.keys(respostasBug).length;
      const totalCenarios = Object.keys(RESPOSTAS_BUG).length;

      if (feedback) {
        feedback.textContent = `Rastros investigados: ${totalRespondidas}/${totalCenarios}.`;
        feedback.className = "bug-feedback";
      }
    });
  });

  btnResolver.addEventListener("click", () => {
    const cenarios = Object.keys(RESPOSTAS_BUG);
    const respondeuTudo = cenarios.every((cenario) => respostasBug[cenario]);

    if (!respondeuTudo) {
      if (feedback) {
        feedback.textContent =
          "O Bug Infernal ainda escapa. Investigue todos os rastros antes de usar o Baú.";
        feedback.className = "bug-feedback erro";
      }

      return;
    }

    const acertouTudo = cenarios.every(
      (cenario) => respostasBug[cenario] === RESPOSTAS_BUG[cenario],
    );

    if (!acertouTudo) {
      if (feedback) {
        feedback.textContent =
          "O Bug Infernal se fortalece. Algumas escolhas pulam investigação, teste ou validação.";
        feedback.className = "bug-feedback erro";
      }

      return;
    }

    if (feedback) {
      feedback.textContent =
        "O Baú da Melhoria se abre. O bug é isolado, validado e aprisionado. O baú se transforma em um Escudo Mágico.";
      feedback.className = "bug-feedback sucesso";
    }

    if (desafio) {
      desafio.classList.add("resolvido");
    }

    botoesOpcao.forEach((botao) => {
      botao.disabled = true;

      const cenario = botao.dataset.cenario;
      const respostaCorreta = RESPOSTAS_BUG[cenario];

      if (botao.dataset.resposta === respostaCorreta) {
        botao.classList.add("correta");
      }
    });

    btnResolver.disabled = true;
    btnResolver.classList.add("concluida");
    btnResolver.textContent = "Escudo Mágico obtido";

    concluirEtapaCapitulo5("bug-infernal");
  });
}

function configurarForjaMvp() {
  const botoesOpcao = document.querySelectorAll(".forja-opcao");
  const btnForjar = document.getElementById("btnForjarMvp");
  const feedback = document.getElementById("forjaFeedback");
  const desafio = document.getElementById("forjaDesafio");

  if (!botoesOpcao.length || !btnForjar) return;

  botoesOpcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cenario = botao.dataset.cenario;
      const resposta = botao.dataset.resposta;

      if (!cenario || !resposta) return;

      respostasForja[cenario] = resposta;

      document
        .querySelectorAll(`.forja-opcao[data-cenario="${cenario}"]`)
        .forEach((opcao) => {
          opcao.classList.remove("ativo");
        });

      botao.classList.add("ativo");

      const totalRespondidas = Object.keys(respostasForja).length;
      const totalCenarios = Object.keys(RESPOSTAS_FORJA).length;

      if (feedback) {
        feedback.textContent = `Artefatos posicionados: ${totalRespondidas}/${totalCenarios}.`;
        feedback.className = "forja-feedback";
      }
    });
  });

  btnForjar.addEventListener("click", () => {
    const cenarios = Object.keys(RESPOSTAS_FORJA);
    const respondeuTudo = cenarios.every((cenario) => respostasForja[cenario]);

    if (!respondeuTudo) {
      if (feedback) {
        feedback.textContent =
          "A forja ainda não responde. Posicione todos os artefatos antes de tentar criar o MVP.";
        feedback.className = "forja-feedback erro";
      }

      return;
    }

    const acertouTudo = cenarios.every(
      (cenario) => respostasForja[cenario] === RESPOSTAS_FORJA[cenario],
    );

    if (!acertouTudo) {
      if (feedback) {
        feedback.textContent =
          "Os artefatos vibram fora de ordem. Revise o que cada item representa para uma entrega ágil.";
        feedback.className = "forja-feedback erro";
      }

      return;
    }

    if (feedback) {
      feedback.textContent =
        "A forja desperta. Os artefatos se unem e formam o MVP, uma entrega mínima, funcional, validada e testada.";
      feedback.className = "forja-feedback sucesso";
    }

    if (desafio) {
      desafio.classList.add("resolvido");
    }

    botoesOpcao.forEach((botao) => {
      botao.disabled = true;

      const cenario = botao.dataset.cenario;
      const respostaCorreta = RESPOSTAS_FORJA[cenario];

      if (botao.dataset.resposta === respostaCorreta) {
        botao.classList.add("correta");
      }
    });

    btnForjar.disabled = true;
    btnForjar.classList.add("concluida");
    btnForjar.textContent = "MVP Forjado";

    concluirEtapaCapitulo5("forja-mvp");
  });
}

function inserirIndicadorProgresso() {
  const wrap = document.querySelector(".chapter-progress-wrap");
  if (!wrap) return;

  let indicador = wrap.querySelector(".capitulo5-progresso-texto");

  if (!indicador) {
    indicador = document.createElement("div");
    indicador.className = "capitulo5-progresso-texto";
    wrap.appendChild(indicador);
  }

  indicador.textContent = `0 / ${ETAPAS_CAPITULO_5.length}`;
}


function obterIndiceEtapa(step) {
  if (step === "porta-final") return ETAPAS_CAPITULO_5.length;
  return ETAPAS_CAPITULO_5.indexOf(step);
}

function etapaEstaLiberada(step) {
  if (step === "duplo") return true;

  if (step === "porta-final") {
    return ETAPAS_CAPITULO_5.every((etapa) => etapasConcluidas.has(etapa));
  }

  const indice = ETAPAS_CAPITULO_5.indexOf(step);
  if (indice <= 0) return true;

  const etapaAnterior = ETAPAS_CAPITULO_5[indice - 1];
  return etapasConcluidas.has(etapaAnterior);
}

function atualizarCardEncontroAtual(step) {
  const encontro = ENCONTROS_CAPITULO_5[step];
  if (!encontro) return;

  const titulo = document.getElementById("encontroTitulo");
  const descricao = document.getElementById("encontroDescricao");
  const artefato = document.getElementById("encontroArtefato");
  const imagem = document.getElementById("encontroImagem");

  if (titulo) titulo.textContent = encontro.titulo;
  if (descricao) descricao.textContent = encontro.descricao;
  if (artefato) artefato.textContent = encontro.artefato;

  if (imagem) {
    imagem.src = encontro.imagem;
    imagem.alt = encontro.titulo;
  }
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

function abrirStageCapitulo5(step) {
  const encontro = ENCONTROS_CAPITULO_5[step];
  if (!encontro) return;

  document.querySelectorAll(".encounter-stage").forEach((stage) => {
    stage.classList.add("hidden");
  });

  const stageAtivo = document.getElementById(encontro.stageId);
  if (!stageAtivo) return;

  stageAtivo.classList.remove("hidden");
  stageAtivo.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selecionarEtapaCapitulo5(step, abrirStage = false) {
  if (!etapaEstaLiberada(step)) return;

  etapaAtualCapitulo5 = step;
  atualizarCardEncontroAtual(step);
  atualizarNavegacaoCapitulo5();

  if (abrirStage) {
    abrirStageCapitulo5(step);
  }
}

function configurarNavegacaoCapitulo5() {
  document.querySelectorAll("[data-open-stage]").forEach((botao) => {
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
      const mapa = document.querySelector(".ponte-layout");
      if (mapa) {
        mapa.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();

  inserirIndicadorProgresso();

  await carregarEstadoHistoria();

 configurarRevealNoScroll();
  configurarNavegacaoCapitulo5();

  configurarDesafioDuplo();
  configurarDesafioStakeholder();
  configurarDesafioNecrobranch();
  configurarDesafioBugInfernal();
  configurarForjaMvp();

  configurarConclusaoHistoria();
  configurarEntradaDesafio();

  atualizarCardEncontroAtual(etapaAtualCapitulo5);
  atualizarProgressoCapitulo();
});
