let musicaAtiva = true;
let efeitosAtivos = true;

// ============================================
// CARREGAR PERFIL
// ============================================
async function carregarPerfil() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        const response = await fetch("/api/perfil", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }

        const usuario = await response.json();

        document.getElementById("nomeUsuario").textContent = usuario.nome ?? "Carregando...";
        document.getElementById("emailUsuario").textContent = usuario.email ?? "Carregando...";
        document.getElementById("emailConta").textContent = usuario.email ?? "-";
        document.getElementById("capituloAtual").textContent = usuario.progresso?.modulo_desafio_atual ?? "-";

        // Avatar - o backend já garante que sempre terá um valor válido
        if (usuario.avatar) {
            document.getElementById("avatarImg").src = `/assets/img/perfil/icones/${usuario.avatar}`;
        } else {
            document.getElementById("avatarImg").src = `/assets/img/perfil/icones/corvo.png`;
        }

        if (usuario.data_criacao) {
            document.getElementById("dataCadastro").textContent = formatarData(usuario.data_criacao);
        }
        if (usuario.ultimo_acesso) {
            document.getElementById("ultimoAcesso").textContent = formatarDataRelativa(usuario.ultimo_acesso);
        }
        if (usuario.tempo_total) {
            document.getElementById("tempoTotal").textContent = usuario.tempo_total;
        }

        const musicaStorage = localStorage.getItem("audioLigado");
        musicaAtiva = musicaStorage !== null ? musicaStorage !== "false" : (usuario.musica_ativa ?? true);
        efeitosAtivos = usuario.efeitos_ativos ?? true;

        // Salva sincronizado
        localStorage.setItem("audioLigado", String(musicaAtiva));
        localStorage.setItem("efeitosAtivos", String(efeitosAtivos));
        atualizarToggles();

        await Promise.all([
            carregarEstatisticas(),
            carregarRanking(),
            carregarHistorico(),
            carregarDadosConta()
        ]);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// ============================================
// CARREGAR ESTATÍSTICAS
// ============================================
async function carregarEstatisticas() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/perfil/estatisticas", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const stats = await response.json();

        document.getElementById("totalQuestoes").textContent = stats.total_questoes ?? 0;
        document.getElementById("taxaAcerto").textContent = (stats.taxa_acerto ?? 0) + "%";
        document.getElementById("streakDias").textContent = stats.streak_dias ?? 0;
        document.getElementById("tempoMedio").textContent = (stats.tempo_medio ?? 0) + "s";
    } catch (error) {
        // Silencioso
    }
}

// ============================================
// CARREGAR RANKING
// ============================================
async function carregarRanking() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/perfil/ranking", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            document.getElementById("listaRanking").innerHTML =
                '<li style="text-align:center;opacity:0.6;">Ranking indisponível</li>';
            return;
        }

        const dados = await response.json();

        document.getElementById("minhaPosicao").textContent = "#" + (dados.minha_posicao ?? "-");
        document.getElementById("rankingTotal").textContent = `de ${dados.total_jogadores ?? 0} jogadores`;

        const lista = document.getElementById("listaRanking");
        lista.innerHTML = "";

        if (!dados.top5 || dados.top5.length === 0) {
            lista.innerHTML = '<li style="text-align:center;opacity:0.6;">Seja o primeiro a pontuar!</li>';
            return;
        }

        dados.top5.forEach((jogador, index) => {
            const li = document.createElement("li");
            if (index === 0) li.className = "top-1";
            else if (index === 1) li.className = "top-2";
            else if (index === 2) li.className = "top-3";

            const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`;

            li.innerHTML = `
                <span class="ranking-nome">${medalha} ${jogador.nome}</span>
                <span class="ranking-pontos">${jogador.pontos} pts</span>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        // Silencioso
    }
}

// ============================================
// CARREGAR HISTÓRICO
// ============================================
async function carregarHistorico() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/perfil/historico", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const historico = await response.json();

        const lista = document.getElementById("listaHistorico");
        lista.innerHTML = "";

        if (historico.length === 0) {
            lista.innerHTML = '<li style="text-align:center;opacity:0.6;">Nenhuma atividade ainda</li>';
            return;
        }

        historico.forEach(item => {
            const li = document.createElement("li");
            li.className = item.acertou ? "acerto" : "erro";

            const resultado = item.acertou ? "✓ Acerto" : "✗ Erro";
            const classeResultado = item.acertou ? "acerto" : "erro";

            li.innerHTML = `
                <span class="historico-resultado ${classeResultado}">${resultado}</span>
                <span class="historico-titulo">${item.titulo}</span>
                <span class="historico-data">${item.data}</span>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        // Silencioso
    }
}

// ============================================
// CARREGAR DADOS DA CONTA
// ============================================
async function carregarDadosConta() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/perfil/dados-conta", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error("Erro HTTP:", response.status);
            return;
        }

        const dados = await response.json();
        console.log("Dados da conta recebidos", /*dados*/); /*Caso queira ver os dados no console, basta descomentar*/

        if (dados.data_criacao) {
            document.getElementById("dataCadastro").textContent = formatarData(dados.data_criacao);
        }

        if (dados.ultimo_acesso) {
            document.getElementById("ultimoAcesso").textContent = formatarDataRelativa(dados.ultimo_acesso);
        }

        // Calcula tempo a partir dos segundos
        const segundos = dados.tempo_total_segundos || 0;
        console.log("Tempo total em segundos:", segundos);

        if (segundos > 0) {
            const minutos = Math.floor(segundos / 60);
            const segundosRestantes = segundos % 60;

            let texto = '';
            if (minutos > 0) {
                texto += `${minutos} minuto${minutos > 1 ? 's' : ''}`;
            }
            if (segundosRestantes > 0) {
                texto += texto ? ` e ${segundosRestantes} segundo${segundosRestantes > 1 ? 's' : ''}`
                    : `${segundosRestantes} segundo${segundosRestantes > 1 ? 's' : ''}`;
            }

            document.getElementById("tempoTotal").textContent = texto;
            console.log("Tempo exibido:", texto);
        } else {
            document.getElementById("tempoTotal").textContent = "0 segundos";
            console.log("Sem tempo registrado");
        }
    } catch (error) {
        console.error("❌ Erro ao carregar dados da conta:", error);
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function formatarData(dataString) {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

function formatarDataRelativa(dataString) {
    if (!dataString) return "-";

    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return "Agora mesmo";
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHoras < 24) return `há ${diffHoras}h`;
    if (diffDias < 7) return `há ${diffDias} dias`;
    return data.toLocaleDateString('pt-BR');
}

// ============================================
// SISTEMA DE ABAS
// ============================================
function inicializarAbas() {
    const botoes = document.querySelectorAll(".aba-btn");
    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            const abaAlvo = btn.dataset.aba;

            botoes.forEach(b => b.classList.remove("ativa"));
            document.querySelectorAll(".aba-conteudo").forEach(c => c.classList.remove("ativa"));

            btn.classList.add("ativa");
            document.getElementById(`aba-${abaAlvo}`).classList.add("ativa");
        });
    });
}

// ============================================
// CONFIGURAÇÕES
// ============================================
function atualizarToggles() {
    const musica = document.getElementById("toggleMusica");
    const efeitos = document.getElementById("toggleEfeitos");

    if (musica) {
        // Usa a mesma lógica do header (classList.toggle com condição invertida)
        musica.classList.toggle("desativado", !musicaAtiva);
    }

    if (efeitos) {
        efeitos.classList.toggle("desativado", !efeitosAtivos);
    }
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
                efeitos_ativos: efeitosAtivos
            }),
        });
    } catch (error) {
        // Ignora
    }
}

// ============================================
// AVATAR - SELETOR COMPLETO
// ============================================
async function abrirSeletorAvatar() {
    try {
        const token = localStorage.getItem("token");

        // Busca TODOS os avatares do banco
        const response = await fetch("/api/perfil/avatares/todos", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            alert("Erro ao carregar avatares. Tente novamente.");
            return;
        }

        const todosAvatares = await response.json();

        // Busca qual está equipado
        const responseEquipado = await fetch("/api/perfil/meus-avatares", {
            headers: { Authorization: `Bearer ${token}` },
        });

        let avataresComStatus = todosAvatares;

        if (responseEquipado.ok) {
            const meusAvatares = await responseEquipado.json();

            // Marca quais estão equipados
            avataresComStatus = todosAvatares.map(ava => ({
                ...ava,
                equipado: meusAvatares.find(m => m.id_avatar === ava.id_avatar)?.equipado || false
            }));
        }

        mostrarModalAvatares(avataresComStatus);

    } catch (error) {
        console.error("Erro ao carregar avatares:", error);
        alert("Não foi possível carregar os avatares.");
    }
}

function mostrarModalAvatares(avatares) {
    const modal = document.createElement("div");
    modal.className = "modal-avatares";

    const content = document.createElement("div");
    content.className = "modal-content";
    content.innerHTML = `
        <h3>🎨 Escolha seu Avatar</h3>
        <div class="avatar-grid" id="grid"></div>
    `;

    const grid = content.querySelector("#grid");

    avatares.forEach(ava => {
        const opt = document.createElement("div");
        opt.className = `avatar-option ${ava.equipado ? 'selected' : ''}`;
        opt.dataset.id = ava.id_avatar;
        opt.dataset.caminho = ava.caminho_imagem;
        opt.dataset.nome = ava.nome;

        // Inclui a descrição se existir
        opt.innerHTML = `
            <img src="/assets/img/perfil/icones/${ava.caminho_imagem}" alt="${ava.nome}">
            <p>${ava.nome}</p>
            ${ava.descricao ? `<div class="descricao">${ava.descricao}</div>` : ''}
        `;

        opt.addEventListener("click", async () => {
            // Remover seleção anterior
            document.querySelectorAll('.avatar-option').forEach(o =>
                o.classList.remove('selected')
            );

            // Selecionar o clicado
            opt.classList.add('selected');

            // Atualizar avatar na tela imediatamente
            document.getElementById("avatarImg").src = `/assets/img/perfil/icones/${ava.caminho_imagem}`;

            // Salvar no backend
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/perfil/equipar-avatar", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ id_avatar: ava.id_avatar })
                });

                if (response.ok) {
                    // Feedback visual de sucesso
                    opt.style.boxShadow = "0 0 30px rgba(46, 204, 113, 0.8)";
                    setTimeout(() => {
                        modal.remove();
                    }, 800);
                }
            } catch (error) {
                console.error("Erro ao equipar avatar:", error);
                // Mesmo com erro, fecha o modal
                setTimeout(() => {
                    modal.remove();
                }, 500);
            }
        });

        grid.appendChild(opt);
    });

    const btn = document.createElement("button");
    btn.textContent = "✕ Fechar";
    btn.onclick = () => {
        modal.style.animation = "fadeIn 0.3s ease reverse";
        setTimeout(() => modal.remove(), 300);
    };

    content.appendChild(btn);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const toggleMusica = document.getElementById("toggleMusica");
    if (toggleMusica) {
        toggleMusica.addEventListener("click", () => {
            // Alterna o estado
            musicaAtiva = !musicaAtiva;

            // Salva na MESMA chave que o header usa
            localStorage.setItem("audioLigado", String(musicaAtiva));

            // Atualiza o toggle visual
            atualizarToggles();

            // Salva configurações no backend
            salvarConfiguracoes();

            // Dispara click no botão do header para sincronizar o áudio
            const botaoAudioHeader = document.getElementById("botao-audio");
            if (botaoAudioHeader) {
                botaoAudioHeader.click();
            }
        });
    }

    const toggleEfeitos = document.getElementById("toggleEfeitos");
    if (toggleEfeitos) {
        toggleEfeitos.addEventListener("click", () => {
            efeitosAtivos = !efeitosAtivos;
            localStorage.setItem("efeitosAtivos", efeitosAtivos);
            atualizarToggles();
            salvarConfiguracoes();
        });
    }

    const avatarContainer = document.getElementById("avatarContainer");
    if (avatarContainer) {
        avatarContainer.addEventListener("click", abrirSeletorAvatar);
    }

    inicializarAbas();
    carregarPerfil();
});