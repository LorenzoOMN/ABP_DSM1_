// 1. DICIONÁRIO DE BOSSES
const bossesData = {
  "1": {
    imagem: "/assets/img/capitulo_1/inimigos/confronto-1.png",
    nome: "Documentação Confusa",
    descricao: "Responda às questões antes que o tempo termine, ou seja devorado pela Documentação Confusa."
  },
  "2": {
    imagem: "/assets/img/capitulo_2/inimigos/confronto-2.png",
    nome: "Golem da Confusão de Papéis",
    descricao: "O tempo é seu inimigo. Finalize o questionário antes que a burocracia consuma sua sanidade!"
  },
  "3": {
    imagem: "/assets/img/capitulo_3/inimigos/confronto-3.jpeg",
    nome: "Névoa da Improvisação",
    descricao: "Requisitos mudam a cada segundo. Mantenha o foco ou será esmagado pelas novas demandas!"
  },
  "4": {
    imagem: "/assets/img/capitulo_4/inimigos/confronto-4.jpeg",
    nome: "Colosso do Escopo Selvagem",
    descricao: "Encontre e elimine os erros antes que eles corrompam seu progresso!"
  },
  "5": {
    imagem: "/assets/img/capitulo_5/inimigos/confronto-5.jpeg",
    nome: "Guardião do Fluxo Perpétuo",
    descricao: "A produção caiu! Restaure o sistema respondendo corretamente antes do caos total."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let moduloId = "1"; // Valor padrão de segurança

  // PRIORIDADE 1: Lê o parâmetro da URL (Ex: /desafio?modulo=2)
  const params = new URLSearchParams(window.location.search);
  if (params.has("modulo")) {
    moduloId = params.get("modulo");
  } 
  // PRIORIDADE 2: Se não tiver parâmetro, lê o nome da rota (Ex: /desafio1, /desafio-2, /desafio/3)
  else {
    const path = window.location.pathname;
    const match = path.match(/desafio[_\-\/]?(\d+)/i); // Captura o número depois de "desafio"
    if (match) {
      moduloId = match[1];
    }
  }

  console.log("🔍 Módulo detectado pela rota/URL:", moduloId);

  // Busca os dados do boss (se o módulo não existir no dicionário, usa o 1 como fallback)
  const bossAtual = bossesData[moduloId] || bossesData["1"];
  console.log("🐉 Boss carregado:", bossAtual.nome, "| Imagem:", bossAtual.imagem);

  // Aplica os dados no HTML
  const imgElement = document.getElementById("bossImage");
  const nameElement = document.getElementById("bossName");
  
  if (imgElement) {
    imgElement.src = bossAtual.imagem;
    imgElement.alt = `Herói enfrentando ${bossAtual.nome}`;
  }
  if (nameElement) {
    nameElement.textContent = bossAtual.nome;
  }

  // Inicializa as outras funções
  revelarElementosEmSequencia();
  configurarTextoDigitado(bossAtual.descricao);
  configurarAcoesDesafio(moduloId);
  configurarRegras();
  carregarVidasDesafio();
});

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

  let indice = 0;
  function digitar() {
    elemento.textContent = texto.slice(0, indice);
    indice += 1;
    if (indice <= texto.length) {
      setTimeout(digitar, 34);
    }
  }
  setTimeout(digitar, 1200);
}

// FUNÇÃO ÚNICA DE AÇÕES (Removida a duplicata que existia no seu código)
function configurarAcoesDesafio(moduloId) {
  const btnIniciar = document.getElementById("btnIniciarDesafio");
  const btnVoltarMapa = document.getElementById("btnVoltarMapa");

  if (btnIniciar) {
    btnIniciar.addEventListener("click", () => {
      sessionStorage.setItem("modulo_alvo_desafio", moduloId);
      btnIniciar.disabled = true;

      document.body.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "scale(1.02)";

      setTimeout(() => {
        window.location.replace(`/questionario?modulo=${moduloId}`);
      }, 450);
    });
  }

  if (btnVoltarMapa) {
    btnVoltarMapa.addEventListener("click", () => {
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

async function carregarVidasDesafio() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) return;

    const data = await response.json();
    // Aqui mantemos a lógica original do backend apenas para as VIDAS, que é seguro
    const moduloAtual = data.modulos?.find(m => m.desafio_atual);
    
    if (moduloAtual) {
      const container = document.getElementById("vidasDesafio");
      if (typeof renderizarVidas === 'function') {
        renderizarVidas(container, moduloAtual.falhas_no_modulo);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar vidas:", error);
  }
}