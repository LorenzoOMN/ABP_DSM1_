let musicaAtiva = true;
let efeitosAtivos = true;

async function carregarPerfil() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/perfil", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const usuario = await response.json();

        document.getElementById("nomeUsuario").textContent = usuario.nome ?? "-";
        document.getElementById("emailUsuario").textContent = usuario.email ?? "-";
        document.getElementById("capituloAtual").textContent = usuario.progresso?.modulo_desafio_atual ?? "-";

        if (usuario.avatar) {
            document.getElementById("avatarImg").src = `/assets/img/avatares/${usuario.avatar}`;
        }

        musicaAtiva = usuario.musica_ativa ?? true;
        efeitosAtivos = usuario.efeitos_ativos ?? true;

        localStorage.setItem("musicaAtiva", musicaAtiva);
        localStorage.setItem("efeitosAtivos", efeitosAtivos);
        atualizarToggles();
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
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
            body: JSON.stringify({ musica_ativa: musicaAtiva, efeitos_ativos: efeitosAtivos }),
        });
    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggleMusica").addEventListener("click", () => {
        musicaAtiva = !musicaAtiva;
        localStorage.setItem("musicaAtiva", musicaAtiva);
        atualizarToggles();
        salvarConfiguracoes();
    });

    document.getElementById("toggleEfeitos").addEventListener("click", () => {
        efeitosAtivos = !efeitosAtivos;
        localStorage.setItem("efeitosAtivos", efeitosAtivos);
        atualizarToggles();
        salvarConfiguracoes();
    });

    // Clique no avatar abre o modal
    document.getElementById("avatarContainer").addEventListener("click", abrirSeletorAvatar);

    carregarPerfil();
});

// Funções do Modal de Avatar (Mantidas simplificadas)
async function abrirSeletorAvatar() {
    // Mock de dados para teste (substitua pela chamada real depois)
    const avatares = [
        { id_avatar: 1, nome: 'Guerreiro', caminho_imagem: 'guerreiro.png', equipado: true },
        { id_avatar: 2, nome: 'Mago', caminho_imagem: 'mago.png', equipado: false },
        { id_avatar: 3, nome: 'Arqueiro', caminho_imagem: 'arqueiro.png', equipado: false },
    ];
    mostrarModalAvatares(avatares);
}

function mostrarModalAvatares(avatares) {
    const modal = document.createElement("div");
    modal.className = "modal-avatares";

    const content = document.createElement("div");
    content.className = "modal-content";
    content.innerHTML = `<h3>Escolha seu Avatar</h3><div class="avatar-grid" id="grid"></div>`;

    const grid = content.querySelector("#grid");
    avatares.forEach(ava => {
        const opt = document.createElement("div");
        opt.className = `avatar-option ${ava.equipado ? 'selected' : ''}`;
        opt.onclick = () => selecionarAvatar(ava.caminho_imagem, opt);

        opt.innerHTML = `<img src="/assets/img/avatares/${ava.caminho_imagem}" alt="${ava.nome}"><p>${ava.nome}</p>`;
        grid.appendChild(opt);
    });

    const btn = document.createElement("button");
    btn.textContent = "Fechar";
    btn.onclick = () => modal.remove();
    btn.style.marginTop = "10px";
    btn.style.padding = "10px 20px";
    btn.style.cursor = "pointer";

    content.appendChild(btn);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function selecionarAvatar(imgPath, el) {
    document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById("avatarImg").src = `/assets/img/avatares/${imgPath}`;
    setTimeout(() => document.querySelector('.modal-avatares').remove(), 500);
}