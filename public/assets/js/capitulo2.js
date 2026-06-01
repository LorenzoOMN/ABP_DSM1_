const ID_MODULO = 2;
const ROTA_DESAFIO_CAPITULO2 = "/desafio1";
const SCROLL_OFFSET_CAPITULO2 = 150;

const guardioesData = {
  bardo: {
    titulo: "O Bardo da Compreensão",
    texto:
      "Product Owner: maximiza o valor do produto, mantém o Product Backlog claro e ordenado e ajuda o time a entender o que deve vir primeiro.",
  },
  corvo: {
    titulo: "O Corvo e a Cadeira Vazia",
    texto:
      "Scrum Master: facilita o Scrum, remove impedimentos e ajuda todos a compreenderem e aplicarem o framework corretamente.",
  },
  equipe: {
    titulo: "Os Aventureiros",
    texto:
      "Developers: planejam, constroem e entregam Incrementos utilizáveis. São multifuncionais e compartilham a responsabilidade pela qualidade.",
  },
};

const papeisData = {
  po: {
    titulo: "Product Owner",
    texto:
      "Responsável por maximizar o valor do produto e ordenar o Product Backlog conforme prioridade e valor.",
  },
  sm: {
    titulo: "Scrum Master",
    texto:
      "Responsável por garantir que o Scrum seja compreendido e aplicado, além de ajudar o time removendo impedimentos.",
  },
  devs: {
    titulo: "Developers",
    texto:
      "Responsáveis por planejar, construir e entregar o Incremento durante a Sprint.",
  },
};

function obterTokenCapitulo2() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

function rolarParaElementoCapitulo2(seletor, offset = SCROLL_OFFSET_CAPITULO2) {
  const alvo = document.querySelector(seletor);

  if (!alvo) return;

  const posicaoAlvo = alvo.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: posicaoAlvo,
    behavior: "smooth",
  });
}

function configurarScrollCapitulo2() {
  document.querySelectorAll("[data-scroll-to]").forEach((botao) => {
    botao.addEventListener("click", () => {
      rolarParaElementoCapitulo2(botao.dataset.scrollTo);
    });
  });
}

function ajustarHashInicialCapitulo2() {
  if (!window.location.hash) return;

  setTimeout(() => {
    rolarParaElementoCapitulo2(window.location.hash);
  }, 250);
}

function configurarMangaIntroCapitulo2() {
  const secao = document.querySelector(".manga-intro");
  const frases = Array.from(document.querySelectorAll("[data-manga-frase]"));

  if (!secao || frases.length === 0) return;

  function atualizarFrases() {
    const rect = secao.getBoundingClientRect();
    const alturaRolavel = secao.offsetHeight - window.innerHeight;
    const progresso = Math.min(1, Math.max(0, -rect.top / Math.max(alturaRolavel, 1)));
    const indiceAtual = Math.min(frases.length - 1, Math.floor(progresso * frases.length));

    frases.forEach((frase, index) => {
      frase.classList.toggle("is-active", index === indiceAtual);
      frase.classList.toggle("is-past", index < indiceAtual);
    });
  }

  atualizarFrases();
  window.addEventListener("scroll", atualizarFrases, { passive: true });
  window.addEventListener("resize", atualizarFrases);
}

function configurarRevealCapitulo2() {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
      });
    },
    { threshold: 0.16 },
  );

  elementos.forEach((elemento) => observer.observe(elemento));
}

function configurarProgressoCapitulo2() {
  const secoes = document.querySelectorAll("[data-step]");
  const marcadores = document.querySelectorAll(".chapter-progress .progress-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const step = entry.target.dataset.step;

        marcadores.forEach((marcador) => {
          marcador.classList.toggle("active", marcador.dataset.step === step);
        });
      });
    },
    { threshold: 0.42 },
  );

  secoes.forEach((secao) => observer.observe(secao));
}

function configurarGuardioes() {
  const card = document.getElementById("guardiaoInfo");

  document.querySelectorAll(".guardiao-personagem").forEach((botao) => {
    botao.addEventListener("click", () => {
      const guardiao = guardioesData[botao.dataset.guardiao];

      if (!guardiao || !card) return;

      card.innerHTML = `
        <h3>${guardiao.titulo}</h3>
        <p>${guardiao.texto}</p>
      `;
    });
  });
}

function configurarCardsDePapeis() {
  const card = document.getElementById("papelInfo");

  document.querySelectorAll(".papel-card").forEach((papelCard) => {
    papelCard.addEventListener("click", () => {
      const papel = papeisData[papelCard.dataset.papel];

      if (!papel || !card) return;

      card.innerHTML = `
        <h3>${papel.titulo}</h3>
        <p>${papel.texto}</p>
      `;
    });
  });
}

async function concluirHistoriaCapitulo2() {
  const token = obterTokenCapitulo2();

  if (!token) return;

  const btnConcluir = document.getElementById("btnConcluirHistoriaCapitulo2");
  const btnDesafio = document.getElementById("btnIrDesafioCapitulo2");
  const porta = document.getElementById("porta2Scene");
  const status = document.getElementById("statusHistoriaCapitulo2");
  const tooltip = document.querySelector(".porta2-tooltip");

  if (btnConcluir) {
    btnConcluir.disabled = true;
    btnConcluir.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon está registrando sua jornada...";
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

    localStorage.setItem("moduloAtual", String(ID_MODULO));

    if (status) {
      status.textContent = "História concluída. A segunda porta foi liberada.";
    }

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (btnDesafio) {
      btnDesafio.classList.remove("hidden");
    }

    if (porta) {
      porta.classList.add("porta-liberada");
    }

    if (tooltip) {
      tooltip.textContent = "A porta se abriu... os guardiões chamam pelo seu teste.";
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

function entrarNoDesafioCapitulo2() {
  localStorage.setItem("moduloAtual", String(ID_MODULO));
  window.location.href = ROTA_DESAFIO_CAPITULO2;
}

function configurarConclusaoCapitulo2() {
  const btnConcluir = document.getElementById("btnConcluirHistoriaCapitulo2");
  const btnDesafio = document.getElementById("btnIrDesafioCapitulo2");
  const porta = document.getElementById("porta2Scene");

  if (btnConcluir) {
    btnConcluir.addEventListener("click", concluirHistoriaCapitulo2);
  }

  if (btnDesafio) {
    btnDesafio.addEventListener("click", entrarNoDesafioCapitulo2);
  }

  if (porta) {
    porta.addEventListener("click", () => {
      if (!porta.classList.contains("porta-liberada")) return;
      entrarNoDesafioCapitulo2();
    });
  }
}

function configurarDesbloqueioNavbarCapitulo2() {
  const secaoFinal = document.getElementById("porta2");

  if (!secaoFinal) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (typeof mostrarNavbarInferior === "function") {
          mostrarNavbarInferior();
        }

        observer.disconnect();
      });
    },
    { threshold: 0.45 },
  );

  observer.observe(secaoFinal);
}

document.addEventListener("DOMContentLoaded", () => {
  configurarMangaIntroCapitulo2();
  configurarScrollCapitulo2();
  configurarRevealCapitulo2();
  configurarProgressoCapitulo2();
  configurarGuardioes();
  configurarCardsDePapeis();
  configurarConclusaoCapitulo2();
  configurarDesbloqueioNavbarCapitulo2();
  ajustarHashInicialCapitulo2();
});
