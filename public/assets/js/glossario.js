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

glossario();