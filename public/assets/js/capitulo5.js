const ID_MODULO = 5;

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
  },
};

const impedimentosResolvidos = new Set();
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

  document.querySelectorAll(".artefato-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".artefato-card").forEach((item) => {
        item.classList.remove("ativo");
      });

      card.classList.add("ativo");

      if (artefatosInfo) {
        artefatosInfo.innerHTML = `
          <h3>${card.innerText.trim()}</h3>
          <p>${card.dataset.feedback}</p>
        `;
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
    imagem.src = resolvido && impedimento.imagemResolvida
      ? impedimento.imagemResolvida
      : impedimento.imagem;

    imagem.alt = impedimento.titulo;
  }

  if (titulo) titulo.textContent = impedimento.titulo;
  if (descricao) descricao.textContent = impedimento.descricao;
  if (solucao) solucao.textContent = impedimento.solucao;
  if (aprendizado) aprendizado.textContent = impedimento.aprendizado;

  if (btnResolver) {
    btnResolver.disabled = resolvido;
    btnResolver.classList.toggle("resolvido", resolvido);
    btnResolver.textContent = resolvido
      ? "Impedimento resolvido"
      : "Resolver impedimento";
  }

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
}

function resolverImpedimentoAtual() {
  if (!impedimentoAtual) return;

  impedimentosResolvidos.add(impedimentoAtual);

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

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();

  await carregarEstadoHistoria();

  configurarScrollParaBotoes();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarInteracoesSimples();
  configurarMiniGameImpedimentos();
  configurarConclusaoHistoria();
  configurarEntradaDesafio();
  
});