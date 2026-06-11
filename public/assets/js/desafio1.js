// ============================================================================
// DICIONÁRIO DE BOSSES
// ============================================================================

const BOSSES = {
  1: {
    nome: "Documentação Confusa",
    imagem: "/assets/img/capitulo_1/inimigos/confronto-1.png",
    descricao: "Responda às questões antes que o tempo termine, ou seja devorado pela Documentação Confusa."
  },
  2: {
    nome: "Golem da Confusão de Papéis",
    imagem: "/assets/img/capitulo_2/inimigos/confronto-2.png",
    descricao: "O tempo é seu inimigo. Finalize o questionário antes que a burocracia consuma sua sanidade!"
  },
  3: {
    nome: "Névoa da Improvisação",
    imagem: "/assets/img/capitulo_3/inimigos/confronto-3.png",
    descricao: "Requisitos mudam a cada segundo. Mantenha o foco ou será esmagado pelas novas demandas!"
  },
  4: {
    nome: "Colosso do Escopo Selvagem",
    imagem: "/assets/img/capitulo_4/inimigos/confronto-4.png",
    descricao: "Encontre e elimine os erros antes que eles corrompam seu progresso!"
  },
  5: {
    nome: "Guardião do Fluxo Perpétuo",
    imagem: "/assets/img/capitulo_5/inimigos/confronto-5.png",
    descricao: "A produção caiu! Restaure o sistema respondendo corretamente antes do caos total."
  }
};

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDadosDoBackend();
});

async function carregarDadosDoBackend() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("❌ Erro ao buscar progresso do mapa");
      aplicarBossNoDOM(BOSSES[1]);
      atualizarTituloCapitulo(1);
      configurarAcoesDesafio(1);
      return;
    }

    const data = await response.json();
    console.log("📦 Resposta do backend:", data);

    let moduloDoBanco = null;
    let falhasDoBanco = 0;

    if (Array.isArray(data)) {
      const primeiroItem = data[0];
      moduloDoBanco = primeiroItem?.modulo_desafio_atual;
      falhasDoBanco = primeiroItem?.falhas_no_modulo || 0;
    } else if (data.modulos && Array.isArray(data.modulos)) {
      const moduloAtual = data.modulos.find(m => m.desafio_atual);
      if (moduloAtual) {
        moduloDoBanco = moduloAtual.id_modulo || moduloAtual.numero || moduloAtual.modulo_desafio_atual;
        falhasDoBanco = moduloAtual.falhas_no_modulo || 0;
      }
      if (!moduloDoBanco && data.modulos[0]?.modulo_desafio_atual) {
        moduloDoBanco = data.modulos[0].modulo_desafio_atual;
        falhasDoBanco = data.modulos[0].falhas_no_modulo || 0;
      }
    }

    console.log("🎯 Módulo do backend:", moduloDoBanco);

    const moduloFinal = (moduloDoBanco && moduloDoBanco >= 1 && moduloDoBanco <= 5) 
      ? moduloDoBanco 
      : 1;

    console.log("✅ Módulo final selecionado:", moduloFinal);

    const bossCorreto = BOSSES[moduloFinal] || BOSSES[1];
    aplicarBossNoDOM(bossCorreto);
    atualizarTituloCapitulo(moduloFinal); // ← ATUALIZA O TÍTULO AQUI
    revelarElementosEmSequencia();
    configurarRegras();

    carregarVidasDesafio(moduloFinal, falhasDoBanco);
    configurarAcoesDesafio(moduloFinal);

  } catch (error) {
    console.error("❌ Erro ao carregar dados do backend:", error);
    const bossPadrao = BOSSES[1];
    aplicarBossNoDOM(bossPadrao);
    atualizarTituloCapitulo(1);
    revelarElementosEmSequencia();
    configurarRegras();
    configurarAcoesDesafio(1);
  }
}

// ============================================================================
// FUNÇÃO PARA ATUALIZAR O TÍTULO DO CAPÍTULO
// ============================================================================

function atualizarTituloCapitulo(moduloId) {
  const titleElement = document.getElementById("chapterTitle");
  
  if (titleElement) {
    const nomesCapitulos = {
      1: "Boss Fight",
      2: "Boss Fight",
      3: "Boss Fight",
      4: "Boss Fight",
      5: "Boss Fight"
    };
    
    const nomeCapitulo = nomesCapitulos[moduloId] || "Desafio";
    titleElement.textContent = `Capítulo ${moduloId}: ${nomeCapitulo}`;
    
    console.log(`📝 Título atualizado: Capítulo ${moduloId}: ${nomeCapitulo}`);
  }
}

// ============================================================================
// OUTRAS FUNÇÕES (mantenha as existentes)
// ============================================================================

function aplicarBossNoDOM(boss) {
  const imgElement = document.getElementById("bossImage");
  const nameElement = document.getElementById("bossName");
  
  if (imgElement) {
    imgElement.src = boss.imagem;
    imgElement.alt = `Herói enfrentando ${boss.nome}`;
  }
  if (nameElement) {
    nameElement.textContent = boss.nome;
  }

  configurarTextoDigitado(boss.descricao);
}

function revelarElementosEmSequencia() {
  const passos = [
    { seletor: ".step-1", delay: 150 },
    { seletor: ".step-2", delay: 500 },
    { seletor: ".step-3", delay: 950 },
    { seletor: ".step-4", delay: 3600 },
    { seletor: ".step-5", delay: 4300 },
  ];

  passos.forEach((passo) => {
    const elemento = document.querySelector(passo.seletor);
    if (!elemento) return;
    setTimeout(() => elemento.classList.add("is-visible"), passo.delay);
  });
}

function configurarTextoDigitado(texto) {
  const elemento = document.getElementById("bossTypeText");
  if (!elemento) return;

  elemento.textContent = "";
  let indice = 0;
  
  function digitar() {
    elemento.textContent = texto.slice(0, indice);
    indice += 1;
    if (indice <= texto.length) {
      setTimeout(digitar, 34);
    }
  }
  
  setTimeout(digitar, 1000);
}

function configurarAcoesDesafio(moduloId) {
  const btnIniciar = document.getElementById("btnIniciarDesafio");
  const btnVoltarMapa = document.getElementById("btnVoltarMapa");

  if (btnIniciar) {
    btnIniciar.replaceWith(btnIniciar.cloneNode(true));
    const novoBtnIniciar = document.getElementById("btnIniciarDesafio");

    novoBtnIniciar.addEventListener("click", () => {
      sessionStorage.setItem("modulo_alvo_desafio", moduloId);
      novoBtnIniciar.disabled = true;

      document.body.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "scale(1.02)";

      setTimeout(() => {
        window.location.replace(`/questionario?modulo=${moduloId}`);
      }, 450);
    });
  }

  if (btnVoltarMapa) {
    btnVoltarMapa.replaceWith(btnVoltarMapa.cloneNode(true));
    const novoBtnVoltar = document.getElementById("btnVoltarMapa");
    
    novoBtnVoltar.addEventListener("click", () => {
      window.location.href = "/mapa";
    });
  }
}

function configurarRegras() {
  const card = document.querySelector(".rules-card");
  const botao = document.getElementById("btnToggleRegras");
  if (!card || !botao) return;
  
  setTimeout(() => card.classList.add("is-open"), 4700);
  
  botao.addEventListener("click", () => {
    card.classList.toggle("is-open");
  });
}

function carregarVidasDesafio(moduloId, falhasDoBanco = null) {
  const container = document.getElementById("vidasDesafio");
  
  if (falhasDoBanco !== null && typeof renderizarVidas === 'function') {
    renderizarVidas(container, falhasDoBanco);
    return;
  }
  
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("/api/progresso/mapa", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(res => res.json())
  .then(data => {
    let falhas = 0;
    
    if (Array.isArray(data)) {
      const moduloData = data.find(m => m.id_modulo == moduloId);
      falhas = moduloData?.falhas_no_modulo || 0;
    } else if (data.modulos && Array.isArray(data.modulos)) {
      const moduloData = data.modulos.find(m => m.id_modulo == moduloId);
      falhas = moduloData?.falhas_no_modulo || 0;
    }
    
    if (typeof renderizarVidas === 'function') {
      renderizarVidas(container, falhas);
    }
  })
  .catch(err => console.error("Erro ao carregar vidas:", err));
}