// Função para obter token (verifica em vários lugares)
function getToken() {
    return localStorage.getItem('token') || 
           sessionStorage.getItem('token') || 
           null;
}

// Função para verificar se está logado
function verificarAutenticacao() {
    const token = getToken();
    
    if (!token) {
        // Redireciona para login se não tiver token
        alert('Você precisa estar logado para acessar esta área.');
        window.location.href = '/'; // ou '/login'
        return false;
    }
    
    return true;
}

// Carregar questões
async function carregarQuestoes() {
    if (!verificarAutenticacao()) return;
    
    const token = getToken();
    const tbody = document.getElementById('corpo-tabela');
    
    try {
        const response = await fetch('/api/admin/questoes?limit=100', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao carregar questões');
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            renderizarTabela(data.data);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem;">
                        O grimório está vazio. Nenhuma questão encontrada.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar questões:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #dc3545;">
                    Erro: ${error.message}
                    <br><br>
                    <button class="btn-action btn-add" onclick="carregarQuestoes()">
                        Tentar Novamente
                    </button>
                </td>
            </tr>
        `;
    }
}

// Renderizar tabela
function renderizarTabela(questoes) {
    const tbody = document.getElementById('corpo-tabela');
    tbody.innerHTML = '';

    questoes.forEach(q => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${q.id_questao}</td>
            <td>${q.enunciado ? q.enunciado.substring(0, 50) + '...' : 'Sem enunciado'}</td>
            <td>Módulo ${q.id_modulo || '?'}</td>
            <td>${q.dificuldade || 'N/A'}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarQuestao(${q.id_questao})">
                    Editar
                </button>
                <button class="btn-action btn-delete" onclick="deletarQuestao(${q.id_questao})">
                    Deletar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Editar questão
function editarQuestao(id) {
    console.log('Editar questão:', id);
    // Implementar modal ou redirecionamento
    alert(`Editar questão ${id} - Em desenvolvimento`);
}

// Deletar questão
async function deletarQuestao(id) {
    if (!confirm('Tem certeza que deseja banir esta questão para o abismo?')) {
        return;
    }

    const token = getToken();
    
    try {
        const response = await fetch(`/api/admin/questoes/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar questão');
        }

        alert('Questão deletada com sucesso!');
        carregarQuestoes(); // Recarrega a tabela
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar questão: ' + error.message);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página admin carregada');
    console.log('Token no localStorage:', localStorage.getItem('token'));
    console.log('Token no sessionStorage:', sessionStorage.getItem('token'));
    
    carregarQuestoes();
});