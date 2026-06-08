let musicaAtiva = true;
let efeitosAtivos = true;

async function carregarPerfil() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/perfil", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const usuario = await response.json();

        console.log(usuario);

        document.getElementById("nomeUsuario").textContent =
            usuario.nome ?? "-";

        document.getElementById("emailUsuario").textContent =
            usuario.email ?? "-";

        document.getElementById("capituloAtual").textContent =
            usuario.progresso?.modulo_desafio_atual ?? "-";

        musicaAtiva = usuario.musica_ativa ?? true;
        efeitosAtivos = usuario.efeitos_ativos ?? true;

        atualizarToggles();
    } catch (error) {
        console.error(error);
    }
}

function atualizarToggles() {
    const musica = document.getElementById("toggleMusica");

    const efeitos = document.getElementById("toggleEfeitos");

    musica.classList.toggle("desativado", !musicaAtiva);

    efeitos.classList.toggle("desativado", !efeitosAtivos);
}

async function salvarConfiguracoes() {
    try {
        const token = localStorage.getItem("token");

        await fetch("/api/perfil/configuracoes", {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                musica_ativa: musicaAtiva,
                efeitos_ativos: efeitosAtivos,
            }),
        });
    } catch (error) {
        console.error(error);
    }
}

document
    .getElementById("toggleMusica")
    .addEventListener("click", async () => {
        musicaAtiva = !musicaAtiva;

        atualizarToggles();

        await salvarConfiguracoes();
    });

document
    .getElementById("toggleEfeitos")
    .addEventListener("click", async () => {
        efeitosAtivos = !efeitosAtivos;

        atualizarToggles();

        await salvarConfiguracoes();
    });

carregarPerfil();