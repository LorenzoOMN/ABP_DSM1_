const ID_MODULO = 5;

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

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();

  await carregarEstadoHistoria();

  configurarScrollParaBotoes();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarInteracoesSimples();
  configurarConclusaoHistoria();
  configurarEntradaDesafio();
});