(function () {
  // ============================================================================
  // CONSTANTES
  // ============================================================================

  const DURACAO_TIMER_SEGUNDOS = 20 * 60;
  const RESPOSTA_PULADA = "x";

  // Mapeamento dos bosses por número do questionário
  const BOSSES = {
    1: {
      nome: "Documentação Confusa",
      imagem: "/assets/img/boss_questionario1.png",
    },
    2: {
      nome: "Golem da Confusão de Papéis",
      imagem: "/assets/img/capitulo_2/inimigos/boss_questionario2.png",
    },
    3: {
      nome: "Névoa da Improvisação",
      imagem: "/assets/img/capitulo_3/inimigos/boss_questionario3.png",
    },
    4: {
      nome: "Colosso do Escopo Selvagem",
      imagem: "/assets/img/capitulo_4/inimigos/boss_questionario4.png",
    },
    5: {
      nome: "Guardião do Fluxo Perpétuo",
      imagem: "/assets/img/capitulo_5/inimigos/boss_questionario5.png",
    },
  };

  // ============================================================================
  // ELEMENTOS DO DOM
  // ============================================================================

  const bossHPFill = document.getElementById("boss-hp-fill");
  const bossHPTexto = document.getElementById("boss-hp-texto");
  const bossImagem = document.getElementById("bossImagem");
  const bossNomeEl = document.getElementById("boss-nome");
  const pageTitleEl = document.getElementById("page-title");

  const botoesResposta = Array.from(
    document.querySelectorAll(".botaoresposta"),
  );

  const barra = document.getElementById("progresso-dinamico");
  const barraContainer = document.querySelector(".barra-container");

  const textoProgresso = document.getElementById("texto-progresso");
  const textoDificuldade = document.getElementById("texto-dificuldade");
  const enunciadoQuestao = document.getElementById("enunciado-questao");

  const imagemContainer = document.getElementById("imagem-questao-container");

  const botaoConfirmar = document.querySelector(".confirmar");

  const timerEl = document.getElementById("timer-questao");

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  let fila = [];
  let indiceAtual = 0;

  let respostas = {};
  let confirmadas = {};
  let acertos = {};

  let timerInterval = null;
  let segundosRestantes = DURACAO_TIMER_SEGUNDOS;

  let exameId = null;
  let questionarioNumero = 1;

  let questionarioEncerrado = false;

  // ============================================================================
  // DETECÇÃO DO QUESTIONÁRIO
  // ============================================================================

  function detectarNumeroQuestionario() {
    // Método 1: Verificar query param 'modulo' (ex: ?modulo=2)
    const urlParams = new URLSearchParams(window.location.search);
    const moduloParam = urlParams.get("modulo");
    if (moduloParam) {
      return parseInt(moduloParam, 10);
    }

    // Método 2: Verificar query param 'q' (ex: ?q=2)
    const qParam = urlParams.get("q");
    if (qParam) {
      return parseInt(qParam, 10);
    }

    // Método 3: Verificar data attribute no body
    const bodyNumero = document.body.dataset.questionarioNumero;
    if (bodyNumero) {
      return parseInt(bodyNumero, 10);
    }

    // Método 4: Verificar URL path (ex: /questionario/2, /questionario2)
    const path = window.location.pathname;
    const match = path.match(/questionario[-_]?(\d+)/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    // Método 5: Verificar pelo nome do script carregado
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      const src = script.src || "";
      const match = src.match(/questionario[-_]?(\d+)\.js/i);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }

    // Padrão: questionário 1
    return 1;
  }

  // ============================================================================
  // TOKEN
  // ============================================================================

  function obterToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return null;
    }

    return token;
  }

  // ============================================================================
  // VIDA BOSS
  // ============================================================================

  function atualizarVidaBoss() {
    if (!fila.length) return;

    const totalAcertos = Object.values(acertos).filter(Boolean).length;

    const porcentagem = Math.max(0, 100 - (totalAcertos / fila.length) * 100);

    if (bossHPFill) {
      bossHPFill.style.width = `${porcentagem}%`;

      bossHPFill.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-2px)" },
          { transform: "translateX(2px)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 180,
        },
      );
    }

    if (bossHPTexto) {
      bossHPTexto.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  // ============================================================================
  // TIMER
  // ============================================================================

  function chaveTimer() {
    return exameId ? `timer_exame_${exameId}` : null;
  }

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");

    const s = (segundos % 60).toString().padStart(2, "0");

    return `${m}:${s}`;
  }

  function atualizarTimerDOM() {
    if (!timerEl) return;

    timerEl.textContent = formatarTempo(segundosRestantes);

    timerEl.classList.remove("timer-aviso", "timer-critico");

    if (segundosRestantes <= 60) {
      timerEl.classList.add("timer-critico");
    } else if (segundosRestantes <= 300) {
      timerEl.classList.add("timer-aviso");
    }
  }

  function salvarTimerLocal() {
    const chave = chaveTimer();

    if (!chave) return;

    localStorage.setItem(chave, String(Date.now() + segundosRestantes * 1000));
  }

  function carregarTimerLocal() {
    const chave = chaveTimer();

    if (!chave) return;

    const expira = parseInt(localStorage.getItem(chave) || "0", 10);

    if (!expira) return;

    const restante = Math.floor((expira - Date.now()) / 1000);

    if (restante > 0 && restante <= DURACAO_TIMER_SEGUNDOS) {
      segundosRestantes = restante;
    } else if (restante <= 0) {
      segundosRestantes = 0;
    }
  }

  function iniciarTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    carregarTimerLocal();
    salvarTimerLocal();
    atualizarTimerDOM();

    if (segundosRestantes <= 0) {
      encerrarPorTimer();
      return;
    }

    timerInterval = setInterval(function () {
      segundosRestantes = Math.max(0, segundosRestantes - 1);

      salvarTimerLocal();
      atualizarTimerDOM();

      if (segundosRestantes === 0) {
        clearInterval(timerInterval);
        encerrarPorTimer();
      }
    }, 1000);
  }

  function pararTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const chave = chaveTimer();

    if (chave) {
      localStorage.removeItem(chave);
    }
  }

  async function encerrarPorTimer() {
    if (questionarioEncerrado) return;

    questionarioEncerrado = true;

    pararTimer();

    if (timerEl) {
      timerEl.textContent = "00:00";
      timerEl.classList.add("timer-critico");
    }

    desabilitarTudo();

    mostrarAlerta("Tempo esgotado! Enviando respostas pendentes...", "info");

    await enviarPendentesComoX();

    window.location.href = "/resultado";
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  function questaoAtual() {
    return fila[indiceAtual] || null;
  }

  function totalQuestoes() {
    return fila.length;
  }

  // ============================================================================
  // BARRA DE PROGRESSO
  // ============================================================================

  function atualizarPercentual() {
    const n = indiceAtual + 1;
    const total = totalQuestoes() || 10;

    let percentual;

    if (total <= 1) {
      percentual = 90;
    } else if (n > total) {
      percentual = 100;
    } else if (n === total) {
      percentual = 90;
    } else {
      percentual = Math.round(((n - 1) / (total - 1)) * 90);
    }

    percentual = Math.max(0, Math.min(100, percentual || 0));

    if (barra) {
      barra.style.width = `${percentual}%`;
    }

    if (barraContainer) {
      barraContainer.setAttribute("aria-valuenow", String(percentual));
    }
  }

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  function preencherAlternativa(letra, texto) {
    const botao = document.querySelector(
      `.botaoresposta[data-alternativa="${letra}"]`,
    );

    const span = botao?.querySelector(".resposta");

    if (span) {
      span.textContent = texto || "";
    }
  }

  function renderizarImagem(questao) {
    if (!imagemContainer) return;

    imagemContainer.innerHTML = "";

    if (!questao.imagem) return;

    const nome = String(questao.imagem).split("/").pop();

    imagemContainer.innerHTML = `
      <img
        src="/assets/img/questoes/${nome}"
        alt="Imagem relacionada à questão"
        class="questao-imagem"
      >
    `;
  }

  function restaurarSelecao(idQuestao) {
    const salva = respostas[idQuestao];

    botoesResposta.forEach(function (botao) {
      botao.classList.remove("is-selected");
      botao.setAttribute("aria-pressed", "false");

      const marcado =
        salva &&
        salva !== RESPOSTA_PULADA &&
        botao.dataset.alternativa === salva;

      if (marcado) {
        botao.classList.add("is-selected");
        botao.setAttribute("aria-pressed", "true");
      }
    });
  }

  function renderizarQuestao() {
    const q = questaoAtual();

    if (!q) return;

    if (textoProgresso) {
      textoProgresso.textContent = `Questão ${indiceAtual + 1} de ${totalQuestoes()}`;
    }

    if (textoDificuldade) {
      textoDificuldade.textContent = q.dificuldade || "--";
    }

    if (enunciadoQuestao) {
      enunciadoQuestao.textContent = q.enunciado || "Pergunta indisponível";
    }

    renderizarImagem(q);

    preencherAlternativa("a", q.alternativa_a);
    preencherAlternativa("b", q.alternativa_b);
    preencherAlternativa("c", q.alternativa_c);
    preencherAlternativa("d", q.alternativa_d);

    restaurarSelecao(q.id_questao);

    atualizarPercentual();

    habilitarRespostas();
    if (botaoConfirmar) {
      botaoConfirmar.textContent = "Confirmar Resposta";
      botaoConfirmar.disabled = false;
    }
  }

  // ============================================================================
  // SELEÇÃO
  // ============================================================================

  function selecionarAlternativa(botaoSelecionado) {
    const q = questaoAtual();

    if (!q) return;

    respostas[q.id_questao] = botaoSelecionado.dataset.alternativa;

    botoesResposta.forEach(function (botao) {
      const marcado = botao === botaoSelecionado;

      botao.classList.toggle("is-selected", marcado);

      botao.setAttribute("aria-pressed", marcado ? "true" : "false");
    });
  }

  function habilitarRespostas() {
    botoesResposta.forEach(function (b) {
      b.disabled = false;
    });
  }

  function desabilitarRespostas() {
    botoesResposta.forEach(function (b) {
      b.disabled = true;
    });
  }

  function desabilitarTudo() {
    desabilitarRespostas();

    if (botaoConfirmar) {
      botaoConfirmar.disabled = true;
    }
  }

  // ============================================================================
  // FEEDBACK DE DANO
  // ============================================================================

  function mostrarDano(valor) {
    const area = document.getElementById("damage-float");

    if (!area) return;

    const el = document.createElement("div");

    el.className = "damage-number";
    el.textContent = `-${valor}`;

    area.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 800);
  }

  function mostrarMiss() {
    const area = document.getElementById("damage-float");

    if (!area) return;

    const el = document.createElement("div");

    el.className = "damage-number miss";
    el.textContent = "MISS";

    area.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 800);
  }

  // ============================================================================
  // ENVIO
  // ============================================================================

  async function encerrarPorToken() {
    if (questionarioEncerrado) return;

    questionarioEncerrado = true;

    pararTimer();

    desabilitarTudo();

    localStorage.removeItem("token");

    mostrarAlerta("Sua sessão expirou. Faça login novamente.", "erro");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  }

  async function enviarResposta(idExame, idQuestao, resposta) {
    const token = obterToken();

    if (!token) {
      return false;
    }

    try {
      const res = await fetch("/api/questoes/responder", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id_exame: idExame,
          id_questao: idQuestao,
          resposta,
        }),
      });

      if (res.status === 401) {
        await encerrarPorToken();
        return false;
      }

      if (res.ok) {
        const data = await res.json();

        confirmadas[idQuestao] = true;

        if (data.correta) {
          acertos[idQuestao] = true;

          atualizarVidaBoss();

          mostrarDano(10);

          if (bossImagem) {
            bossImagem.animate(
              [
                {
                  transform: "translateX(0) scale(1)",
                  filter: "brightness(1)",
                },
                {
                  transform: "translateX(-10px) scale(1.08)",
                  filter: "brightness(1.8)",
                },
                {
                  transform: "translateX(10px) scale(0.95)",
                  filter: "brightness(0.6)",
                },
                {
                  transform: "translateX(-8px) scale(1.05)",
                },
                {
                  transform: "translateX(0) scale(1)",
                },
              ],
              {
                duration: 350,
                easing: "ease-out",
              },
            );
          }
        } else {
          mostrarMiss();

          if (bossImagem) {
            bossImagem.animate(
              [
                { transform: "translateX(0)" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(0)" },
              ],
              {
                duration: 180,
              },
            );
          }
        }

        return true;
      }

      if (res.status === 409) {
        confirmadas[idQuestao] = true;
        return true;
      }

      const data = await res.json();

      mostrarAlerta(data.message || "Erro ao enviar resposta", "erro");

      return false;
    } catch {
      mostrarAlerta("Erro de conexão ao enviar resposta", "erro");

      return false;
    }
  }

  async function enviarPendentesComoX() {
    for (const q of fila) {
      if (!confirmadas[q.id_questao]) {
        await enviarResposta(q.id_exame, q.id_questao, RESPOSTA_PULADA);
      }
    }
  }

  // ============================================================================
  // BOTÕES
  // ============================================================================

  async function aoConfirmar() {
    const q = questaoAtual();

    if (!q) return;

    const resposta = respostas[q.id_questao];

    if (!resposta || resposta === RESPOSTA_PULADA) {
      mostrarAlerta("Escolha uma alternativa antes de confirmar.", "erro");

      return;
    }

    desabilitarTudo();

    const ok = await enviarResposta(q.id_exame, q.id_questao, resposta);

    if (!ok) {
      habilitarRespostas();

      if (botaoConfirmar) {
        botaoConfirmar.disabled = false;
      }

      return;
    }

    if (indiceAtual < fila.length - 1) {
      indiceAtual++;
      renderizarQuestao();
    } else {
      await finalizarQuestionario();
    }
  }

  async function finalizarQuestionario() {
    if (questionarioEncerrado) return;

    questionarioEncerrado = true;

    desabilitarTudo();

    pararTimer();

    await enviarPendentesComoX();

    if (exameId) {
      localStorage.setItem(`exame_finalizado_${exameId}`, "1");
    }

    if (exameId) {
      sessionStorage.setItem("ultimo_id_exame", String(exameId));
    }

    window.location.href = "/resultado";
  }

  // ============================================================================
  // CARREGAMENTO
  // ============================================================================

  async function carregarTodasQuestoes() {
    const token = obterToken();

    if (!token) return;

    desabilitarTudo();

    try {
      const res = await fetch("/api/questoes/todas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        await encerrarPorToken();
        return;
      }

      const data = await res.json();

      if (res.status === 404) {
        window.location.href = "/resultado";
        return;
      }

      if (!res.ok) {
        mostrarAlerta(data.message || "Erro ao carregar questões", "erro");

        window.location.href = "/mapa";

        return;
      }

      fila = data;

      exameId = fila[0]?.id_exame || null;

      if (exameId) {
        Object.keys(localStorage)
          .filter(
            (k) =>
              k.startsWith("exame_finalizado_") &&
              k !== `exame_finalizado_${exameId}`,
          )
          .forEach((k) => localStorage.removeItem(k));

        Object.keys(localStorage)
          .filter(
            (k) =>
              k.startsWith("timer_exame_") && k !== `timer_exame_${exameId}`,
          )
          .forEach((k) => localStorage.removeItem(k));
      }

      fila.forEach(function (q) {
        if (q.resposta_salva) {
          confirmadas[q.id_questao] = true;
          respostas[q.id_questao] = q.resposta_salva;
        }
      });

      const primeiraAberta = fila.findIndex((q) => !confirmadas[q.id_questao]);

      const jaFinalizado =
        exameId && localStorage.getItem(`exame_finalizado_${exameId}`);

      if (primeiraAberta === -1 || jaFinalizado) {
        window.location.href = "/resultado";
        return;
      }

      indiceAtual = primeiraAberta;

      atualizarVidaBoss();
      renderizarQuestao();
      iniciarTimer();
    } catch (err) {
      console.error(err);

      mostrarAlerta("Erro de conexão ao carregar questões", "erro");
    }
  }

  // ============================================================================
  // ATUALIZAÇÃO DA INTERFACE DO QUESTIONÁRIO
  // ============================================================================

  function atualizarInterfaceQuestionario() {
    questionarioNumero = detectarNumeroQuestionario();
    const boss = BOSSES[questionarioNumero] || BOSSES[1];

    // Atualizar título da página
    if (pageTitleEl) {
      pageTitleEl.textContent = `Questionário ${questionarioNumero} | Scrum Dungeon`;
    }

    // Atualizar nome do boss
    if (bossNomeEl) {
      bossNomeEl.textContent = boss.nome;
    }

    // Atualizar imagem do boss
    if (bossImagem) {
      bossImagem.src = boss.imagem;
      bossImagem.alt = `Boss ${boss.nome}`;
      bossImagem.dataset.bossSrc = boss.imagem;

      // Tratamento de erro caso a imagem não exista
      bossImagem.onerror = function () {
        console.warn(`Imagem do boss não encontrada: ${boss.imagem}`);
        this.style.opacity = "0.5";
      };
    }
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  botoesResposta.forEach(function (botao) {
    botao.setAttribute("aria-pressed", "false");

    botao.addEventListener("click", function () {
      selecionarAlternativa(botao);
    });
  });

  if (botaoConfirmar) {
    botaoConfirmar.addEventListener("click", aoConfirmar);
  }

  // ============================================================================
  // INIT
  // ============================================================================

  // IMPORTANTE: Atualizar interface do questionário (boss, título, etc)
  atualizarInterfaceQuestionario();

  // Carregar questões
  carregarTodasQuestoes();
})();