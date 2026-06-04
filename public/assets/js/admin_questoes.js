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

        // ← ADICIONA VERIFICAÇÃO DE AUTH
        if (response.status === 401 || response.status === 403) {
            tratarErroAutenticacao(response, 'Acesso negado ao carregar questões. Faça login novamente.');
            return;
        }

        if (!response.ok) throw new Error('Erro na consulta');

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
        if (error.message === 'Acesso negado') return; // Já foi tratado
        
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
  
  delete dados.id_questao;
  dados.alternativa_correta = dados.alternativa_correta?.toLowerCase();
  
  const token = getToken();
  
  if (!token) {
    bloquearAcesso('Sessão expirada. Faça login novamente.');
    return;
  }
  
  const btnSubmit = form.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.textContent = 'Salvando...';
  btnSubmit.disabled = true;
  
  try {
      const response = await fetch(`/api/admin/questoes/${idQuestao}`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
      });
      
      // ← ADICIONA VERIFICAÇÃO DE AUTH
      if (response.status === 401 || response.status === 403) {
          tratarErroAutenticacao(response, 'Sessão expirada ou acesso negado ao salvar.');
          return;
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
      if (error.message === 'Acesso negado') return;
      
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

    if (!token) {
        bloquearAcesso('Sessão expirada. Faça login novamente.');
        return;
    }

    try {
        const response = await fetch(`/api/admin/questoes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // ← ADICIONA VERIFICAÇÃO DE AUTH
        if (response.status === 401 || response.status === 403) {
            tratarErroAutenticacao(response, 'Acesso negado ao deletar questão.');
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao deletar questão');
        }

        mostrarAlerta('Questão deletada com sucesso!', "sucesso");
        carregarQuestoes();
    } catch (error) {
        if (error.message === 'Acesso negado') return;
        
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
  
  delete dados.id_questao;
  dados.alternativa_correta = dados.alternativa_correta?.toLowerCase();
  
  const token = getToken();
  
  if (!token) {
    bloquearAcesso('Sessão expirada. Faça login novamente.');
    return;
  }
  
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
      
      // ← ADICIONA VERIFICAÇÃO DE AUTH
      if (response.status === 401 || response.status === 403) {
          tratarErroAutenticacao(response, 'Acesso negado ao criar questão.');
          return;
      }
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao criar questão');
      }
      
      const novaQuestao = await response.json();
      
      mostrarAlerta('Questão criada com sucesso!', "sucesso");
      fecharModal();
      carregarQuestoes();
      
  } catch (error) {
      if (error.message === 'Acesso negado') return;
      
      console.error('Erro ao criar:', error);
      mostrarAlerta('Erro ao criar questão: ' + error.message, "erro");
  } finally {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
  }
}

// ============================================
// SISTEMA DE BLOQUEIO DE ACESSO
// ============================================

// Função para bloquear a interface quando acesso é negado
function bloquearAcesso(mensagem = 'Acesso negado. Você não tem permissão para acessar esta área.') {
    // Remove overlay existente se houver
    const overlayExistente = document.getElementById('overlay-bloqueio');
    if (overlayExistente) overlayExistente.remove();

    // Cria overlay de bloqueio
    const overlay = document.createElement('div');
    overlay.id = 'overlay-bloqueio';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #2a1a0f 0%, #1a0f05 100%);
            border: 2px solid #8b0000;
            border-radius: 15px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(139, 0, 0, 0.5);
        ">
            <div style="
                font-size: 4rem;
                margin-bottom: 1rem;
                color: #dc3545;
            ">⛔</div>
            <h2 style="
                color: #dc3545;
                margin-bottom: 1rem;
                font-size: 1.8rem;
            ">Acesso Negado</h2>
            <p style="
                color: #e0d0b0;
                margin-bottom: 2rem;
                line-height: 1.6;
            ">${mensagem}</p>
            <button onclick="window.location.href = '/mapa'" style="
                background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
                color: #fff;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 1.1rem;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            ">Voltar ao Mapa</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Impede scroll
}

// Função centralizada para tratar erros de autenticação
function tratarErroAutenticacao(response, mensagemCustom = null) {
    if (response.status === 401 || response.status === 403) {
        const mensagem = mensagemCustom || 
            (response.status === 401 ? 'Sessão expirada. Faça login novamente.' : 
            'Você não tem permissão para realizar esta ação.');
        
        mostrarAlerta(mensagem, "erro");
        bloquearAcesso(mensagem);
        return true; // Indica que foi tratado
    }
    return false; // Não foi erro de autenticação
}

// Função auxiliar para verificar se response é erro de auth antes de processar
async function verificarRespostaAuth(response, mensagemCustom = null) {
    if (tratarErroAutenticacao(response, mensagemCustom)) {
        throw new Error('Acesso negado');
    }
    return response;
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