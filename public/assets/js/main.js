/* =========================================================
   MAIN.JS
   ---------------------------------------------------------
   Arquivo global utilizado em múltiplas páginas do projeto.
   Manter aqui apenas funções compartilhadas entre páginas.
========================================================= */

/* =========================================================
   ESTADO DA SESSÃO (IN-MEMORY)
   - Não persiste entre recarregamentos/contas
   - Usado para controle temporário de UI
========================================================= */
window.__progressoSessao = window.__progressoSessao || {};

/* =========================================================
   DEBUG: LIBERAR TODAS AS ROTAS E CAPITULOS
========================================================= */

const DEBUG_UNLOCK_ALL_KEY = "scrum_dungeon_debug_unlock_all";
const DEBUG_UNLOCK_TOKEN = "debug-unlock-token";

function isDebugUnlockAllEnabled() {
  try {
    return localStorage.getItem(DEBUG_UNLOCK_ALL_KEY) === "true";
  } catch (_error) {
    return false;
  }
}

function garantirSessaoDebugLocal() {
  if (!isDebugUnlockAllEnabled()) return;

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", DEBUG_UNLOCK_TOKEN);
  }

  if (!localStorage.getItem("nome")) {
    localStorage.setItem("nome", "Debug Unlock");
  }
}

function criarProgressoDebug() {
  return {
    modulos: Array.from({ length: 5 }, (_, index) => ({
      id_modulo: index + 1,
      historia_liberada: true,
      historia_concluida: true,
      desafio_atual: true,
      desafio_concluido: false,
      certificado_liberado: true,
    })),
  };
}

function criarRespostaJsonDebug(payload, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(payload), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
}

function normalizarUrlDebug(input) {
  if (typeof window === "undefined") return null;

  try {
    if (input instanceof Request) {
      return new URL(input.url, window.location.origin);
    }

    return new URL(String(input), window.location.origin);
  } catch (_error) {
    return null;
  }
}

garantirSessaoDebugLocal();

if (!window.__debugUnlockAllFetchPatched) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = function fetchComDebugUnlock(input, init) {
    if (!isDebugUnlockAllEnabled()) {
      return originalFetch(input, init);
    }

    garantirSessaoDebugLocal();

    const url = normalizarUrlDebug(input);
    const pathname = url?.pathname || "";

    if (pathname === "/api/usuarios/me") {
      return criarRespostaJsonDebug({
        id_usuario: 1,
        nome: "Debug Unlock",
        email: "debug@scrumdungeon.local",
        barra_desbloqueada: true,
        is_admin: true,
      });
    }

    if (pathname === "/api/progresso/mapa") {
      return criarRespostaJsonDebug(criarProgressoDebug());
    }

    if (pathname === "/api/navbar/status") {
      return criarRespostaJsonDebug({
        barra_desbloqueada: true,
        desbloqueada: true,
      });
    }

    if (pathname === "/api/navbar/desbloquear") {
      return criarRespostaJsonDebug({
        sucesso: true,
        barra_desbloqueada: true,
      });
    }

    if (/^\/api\/progresso\/historia\/\d+\/concluir$/.test(pathname)) {
      return criarRespostaJsonDebug({
        sucesso: true,
        message: "Progresso liberado em modo debug.",
      });
    }

    if (pathname === "/api/perfil/sessao/iniciar") {
      return criarRespostaJsonDebug({
        id_sessao: "debug-session",
      });
    }

    if (pathname === "/api/perfil/sessao/finalizar") {
      return criarRespostaJsonDebug({
        sucesso: true,
      });
    }

    return originalFetch(input, init);
  };

  window.__debugUnlockAllFetchPatched = true;
}

window.debugLiberarRotas = function debugLiberarRotas() {
  localStorage.setItem(DEBUG_UNLOCK_ALL_KEY, "true");
  garantirSessaoDebugLocal();
  window.location.href = "/mapa";
};

window.debugRestaurarRotas = function debugRestaurarRotas() {
  localStorage.removeItem(DEBUG_UNLOCK_ALL_KEY);

  if (localStorage.getItem("token") === DEBUG_UNLOCK_TOKEN) {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
  }

  window.__progressoSessao = {};
  window.location.reload();
};

/* =========================================================
   BARREIRAS DE ACESSO POR PROGRESSO
========================================================= */

(async function protegerRotasPorProgresso() {
  if (isDebugUnlockAllEnabled()) {
    garantirSessaoDebugLocal();
    return;
  }

  const rotaAtual = window.location.pathname;
  const rotasPublicas = ["/"];
  const rotasComBarreira = [
    "/mapa", "/burningdown", "/artefatos", "/coleta-artefato",
    "/perfil", "/certificado", "/questionario", "/questionario1", "/resultado",
  ];
  const rotaCapitulo = rotaAtual.match(/^\/capitulo([1-5])$/);
  const rotaDesafio = rotaAtual.match(/^\/desafio([1-5])$/);
  const precisaValidar = rotaCapitulo || rotaDesafio || rotasComBarreira.includes(rotaAtual);

  if (!precisaValidar || rotasPublicas.includes(rotaAtual)) return;

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("/");
    return;
  }

  try {
    // ✅ Valida se o token ainda é válido no backend
    const response = await fetch("/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401 || response.status === 403) {
      // Token inválido (usuário deletado, banco reiniciado, etc)
      console.warn("Token inválido, fazendo logout...");
      fazerLogout();
      return;
    }

    if (!response.ok) {
      throw new Error("Nao foi possivel validar usuario.");
    }

    const progresso = await obterProgressoDaJornada(token);
    const modulos = Array.isArray(progresso?.modulos) ? progresso.modulos : [];
    const moduloAtual = modulos.find((modulo) => modulo.desafio_atual) || modulos[0];

    if (
      rotaAtual !== "/resultado" &&
      await deveRetomarResultadoDaBatalha(rotaAtual, token)
    ) {
      window.location.replace("/resultado");
      return;
    }

    const podeAcessar = await podeAcessarRotaDaJornada(
      rotaAtual,
      modulos,
      token,
    );

    if (!modulos.length || !podeAcessar) {
      window.location.replace(criarRotaSeguraDaJornada(moduloAtual));
    }
  } catch (error) {
    console.warn("Falha ao validar acesso da rota.", error);
  }
})();

async function obterProgressoDaJornada(token) {
  if (isDebugUnlockAllEnabled()) {
    const progressoDebug = criarProgressoDebug();
    window.__progressoSessao.progressoMapa = progressoDebug;
    return progressoDebug;
  }

  if (window.__progressoSessao.progressoMapa) {
    return window.__progressoSessao.progressoMapa;
  }

  const response = await fetch("/api/progresso/mapa", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel validar o progresso.");
  }

  const progresso = await response.json();
  window.__progressoSessao.progressoMapa = progresso;
  return progresso;
}

async function podeAcessarRotaDaJornada(rota, modulos, token) {
  if (isDebugUnlockAllEnabled()) {
    return true;
  }

  const rotaCapitulo = rota.match(/^\/capitulo([1-5])$/);
  const rotaDesafio = rota.match(/^\/desafio([1-5])$/);
  const moduloAtual = modulos.find((modulo) => modulo.desafio_atual);

  if (rotaCapitulo) {
    const idModulo = Number(rotaCapitulo[1]);
    const modulo = modulos.find((item) => Number(item.id_modulo) === idModulo);
    return Boolean(modulo?.historia_liberada);
  }

  if (rotaDesafio) {
    const idModulo = Number(rotaDesafio[1]);
    const modulo = modulos.find((item) => Number(item.id_modulo) === idModulo);
    return Boolean(modulo?.historia_concluida && modulo?.desafio_atual);
  }

  if (rota === "/questionario" || rota === "/questionario1") {
    return Boolean(moduloAtual?.historia_concluida);
  }

  if (rota === "/certificado") {
    return modulos.some((modulo) => modulo.certificado_liberado);
  }

  if (rota === "/artefatos") {
    const primeiroModulo = modulos.find((modulo) => Number(modulo.id_modulo) === 1);
    return Boolean(primeiroModulo?.historia_concluida);
  }

  if (rota === "/coleta-artefato") {
    const idModulo = Number(new URLSearchParams(window.location.search).get("modulo"));
    const moduloSessao = Number(sessionStorage.getItem("modulo_artefato_pendente"));
    const modulo = modulos.find((item) => Number(item.id_modulo) === idModulo);

    const contextoAtualDaColeta = Boolean(
      idModulo &&
        modulo &&
        moduloSessao === idModulo &&
        (!modulo.desafio_atual || modulo.certificado_liberado)
    );

    if (contextoAtualDaColeta) {
      return true;
    }

    return await usuarioTemArtefatoDoModulo(token, idModulo);
  }

  if (rota === "/resultado") {
    return Boolean(moduloAtual?.historia_concluida);
  }

  return true;
}

async function usuarioTemArtefatoDoModulo(token, idModulo) {
  if (!token || !Number.isInteger(idModulo) || idModulo <= 0) {
    return false;
  }

  try {
    const response = await fetch(`/api/artefatos/modulo/${idModulo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json();
    return payload?.data?.desbloqueado === true;
  } catch (error) {
    console.warn("Falha ao validar artefato desbloqueado.", error);
    return false;
  }
}

async function deveRetomarResultadoDaBatalha(rota, token) {
  const rotaDesafio = /^\/desafio[1-5]$/.test(rota);
  const rotaQuestionario = rota === "/questionario" || rota === "/questionario1";

  if (!token || (!rotaDesafio && !rotaQuestionario)) {
    return false;
  }

  try {
    const response = await fetch("/api/questoes/status-atual", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return false;
    }

    const status = await response.json();
    return status?.concluido === true;
  } catch (error) {
    console.warn("Falha ao verificar retomada do resultado.", error);
    return false;
  }
}

function criarRotaSeguraDaJornada(moduloAtual) {
  const idModuloAtual = Number(moduloAtual?.id_modulo) || 1;

  if (moduloAtual?.historia_concluida) {
    return `/desafio${idModuloAtual}`;
  }

  return `/capitulo${idModuloAtual}`;
}

/* =========================================================
   MENU MOBILE (HEADER)
========================================================= */

(function () {
  const menuToggle = document.getElementById("menuToggle");
  const menuPrincipal = document.getElementById("menuPrincipal");

  // Encerra caso o menu não exista na página
  if (!menuToggle || !menuPrincipal) {
    return;
  }

  /* =========================================
     ABRIR / FECHAR MENU MOBILE
  ========================================= */

  menuToggle.addEventListener("click", function () {
    const aberto = menuPrincipal.classList.toggle("ativo");

    menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  /* =========================================
     FECHAR MENU AO CLICAR EM UM LINK
  ========================================= */

  menuPrincipal.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuPrincipal.classList.remove("ativo");

      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* =========================================
      RESETAR MENU AO VOLTAR PARA DESKTOP
  ========================================= */

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      menuPrincipal.classList.remove("ativo");

      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* =========================================================
 HEADER ATIVO POR SEÇÃO
========================================================= */

function atualizarMenuAtivo() {
  const inicio = document.getElementById("inicio");
  const sobre = document.getElementById("sobre");

  const linkInicio = document.getElementById("linkInicio");
  const linkSobre = document.getElementById("linkSobre");

  // Encerra caso os elementos não existam
  if (!inicio || !sobre || !linkInicio || !linkSobre) {
    return;
  }

  const scrollPos = window.scrollY;

  // Define ponto de ativação da seção Sobre
  const pontoSobre = sobre.offsetTop - 200;

  // Remove classes ativas
  linkInicio.classList.remove("ativo");
  linkSobre.classList.remove("ativo");

  // Define qual item ficará ativo
  if (scrollPos >= pontoSobre) {
    linkSobre.classList.add("ativo");
  } else {
    linkInicio.classList.add("ativo");
  }
}

// Eventos
window.addEventListener("scroll", atualizarMenuAtivo);
window.addEventListener("load", atualizarMenuAtivo);

/* =========================================================
 NAVEGAÇÃO INFERIOR ATIVA
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btnToggleNavbar");
  const navbarPrincipal = document.getElementById("navbarPrincipal");

  if (btnToggle && navbarPrincipal) {
    // 1. Abre e fecha ao clicar no botão de espada/ícone
    btnToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que o clique feche imediatamente pelo listener global
      navbarPrincipal.classList.toggle("navbar-aberta");

      // Opcional: Altera o ícone dinamicamente entre abrir (⚔️) e fechar (❌)
      const iconSpan = btnToggle.querySelector(".toggle-icon");
      if (iconSpan) {
        if (navbarPrincipal.classList.contains("navbar-aberta")) {
          iconSpan.textContent = "❌";
        } else {
          iconSpan.textContent = "⚔️";
        }
      }
    });

    // 2. Fecha a barra caso o usuário clique fora dela (na tela do sistema)
    document.addEventListener("click", (e) => {
      if (
        !navbarPrincipal.contains(e.target) &&
        !btnToggle.contains(e.target)
      ) {
        if (navbarPrincipal.classList.contains("navbar-aberta")) {
          navbarPrincipal.classList.remove("navbar-aberta");
          const iconSpan = btnToggle.querySelector(".toggle-icon");
          if (iconSpan) iconSpan.textContent = "⚔️";
        }
      }
    });
  }

  // Lógica existente de marcar a rota atual ativa
  const rotaAtual = window.location.pathname;
  const itensMenu = document.querySelectorAll(".navegacao-inferior__item");

  itensMenu.forEach((item) => {
    if (item.getAttribute("data-rota") === rotaAtual) {
      item.classList.add("item-ativo"); // Adicione estilização no seu CSS para a classe ativa se quiser
    }
  });
});
/* =========================================================
 ALERTA CUSTOMIZADO
========================================================= */

/*
  TIPOS DISPONÍVEIS:
  - sucesso
  - erro
*/

function mostrarAlerta(mensagem, tipo) {
  const alerta = document.getElementById("custom-alert");
  const texto = document.getElementById("custom-alert-message");

  if (!alerta || !texto) {
    console.warn("mostrarAlerta: #custom-alert não encontrado.", mensagem);
    return;
  }

  // Define mensagem
  texto.innerText = mensagem;

  // Remove estados antigos
  alerta.classList.remove("hidden", "sucesso", "erro");

  // Aplica novo tipo
  alerta.classList.add(tipo);

  // Exibe alerta
  alerta.style.display = "flex";
}

/* =========================================
 FECHAR ALERTA
========================================= */

function fecharAlerta() {
  const alerta = document.getElementById("custom-alert");

  alerta.classList.add("hidden");

  alerta.classList.remove("sucesso", "erro");

  alerta.style.display = "none";
}

/* =========================================================
 ALTURA DINÂMICA DO FOOTER
========================================================= */

function atualizarAlturaFooter() {
  const footer = document.querySelector("footer");

  // Encerra caso não exista footer
  if (!footer) return;

  const alturaFooter = footer.offsetHeight;

  document.documentElement.style.setProperty(
    "--footer-height",
    `${alturaFooter}px`,
  );
}

/* =========================================================
 ALTURA DINÂMICA DO HEADER
========================================================= */

function atualizarAlturaHeader() {
  const header = document.querySelector("header");

  // Encerra caso não exista header
  if (!header) return;

  const alturaHeader = header.offsetHeight;

  document.documentElement.style.setProperty(
    "--header-height",
    `${alturaHeader}px`,
  );
}

function atualizarAlturasFixas() {
  atualizarAlturaFooter();
  atualizarAlturaHeader();
}

function agendarAtualizacaoAlturas() {
  window.requestAnimationFrame(atualizarAlturasFixas);
}

/* =========================================================
 CONTROLE GLOBAL DE NAVEGAÇÃO
========================================================= */

// páginas que NÃO devem entrar no histórico de retorno
const paginasBloqueadas = ["/questionario1", "/resultado", "desafio1"];

// página atual
const paginaAtual = window.location.pathname;

// pega a última página visitada
const paginaAnterior = sessionStorage.getItem("paginaAtual");

// salva como "última válida" apenas se NÃO for bloqueada
if (paginaAnterior && !paginasBloqueadas.includes(paginaAnterior)) {
  sessionStorage.setItem("ultimaPaginaValida", paginaAnterior);
}

// atualiza a página atual
sessionStorage.setItem("paginaAtual", paginaAtual);

/* =========================================================
 EVENTOS GLOBAIS
========================================================= */

// Quando a página termina de carregar
window.addEventListener("load", () => {
  agendarAtualizacaoAlturas();

  if (typeof marcarItemAtivoDaNavegacaoInferior === "function") {
    marcarItemAtivoDaNavegacaoInferior();
  }
});

// Quando a tela é redimensionada
window.addEventListener("resize", agendarAtualizacaoAlturas);

/* =========================================================
   NAVBAR PERMANENTE — CONTROLE POR USUÁRIO
   Usa localStorage com chave única por token para evitar conflitos
========================================================= */

async function controlarVisibilidadeNavbar() {
  const navbar = document.querySelector(".navegacao-inferior");
  if (!navbar) return;

  let deveMostrar = false;
  const token = localStorage.getItem("token");

  // Tenta backend primeiro
  if (token) {
    try {
      const res = await fetch("/api/navbar/status", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.barra_desbloqueada === "boolean") {
          deveMostrar = data.barra_desbloqueada;
          localStorage.setItem(
            getChaveProgressoUsuario(),
            deveMostrar ? "true" : "false",
          );
        }
      }
    } catch (e) {
      console.warn("Fallback localStorage", e);
    }
  }

  // Fallback localStorage
  if (!token || typeof deveMostrar !== "boolean") {
    const chave = getChaveProgressoUsuario();
    deveMostrar = localStorage.getItem(chave) === "true";
  }

  // Aplica estado final
  if (deveMostrar) {
    navbar.classList.remove("bloqueada", "hidden");
    navbar.classList.add("navbar-visivel");
    navbar.style.display = "flex";
  } else {
    navbar.classList.add("bloqueada", "hidden");
    navbar.classList.remove("navbar-visivel");
    navbar.style.display = "none";
  }
}

/**
 * Gera chave única de progresso baseada no token do usuário
 */
function calcularOffsetNavbarMobilePorFooter(footerRect, viewportHeight) {
  if (!footerRect || !Number.isFinite(viewportHeight)) return 0;
  if (footerRect.top >= viewportHeight || footerRect.bottom <= 0) return 0;

  const alturaVisivel = viewportHeight - footerRect.top;
  return Math.max(0, Math.min(alturaVisivel, footerRect.height));
}

function atualizarOffsetNavbarMobilePorFooter() {
  const container = document.querySelector(".navbar-container-fixo");
  const navbar = document.querySelector(".navegacao-inferior");
  const footer = document.querySelector("footer");
  const mobile = window.matchMedia("(max-width: 768px)").matches;

  if (!container || !mobile) {
    document.documentElement.style.setProperty("--mobile-navbar-footer-offset", "0px");
    document.documentElement.style.setProperty("--mobile-navbar-height", "0px");
    return;
  }

  const navbarHeight = Math.round(navbar?.getBoundingClientRect().height || 0);
  document.documentElement.style.setProperty("--mobile-navbar-height", `${navbarHeight || 76}px`);

  const offset = footer
    ? calcularOffsetNavbarMobilePorFooter(footer.getBoundingClientRect(), window.innerHeight)
    : 0;

  document.documentElement.style.setProperty("--mobile-navbar-footer-offset", `${Math.round(offset)}px`);
}

function agendarOffsetNavbarMobilePorFooter() {
  if (window.__navbarFooterOffsetFrame) return;

  window.__navbarFooterOffsetFrame = window.requestAnimationFrame(() => {
    window.__navbarFooterOffsetFrame = null;
    atualizarOffsetNavbarMobilePorFooter();
  });
}

document.addEventListener("DOMContentLoaded", atualizarOffsetNavbarMobilePorFooter);
window.addEventListener("load", atualizarOffsetNavbarMobilePorFooter);
window.addEventListener("scroll", atualizarOffsetNavbarMobilePorFooter, { passive: true });
window.addEventListener("resize", agendarOffsetNavbarMobilePorFooter);

function getChaveProgressoUsuario() {
  const token = localStorage.getItem("token");
  if (!token) return "capitulo1_concluido_anon";

  // Cria hash simples do token para chave única
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  return `capitulo1_concluido_${Math.abs(hash)}`;
}

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", controlarVisibilidadeNavbar);

/* =========================================================
   BOTAO GLOBAL DE LOGOUT
========================================================= */

function atualizarBotaoLogout() {
  const botaoLogout = document.getElementById("botao-logout");
  if (!botaoLogout) return;

  const usuarioLogado = Boolean(localStorage.getItem("token"));
  botaoLogout.hidden = !usuarioLogado;
}

document.addEventListener("DOMContentLoaded", () => {
  const botaoLogout = document.getElementById("botao-logout");
  if (!botaoLogout) return;

  atualizarBotaoLogout();
  botaoLogout.addEventListener("click", fazerLogout);
});

/* =========================================================
   FUNÇÃO CENTRALIZADA DE LOGOUT
========================================================= */

function fazerLogout() {
  console.log("Fazendo logout...");
  
  // Remove TODOS os dados do usuário
  localStorage.removeItem("token");
  localStorage.removeItem("nome");
  localStorage.removeItem("cpf");
  localStorage.removeItem("usuario");
  localStorage.removeItem("musicaAtiva");
  localStorage.removeItem("efeitosAtivos");
  localStorage.removeItem("efeitosSonoros");
  
  // Limpa variáveis de sessão
  if (typeof idSessaoGlobal !== "undefined" && idSessaoGlobal) {
    finalizarSessaoGlobal();
  }
  
  // Redireciona para a home
  window.location.replace("/");
}

// Torna disponível globalmente
window.fazerLogout = fazerLogout;

  //=========== SINCRONIZAÇÃO DE LOGOUT ENTRE ABAS ===========
window.addEventListener("storage", (event) => {
  // Quando o token for removido em outra aba, remove nesta também
  if (event.key === "token" && !event.newValue) {
    console.log("Logout detectado em outra aba, sincronizando...");
    fazerLogout();
  }
});

/*=========== FUNÇAO LOGOUT ===========*/
function logout() {
  fazerLogout();
}

  //===========  INICIALIZAÇÃO DO BOTÃO DE LOGOUT ===========
document.addEventListener("DOMContentLoaded", async () => {
  // Configura botão de logout
  const botaoLogout = document.getElementById("botao-logout");
  const token = localStorage.getItem("token");
  
  if (botaoLogout) {
    if (token) {
      // Remove o hidden e adiciona o evento de click
      botaoLogout.removeAttribute("hidden");
      botaoLogout.style.display = "block";
      botaoLogout.addEventListener("click", logout);
    } else {
      // Garante que esteja escondido
      botaoLogout.setAttribute("hidden", "");
      botaoLogout.style.display = "none";
    }
  }
});

/**
 * Marca capítulo 1 como concluído para o usuário atual
 */
function marcarCapitulo1Concluido() {
  const chave = getChaveProgressoUsuario();
  localStorage.setItem(chave, "true");
  mostrarNavbarInferior();
}

/**
 * Verifica se capítulo 1 foi concluído pelo usuário atual
 */
function usuarioConcluiuCapitulo1() {
  const chave = getChaveProgressoUsuario();
  return localStorage.getItem(chave) === "true";
}

/**
 * Mostra a navbar inferior com animação
 */
function mostrarNavbarInferior() {
  const container = document.querySelector(".navbar-container-fixo");
  const navbar = document.getElementById("navbarPrincipal");
  const btnToggle = document.getElementById("btnToggleNavbar");

  if (container) {
    container.classList.remove("navbar-bloqueada");
  }

  if (navbar) {
    navbar.classList.remove("hidden", "bloqueada");
    navbar.classList.add("navbar-visivel");
    navbar.style.display = "flex";
  }

  if (btnToggle) {
    btnToggle.classList.remove("navbar-bloqueada");
    btnToggle.hidden = false;
  }
}

/**
 * Esconde a navbar inferior
 */
function esconderNavbarInferior() {
  const container = document.querySelector(".navbar-container-fixo");
  const navbar = document.getElementById("navbarPrincipal");
  const btnToggle = document.getElementById("btnToggleNavbar");

  if (container) {
    container.classList.add("navbar-bloqueada");
  }

  if (navbar) {
    navbar.classList.remove("navbar-visivel", "navbar-aberta");
    navbar.classList.add("bloqueada");
    navbar.style.display = "none";
  }

  if (btnToggle) {
    btnToggle.classList.add("navbar-bloqueada");
    btnToggle.hidden = true;

    const iconSpan = btnToggle.querySelector(".toggle-icon");
    if (iconSpan) {
      iconSpan.textContent = "⚔️";
    }
  }
}

/**
 * Verifica e atualiza estado da navbar - EXECUTA EM TODAS AS PÁGINAS
 */
async function verificarEAtualizarNavbar() {
  const navbar = document.getElementById("navbarPrincipal");
  if (!navbar) return;

  // Prioriza buscar do backend se houver token
  const token = localStorage.getItem("token");
  let barraDesbloqueada = false;

  if (token) {
    const statusBackend = await buscarStatusNavbarDoBackend();
    if (statusBackend !== null) {
      barraDesbloqueada = statusBackend;
    }
  }

  // Atualiza UI conforme status
  if (barraDesbloqueada) {
    mostrarNavbarInferior();
  } else {
    esconderNavbarInferior();
  }
}

/**
 * Busca status da navbar do backend para o usuário logado
 */
async function buscarStatusNavbarDoBackend() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // URL correta conforme sua estrutura
    const response = await fetch("/api/navbar/status", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao buscar status");

    const data = await response.json();
    return data.barra_desbloqueada;
  } catch (error) {
    console.error("Erro ao buscar status da navbar:", error);
    return null;
  }
}

/**
 * Desbloqueia navbar no backend
 */
async function desbloquearNavbarNoBackend() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch("/api/navbar/desbloquear", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao desbloquear");

    const data = await response.json();

    // 👇 MOSTRA O ALERTA (antes do return!)
   mostrarModalNavbarDesbloqueada();

    console.log("Navbar desbloqueada");
    return data.sucesso !== false; // retorna true se sucesso for true ou undefined
  } catch (error) {
    console.error("Erro ao desbloquear navbar:", error);

    // 👇 Mostra alerta de erro também
    mostrarAlerta("Erro ao desbloquear navbar", "erro");

    return false;
  }
}

// Torna disponível globalmente
window.desbloquearNavbarNoBackend = desbloquearNavbarNoBackend;

// Inicialização automática da navbar em todas as páginas
window.addEventListener("load", async () => {
  agendarAtualizacaoAlturas();
  await controlarVisibilidadeNavbar();

  const navbar = document.querySelector(".navegacao-inferior");
  if (navbar && !navbar.classList.contains("bloqueada")) {
    // controlarSobreposicaoNavbarFooter();  ← COMENTE ESTA LINHA (já está no DOMContentLoaded)
  }

  window.addEventListener("popstate", async () => {
    await controlarVisibilidadeNavbar();
  });
});

function mostrarModalNavbarDesbloqueada() {
  const modal = document.getElementById("navbarUnlockModal");
  const btnContinuar = document.getElementById("btnContinuarAventura");

  if (!modal) return;

  modal.classList.remove("hidden");

  if (btnContinuar) {
    btnContinuar.onclick = () => {
      modal.classList.add("hidden");
    };
  }
}


function renderizarVidas(container, falhasNoModulo, totalTentativas = 2) {
  if (!container) return;

  container.innerHTML = "";

  const falhas = Number(falhasNoModulo) || 0;

  for (let i = 1; i <= totalTentativas; i++) {
    const img = document.createElement("img");

    img.classList.add("vida-icon");

    if (i <= falhas) {
      img.src = "/assets/img/vida-icon-perdeu.png";
      img.alt = "Tentativa perdida";
    } else {
      img.src = "/assets/img/vida-icon.png";
      img.alt = "Tentativa disponível";
    }

    container.appendChild(img);
  }
}

/**
 * Glossario
 */
async function glossario() {
  // pega o json
  const r = await fetch("/assets/data/dicionario.json");

  // transforma em objeto JS
  const d = await r.json();

  // pega todos elementos glossario
  const termos = document.querySelectorAll(".glossario");

  termos.forEach((el) => {
    // pega o ID
    const id = el.dataset.g;

    // acha definição
    const definicao = d[id];

    // se existir
    if (definicao) {
      // adiciona tooltip
      el.dataset.tip = definicao;
    }
  });
}

// Efeitos Sonoros

// Chave usada para salvar a preferência do usuário
const AUDIO_KEY = "efeitosSonoros";

// Retorna true ou false
function efeitosSonorosAtivos() {
  const valor = localStorage.getItem(AUDIO_KEY);

  // Se nunca configurou, assume ligado
  return valor !== "false";
}

// Salva a preferência
function definirEfeitosSonoros(ativo) {
  localStorage.setItem(AUDIO_KEY, ativo);
}

// Toca qualquer áudio respeitando a configuração
function tocarSom(caminho, volume = 1) {
  if (!efeitosSonorosAtivos()) {
    return;
  }

  const audio = new Audio(caminho);

  audio.volume = volume;

  audio.play().catch((erro) => {
    console.error("Erro ao tocar áudio:", erro);
  });
}

const somClickGlobal = new Audio("/assets/audio/click.mp3");

function efeitosSonorosAtivos() {
  return localStorage.getItem("efeitosAtivos") !== "false";
}

function tocarSomClick() {
  if (!efeitosSonorosAtivos()) {
    return;
  }

  somClickGlobal.volume = 0.06;
  somClickGlobal.currentTime = 0;

  somClickGlobal.play().catch((erro) => {
    console.error("Erro ao tocar áudio:", erro);
  });
}

document.addEventListener("click", (event) => {

  // Se estiver em uma página de questionário, não toca o som
  if (document.body.classList.contains("pagina-questionario")) {
    return;
  }

  if (
    [...document.body.classList].some((classe) =>
      classe.startsWith("capitulo")
    )
  ) {
    return;
  }


  const botao = event.target.closest("button");

  if (!botao) {
    return;
  }

  tocarSomClick();
});

function tocarEfeito(caminho, volume = 0.25) {

  if (!efeitosSonorosAtivos()) {
    return;
  }

  const audio = new Audio(caminho);

  audio.volume = volume;

  audio.play().catch((erro) => {
    console.error("Erro ao tocar áudio:", erro);
  });
}

glossario();

/* =========================================================
   SISTEMA DE SESSÃO GLOBAL (em todas as páginas)
========================================================= */

let idSessaoGlobal = null;
let tempoInicioSessao = null;
let sessaoFinalizada = false;

// Iniciar sessão quando a página carregar
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (token) {
        await iniciarSessaoGlobal();
    }
});

async function iniciarSessaoGlobal() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            // Sem token, não tenta iniciar sessão (página pública)
            return;
        }
        
        // Finaliza qualquer sessão anterior pendente
        if (idSessaoGlobal && !sessaoFinalizada) {
            await finalizarSessaoGlobal(true);
        }
        
        const response = await fetch("/api/perfil/sessao/iniciar", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
            const data = await response.json();
            idSessaoGlobal = data.id_sessao;
            tempoInicioSessao = Date.now();
            sessaoFinalizada = false;
            console.log("Sessão iniciada");
        } else if (response.status === 401) {
            // Token inválido ou expirado - limpa e não mostra erro
            localStorage.removeItem("token");
            localStorage.removeItem("nome");
            localStorage.removeItem("cpf");
            localStorage.removeItem("usuario");
        }
        // Outros erros são ignorados silenciosamente (página pública)
    } catch (error) {
        // Erros de rede são ignorados em páginas públicas
        if (error.message !== "Failed to fetch") {
            console.error("Erro ao iniciar sessão:", error);
        }
    }
}

async function finalizarSessaoGlobal(forçado = false) {
    if (!idSessaoGlobal || sessaoFinalizada) {
        return;
    }
    
    sessaoFinalizada = true;
    const duracaoMs = Date.now() - tempoInicioSessao;
    const duracaoSegundos = Math.floor(duracaoMs / 1000);
    
    try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Tenta finalizar via fetch normal primeiro
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        try {
            const response = await fetch("/api/perfil/sessao/finalizar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_sessao: idSessaoGlobal }),
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
            }
        } catch (fetchError) {
            console.log("Fetch falhou, tentando sendBeacon...");
            
            // Fallback com sendBeacon
            const data = JSON.stringify({ id_sessao: idSessaoGlobal });
            const blob = new Blob([data], { type: 'application/json' });
            
            if (navigator.sendBeacon) {
                const enviado = navigator.sendBeacon("/api/perfil/sessao/finalizar", blob);
                console.log("sendBeacon:", enviado ? "enviado" : "falhou");
            }
        }
        
        idSessaoGlobal = null;
        tempoInicioSessao = null;
    } catch (error) {
        console.error("Erro ao finalizar sessão:", error);
        sessaoFinalizada = false; // Permite tentar novamente
    }
}

// Eventos de finalização
window.addEventListener("beforeunload", () => {
    if (idSessaoGlobal) {
        finalizarSessaoGlobal();
    }
});

window.addEventListener("pagehide", () => {
    if (idSessaoGlobal) {
        finalizarSessaoGlobal();
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && idSessaoGlobal && !sessaoFinalizada) {
        finalizarSessaoGlobal();
    }
});

// Exporta funções
window.iniciarSessaoGlobal = iniciarSessaoGlobal;
window.finalizarSessaoGlobal = finalizarSessaoGlobal;
window.marcarCapitulo1Concluido = marcarCapitulo1Concluido;
window.usuarioConcluiuCapitulo1 = usuarioConcluiuCapitulo1;
window.verificarEAtualizarNavbar = verificarEAtualizarNavbar;
window.mostrarNavbarInferior = mostrarNavbarInferior;
window.atualizarOffsetNavbarMobilePorFooter = atualizarOffsetNavbarMobilePorFooter;
