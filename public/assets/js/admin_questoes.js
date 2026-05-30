// Variáveis globais para os filtros
let filtroModuloAtual = 'todos';
let filtroDificuldadeAtual = '';
let questoesCarregadas = [];

// Função para obter token
function getToken() {
    return localStorage.getItem('token') ||
        sessionStorage.getItem('token') ||
        null;
}

// Função para verificar autenticação
function verificarAutenticacao() {
    const token = getToken();
    if (!token) {
        mostrarAlerta('Você precisa estar logado para acessar esta área.', "erro");
        window.location.href = '/';
        return false;
    }
    return true;
}

// Carregar questões (com filtros combinados)
async function carregarQuestoes() {
    if (!verificarAutenticacao()) return;

    const token = getToken();
    const grid = document.getElementById('grid-questoes');

    // Loading
    grid.innerHTML = `
    <div class="loading-grid">
      <span class="loading">Consultando grimório...</span>
    </div>
  `;

    try {
        let url = '/api/admin/questoes?limit=200';

        if (filtroModuloAtual !== 'todos') {
            url += `&id_modulo=${filtroModuloAtual}`;
        }

        if (filtroDificuldadeAtual) {
            url += `&dificuldade=${encodeURIComponent(filtroDificuldadeAtual)}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Falha ao carregar');

        const data = await response.json();
        questoesCarregadas = data.data || [];

        if (questoesCarregadas.length > 0) {
            renderizarCards(questoesCarregadas);
            atualizarInfoFiltro(questoesCarregadas.length);
        } else {
            grid.innerHTML = `
        <div class="empty-state">
          Nenhuma questão encontrada com os filtros selecionados.
        </div>
      `;
        }
    } catch (error) {
        console.error('Erro:', error);
        grid.innerHTML = `
      <div class="empty-state" style="color: #dc3545;">
        Erro: ${error.message}
        <br><br>
        <button class="btn-action btn-add" onclick="carregarQuestoes()">
          Tentar Novamente
        </button>
      </div>
    `;
    }
}

function renderizarCards(questoes) {
    const grid = document.getElementById('grid-questoes');
    grid.innerHTML = '';

    questoes.forEach(q => {
        const card = document.createElement('div');
        card.className = 'questao-card';
        card.innerHTML = `
      <div class="questao-card-header">
        <span class="questao-id">#${q.id_questao}</span>
        <span class="questao-modulo">Módulo ${q.id_modulo}</span>
      </div>
            <div class="dificuldade-badge dificuldade-${q.dificuldade}">
        ${q.dificuldade === 'fácil' ? '<span class="stars">★<span class="star-empty">☆☆</span></span>' : 
          q.dificuldade === 'média' ? '<span class="stars">★★<span class="star-empty">☆</span></span>' : 
          '<span class="stars">★★★</span>'}
        <span class="diff-text">${q.dificuldade.toUpperCase()}</span>
      </div>
      <div class="questao-enunciado">
        ${q.enunciado || 'Sem enunciado'}
      </div>
      <div class="questao-acoes">
        <button class="btn-card btn-editar" onclick="abrirModalEdicao(${q.id_questao})">
          Editar
        </button>
        <button class="btn-card btn-deletar" onclick="deletarQuestao(${q.id_questao})">
          Deletar
        </button>
      </div>
    `;
        grid.appendChild(card);
    });
}

// Modal functions
function abrirModalEdicao(idQuestao) {
  const questao = questoesCarregadas.find(q => q.id_questao === idQuestao);
  if (!questao) return;

  const modal = document.getElementById('modal-questao');
  const body = modal.querySelector('.modal-body');
  const header = modal.querySelector('.modal-header h2');
  
  // Muda o título para edição
  header.textContent = 'Editar Questão';

    body.innerHTML = `
    <form id="form-editar-questao" onsubmit="salvarEdicao(event, ${questao.id_questao})">
      <div class="form-row">
        <div class="form-group">
          <label>Módulo</label>
          <select name="id_modulo" required>
            <option value="1" ${questao.id_modulo == 1 ? 'selected' : ''}>Módulo 1</option>
            <option value="2" ${questao.id_modulo == 2 ? 'selected' : ''}>Módulo 2</option>
            <option value="3" ${questao.id_modulo == 3 ? 'selected' : ''}>Módulo 3</option>
            <option value="4" ${questao.id_modulo == 4 ? 'selected' : ''}>Módulo 4</option>
            <option value="5" ${questao.id_modulo == 5 ? 'selected' : ''}>Módulo 5</option>
          </select>
        </div>
        <div class="form-group">
          <label>Dificuldade</label>
          <select name="dificuldade" required>
            <option value="fácil" ${questao.dificuldade === 'fácil' ? 'selected' : ''}>Fácil</option>
            <option value="média" ${questao.dificuldade === 'média' ? 'selected' : ''}>Média</option>
            <option value="difícil" ${questao.dificuldade === 'difícil' ? 'selected' : ''}>Difícil</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Enunciado</label>
        <textarea name="enunciado" required>${questao.enunciado || ''}</textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Alternativa A</label>
          <input type="text" name="alternativa_a" value="${questao.alternativa_a || ''}" required>
        </div>
        <div class="form-group">
          <label>Alternativa B</label>
          <input type="text" name="alternativa_b" value="${questao.alternativa_b || ''}" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Alternativa C</label>
          <input type="text" name="alternativa_c" value="${questao.alternativa_c || ''}" required>
        </div>
        <div class="form-group">
          <label>Alternativa D</label>
          <input type="text" name="alternativa_d" value="${questao.alternativa_d || ''}" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Alternativa Correta</label>
        <select name="alternativa_correta" required>
          <option value="a" ${questao.alternativa_correta === 'a' ? 'selected' : ''}>A</option>
          <option value="b" ${questao.alternativa_correta === 'b' ? 'selected' : ''}>B</option>
          <option value="c" ${questao.alternativa_correta === 'c' ? 'selected' : ''}>C</option>
          <option value="d" ${questao.alternativa_correta === 'd' ? 'selected' : ''}>D</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Imagem (opcional)</label>
        <input type="text" name="imagem" value="${questao.imagem || ''}" placeholder="questao_x.png">
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-cancelar" onclick="fecharModal()">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar Alterações</button>
      </div>
    </form>
  `;

    modal.classList.add('active');
}

function fecharModal() {
  const modal = document.getElementById('modal-questao');
  const header = modal.querySelector('.modal-header h2');
  
  // Reseta o título para o padrão
  header.textContent = 'Editar Questão';
  
  modal.classList.remove('active');
}

async function salvarEdicao(event, idQuestao) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  
  // Remove id_questao se estiver presente
  delete dados.id_questao;
  
  // Garante alternativa_correta em minúsculo
  dados.alternativa_correta = dados.alternativa_correta?.toLowerCase();
  
  const token = getToken();
  
  // Verifica se tem token
  if (!token) {
    mostrarAlerta('Sessão expirada. Faça login novamente.', "erro");
      window.location.href = '/';
      return;
  }
  
  const btnSubmit = form.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.textContent = 'Salvando...';
  btnSubmit.disabled = true;
  
  try {
      const response = await fetch(`/api/admin/questoes/${idQuestao}`, {
          method: 'PUT',  // ou 'PATCH'
          headers: {
              'Authorization': `Bearer ${token}`,  // ← Token aqui!
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
      });
      
      
      if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao salvar questão');
      }
      
      const questaoAtualizada = await response.json();
      
      mostrarAlerta('Questão atualizada com sucesso!', "sucesso");
      fecharModal();
      carregarQuestoes();
      
  } catch (error) {
      console.error('Erro ao salvar:', error);
      mostrarAlerta('Erro ao salvar questão: ' + error.message, "erro");
  } finally {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
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

// Atualizar texto informativo
function atualizarInfoFiltro(totalQuestoes) {
    const infoEl = document.getElementById('modulo-atual-info');
    let texto = `Exibindo: <strong>${totalQuestoes} questão(ões)</strong>`;

    if (filtroModuloAtual !== 'todos') {
        texto += ` do Módulo ${filtroModuloAtual}`;
    }

    if (filtroDificuldadeAtual) {
        texto += ` | Dificuldade: <strong>${filtroDificuldadeAtual}</strong>`;
    }

    infoEl.innerHTML = texto;
}

// Aplicar filtro de módulo
function aplicarFiltroModulo(idModulo) {
    filtroModuloAtual = idModulo;

    // Atualiza botões visualmente
    document.querySelectorAll('.modulo-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.modulo === idModulo) {
            btn.classList.add('active');
        }
    });

    // Recarrega com filtros combinados
    carregarQuestoes();
}

// Aplicar filtro de dificuldade
function aplicarFiltroDificuldade(dificuldade) {
    filtroDificuldadeAtual = dificuldade;
    carregarQuestoes();
}

// Resetar todos os filtros
function resetarFiltrosECarregar() {
    filtroModuloAtual = 'todos';
    filtroDificuldadeAtual = '';

    // Reseta UI dos botões
    document.querySelectorAll('.modulo-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.modulo === 'todos') {
            btn.classList.add('active');
        }
    });

    // Reseta select
    document.getElementById('filtro-dificuldade').value = '';

    carregarQuestoes();
}

// Editar questão
function editarQuestao(id) {
    console.log('Editar questão:', id);
    mostrarAlerta(`Editar questão ${id} - Em desenvolvimento`, "erro");
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

        mostrarAlerta('Questão deletada com sucesso!', "sucesso");
        carregarQuestoes(); // Recarrega com filtros atuais
    } catch (error) {
        console.error('Erro:', error);
        mostrarAlerta('Erro ao deletar questão: ' + error.message, "erro");
    }
}

// ============================================
// FUNÇÕES DE CRIAÇÃO DE QUESTÃO
// ============================================

// Abrir modal para CRIAR nova questão (campos vazios)
function abrirModalCriacao() {
  const modal = document.getElementById('modal-questao');
  const body = modal.querySelector('.modal-body');
  const header = modal.querySelector('.modal-header h2');
  
  // Muda o título do modal
  header.textContent = 'Nova Questão';
  
  // Formulário com campos vazios
  body.innerHTML = `
    <form id="form-criar-questao" onsubmit="salvarNovaQuestao(event)">
      <div class="form-row">
        <div class="form-group">
          <label>Módulo *</label>
          <select name="id_modulo" required>
            <option value="">Selecione...</option>
            <option value="1">Módulo 1</option>
            <option value="2">Módulo 2</option>
            <option value="3">Módulo 3</option>
            <option value="4">Módulo 4</option>
            <option value="5">Módulo 5</option>
          </select>
        </div>
        <div class="form-group">
          <label>Dificuldade *</label>
          <select name="dificuldade" required>
            <option value="">Selecione...</option>
            <option value="fácil">Fácil</option>
            <option value="média">Média</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Enunciado *</label>
        <textarea name="enunciado" required placeholder="Digite o enunciado da questão..."></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Alternativa A *</label>
          <input type="text" name="alternativa_a" required placeholder="Texto da alternativa A">
        </div>
        <div class="form-group">
          <label>Alternativa B *</label>
          <input type="text" name="alternativa_b" required placeholder="Texto da alternativa B">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Alternativa C *</label>
          <input type="text" name="alternativa_c" required placeholder="Texto da alternativa C">
        </div>
        <div class="form-group">
          <label>Alternativa D *</label>
          <input type="text" name="alternativa_d" required placeholder="Texto da alternativa D">
        </div>
      </div>
      
      <div class="form-group">
        <label>Alternativa Correta *</label>
        <select name="alternativa_correta" required>
          <option value="">Selecione...</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Imagem (opcional)</label>
        <input type="text" name="imagem" placeholder="Ex: questao_151.png">
        <small style="color: #a09070; display: block; margin-top: 0.3rem;">
          Nome do arquivo de imagem (deve estar na pasta /assets/img/questoes/)
        </small>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-cancelar" onclick="fecharModal()">Cancelar</button>
        <button type="submit" class="btn-salvar">Criar Questão</button>
      </div>
    </form>
  `;
  
  modal.classList.add('active');
}

// Salvar nova questão via API POST
async function salvarNovaQuestao(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  let dados = Object.fromEntries(formData);
  
  // ← REMOVE explicitamente id_questao se existir
  delete dados.id_questao;
  
  // Garante alternativa_correta em minúsculo
  dados.alternativa_correta = dados.alternativa_correta?.toLowerCase();
  
  const token = getToken();
  
  const btnSubmit = form.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.textContent = 'Criando...';
  btnSubmit.disabled = true;
  
  try {
      const response = await fetch('/api/admin/questoes', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao criar questão');
      }
      
      const novaQuestao = await response.json();
      
      mostrarAlerta('Questão criada com sucesso!', "sucesso");
      fecharModal();
      carregarQuestoes();
      
  } catch (error) {
      console.error('Erro ao criar:', error);
      mostrarAlerta('Erro ao criar questão: ' + error.message, "erro");
  } finally {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    console.log('Página admin carregada');

    // Adiciona eventos aos botões de filtro de módulo
    document.querySelectorAll('.modulo-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const modulo = this.dataset.modulo;
            aplicarFiltroModulo(modulo);
        });
    });

    // Carrega questões inicialmente (sem filtros)
    carregarQuestoes();
});