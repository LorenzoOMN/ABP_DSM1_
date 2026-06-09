document.addEventListener("DOMContentLoaded", () => {
  animarEntrada();
  carregarResumoBurningDown();
  configurarRetornoAventura();
  carregarVidasBurningdown();
  tocarSomFogueira();
});

function tocarSomFogueira() {

  if (!efeitosSonorosAtivos()) {
    return;
  }

  const som = new Audio("/assets/audio/fogueira.mp3");

  som.volume = 0.3;

  som.play().catch((erro) => {
    console.error("Erro ao tocar áudio:", erro);
  });
}

function animarEntrada() {
  const left = document.querySelector(".burningdown-left");
  const right = document.querySelector(".burningdown-right");
  const btn = document.querySelector(".btn-retomar");

  if (left && right) {
    left.style.opacity = 0;
    right.style.opacity = 0;
    left.style.transform = "translateY(10px)";
    right.style.transform = "translateY(10px)";

    setTimeout(() => {
      left.style.transition = "0.6s ease";
      right.style.transition = "0.6s ease";

      left.style.opacity = 1;
      right.style.opacity = 1;
      left.style.transform = "translateY(0)";
      right.style.transform = "translateY(0)";
    }, 150);
  }

 if (btn) {
  setInterval(() => {
    btn.classList.add("pulsando");

    setTimeout(() => {
      btn.classList.remove("pulsando");
    }, 700);
  }, 1400);
}
}

async function carregarResumoBurningDown() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    preencherResumo(data.modulos || []);
  } catch (error) {
    console.error("Erro ao carregar Burning Down:", error);
  }
}

function preencherResumo(modulos) {
  const totalModulos = modulos.length || 5;
    const historiasConcluidas = modulos.filter(
    (modulo) => modulo.historia_concluida
  ).length;

  const moduloDesafioAtual = modulos.find(
    (modulo) => modulo.desafio_atual
  );

  const certificadoLiberado = modulos.some(
    (modulo) => modulo.certificado_liberado
  );

  const idModuloAtual = certificadoLiberado
    ? totalModulos
    : Number(moduloDesafioAtual?.id_modulo || 1);

  const desafiosConcluidos = certificadoLiberado
    ? totalModulos
    : Math.max(0, idModuloAtual - 1);

 const falhasNoModulo = Number(moduloDesafioAtual?.falhas_no_modulo || 0);

const totalTentativasGastas = Number(
  moduloDesafioAtual?.tentativas_gastas_total || 0
);

  const conteudosConcluidos = historiasConcluidas + desafiosConcluidos;
  const totalConteudos = totalModulos * 2;

  const porcentagemTotal = Math.round(
    (conteudosConcluidos / totalConteudos) * 100
  );

  atualizarTexto("capituloAtual", String(idModuloAtual).padStart(2, "0"));
  atualizarTexto("historiasCompletas", `${historiasConcluidas}/${totalModulos}`);
  atualizarTexto("desafiosCompletos", `${desafiosConcluidos}/${totalModulos}`);
  atualizarTexto("porcentagemTotal", `${porcentagemTotal}%`);
  atualizarTexto("tentativasGastas", totalTentativasGastas);


}

function atualizarTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = valor;
  }
}

function configurarRetornoAventura() {
  const btn = document.getElementById("btnRetomarAventura");

  if (!btn) return;

  btn.addEventListener("click", () => {
    const retorno = sessionStorage.getItem("retornoBurningdown");

    if (retorno) {
      sessionStorage.removeItem("origemBurningdown");
      sessionStorage.removeItem("retornoBurningdown");

      window.location.href = retorno;
      return;
    }

    window.location.href = "/mapa";
  });
}

async function carregarVidasBurningdown() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/api/progresso/mapa", {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    const moduloAtual = data.modulos.find(function (modulo) {
      return modulo.desafio_atual;
    });

    if (!moduloAtual) return;

    const container = document.getElementById("vidasBurningdown");

    renderizarVidas(container, moduloAtual.falhas_no_modulo);
  } catch (error) {
    console.error(error);
  }
}