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