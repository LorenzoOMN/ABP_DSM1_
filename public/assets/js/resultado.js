(function () {
  const resultadoAcertos = document.getElementById("resultadoAcertos");
  const resultadoRespondidas = document.getElementById("resultadoRespondidas");
  const resultadoNotaFinal = document.getElementById("resultadoNotaFinal");
  const resultadoDesempenho = document.getElementById("resultadoDesempenho");
  const resultadoTentativas = document.getElementById("resultadoTentativas");
  const resultadoMensagem = document.getElementById("resultadoMensagem");
  const btnAcaoResultado = document.getElementById("btnAcaoResultado");
  const btnRevisar = document.getElementById("btnRevisar");
  const resultadoImagemArea = document.getElementById("resultadoImagemArea");
  const resultadoImagem = document.getElementById("resultadoImagem");
  const resultadoHoverTexto = document.getElementById("resultadoHoverTexto");
  const resultadoEtiqueta = document.getElementById("resultadoEtiqueta");
  const btnMelhorarNota = document.getElementById("btnMelhorarNota");
  const resultadoTituloPrincipal = document.getElementById(
    "resultadoTituloPrincipal",
  );

  const TOTAL_TENTATIVAS = 2;

  // ============================================================================
  // DICIONÁRIO DE IMAGENS POR CAPÍTULO
  // ============================================================================

  const RESULTADOS_POR_CAPITULO = {
    1: {
      vitoria: "/assets/img/capitulo_1/resultado_venceu.png",
      perdeu: "/assets/img/capitulo_1/resultado_perdeu.png",
      esgotou: "/assets/img/capitulo_1/resultado_esgotou_tentativas.png",
    },
    2: {
      vitoria: "/assets/img/capitulo_2/resultado_venceu.png",
      perdeu: "/assets/img/capitulo_2/resultado_perdeu.png",
      esgotou: "/assets/img/capitulo_2/resultado_esgotou_tentativas.png",
    },
    3: {
      vitoria: "/assets/img/capitulo_3/resultado_venceu.png",
      perdeu: "/assets/img/capitulo_3/resultado_perdeu.png",
      esgotou: "/assets/img/capitulo_3/resultado_esgotou_tentativas.png",
    },
    4: {
      vitoria: "/assets/img/capitulo_4/resultado_venceu.png",
      perdeu: "/assets/img/capitulo_4/resultado_perdeu.png",
      esgotou: "/assets/img/capitulo_4/resultado_esgotou_tentativas.png",
    },
    5: {
      vitoria: "/assets/img/capitulo_5/resultado_venceu.png",
      perdeu: "/assets/img/capitulo_5/resultado_perdeu.png",
      esgotou: "/assets/img/capitulo_5/resultado_esgotou_tentativas.png",
    },
  };

  // Mantém referência para fallback (capítulo 1)
  const RESULTADO_IMAGENS_PADRAO = RESULTADOS_POR_CAPITULO[1];

  const VIDA_IMAGEM = "/assets/img/vida-icon.png";
  const VIDA_PERDIDA_IMAGEM = "/assets/img/vida-icon-perdeu.png";

  let resultadoAtual = null;
  let moduloAtual = 1;

  function obterToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return null;
    }

    return token;
  }

  function formatarPercentual(percentual) {
    const numero = Number(percentual) || 0;
    return Number.isInteger(numero) ? String(numero) : numero.toFixed(2);
  }

  function obterDesempenho(percentual) {
    const nota = Number(percentual) || 0;

    if (nota >= 90) return "Excelente";
    if (nota >= 70) return "Muito bom";
    if (nota >= 50) return "Bom";
    return "Precisa melhorar";
  }

  function obterMensagem(resultado) {
    if (!resultado.aprovado && resultado.aprovado_por_melhor_nota) {
      return `Esta tentativa não superou sua melhor nota, mas sua aprovação anterior foi mantida. Nota considerada: ${formatarPercentual(
        resultado.nota_considerada,
      )}%.`;
    }
    if (resultado.aprovado) {
      return "Após uma árdua batalha mental, você encontrou os pontos fracos da criatura: objetivo claro, estrutura, detalhes úteis e entrega com valor.";
    }

    if (tentativasRestantes(resultado) <= 0) {
      return "Suas tentativas se esgotaram. O corvo surge em meio à energia roxa da dungeon para levá-lo de volta ao início da jornada.";
    }

    return "Você lutou bravamente, mas a criatura ainda se alimenta de informações soltas, excesso de detalhes e objetivos pouco claros. Revise seus passos, fortaleça sua estratégia e tente novamente.";
  }

  function tentativasUsadas(resultado) {
    return Math.min(Number(resultado.tentativa) || 1, TOTAL_TENTATIVAS);
  }

  function tentativasRestantes(resultado) {
    return Math.max(TOTAL_TENTATIVAS - tentativasUsadas(resultado), 0);
  }

  function obterEstadoResultado(resultado) {
    if (resultado.aprovado || resultado.aprovado_por_melhor_nota) {
      return "vitoria";
    }

    if (tentativasRestantes(resultado) <= 0) {
      return "esgotou";
    }

    return "perdeu";
  }

  function renderizarTentativas(resultado) {
    if (!resultadoTentativas) return;

    const usadas = tentativasUsadas(resultado);
    const aprovadoGeral =
      resultado.aprovado || resultado.aprovado_por_melhor_nota;

    resultadoTentativas.innerHTML = "";

    for (let i = 1; i <= TOTAL_TENTATIVAS; i++) {
      const img = document.createElement("img");

      img.classList.add("vida-icon");

      if (i <= usadas && !aprovadoGeral) {
        img.src = VIDA_PERDIDA_IMAGEM;
        img.alt = "Tentativa perdida";
      } else {
        img.src = VIDA_IMAGEM;
        img.alt = "Tentativa disponível";
      }

      resultadoTentativas.appendChild(img);
    }
  }

  // ============================================================================
  // FUNÇÃO : usa o módulo atual para selecionar imagens
  // ============================================================================

  function configurarImagemResultado(resultado) {
    if (!resultadoImagemArea || !resultadoImagem || !resultadoHoverTexto)
      return;

    const estado = obterEstadoResultado(resultado);

    // Seleciona as imagens baseadas no módulo atual
    const imagensModulo =
      RESULTADOS_POR_CAPITULO[moduloAtual] || RESULTADO_IMAGENS_PADRAO;

    resultadoImagemArea.classList.remove(
      "estado-vitoria",
      "estado-perdeu",
      "estado-esgotou",
    );

    resultadoImagemArea.classList.add(`estado-${estado}`);
    resultadoImagem.src = imagensModulo[estado];

    if (estado === "vitoria") {
      resultadoImagem.alt = "Aventureiro venceu a batalha";
      resultadoHoverTexto.textContent = "VOCÊ VENCEU";
    }

    if (estado === "perdeu") {
      resultadoImagem.alt = "Aventureiro perdeu uma tentativa";
      resultadoHoverTexto.textContent = "FUJA";
    }

    if (estado === "esgotou") {
      resultadoImagem.alt =
        "Corvo resgata o aventureiro após esgotar tentativas";
      resultadoHoverTexto.textContent = "VOE COM O CORVO";
    }
  }

  function atualizarBotaoAcao(resultado) {
    if (!btnAcaoResultado) return;

    btnAcaoResultado.disabled = false;

    const aprovadoGeral =
      resultado.aprovado || resultado.aprovado_por_melhor_nota;
    const tentativaAtual = Number(resultado.tentativa) || 1;
    const percentual = Number(resultado.percentual) || 0;

    // Condição atualizada: esconde se nota for 100%
    const podeMelhorarNota =
      resultado.aprovado === true &&
      tentativaAtual === 1 &&
      resultado.pode_tentar_melhorar === true &&
      percentual < 100;

    btnAcaoResultado.querySelector(".texto-botao").textContent = aprovadoGeral
      ? "Avançar"
      : "Tentar novamente";

    if (btnMelhorarNota) {
      btnMelhorarNota.hidden = !podeMelhorarNota;
      btnMelhorarNota.disabled = !podeMelhorarNota;

      // Opcional: adicionar tooltip explicativo
      if (percentual >= 100) {
        btnMelhorarNota.title = "Parabéns! Você atingiu a nota máxima.";
      }
    }
  }

  function renderizarResultado(resultado) {
    const totalRespondidas = Number(resultado.total_respondidas) || 0;
    const acertos = Number(resultado.acertos) || 0;
    const percentual = formatarPercentual(resultado.percentual);
    renderizarTituloResultado(resultado);

    if (resultadoAcertos) {
      resultadoAcertos.textContent = `${acertos}/${totalRespondidas}`;
    }

    if (resultadoRespondidas) {
      resultadoRespondidas.textContent = `Total respondidas: ${totalRespondidas}`;
    }

    if (resultadoNotaFinal) {
      resultadoNotaFinal.textContent = `Nota final: ${percentual}%`;
    }

    if (resultadoDesempenho) {
      resultadoDesempenho.textContent = obterDesempenho(resultado.percentual);
    }

    renderizarTentativas(resultado);
    configurarImagemResultado(resultado);

    if (resultadoMensagem) {
      resultadoMensagem.textContent = obterMensagem(resultado);
    }

    if (btnRevisar) {
      btnRevisar.disabled = true;
      btnRevisar.title = "Revisao ainda nao disponivel";
    }

    atualizarBotaoAcao(resultado);
  }

  // ============================================================================
  //  FUNÇÃO: Carrega o módulo atual antes de carregar o resultado
  // ============================================================================

  async function carregarModuloAtual() {
    const token = obterToken();
    if (!token) return 1;

    try {
      const response = await fetch("/api/progresso/mapa", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.warn(
          "⚠️ Não foi possível carregar progresso do mapa, usando módulo 1",
        );
        return 1;
      }

      const data = await response.json();
      console.log("📦 Dados do mapa:", data);

      let moduloDoBanco = null;

      if (Array.isArray(data)) {
        const primeiroItem = data[0];
        moduloDoBanco = primeiroItem?.modulo_desafio_atual;
      } else if (data.modulos && Array.isArray(data.modulos)) {
        const moduloAtual = data.modulos.find((m) => m.desafio_atual);
        if (moduloAtual) {
          moduloDoBanco =
            moduloAtual.id_modulo ||
            moduloAtual.numero ||
            moduloAtual.modulo_desafio_atual;
        }
        if (!moduloDoBanco && data.modulos[0]?.modulo_desafio_atual) {
          moduloDoBanco = data.modulos[0].modulo_desafio_atual;
        }
      }

      const moduloFinal =
        moduloDoBanco && moduloDoBanco >= 1 && moduloDoBanco <= 5
          ? moduloDoBanco
          : 1;

      console.log("✅ Módulo atual detectado:", moduloFinal);
      return moduloFinal;
    } catch (error) {
      console.error("❌ Erro ao carregar módulo atual:", error);
      return 1;
    }
  }

  async function carregarResultado() {
    const token = obterToken();
    if (!token) return;

    try {
      const response = await fetch("/api/questoes/resultado-atual", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // se não tem resultado, o usuário foi resetado ou chegou aqui sem querer
        // manda pro mapa que é o lugar certo
        window.location.href = "/mapa";
        return;
      }

      resultadoAtual = data;
      renderizarResultado(data);
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro de conexao ao carregar resultado", "erro");
    }
  }

  function renderizarTituloResultado(resultado) {
    const estado = obterEstadoResultado(resultado);

    if (resultadoTituloPrincipal) {
      if (estado === "vitoria") {
        resultadoTituloPrincipal.textContent = "Você venceu!";
      }

      if (estado === "perdeu") {
        resultadoTituloPrincipal.textContent = "Batalha perdida";
      }

      if (estado === "esgotou") {
        resultadoTituloPrincipal.textContent = "Run reiniciada";
      }
    }

    if (resultadoEtiqueta) {
      if (estado === "vitoria") {
        resultadoEtiqueta.textContent = "Missão concluída";
      }

      if (estado === "perdeu") {
        resultadoEtiqueta.textContent = "Tente novamente";
      }

      if (estado === "esgotou") {
        resultadoEtiqueta.textContent = "O corvo te resgatou";
      }
    }
  }

  async function refazerParaMelhorarNota() {
    const token = obterToken();

    if (!token || !resultadoAtual || !btnMelhorarNota) return;

    btnMelhorarNota.disabled = true;
    btnMelhorarNota.querySelector(".texto-botao").textContent = "Preparando...";

    try {
      const response = await fetch("/api/questoes/proxima-tentativa", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta(
          data.message || "Não foi possível criar nova tentativa.",
          "erro",
        );

        btnMelhorarNota.disabled = false;
        btnMelhorarNota.querySelector(".texto-botao").textContent =
          "Refazer para melhorar nota";

        return;
      }

      window.location.href = "/desafio1";
    } catch (error) {
      console.error("Erro ao criar tentativa de melhoria:", error);

      mostrarAlerta("Erro de conexão ao criar nova tentativa.", "erro");

      btnMelhorarNota.disabled = false;
      btnMelhorarNota.querySelector(".texto-botao").textContent =
        "Refazer para melhorar nota";
    }
  }

  // Guarda a resposta do proximo-modulo para não chamar duas vezes
  let progressaoJaAplicada = false;

  function obterModuloConcluido() {
    return Number(resultadoAtual?.id_modulo) || Number(moduloAtual) || 1;
  }

  function irParaColetaArtefato(moduloConcluido, destinoFinal) {
    sessionStorage.setItem("modulo_artefato_pendente", String(moduloConcluido));
    sessionStorage.setItem(
      "destino_pos_coleta_artefato",
      destinoFinal || "/mapa",
    );

    window.location.href = `/coleta-artefato?modulo=${encodeURIComponent(
      moduloConcluido,
    )}`;
  }

  async function aplicarProgressao() {
    const token = obterToken();
    if (!token || !resultadoAtual || !btnAcaoResultado) return;

    //  SEMPRE chama a API, independente de aprovado ou não
    // O backend decide a lógica de avançar/resetar/nova tentativa

    if (progressaoJaAplicada) return;
    progressaoJaAplicada = true;

    btnAcaoResultado.disabled = true;
    const textoOriginal =
      btnAcaoResultado.querySelector(".texto-botao").textContent;
    btnAcaoResultado.querySelector(".texto-botao").textContent = "Aguarde...";

    try {
      const response = await fetch("/api/questoes/proximo-modulo", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Prioriza id_exame salvo pelo questionário (evita problemas pós-reset)
          id_exame:
            sessionStorage.getItem("ultimo_id_exame") ||
            resultadoAtual.id_exame,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta(data.message || "Erro ao atualizar progresso.", "erro");
        progressaoJaAplicada = false;
        btnAcaoResultado.disabled = false;
        btnAcaoResultado.querySelector(".texto-botao").textContent =
          textoOriginal;
        return;
      }

      //  Caso 1: Run resetada (falhou 2 vezes no módulo 1)
      if (data.resetou_run === true) {
        sessionStorage.removeItem("ultimo_id_exame");
        mostrarAlerta("Sua run foi reiniciada. Retorne ao Módulo 1.", "info");
        window.location.href = "/mapa";
        return;
      }

      // Caso 2: Aprovado e há próximo módulo
      if (data.aprovado && data.exame?.id_exame) {
        const moduloConcluido = obterModuloConcluido();

        sessionStorage.setItem("ultimo_id_exame", String(data.exame.id_exame));
        mostrarAlerta("Módulo concluído! Artefato desbloqueado.", "sucesso");

        irParaColetaArtefato(moduloConcluido, "/mapa");
        return;
      }

      // Caso 3: Aprovado e SEM próximo módulo
      if (data.aprovado && data.certificado_liberado) {
        const moduloConcluido = obterModuloConcluido();

        mostrarAlerta(
          "Jornada concluída! Artefato final desbloqueado.",
          "sucesso",
        );

        irParaColetaArtefato(moduloConcluido, "/certificado");
        return;
      }

      //  Caso 4: Reprovado com tentativas restantes → nova tentativa no mesmo módulo
      if (!data.aprovado && data.exame?.id_exame) {
        sessionStorage.setItem("ultimo_id_exame", String(data.exame.id_exame));
        mostrarAlerta("Nova tentativa disponível. Boa sorte!", "info");
        window.location.href = "/questionario";
        return;
      }

      // Fallback seguro
      window.location.href = "/mapa";
    } catch (error) {
      console.error("Erro ao aplicar progressão:", error);
      mostrarAlerta("Erro de conexão ao atualizar progresso.", "erro");
      progressaoJaAplicada = false;
      btnAcaoResultado.disabled = false;
      btnAcaoResultado.querySelector(".texto-botao").textContent =
        textoOriginal;
    }
  }

  if (btnAcaoResultado) {
    btnAcaoResultado.addEventListener("click", aplicarProgressao);
  }

  if (btnMelhorarNota) {
    btnMelhorarNota.addEventListener("click", refazerParaMelhorarNota);
  }

  // ============================================================================
  // INICIALIZAÇÃO MODIFICADA: Carrega módulo primeiro, depois resultado
  // ============================================================================

  (async function iniciar() {
    // Primeiro detecta o módulo atual
    moduloAtual = await carregarModuloAtual();
    console.log("🎯 Módulo configurado para imagens:", moduloAtual);

    // Depois carrega o resultado
    await carregarResultado();
  })();
})();
