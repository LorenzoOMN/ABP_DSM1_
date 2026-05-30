const ID_MODULO = 5;

const ETAPAS_CAPITULO_5 = [
  "duplo",
  "stakeholder",
  "necrobranch",
  "bug-infernal",
  "forja-mvp",
];


const etapasConcluidas = new Set();

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

const IMPEDIMENTOS = {
  duplo: {
    titulo: "O Duplo",
    imagem: "/assets/img/capitulo_5/duplo-icon.png",
    descricao:
      "O Duplo surge quando uma única pessoa tenta carregar o trabalho de muitas. Ele copia tarefas, acumula responsabilidades e transforma o fluxo em confusão.",
    solucao:
      "Facilite uma conversa com o time, torne responsabilidades visíveis e redistribua o trabalho antes que uma pessoa vire gargalo.",
    aprendizado:
      "Um time saudável não depende de uma pessoa sobrecarregada. Transparência e colaboração reduzem gargalos.",
    opcoes: [
      { texto: "Redistribuir responsabilidades com o time", correta: true },
      { texto: "Clarificar papéis e responsabilidades", correta: true },
      { texto: "Quebrar tarefas grandes em partes menores", correta: true },
      { texto: "Colocar tudo nas mãos da pessoa mais rápida", correta: false },
      {
        texto: "Ignorar a sobrecarga porque a pessoa dá conta",
        correta: false,
      },
      {
        texto: "Adicionar mais tarefas sem revisar prioridades",
        correta: false,
      },
    ],
  },

  stakeholder: {
    titulo: "Stakeholder Selvagem",
    imagem: "/assets/img/capitulo_5/stake-holder-selvagem-icon.png",
    imagemResolvida: "/assets/img/capitulo_5/stake-holder-icon.png",
    descricao:
      "O Stakeholder Selvagem ruge quando não entende o que está sendo entregue. Sem alinhamento, expectativa e visibilidade, cada pedido vira ameaça.",
    solucao:
      "Mostre incrementos de valor, alinhe expectativas e registre decisões importantes para transformar ruído em colaboração.",
    aprendizado:
      "Stakeholders não são inimigos. Eles precisam de transparência, escuta e entregas frequentes de valor.",
    opcoes: [
      { texto: "Alinhar expectativas com clareza", correta: true },
      { texto: "Mostrar incrementos de valor", correta: true },
      { texto: "Registrar decisões e acordos importantes", correta: true },
      { texto: "Prometer tudo imediatamente", correta: false },
      { texto: "Ignorar o stakeholder até a entrega final", correta: false },
      {
        texto: "Mudar o backlog sem conversar com o Product Owner",
        correta: false,
      },
    ],
  },

  necrobranch: {
    titulo: "Necrobranch Commitada",
    imagem: "/assets/img/capitulo_5/necrobranch-icon-simples.png",
    descricao:
      "A Necrobranch nasce quando uma branch esquecida volta dos mortos. Commits confusos, conflitos ignorados e código sem revisão alimentam sua magia sombria.",
    solucao:
      "Verifique a branch, atualize com a base correta, resolva conflitos, teste e só então faça commits claros.",
    aprendizado:
      "Git também faz parte do fluxo. Branches organizadas reduzem retrabalho, conflitos e bugs inesperados.",
    opcoes: [
      { texto: "Verificar o status da branch antes de alterar", correta: true },
      { texto: "Atualizar a branch com a base correta", correta: true },
      {
        texto: "Resolver conflitos, testar e só então commitar",
        correta: true,
      },
      { texto: "Commmitar rápido para resolver depois", correta: false },
      {
        texto: "Ignorar conflitos se a tela aparentemente abriu",
        correta: false,
      },
      { texto: "Misturar várias correções sem mensagem clara", correta: false },
    ],
  },

  bug: {
    titulo: "Bug Infernal",
    imagem: "/assets/img/capitulo_5/bug-infernal-icon.png",
    descricao:
      "O Bug Infernal surge sem aviso e resiste a soluções apressadas. Quanto mais se chuta no escuro, mais forte ele fica.",
    solucao:
      "Reproduza o erro, leia os logs, isole a causa, teste a correção e peça ajuda ao time quando necessário.",
    aprendizado:
      "Nem todo bug se vence sozinho. Diagnóstico, testes e colaboração protegem o fluxo.",
    opcoes: [
      { texto: "Reproduzir o erro antes de corrigir", correta: true },
      { texto: "Isolar a causa do problema", correta: true },
      { texto: "Pedir ajuda ou parear com alguém do time", correta: true },
      { texto: "Alterar vários arquivos sem testar", correta: false },
      { texto: "Ignorar logs e mensagens de erro", correta: false },
      { texto: "Subir correção sem validar", correta: false },
    ],
  },
};
const impedimentosResolvidos = new Set();
const respostasImpedimentos = {};
let impedimentoAtual = null;

function obterToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

function configurarScrollParaBotoes() {
  document.querySelectorAll("[data-scroll-to]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const alvo = document.querySelector(botao.dataset.scrollTo);

      if (!alvo) return;

      const posicao = alvo.getBoundingClientRect().top + window.scrollY - 90;

      window.scrollTo({
        top: posicao,
        behavior: "smooth",
      });
    });
  });
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

function configurarProgressoVisual() {
  const secoes = document.querySelectorAll("[data-step]");
  const botoes = document.querySelectorAll(".capitulo5-nav-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = `#${entry.target.id}`;

        botoes.forEach((botao) => {
          botao.classList.toggle("active", botao.dataset.scrollTo === id);
        });
      });
    },
    {
      threshold: 0.42,
    },
  );

  secoes.forEach((secao) => observer.observe(secao));
}

function configurarInteracoesSimples() {
  document.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("ativo");
    });
  });

  const artefatosInfo = document.getElementById("artefatosInfo");
  const artefatos = document.querySelectorAll(".artefato-card");

  artefatos.forEach((card, index) => {
    const idArtefato = card.dataset.artefato || `artefato-${index + 1}`;

    card.dataset.artefato = idArtefato;

    card.addEventListener("click", () => {
      artefatos.forEach((item) => {
        item.classList.remove("ativo");
      });

      card.classList.add("ativo");
      card.classList.add("visualizado");

      artefatosVisualizados.add(idArtefato);

      if (artefatosInfo) {
        artefatosInfo.innerHTML = `
          <h3>${card.innerText.trim()}</h3>
          <p>${card.dataset.feedback}</p>
          <p class="artefatos-progresso">
            Artefatos reconhecidos: ${artefatosVisualizados.size}/${artefatos.length}
          </p>
        `;
      }

      if (artefatosVisualizados.size === artefatos.length) {
        concluirEtapaCapitulo5("artefatos");
      }
    });
  });
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

function renderizarOpcoesImpedimento(idImpedimento) {
  const impedimento = IMPEDIMENTOS[idImpedimento];
  const container = document.getElementById("impedimentoOpcoes");
  const feedback = document.getElementById("impedimentoFeedback");
  const desafio = document.getElementById("impedimentoDesafio");

  if (!container || !impedimento) return;

  const resolvido = impedimentosResolvidos.has(idImpedimento);

  if (!respostasImpedimentos[idImpedimento]) {
    respostasImpedimentos[idImpedimento] = new Set();
  }

  const respostasSalvas = respostasImpedimentos[idImpedimento];

  container.innerHTML = "";

  impedimento.opcoes.forEach((opcao, index) => {
    const label = document.createElement("label");
    label.className = "impedimento-opcao";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = String(index);
    input.disabled = resolvido;

    if (resolvido && opcao.correta) {
      input.checked = true;
      label.classList.add("selecionada");
    } else if (respostasSalvas.has(index)) {
      input.checked = true;
      label.classList.add("selecionada");
    }

    input.addEventListener("change", () => {
      if (input.checked) {
        respostasSalvas.add(index);
      } else {
        respostasSalvas.delete(index);
      }

      label.classList.toggle("selecionada", input.checked);
    });

    const span = document.createElement("span");
    span.textContent = opcao.texto;

    label.appendChild(input);
    label.appendChild(span);

    container.appendChild(label);
  });

  if (feedback) {
    feedback.textContent = resolvido
      ? "Impedimento resolvido. Solução e aprendizado desbloqueados."
      : "";

    feedback.className = resolvido
      ? "impedimento-feedback sucesso"
      : "impedimento-feedback";
  }

  if (desafio) {
    desafio.classList.toggle("resolvido", resolvido);
  }
}

function abrirModalImpedimento(idImpedimento) {
  const impedimento = IMPEDIMENTOS[idImpedimento];

  if (!impedimento) return;

  impedimentoAtual = idImpedimento;

  const modal = document.getElementById("impedimentoModal");
  const imagem = document.getElementById("impedimentoImagem");
  const titulo = document.getElementById("impedimentoTitulo");
  const descricao = document.getElementById("impedimentoDescricao");
  const solucao = document.getElementById("impedimentoSolucao");
  const aprendizado = document.getElementById("impedimentoAprendizado");
  const btnResolver = document.getElementById("btnResolverImpedimento");

  const resolvido = impedimentosResolvidos.has(idImpedimento);

  if (imagem) {
    imagem.src =
      resolvido && impedimento.imagemResolvida
        ? impedimento.imagemResolvida
        : impedimento.imagem;

    imagem.alt = impedimento.titulo;
  }

  if (titulo) titulo.textContent = impedimento.titulo;
  if (descricao) descricao.textContent = impedimento.descricao;
  if (solucao) {
    solucao.textContent = resolvido
      ? impedimento.solucao
      : "Resolva o mini desafio para desbloquear a solução.";
  }

  if (aprendizado) {
    aprendizado.textContent = resolvido
      ? impedimento.aprendizado
      : "Resolva o mini desafio para desbloquear o aprendizado.";
  }

  if (btnResolver) {
    btnResolver.disabled = resolvido;
    btnResolver.classList.toggle("resolvido", resolvido);
    btnResolver.textContent = resolvido
      ? "Impedimento resolvido"
      : "Resolver impedimento";
  }

  renderizarOpcoesImpedimento(idImpedimento);
  atualizarTabsBloqueadasImpedimento(resolvido);

  ativarTabImpedimento("descricao");

  if (modal) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }
}

function fecharModalImpedimento() {
  const modal = document.getElementById("impedimentoModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  impedimentoAtual = null;
}

function atualizarTabsBloqueadasImpedimento(resolvido) {
  document.querySelectorAll(".impedimento-tab").forEach((tab) => {
    const nomeTab = tab.dataset.tab;
    const bloqueada = !resolvido && nomeTab !== "descricao";

    tab.classList.toggle("bloqueada", bloqueada);
    tab.disabled = bloqueada;
  });
}

function ativarTabImpedimento(nomeTab) {
  document.querySelectorAll(".impedimento-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === nomeTab);
  });

  document.querySelectorAll(".impedimento-tab-conteudo").forEach((conteudo) => {
    conteudo.classList.remove("active");
  });

  const mapaTabs = {
    descricao: "tabDescricao",
    solucao: "tabSolucao",
    aprendizado: "tabAprendizado",
  };

  const conteudoAtivo = document.getElementById(mapaTabs[nomeTab]);

  if (conteudoAtivo) {
    conteudoAtivo.classList.add("active");
  }
}

function atualizarStatusImpedimentos() {
  const status = document.getElementById("impedimentosStatus");
  const total = Object.keys(IMPEDIMENTOS).length;
  const resolvidos = impedimentosResolvidos.size;

  document.querySelectorAll(".impedimento-criatura").forEach((botao) => {
    const id = botao.dataset.impedimento;
    const resolvido = impedimentosResolvidos.has(id);

    botao.classList.toggle("resolvido", resolvido);

    const img = botao.querySelector("img");
    const dados = IMPEDIMENTOS[id];

    if (img && dados?.imagemResolvida) {
      img.src = resolvido ? dados.imagemResolvida : dados.imagem;
    }
  });

  if (status) {
    status.classList.toggle("concluido", resolvidos === total);

    status.textContent =
      resolvidos === total
        ? "Todos os impedimentos foram resolvidos. O caminho da ponte está livre."
        : `Impedimentos resolvidos: ${resolvidos}/${total}.`;
  }
  if (resolvidos === total && total > 0) {
    concluirEtapaCapitulo5("impedimentos");
  }
}

function resolverImpedimentoAtual() {
  if (!impedimentoAtual) return;

  const impedimento = IMPEDIMENTOS[impedimentoAtual];
  const feedback = document.getElementById("impedimentoFeedback");

  if (!impedimento) return;

  const selecionadas = Array.from(
    respostasImpedimentos[impedimentoAtual] || [],
  );

  const corretas = impedimento.opcoes
    .map((opcao, index) => (opcao.correta ? index : null))
    .filter((index) => index !== null);

  const acertouQuantidade = selecionadas.length === corretas.length;

  const acertouTodas =
    acertouQuantidade &&
    corretas.every((index) => selecionadas.includes(index));

  if (!acertouTodas) {
    if (feedback) {
      feedback.textContent =
        "A criatura resiste. Escolha exatamente as 3 ações que melhor removem este impedimento.";
      feedback.className = "impedimento-feedback erro";
    }

    return;
  }

  impedimentosResolvidos.add(impedimentoAtual);

  if (feedback) {
    feedback.textContent =
      "Impedimento resolvido. Solução e aprendizado desbloqueados.";
    feedback.className = "impedimento-feedback sucesso";
  }

  atualizarStatusImpedimentos();

  abrirModalImpedimento(impedimentoAtual);
}

function configurarMiniGameImpedimentos() {
  document.querySelectorAll(".impedimento-criatura").forEach((botao) => {
    botao.addEventListener("click", () => {
      abrirModalImpedimento(botao.dataset.impedimento);
    });
  });

  document.querySelectorAll("[data-fechar-impedimento]").forEach((elemento) => {
    elemento.addEventListener("click", fecharModalImpedimento);
  });

  document.querySelectorAll(".impedimento-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      ativarTabImpedimento(tab.dataset.tab);
    });
  });

  const btnResolver = document.getElementById("btnResolverImpedimento");

  if (btnResolver) {
    btnResolver.addEventListener("click", resolverImpedimentoAtual);
  }

  atualizarStatusImpedimentos();
}

function atualizarProgressoCapitulo() {
  const totalConcluidas = etapasConcluidas.size;
  const totalEtapas = ETAPAS_CAPITULO_5.length;

  document.querySelectorAll(".capitulo5-progresso-texto").forEach((elemento) => {
    elemento.textContent = `${totalConcluidas} / ${totalEtapas}`;
  });

  document.querySelectorAll(".capitulo5-nav-item").forEach((botao) => {
    const destino = botao.dataset.scrollTo?.replace("#", "");

    if (!destino) return;

    botao.classList.toggle("concluida", etapasConcluidas.has(destino));
  });

  const portaBloqueada = document.getElementById("portaBloqueada");
  const btnConcluir = document.getElementById("btnConcluirHistoria");

  const todasConcluidas = totalConcluidas === totalEtapas;

  if (portaBloqueada) {
    portaBloqueada.classList.toggle("liberada", todasConcluidas);

    portaBloqueada.textContent = todasConcluidas
  ? "O MVP foi forjado. A porta reconhece que o time está pronto para o desafio final."
  : `A porta ainda observa sua jornada. Resolva os obstáculos e forje o MVP. Progresso: ${totalConcluidas}/${totalEtapas}.`;
  }

  if (btnConcluir) {
    btnConcluir.classList.toggle("hidden", !todasConcluidas);
  }
}

function concluirEtapaCapitulo5(nomeEtapa) {
  if (!ETAPAS_CAPITULO_5.includes(nomeEtapa)) return;

  etapasConcluidas.add(nomeEtapa);

  const secao = document.querySelector(`[data-step="${nomeEtapa}"]`);
  const botao = document.querySelector(`[data-complete-step="${nomeEtapa}"]`);

  if (secao) {
    secao.classList.add("etapa-concluida");
  }

  if (botao) {
    botao.classList.add("concluida");
    botao.disabled = true;
    botao.textContent = "Etapa concluída";
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

function configurarConclusaoDasEtapas() {
  document.querySelectorAll("[data-complete-step]").forEach((botao) => {
    botao.addEventListener("click", () => {
      concluirEtapaCapitulo5(botao.dataset.completeStep);
    });
  });

  atualizarProgressoCapitulo();
}

function inserirIndicadorProgresso() {
  const sidebar = document.querySelector(".capitulo5-sidebar");

  if (!sidebar) return;

  const indicadorExistente = sidebar.querySelector(".capitulo5-progresso-texto");

  if (indicadorExistente) return;

  const indicador = document.createElement("div");
  indicador.className = "capitulo5-progresso-texto";
  indicador.textContent = `0 / ${ETAPAS_CAPITULO_5.length}`;

  sidebar.appendChild(indicador);
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();

  inserirIndicadorProgresso();

  await carregarEstadoHistoria();

  configurarScrollParaBotoes();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarInteracoesSimples();
  configurarDesafioDuplo();
  configurarDesafioStakeholder();
  configurarMiniGameImpedimentos();
  configurarConclusaoDasEtapas();
  configurarConclusaoHistoria();
  configurarEntradaDesafio();
});
