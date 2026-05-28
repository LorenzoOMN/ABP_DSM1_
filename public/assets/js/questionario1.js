(function () {
  // ============================================================================
  // CONSTANTES
  // ============================================================================
  const DURACAO_TIMER_SEGUNDOS = 20 * 60; // 20 minutos
  const RESPOSTA_PULADA = 'x';

  // ============================================================================
  // ELEMENTOS DO DOM
  // ============================================================================
  const botoesResposta   = Array.from(document.querySelectorAll('.botaoresposta'));
  const barra            = document.getElementById('progresso-dinamico');
  const textoPercentual  = document.getElementById('texto-percentual');
  const barraContainer   = document.querySelector('.barra-container');
  const textoProgresso   = document.getElementById('texto-progresso');
  const textoDificuldade = document.getElementById('texto-dificuldade');
  const enunciadoQuestao = document.getElementById('enunciado-questao');
  const imagemContainer  = document.getElementById('imagem-questao-container');
  const botaoConfirmar   = document.querySelector('.confirmar');
  const botaoVoltar      = document.querySelector('.botoesdenavegacao .botaonavegacao:first-child');
  const botaoPular       = document.querySelector('.botoesdenavegacao .botaonavegacao:last-child');
  const timerEl          = document.getElementById('timer-questao');

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================
  let fila        = [];   // todas as questões do exame
  let indiceAtual = 0;    // posição atual na fila
  let respostas   = {};   // { id_questao: 'a'|'b'|'c'|'d'|'pulada'|null }
  let confirmadas = {};   // { id_questao: true } — já salvas no servidor
  let timerInterval = null;
  let segundosRestantes = DURACAO_TIMER_SEGUNDOS;
  let exameId = null;

  // ============================================================================
  // TOKEN
  // ============================================================================
  function obterToken() {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return null; }
    return token;
  }

  // ============================================================================
  // TIMER
  // ============================================================================
  function chaveTimer() {
    return exameId ? `timer_exame_${exameId}` : null;
  }

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function atualizarTimerDOM() {
    if (!timerEl) return;
    timerEl.textContent = formatarTempo(segundosRestantes);
    timerEl.classList.remove('timer-aviso', 'timer-critico');
    if (segundosRestantes <= 60)       timerEl.classList.add('timer-critico');
    else if (segundosRestantes <= 300) timerEl.classList.add('timer-aviso');
  }

  function salvarTimerLocal() {
    const chave = chaveTimer();
    if (!chave) return;
    localStorage.setItem(chave, String(Date.now() + segundosRestantes * 1000));
  }

  function carregarTimerLocal() {
    const chave = chaveTimer();
    if (!chave) return;
    const expira = parseInt(localStorage.getItem(chave) || '0', 10);
    if (!expira) return;
    const restante = Math.floor((expira - Date.now()) / 1000);
    if (restante > 0 && restante <= DURACAO_TIMER_SEGUNDOS) {
      segundosRestantes = restante;
    } else if (restante <= 0) {
      segundosRestantes = 0;
    }
  }

  function iniciarTimer() {
    carregarTimerLocal();
    atualizarTimerDOM();

    if (segundosRestantes <= 0) {
      encerrarPorTimer();
      return;
    }

    timerInterval = setInterval(function () {
      segundosRestantes--;
      salvarTimerLocal();
      atualizarTimerDOM();
      if (segundosRestantes <= 0) {
        clearInterval(timerInterval);
        encerrarPorTimer();
      }
    }, 1000);
  }

  function pararTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const chave = chaveTimer();
    if (chave) localStorage.removeItem(chave);
  }

  async function encerrarPorTimer() {
    pararTimer();
    if (timerEl) {
      timerEl.textContent = '00:00';
      timerEl.classList.add('timer-critico');
    }
    desabilitarTudo();
    mostrarAlerta('Tempo esgotado! Enviando respostas pendentes...', 'info');
    await enviarPendentesComoX();
    window.location.href = '/resultado';
  }

  // ============================================================================
  // HELPERS DE FILA
  // ============================================================================
  function questaoAtual() { return fila[indiceAtual] || null; }
  function totalQuestoes() { return fila.length; }

  function atualizarBotoesNavegacao() {
    if (botaoVoltar) botaoVoltar.disabled = (indiceAtual === 0);
    if (botaoPular)  botaoPular.disabled  = false;
  }

  // ============================================================================
  // PERCENTUAL DA BARRA
  // ============================================================================
  function atualizarPercentual() {
    const n     = indiceAtual + 1;
    const total = totalQuestoes() || 10;
    let percentual;

    if (n > total)        percentual = 100;
    else if (n === total) percentual = 90;
    else {
      percentual = Math.round(((n - 1) / (total - 1)) * 90);
      if (n === 1) percentual = 0;
    }

    percentual = Math.max(0, Math.min(100, percentual || 0));

    if (barra)           barra.style.width = `${percentual}%`;
    if (textoPercentual) textoPercentual.textContent = `${percentual}%`;
    if (barraContainer)  barraContainer.setAttribute('aria-valuenow', String(percentual));
  }

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================
  function preencherAlternativa(letra, texto) {
    const botao = document.querySelector(`.botaoresposta[data-alternativa="${letra}"]`);
    const span  = botao?.querySelector('.resposta');
    if (span) span.textContent = texto || '';
  }

  function renderizarImagem(questao) {
    if (!imagemContainer) return;
    imagemContainer.innerHTML = '';
    if (!questao.imagem) return;
    const nome = String(questao.imagem).split('/').pop();
    imagemContainer.innerHTML = `
      <img src="/assets/img/questoes/${nome}"
           alt="Imagem relacionada à questão"
           class="questao-imagem">
    `;
  }

  function restaurarSelecao(idQuestao) {
    const salva = respostas[idQuestao];
    botoesResposta.forEach(function (botao) {
      const marcado = salva && salva !== 'pulada' && botao.dataset.alternativa === salva;
      botao.classList.toggle('is-selected', marcado);
      botao.setAttribute('aria-pressed', marcado ? 'true' : 'false');
    });
  }

  function renderizarQuestao() {
    const q = questaoAtual();
    if (!q) return;

    if (textoProgresso)
      textoProgresso.textContent = `Questão ${indiceAtual + 1} de ${totalQuestoes()}`;
    if (textoDificuldade) textoDificuldade.textContent = q.dificuldade || '--';
    if (enunciadoQuestao) enunciadoQuestao.textContent = q.enunciado || 'Pergunta indisponível';

    renderizarImagem(q);
    preencherAlternativa('a', q.alternativa_a);
    preencherAlternativa('b', q.alternativa_b);
    preencherAlternativa('c', q.alternativa_c);
    preencherAlternativa('d', q.alternativa_d);

    restaurarSelecao(q.id_questao);
    atualizarPercentual();
    atualizarBotoesNavegacao();

    // Questão já confirmada: bloqueia interação
    if (confirmadas[q.id_questao]) {
      desabilitarRespostas();
      if (botaoConfirmar) {
        botaoConfirmar.textContent = 'Já respondida';
        botaoConfirmar.disabled = true;
      }
    } else {
      habilitarRespostas();
      if (botaoConfirmar) {
        botaoConfirmar.textContent = 'Confirmar Resposta';
        botaoConfirmar.disabled = false;
      }
    }
  }

  // ============================================================================
  // SELEÇÃO
  // ============================================================================
  function selecionarAlternativa(botaoSelecionado) {
    const q = questaoAtual();
    if (!q || confirmadas[q.id_questao]) return;

    respostas[q.id_questao] = botaoSelecionado.dataset.alternativa;

    botoesResposta.forEach(function (botao) {
      const marcado = botao === botaoSelecionado;
      botao.classList.toggle('is-selected', marcado);
      botao.setAttribute('aria-pressed', marcado ? 'true' : 'false');
    });
  }

  function habilitarRespostas() {
    botoesResposta.forEach(b => { b.disabled = false; });
  }

  function desabilitarRespostas() {
    botoesResposta.forEach(b => { b.disabled = true; });
  }

  function desabilitarTudo() {
    desabilitarRespostas();
    if (botaoConfirmar) botaoConfirmar.disabled = true;
    if (botaoVoltar)    botaoVoltar.disabled    = true;
    if (botaoPular)     botaoPular.disabled     = true;
  }

  // ============================================================================
  // ENVIO AO SERVIDOR
  // ============================================================================
  async function enviarResposta(idExame, idQuestao, resposta) {
    const token = obterToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/questoes/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_exame: idExame, id_questao: idQuestao, resposta }),
      });

      // 409 = já respondida (ex: reload) — trata como sucesso
      if (res.ok || res.status === 409) {
        confirmadas[idQuestao] = true;
        return true;
      }

      const data = await res.json();
      mostrarAlerta(data.message || 'Erro ao enviar resposta', 'erro');
      return false;
    } catch {
      mostrarAlerta('Erro de conexão ao enviar resposta', 'erro');
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
  // AÇÕES DOS BOTÕES
  // ============================================================================
  async function aoConfirmar() {
    const q = questaoAtual();
    if (!q) return;

    const resposta = respostas[q.id_questao];
    if (!resposta || resposta === 'pulada') {
      mostrarAlerta('Escolha uma alternativa antes de confirmar.', 'erro');
      return;
    }

    desabilitarTudo();
    const ok = await enviarResposta(q.id_exame, q.id_questao, resposta);

    if (!ok) {
      habilitarRespostas();
      if (botaoConfirmar) botaoConfirmar.disabled = false;
      atualizarBotoesNavegacao();
      return;
    }

    // Avança ou finaliza
    if (indiceAtual < fila.length - 1) {
      indiceAtual++;
      renderizarQuestao();
    } else {
      await finalizarQuestionario();
    }
  }

  function aoVoltar() {
    if (indiceAtual === 0) return;
    indiceAtual--;
    renderizarQuestao();
  }

  async function aoPular() {
    const q = questaoAtual();
    if (!q) return;

    if (!confirmadas[q.id_questao]) {
      respostas[q.id_questao] = 'pulada';
      // ← removeu o confirmadas[q.id_questao] = true daqui
    }

    if (indiceAtual < fila.length - 1) {
      indiceAtual++;
      renderizarQuestao();
      return;
    }

    const primeiraSemResposta = fila.findIndex(
      x => !confirmadas[x.id_questao] && respostas[x.id_questao] !== 'pulada'
    );

    if (primeiraSemResposta !== -1) {
      indiceAtual = primeiraSemResposta;
      renderizarQuestao();
      mostrarAlerta('Você ainda tem questões sem resposta.', 'info');
    } else {
      await finalizarQuestionario();
    }
  }

  async function finalizarQuestionario() {
    desabilitarTudo();
    pararTimer();
    await enviarPendentesComoX();
    // Flag para evitar loop entre /questionario e /resultado
    if (exameId) localStorage.setItem(`exame_finalizado_${exameId}`, '1');
    // Guarda o id_exame para o resultado usar na progressão (evita problema pós-reset)
    if (exameId) sessionStorage.setItem('ultimo_id_exame', String(exameId));
    window.location.href = '/resultado';
  }

  // ============================================================================
  // CARREGAMENTO INICIAL
  // ============================================================================
  async function carregarTodasQuestoes() {
    const token = obterToken();
    if (!token) return;

    desabilitarTudo();

    try {
      const res = await fetch('/api/questoes/todas', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.status === 404) {
        window.location.href = '/resultado';
        return;
      }

      if (!res.ok) {
        mostrarAlerta(data.message || 'Erro ao carregar questões', 'erro');
        window.location.href = '/mapa';
        return;
      }

      fila    = data;
      exameId = fila[0]?.id_exame || null;

      // Limpa flags de exames antigos (evita bloqueio de exame anterior)
      if (exameId) {
        Object.keys(localStorage)
          .filter(k => k.startsWith('exame_finalizado_') && k !== `exame_finalizado_${exameId}`)
          .forEach(k => localStorage.removeItem(k));
        Object.keys(localStorage)
          .filter(k => k.startsWith('timer_exame_') && k !== `timer_exame_${exameId}`)
          .forEach(k => localStorage.removeItem(k));
      }

      // Restaura respostas já salvas no banco (reload, etc.)
      fila.forEach(function (q) {
        if (q.resposta_salva) {
          confirmadas[q.id_questao] = true;
          respostas[q.id_questao]   = q.resposta_salva; // 'a'/'b'/'c'/'d'/'pulada'
        }
      });

      // Posiciona na primeira questão ainda não confirmada
      const primeiraAberta = fila.findIndex(q => !confirmadas[q.id_questao]);

      // Se todas já confirmadas (ou exame já foi finalizado): vai direto pro resultado
      const jaFinalizado = exameId && localStorage.getItem(`exame_finalizado_${exameId}`);
      if (primeiraAberta === -1 || jaFinalizado) {
        window.location.href = '/resultado';
        return;
      }

      indiceAtual = primeiraAberta;
      renderizarQuestao();
      iniciarTimer();

    } catch (err) {
      console.error(err);
      mostrarAlerta('Erro de conexão ao carregar questões', 'erro');
    }
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================
  botoesResposta.forEach(function (botao) {
    botao.setAttribute('aria-pressed', 'false');
    botao.addEventListener('click', function () { selecionarAlternativa(botao); });
  });

  if (botaoConfirmar) botaoConfirmar.addEventListener('click', aoConfirmar);
  if (botaoVoltar)    botaoVoltar.addEventListener('click', aoVoltar);
  if (botaoPular)     botaoPular.addEventListener('click', aoPular);

  // ============================================================================
  // INIT
  // ============================================================================
  carregarTodasQuestoes();
})();