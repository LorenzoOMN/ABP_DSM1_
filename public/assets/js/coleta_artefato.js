(function () {
  const coletaModulo = document.getElementById("coletaModulo");
  const coletaTitulo = document.getElementById("coletaTitulo");
  const coletaDescricao = document.getElementById("coletaDescricao");
  const coletaNarrativa = document.getElementById("coletaNarrativa");
  const coletaArtefatoImagem = document.getElementById("coletaArtefatoImagem");
  const btnColetarArtefato = document.getElementById("btnColetarArtefato");
  const coletaHeading = document.querySelector(".coleta-heading");
  const coletaVisual = document.querySelector(".coleta-visual");
  const coletaActions = document.querySelector(".coleta-actions");
  const coletaTransicao = document.getElementById("coletaTransicao");
  const coletaTransicaoTitulo = document.getElementById(
    "coletaTransicaoTitulo",
  );
  const coletaTransicaoTexto = document.getElementById("coletaTransicaoTexto");

  const toastArtefato = document.getElementById("toastArtefato");
  const toastArtefatoIcone = document.getElementById("toastArtefatoIcone");
  const toastArtefatoNome = document.getElementById("toastArtefatoNome");

  let artefatoAtual = null;

  const imagensColetaPorModulo = {
    1: "conclusao-modulo-1.png",
    2: "conclusao-modulo-2.png",
    3: "conclusao-modulo-3.png",
    4: "conclusao-modulo-4.png",
    5: "conclusao-final.png",
  };

  function obterImagemColeta(artefato) {
    const modulo = Number(artefato?.capitulo_requisito);
    const imagemColeta = imagensColetaPorModulo[modulo];

    if (imagemColeta) {
      return `/assets/img/conclusoes/${imagemColeta}`;
    }

    return artefato?.imagem
      ? `/assets/img/artefatos/${artefato.imagem}`
      : "/assets/img/artefatos/product-backlog-icon.png";
  }

  function obterImagemIconeArtefato(artefato) {
    return artefato?.imagem
      ? `/assets/img/artefatos/${artefato.imagem}`
      : "/assets/img/artefatos/product-backlog-icon.png";
  }

  function reiniciarAnimacaoEntrada() {
    [
      coletaHeading,
      coletaVisual,
      coletaDescricao,
      coletaNarrativa,
      coletaActions,
    ].forEach((elemento) => {
      elemento?.classList.remove("is-visible");
    });
  }

  function animarEntradaColeta() {
    const elementos = [
      coletaHeading,
      coletaVisual,
      coletaDescricao,
      coletaNarrativa,
      coletaActions,
    ];

    elementos.forEach((elemento, index) => {
      if (!elemento) return;

      setTimeout(
        () => {
          elemento.classList.add("is-visible");
        },
        180 + index * 260,
      );
    });
  }

  function mostrarTransicaoSaida(destino) {
    if (!coletaTransicao) return 0;

    const vaiParaCertificado = destino.includes("/certificado");

    if (coletaTransicaoTitulo) {
      coletaTransicaoTitulo.textContent = vaiParaCertificado
        ? "Preparando seu certificado..."
        : "Registrando sua conquista...";
    }

    if (coletaTransicaoTexto) {
      coletaTransicaoTexto.textContent = vaiParaCertificado
        ? "A jornada foi concluída. Sua conquista final está sendo emitida."
        : "O artefato foi salvo e a Dungeon abrirá o próximo caminho.";
    }

    coletaTransicao.hidden = false;

    requestAnimationFrame(() => {
      coletaTransicao.classList.add("show");
    });

    return vaiParaCertificado ? 1100 : 700;
  }

  function mostrarToastArtefatoColetado(artefato, aoFinalizar) {
    if (!toastArtefato || !toastArtefatoIcone || !toastArtefatoNome) {
      mostrarAlerta?.("Artefato coletado com sucesso!", "sucesso");

      setTimeout(() => {
        aoFinalizar?.();
      }, 650);

      return;
    }

    toastArtefatoIcone.src = obterImagemIconeArtefato(artefato);
    toastArtefatoIcone.alt = artefato?.titulo || "Artefato coletado";
    toastArtefatoNome.textContent = artefato?.titulo || "Nova relíquia";

    toastArtefato.hidden = false;

    requestAnimationFrame(() => {
      toastArtefato.classList.add("show");
    });

    setTimeout(() => {
      toastArtefato.classList.remove("show");
    }, 1800);

    setTimeout(() => {
      toastArtefato.hidden = true;
      aoFinalizar?.();
    }, 2200);
  }

  const narrativasColetaPorModulo = {
    1: `
      <p>
        A primeira batalha chega ao fim. O caos inicial da Dungeon começa a se
        organizar diante dos seus olhos, como se as missões perdidas finalmente
        encontrassem uma ordem.
      </p>

      <p>
        Entre os vestígios da Documentação Confusa agora organizada, um antigo
        artefato desperta: o <strong>Product Backlog</strong>. Ele não entrega
        respostas prontas, mas revela quais necessidades merecem atenção primeiro.
      </p>

      <p>
        Para compreender melhor este artefato e estudar seu significado,
        acesse a <strong>Sala dos Artefatos</strong> após a coleta.
      </p>
    `,

    2: `
      <p>
        Com o desafio vencido, as vozes dispersas da batalha começam a encontrar
        equilíbrio. Cada força entende melhor seu lugar dentro da missão.
      </p>

      <p>
        Dos destroços do Golem surge o <strong>Medalhão dos Papéis</strong>,
        uma relíquia que carrega a lembrança de que nenhuma jornada Scrum é
        vencida por uma única pessoa.
      </p>

      <p>
        Para analisar o artefato com calma e entender seus ensinamentos,
        visite a <strong>Sala dos Artefatos</strong>.
      </p>
    `,

    3: `
      <p>
        A batalha termina, mas o tempo ainda ecoa pelas paredes da Dungeon.
        Cada grão de areia parece marcar o ritmo de uma nova etapa da jornada.
      </p>

      <p>
        Diante de você surge a <strong>Ampulheta da Sprint</strong>, lembrando
        que grandes entregas não nascem do improviso, mas de ciclos curtos,
        foco e melhoria contínua.
      </p>

      <p>
        Para estudar o artefato e descobrir sua função dentro do Scrum,
        acesse a <strong>Sala dos Artefatos</strong>.
      </p>
    `,

    4: `
      <p>
        O confronto termina e a Dungeon silencia por um instante. No lugar do
        ruído da batalha, surgem perguntas: o que funcionou, o que falhou e o
        que pode melhorar?
      </p>

      <p>
        Um baú antigo se abre lentamente. É o <strong>Baú da Iteração</strong>,
        um artefato que não guarda apenas tesouros, mas aprendizados para o
        próximo ciclo.
      </p>

      <p>
        Para investigar melhor este artefato, vá até a
        <strong>Sala dos Artefatos</strong>.
      </p>
    `,

    5: `
      <p>
        A última batalha deixa marcas profundas na Dungeon. O Guardião do Fluxo
        se dissipa em uma grande explosão de luz. Quando a claridade desaparece,
        vocês já não estão mais diante do campo de batalha.
      </p>

      <p>
        Agora, o grupo se vê dentro da sala do <strong>Scrum Master</strong>.
        No centro, repousa uma máquina de tecnologia distante e misteriosa.
        Atrás dela, uma grande parede exibe inscrições antigas: símbolos que
        você reconhece da jornada, como o Product Backlog, a Sprint e o
        Incremento de Valor.
      </p>

      <p>
        O corvo pousa lentamente em seu ombro. O bardo se aproxima, confuso.
      </p>

      <blockquote>
        “Isso não está certo… onde está o Scrum Master?”
      </blockquote>

      <p>
        O guerreiro aperta a espada.
      </p>

      <blockquote>
        “Se ele não está aqui… então quem estava nos guiando?”
      </blockquote>

      <p>
        Nenhuma resposta ecoa pela sala. Você dá um passo à frente. Ao tocar o
        trono, memórias atravessam sua mente como flashes: você organizando a
        fogueira da Daily, guiando o planejamento, percebendo os ciclos,
        conectando backlog e sprint, removendo impedimentos e conduzindo o time.
      </p>

      <p>
        A voz retorna. Mas agora ela não vem das paredes da Dungeon. Ela vem de você.
      </p>

      <blockquote>
        “Não se engane… ele não lidera. Ele facilita.”
      </blockquote>

      <p>
        O corvo abre as asas e grita, quase alegre:
      </p>

      <blockquote>
        “Você nunca esteve perdido. Você é o Scrum Master!”
      </blockquote>

      <p>
       Então o chapéu que esteve o tempo todo com o corvo enquanto ele procurava seu mestre
        repousa sobre sua cabeça a última relíquia: o <strong>Chapéu do Scrum Master</strong>.
      </p>

      <p>
        O bardo sorri.
      </p>

      <blockquote>
        “Então era você… desde o começo.”
      </blockquote>

      <p>
        Os aventureiros se ajoelham, mas você entende a lição final. Não é sobre
        mandar. Não é sobre controlar. Você estende a mão, e eles se levantam.
      </p>

      <blockquote>
        “O verdadeiro poder não é comandar o time. É fazer o time funcionar.”
      </blockquote>

      <p>
        Para compreender o significado final deste artefato, acesse a
        <strong>Sala dos Artefatos</strong> após a coleta.
      </p>
    `,
  };

  function obterNarrativaColeta(artefato) {
    return (
      narrativasColetaPorModulo[Number(artefato.capitulo_requisito)] ||
      `
        <p>
          A batalha chega ao fim, e uma nova relíquia desperta diante de você.
          Este artefato carrega uma lição importante da sua jornada pelo Scrum.
        </p>

        <p>
          Para estudar melhor seu significado, acesse a
          <strong>Sala dos Artefatos</strong> após a coleta.
        </p>
      `
    );
  }

  function moduloEhFinal(artefato) {
    return Number(artefato?.capitulo_requisito) === 5;
  }

  function obterToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return null;
    }

    return token;
  }

  function obterModuloDaUrl() {
    const params = new URLSearchParams(window.location.search);
    const moduloUrl = Number(params.get("modulo"));
    const moduloSessao = Number(
      sessionStorage.getItem("modulo_artefato_pendente"),
    );

    if (Number.isInteger(moduloUrl) && moduloUrl > 0) {
      return moduloUrl;
    }

    if (Number.isInteger(moduloSessao) && moduloSessao > 0) {
      return moduloSessao;
    }

    return null;
  }

  function obterDestinoFinal() {
    const destinoSalvo = sessionStorage.getItem("destino_pos_coleta_artefato");

    if (moduloEhFinal(artefatoAtual)) {
      return "/certificado";
    }

    return destinoSalvo || "/mapa";
  }

  function limparContextoColeta() {
    sessionStorage.removeItem("modulo_artefato_pendente");
    sessionStorage.removeItem("destino_pos_coleta_artefato");
  }

  function irParaDestinoFinal() {
    const destino = obterDestinoFinal();
    const tempoTransicao = mostrarTransicaoSaida(destino);

    limparContextoColeta();

    setTimeout(() => {
      window.location.href = destino;
    }, tempoTransicao || 450);
  }
  function atualizarTextoBotao(artefato) {
    if (!btnColetarArtefato) return;

    if (artefato.desbloqueado) {
      btnColetarArtefato.textContent = moduloEhFinal(artefato)
        ? "Ir para o certificado"
        : "Voltar ao mapa";
      return;
    }

    btnColetarArtefato.textContent = moduloEhFinal(artefato)
      ? "Coletar chapéu"
      : "Coletar artefato";
  }

  function renderizarArtefato(artefato) {
    artefatoAtual = artefato;
    reiniciarAnimacaoEntrada();

    document.body.classList.toggle("coleta-final", moduloEhFinal(artefato));

    if (coletaModulo) {
      coletaModulo.textContent = moduloEhFinal(artefato)
        ? "Desfecho final"
        : `Módulo ${artefato.capitulo_requisito}`;
    }

    if (coletaTitulo) {
      coletaTitulo.textContent = artefato.titulo;
    }

    if (coletaDescricao) {
      coletaDescricao.textContent = moduloEhFinal(artefato)
        ? "A última relíquia da jornada foi revelada."
        : artefato.descricao_curta ||
          "Uma nova relíquia foi revelada após a vitória.";
    }

    if (coletaNarrativa) {
      coletaNarrativa.innerHTML = obterNarrativaColeta(artefato);
    }

    if (coletaArtefatoImagem) {
      coletaArtefatoImagem.src = obterImagemColeta(artefato);
      coletaArtefatoImagem.alt = moduloEhFinal(artefato)
        ? "Desfecho final da jornada"
        : `Conclusão do módulo ${artefato.capitulo_requisito}`;
    }

    if (btnColetarArtefato) {
      btnColetarArtefato.disabled = false;
      atualizarTextoBotao(artefato);
    }

    setTimeout(() => {
      animarEntradaColeta();
    }, 120);
  }

  async function carregarArtefato() {
    const token = obterToken();
    const modulo = obterModuloDaUrl();

    if (!token) return;

    if (!modulo) {
      mostrarAlerta?.("Módulo do artefato não encontrado.", "erro");
      window.location.href = "/mapa";
      return;
    }

    try {
      const response = await fetch(`/api/artefatos/modulo/${modulo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar artefato.");
      }

      renderizarArtefato(data.data);
    } catch (error) {
      console.error("Erro ao carregar artefato:", error);
      mostrarAlerta?.("Não foi possível carregar o artefato.", "erro");

      if (btnColetarArtefato) {
        btnColetarArtefato.disabled = false;
        btnColetarArtefato.textContent = "Voltar ao mapa";
      }
    }
  }

  async function coletarArtefato() {
    const token = obterToken();

    if (!token) return;

    if (!artefatoAtual) {
      irParaDestinoFinal();
      return;
    }

    if (artefatoAtual.desbloqueado) {
      irParaDestinoFinal();
      return;
    }

    btnColetarArtefato.disabled = true;
    btnColetarArtefato.textContent = moduloEhFinal(artefatoAtual)
      ? "Concluindo jornada..."
      : "Coletando...";

    try {
      const response = await fetch(
        `/api/artefatos/${artefatoAtual.id}/coletar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao coletar artefato.");
      }

      mostrarToastArtefatoColetado(artefatoAtual, () => {
        irParaDestinoFinal();
      });
    } catch (error) {
      console.error("Erro ao coletar artefato:", error);
      mostrarAlerta?.(
        error.message || "Não foi possível coletar o artefato.",
        "erro",
      );

      btnColetarArtefato.disabled = false;
      btnColetarArtefato.textContent = "Tentar coletar novamente";
    }
  }

  if (btnColetarArtefato) {
    btnColetarArtefato.addEventListener("click", coletarArtefato);
  }

  carregarArtefato();
})();
