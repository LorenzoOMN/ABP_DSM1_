/**
 * artefatos.js - Carrega artefatos do banco de dados via API
 * Padrão igual ao questionario.js: usa localStorage para o token
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos do carrossel
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const nomeArtefatoEl = document.getElementById('nomeArtefato');
  const descricaoArtefatoEl = document.getElementById('descricaoArtefato');

  // Estado
  let artefatos = [];
  let currentIndex = 0;
  let slidesMapeadas = [];

  // ============================================================================
  // FUNÇÃO: OBTER TOKEN (Igual ao padrão do questionario.js)
  // ============================================================================
  function obterToken() {
    // Verifica o token salvo no localStorage
    const token = localStorage.getItem("token");
    
    // Se não tiver token, não redireciona imediatamente para permitir
    // que a página carregue como "visitante" (arte fatos bloqueados),
    // a menos que você queira forçar o login.
    return token;
  }

  // 1️ Busca artefatos da API
  try {
    const token = obterToken(); // 🔑 Lê o token igual suas outras páginas

    // Prepara os headers. Se tiver token, envia. Se não, vai sem (API pública/limitada).
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/artefatos', {
      method: 'GET',
      headers: headers
      // ❌ Removido credentials: 'include' pois usamos Bearer Token
    });

    if (!response.ok) {
      // Se der 401 ou erro, tratamos como não autenticado
      console.log('Acesso à API restrito ou erro:', response.status);
    } else {
      const { success, data } = await response.json();
      
      if (success && data) {
        artefatos = data;
      } else {
        console.warn('API não retornou dados válidos');
      }
    }

    // Atualiza o carrossel com os dados (ou lista vazia)
    atualizarCarrosselComArtefatos();
    configurarNavegacao();

  } catch (err) {
    console.error('Erro ao carregar artefatos:', err);
    if (descricaoArtefatoEl) {
      descricaoArtefatoEl.innerHTML = '<p style="color: #c95c5c;">⚠️ Erro de conexão.</p>';
    }
  }

  // ============================================================================
  // FUNÇÕES DE INTERFACE
  // ============================================================================

  function atualizarCarrosselComArtefatos() {
    const carouselFrame = document.querySelector('.carousel-frame');
    
    if (!artefatos || artefatos.length === 0) {
      // Fallback visual se não houver dados
      carouselFrame.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhum artefato encontrado.</p>';
      return;
    }

    // Cria slides dinamicamente
    const slidesHTML = artefatos.map((artefato, index) => `
      <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
           data-id="${artefato.id}" 
           data-desbloqueado="${artefato.desbloqueado}">
        
        <!-- IMAGEM: Monta o caminho usando o nome do banco -->
        <img src="/assets/img/artefatos/${artefato.imagem}" 
             alt="${artefato.titulo}"
             class="${artefato.desbloqueado ? '' : 'img-bloqueada'}" 
             onerror="this.style.display='none'" />
        
        <!-- Overlay de bloqueio -->
        ${!artefato.desbloqueado ? `
          <div class="overlay-bloqueado">
            <span class="cadeado-icon"></span>
            <p class="texto-bloqueado">Cap. ${artefato.capitulo_requisito}</p>
          </div>
        ` : ''}
        
      </div>
    `).join('');

    carouselFrame.innerHTML = slidesHTML;
    slidesMapeadas = document.querySelectorAll('.carousel-slide');
    
    // Seleciona o primeiro desbloqueado automaticamente
    const primeiroDesbloqueado = Array.from(slidesMapeadas).findIndex(s => s.dataset.desbloqueado === 'true');
    currentIndex = primeiroDesbloqueado !== -1 ? primeiroDesbloqueado : 0;
    
    atualizarVisualizacao();
  }

  function configurarNavegacao() {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slidesMapeadas.length) % slidesMapeadas.length;
        atualizarVisualizacao();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slidesMapeadas.length;
        atualizarVisualizacao();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevBtn) {
        currentIndex = (currentIndex - 1 + slidesMapeadas.length) % slidesMapeadas.length;
        atualizarVisualizacao();
      }
      if (e.key === 'ArrowRight' && nextBtn) {
        currentIndex = (currentIndex + 1) % slidesMapeadas.length;
        atualizarVisualizacao();
      }
    });
  }

  function atualizarVisualizacao() {
    const artefatoAtual = artefatos[currentIndex];
    if (!artefatoAtual) return;

    slidesMapeadas.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    if (nomeArtefatoEl) {
      nomeArtefatoEl.textContent = artefatoAtual.titulo.toUpperCase();
    }

    if (descricaoArtefatoEl) {
      if (artefatoAtual.desbloqueado) {
        // ✅ Conteúdo real para desbloqueados
        descricaoArtefatoEl.innerHTML = artefatoAtual.conteudo_longo;
      } else {
        // 🔒 Mensagem de bloqueio
        descricaoArtefatoEl.innerHTML = `
          <p class="bloqueado-text">
            🔒 Desbloqueie o <strong>Capítulo ${artefatoAtual.capitulo_requisito}</strong> 
            para descobrir os segredos deste artefato.
          </p>
        `;
      }
    }
  }
});