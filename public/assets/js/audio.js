(function () {
  const botaoAudio = document.getElementById("botao-audio");
  if (!botaoAudio) return;

  const trilhasPorPagina = {
    "/": "/assets/sound/abp_mapa_sala.mp3",
    "/mapa": "/assets/sound/abp_mapa_sala.mp3",
    "/capitulo1": "/assets/sound/abp_mapa_sala.mp3",
    "/capitulo2": "/assets/sound/abp_mapa_sala.mp3",
    "/capitulo3": "/assets/sound/abp_mapa_sala.mp3",
    "/capitulo4": "/assets/sound/abp_mapa_sala.mp3",
    "/capitulo5": "/assets/sound/abp_mapa_sala.mp3",
    "/resultado": "/assets/sound/abp_mapa_sala.mp3",
    "/certificado": "/assets/sound/abp_mapa_sala.mp3",
    "/burningdown": "/assets/sound/abp_mapa_sala.mp3",
    "/artefatos": "/assets/sound/abp_mapa_sala.mp3",
    "/perfil": "/assets/sound/abp_mapa_sala.mp3",

    "/desafio1": "/assets/sound/abp_desafio.mp3",
    "/desafio2": "/assets/sound/abp_desafio.mp3",
    "/desafio3": "/assets/sound/abp_desafio.mp3",
    "/desafio4": "/assets/sound/abp_desafio.mp3",
    "/desafio5": "/assets/sound/abp_desafio.mp3",
    "/questionario1": "/assets/sound/abp_desafio.mp3",
    "/questionario": "/assets/sound/abp_desafio.mp3",
    "/admin": "/assets/sound/abp_desafio.mp3",
  };

  const caminhoAudio = trilhasPorPagina[window.location.pathname];

  //if (!caminhoAudio) {
  //  botaoAudio.hidden = true;
  //  return;
  //}

  const audio = new Audio(caminhoAudio);
  audio.loop = true;
  audio.volume = 0.35;

  const preferenciaAudio = localStorage.getItem("audioLigado");
  let ligado = preferenciaAudio !== "false";

  function atualizarBotao() {
    botaoAudio.innerHTML = "";
    botaoAudio.classList.toggle("audio-desligado", !ligado);
    botaoAudio.setAttribute(
      "aria-label",
      ligado ? "Desligar trilha sonora" : "Ligar trilha sonora",
    );
  }

  async function tocarAudio() {
    try {
      await audio.play();
    } catch {
      // Alguns navegadores bloqueiam autoplay ate a primeira interacao.
    }
  }

  async function aplicarEstado() {
    atualizarBotao();

    if (ligado) {
      await tocarAudio();
      return;
    }

    audio.pause();
  }

  botaoAudio.addEventListener("click", async () => {
    ligado = !ligado;
    localStorage.setItem("audioLigado", String(ligado));
    await aplicarEstado();
  });

  document.addEventListener(
    "click",
    () => {
      if (ligado && audio.paused) {
        tocarAudio();
      }
    },
    { once: true },
  );

  aplicarEstado();
})();
