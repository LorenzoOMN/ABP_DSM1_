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
    descricao:
      "Vocês começam a andar sobre a ponte e, de repente, tudo parece ficar mais escuro. Sombras surgem por toda parte. A distância da porta aumenta. Algo impede o caminho.",
    artefato: "Medalhão dos Papéis",
    imagem: "/assets/img/capitulo_5/encontro-duplo.png",
    imagemAlt: "Encontro com o Duplo na ponte",
  },

  stakeholder: {
    stageId: "encounter-stakeholder",
    titulo: "Stakeholder Selvagem",
    descricao:
      "A travessia continua, mas vozes começam a ecoar da escuridão. Exigências, mudanças e pedidos impossíveis se acumulam no ar. O caminho à frente se contorce com o ruído.",
    artefato: "Product Backlog",
    imagem: "/assets/img/capitulo_5/carta_stakeholder-selvagem.png",
    imagemAlt: "Carta do encontro Stakeholder Selvagem",
  },

  necrobranch: {
    stageId: "encounter-necrobranch",
    titulo: "Necrobranch Commitada",
    descricao:
      "Mais adiante, a ponte range sob os pés do grupo. Estruturas antigas surgem entre as pedras, como se algo esquecido tentasse voltar e tomar o caminho para si.",
    artefato: "Ampulheta da Sprint",
    imagem: "/assets/img/capitulo_5/carta-necrobranch-commitada.png",
    imagemAlt: "Carta do encontro Necrobranch Commitada",
  },

  "bug-infernal": {
    stageId: "encounter-bug",
    titulo: "Bug Infernal",
    descricao:
      "Um zumbido incômodo cresce na escuridão. A travessia vacila, falhas se acumulam ao redor e cada passo parece acionar um novo erro no caminho.",
    artefato: "Baú da Melhoria",
    imagem: "/assets/img/capitulo_5/carta-bug-infernal.png",
    imagemAlt: "Carta do encontro Bug Infernal",
  },

  "forja-mvp": {
    stageId: "encounter-forja",
    titulo: "A Forja do MVP",
    descricao:
      "Depois dos impedimentos, a travessia leva o grupo a um ponto de decisão. Tudo o que foi conquistado precisa agora ser unido com clareza para que a jornada faça sentido.",
    artefato: "MVP",
    imagem: "/assets/img/capitulo_5/base-artefato-bau.png",
    imagemAlt: "Forja do MVP",
  },

  "porta-final": {
    stageId: "encounter-porta",
    titulo: "A Porta Final",
    descricao:
      "A grande porta observa a jornada. Só avança quem concluiu os encontros, forjou o MVP e compreendeu o fluxo.",
    artefato: "Travessia Final",
    imagem: "/assets/img/capitulo_1/icones/porta.png",
    imagemAlt: "A Porta Final",
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

const MAPA_RESPOSTA_ARTEFATO = {
  "medalhao-papeis": "medalhao",
  "aval-aprovacao": "backlog",
  "main-funcional": "ampulheta",
  "ampulheta-quebrada": "ampulheta",
  "escudo-magico": "bau",
};

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
  atualizarMochila();
  atualizarMapaPonte();
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
    btnResolver.textContent = "Duplo enfraquecido";

    const duploCena = document.getElementById("duploCena");
    const btnMedalhaoDuplo = document.getElementById("btnMedalhaoDuplo");

    if (duploCena) {
      duploCena.src = "/assets/img/capitulo_5/batalha-duplo.png";
      duploCena.alt = "O Duplo enfraquecido após a batalha";
    }

    if (btnMedalhaoDuplo) {
      btnMedalhaoDuplo.classList.remove("hidden");
    }
    atualizarMochila();
  });
}

function configurarTransformacaoDuplo() {
  const btnMedalhaoDuplo = document.getElementById("btnMedalhaoDuplo");
  const duploCena = document.getElementById("duploCena");

  if (!btnMedalhaoDuplo || !duploCena) return;

  btnMedalhaoDuplo.addEventListener("click", () => {
    duploCena.src = "/assets/img/capitulo_5/paladina-lendaria.png";
    duploCena.alt = "A Paladina Lendária libertada da maldição";

    btnMedalhaoDuplo.disabled = true;
    btnMedalhaoDuplo.classList.add("concluida");
    btnMedalhaoDuplo.textContent = "Paladina libertada";

    const itemDuplo = document.querySelector(
      '.progress-item[data-step="duplo"] img',
    );
    if (itemDuplo) {
      itemDuplo.src = "/assets/img/capitulo_5/paladina-icon.png";
      itemDuplo.alt = "Paladina Lendária";
    }

    const ponteNodeDuplo = document.querySelector(
      '.ponte-node[data-step="duplo"] img',
    );
    if (ponteNodeDuplo) {
      ponteNodeDuplo.src = "/assets/img/capitulo_5/paladina-icon.png";
      ponteNodeDuplo.alt = "Paladina Lendária";
    }

    const encontroImagem = document.getElementById("encontroImagem");
    if (encontroImagem && etapaAtualCapitulo5 === "duplo") {
      encontroImagem.src = "/assets/img/capitulo_5/paladina-lendaria.png";
      encontroImagem.alt = "Paladina Lendária";
    }

    const feedback = document.getElementById("duploFeedback");
    if (feedback) {
      feedback.textContent =
        "A maldição foi quebrada. O Duplo revela sua verdadeira forma: uma Paladina Lendária que agora jura sua espada à causa do time.";
      feedback.className = "duplo-feedback sucesso";
    }
    atualizarMochila();
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

      const artefatoRelacionado = MAPA_RESPOSTA_ARTEFATO[resposta];
      destacarArtefatoTemporariamente(artefatoRelacionado);

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
  const encontroArte = document.querySelector(".encontro-arte");

  if (titulo) titulo.textContent = encontro.titulo;
  if (descricao) descricao.textContent = encontro.descricao;
  if (artefato) artefato.textContent = encontro.artefato;

  if (imagem) {
    imagem.src = encontro.imagem;
    imagem.alt = encontro.imagemAlt || encontro.titulo;
  }

  if (encontroArte) {
    encontroArte.classList.toggle(
      "encontro-arte--card",
      Boolean(encontro.imagem && encontro.imagem.includes("carta")),
    );
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
  atualizarMochila();
  atualizarMapaPonte();

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

      btnEntrarNaPonte.disabled = true;
      btnEntrarNaPonte.classList.add("concluida");
      btnEntrarNaPonte.classList.add("ativando");
      setTimeout(() => {
        if (mapa) {
          mapa.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 220);
    });
  }
}

function configurarMochila() {
  const btnMochila = document.getElementById("btnMochila");
  const mochilaPainel = document.getElementById("mochilaPainel");

  if (!btnMochila || !mochilaPainel) return;

  btnMochila.addEventListener("click", () => {
    const aberta = !mochilaPainel.classList.contains("hidden");

    mochilaPainel.classList.toggle("hidden", aberta);
    btnMochila.setAttribute("aria-expanded", String(!aberta));
  });
}

function atualizarMochila() {
  const backlog = document.querySelector('[data-artefato="backlog"]');
  const medalhao = document.querySelector('[data-artefato="medalhao"]');
  const ampulheta = document.querySelector('[data-artefato="ampulheta"]');
  const bau = document.querySelector('[data-artefato="bau"]');

  const todos = [backlog, medalhao, ampulheta, bau].filter(Boolean);

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
      img.src = "/assets/img/artefatos/bau-da-iteracao-icon.png";
      img.alt = "Baú da Iteração";
    }
    if (tooltip) {
      tooltip.textContent =
        "Baú da Iteração — guarda aprendizados e reforça a evolução contínua.";
    }
    bau.classList.add("ativo");
  }

  // Duplo concluído -> medalhão vira paladina
  if (
    etapasConcluidas.has("duplo") &&
    !etapasConcluidas.has("necrobranch") &&
    medalhao
  ) {
    medalhao.classList.add("hidden");
  }

  // Stakeholder concluído -> backlog vira stakeholder amigável
  if (etapasConcluidas.has("stakeholder") && backlog) {
    const img = backlog.querySelector("img");
    const tooltip = backlog.querySelector(".mochila-item-tooltip");
    if (img) {
      img.src = "/assets/img/capitulo_5/aval-aprovacao-icon.png";
      img.alt = "Documentação assinada";
    }
    if (tooltip) {
      tooltip.textContent =
        "Stakeholder — agora alinhado com o time e com as prioridades assinou o documento autorizando a produção do produto, apresente-o na forja.";
    }
  }

  // Necrobranch concluído -> paladina some e medalhão volta; ampulheta se quebra; surge orb main funcional
  if (etapasConcluidas.has("necrobranch")) {
    if (medalhao) {
      const img = medalhao.querySelector("img");
      const tooltip = medalhao.querySelector(".mochila-item-tooltip");
      if (img) {
        img.src = "/assets/img/artefatos/medalhao-icon.png";
        img.alt = "Medalhão dos Papéis";
      }
      if (tooltip) {
        tooltip.textContent =
          "Medalhão dos Papéis — retornou à mochila após o sacrifício da Dev Lendária.";
      }
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
  const btnMedalhaoDuplo = document.getElementById("btnMedalhaoDuplo");

  if (
    etapaAtualCapitulo5 === "duplo" &&
    btnMedalhaoDuplo &&
    !btnMedalhaoDuplo.classList.contains("hidden") &&
    medalhao &&
    !etapasConcluidas.has("duplo")
  ) {
    medalhao.classList.remove("destacado");
    medalhao.classList.add("convocado");
  } else if (etapaAtualCapitulo5 === "duplo" && medalhao) {
    medalhao.classList.add("destacado");
  }

  if (etapaAtualCapitulo5 === "stakeholder" && backlog) {
    backlog.classList.add("destacado");
  }

  if (etapaAtualCapitulo5 === "necrobranch" && ampulheta) {
    ampulheta.classList.add("destacado");
  }

  if (etapaAtualCapitulo5 === "bug-infernal" && bau) {
    bau.classList.add("destacado");
  }

  // Forja -> só ficam 4 artefatos finais
  if (etapaAtualCapitulo5 === "forja-mvp") {
    if (btnMochila) {
      btnMochila.classList.add("destacada-forja");
      btnMochila.setAttribute("aria-expanded", "true");
    }

    if (mochilaPainel) {
      mochilaPainel.classList.remove("hidden");
    }

    // backlog vira aval
    if (backlog) {
      const img = backlog.querySelector("img");
      const tooltip = backlog.querySelector(".mochila-item-tooltip");
      if (img) {
        img.src = "/assets/img/capitulo_5/aval-icon.png";
        img.alt = "Aval de Aprovação";
      }
      if (tooltip) {
        tooltip.textContent =
          "Aval de Aprovação — valida que a entrega faz sentido para quem recebe valor.";
      }
      backlog.classList.add("destacado");
    }

    // medalhão permanece
    if (medalhao) {
      const tooltip = medalhao.querySelector(".mochila-item-tooltip");
      if (tooltip) {
        tooltip.textContent =
          "Medalhão dos Papéis — mantém clareza de papéis e responsabilidades.";
      }
      medalhao.classList.add("destacado");
    }

    // ampulheta sai de cena quebrada -> slot mostra orb main funcional
    if (ampulheta) {
      const img = ampulheta.querySelector("img");
      const tooltip = ampulheta.querySelector(".mochila-item-tooltip");
      if (img) {
        img.src = "/assets/img/capitulo_5/orb-main-funcional-icon.png";
        img.alt = "Orb Main Funcional";
      }
      if (tooltip) {
        tooltip.textContent =
          "Orb Main Funcional — representa um incremento utilizável e estável.";
      }
      ampulheta.classList.add("destacado");
    }

    // baú vira escudo
    if (bau) {
      const img = bau.querySelector("img");
      const tooltip = bau.querySelector(".mochila-item-tooltip");
      if (img) {
        img.src = "/assets/img/capitulo_5/escudo-magico-icon.png";
        img.alt = "Escudo Mágico";
      }
      if (tooltip) {
        tooltip.textContent =
          "Escudo Mágico — garante confiança e qualidade no que será entregue.";
      }
      bau.classList.add("destacado");
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

      const img = bau.querySelector("img");
      const tooltip = bau.querySelector(".mochila-item-tooltip");

      if (img) {
        img.src = "/assets/img/capitulo_5/mvp-icon.png";
        img.alt = "MVP";
      }

      if (tooltip) {
        tooltip.textContent =
          "MVP — a menor versão funcional de uma entrega que já gera valor real e pode ser validada.";
      }
    }

    if (btnMochila) {
      btnMochila.classList.add("destacada-forja");
      btnMochila.setAttribute("aria-expanded", "true");
    }

    if (mochilaPainel) {
      mochilaPainel.classList.remove("hidden");
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
      nodeStakeholder.src =
        "/assets/img/capitulo_5/stakeholder-amigavel-icon.png";
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
    titulo: "Product Owner",
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
          "Aceitar todas as mudanças imediatamente para mostrar flexibilidade.",
        correta: false,
      },
      {
        texto:
          "Deixar cada desenvolvedor decidir sozinho o que é prioridade.",
        correta: false,
      },
    ],
  },

  sm: {
    titulo: "Scrum Master",
    texto:
      "Diante do Duplo, o Scrum Master deixa os conflitos crescerem, não esclarece o processo e o time começa a se confundir ainda mais sobre como trabalhar junto. O que fazer?",
    opcoes: [
      {
        texto:
          "Facilitar o alinhamento do time, reforçar papéis e ajudar o grupo a remover a confusão.",
        correta: true,
      },
      {
        texto:
          "Assumir todas as decisões sozinho para ganhar velocidade.",
        correta: false,
      },
      {
        texto:
          "Ignorar a confusão porque o time deve se resolver sem apoio.",
        correta: false,
      },
    ],
  },

  dev: {
    titulo: "Dev Team",
    texto:
      "Sob a influência do Duplo, o Dev Team começa a misturar responsabilidades, duplicar esforço e trabalhar sem coordenação. Ninguém sabe exatamente quem faz o quê. O que fazer?",
    opcoes: [
      {
        texto:
          "Distribuir responsabilidades com clareza e colaborar com foco em um objetivo comum.",
        correta: true,
      },
      {
        texto:
          "Cada pessoa escolhe qualquer tarefa, mesmo sem alinhamento com o restante do time.",
        correta: false,
      },
      {
        texto:
          "Esperar o Product Owner resolver sozinho toda a organização interna do desenvolvimento.",
        correta: false,
      },
    ],
  },
};

function renderizarRoleDuplo(roleKey, duploRoleTitulo, duploRoleTexto, duploRoleOpcoes) {
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
    btn.dataset.correct = opcao.correta ? "true" : "false";

    btn.addEventListener("click", () => {
      duploRoleOpcoes.querySelectorAll(".duplo-opcao-btn").forEach((b) => {
        b.classList.remove("correta", "errada");
      });

      if (btn.dataset.correct === "true") {
        btn.classList.add("correta");
      } else {
        btn.classList.add("errada");
      }
    });

    duploRoleOpcoes.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();

  await carregarEstadoHistoria();

  configurarRevealNoScroll();
  configurarNavegacaoCapitulo5();

  configurarDesafioDuplo();
  configurarDesafioStakeholder();
  configurarDesafioNecrobranch();
  configurarDesafioBugInfernal();
  configurarForjaMvp();
  configurarTransformacaoDuplo();
  configurarMochila();
  atualizarMochila();
  configurarCliqueArtefatosMochila();

  const btnMostrarDesafioDuplo = document.getElementById("btnMostrarDesafioDuplo");
const duploDesafioWrap = document.getElementById("duploDesafioWrap");
const duploRoleCards = document.querySelectorAll(".duplo-role-card");
const duploRoleTitulo = document.getElementById("duploRoleTitulo");
const duploRoleTexto = document.getElementById("duploRoleTexto");
const duploRoleOpcoes = document.getElementById("duploRoleOpcoes");

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
        duploRoleOpcoes
      );
    });
  });

  renderizarRoleDuplo(
    "po",
    duploRoleTitulo,
    duploRoleTexto,
    duploRoleOpcoes
  );
}

  configurarConclusaoHistoria();
  configurarEntradaDesafio();

  atualizarCardEncontroAtual(etapaAtualCapitulo5);
  atualizarProgressoCapitulo();
  atualizarMapaPonte();
  abrirStageCapitulo5(etapaAtualCapitulo5);

  
});
