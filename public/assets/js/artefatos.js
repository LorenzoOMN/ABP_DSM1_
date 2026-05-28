/**
 * artefatos.js - Versão adaptada para API dinâmica
 * Mantém sua estrutura de carousel, mas busca dados do backend
 * 
 * Comportamento:
 * - Usuário logado: busca artefatos e exibe desbloqueados/bloqueados conforme progresso
 * - Usuário não logado: exibe todos como bloqueados + mensagem "Faça login"
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos da UI
  const carouselFrame = document.querySelector('.carousel-frame');
  const nomeArtefatoEl = document.getElementById('nomeArtefato');
  const descricaoArtefatoEl = document.getElementById('descricaoArtefato');
  const listaArtefatosEl = document.getElementById('lista-artefatos');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');

  // Estado global (exposto para funções inline)
  window.artefatos = [];
  let artefatoAtual = null;
  let slides = [];
  let currentIndex = 0;

  // 1️⃣ Busca artefatos da API
  try {
    const response = await fetch('/api/artefatos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // ✅ NÃO redireciona! Apenas exibe artefatos como bloqueados
        console.log('Usuário não autenticado - exibindo artefatos como bloqueados');
        renderizarArtefatosBloqueados(listaArtefatosEl);
        return;
      }
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const { success, data } = await response.json();
    
    if (!success || !data) {
      throw new Error('Resposta inválida da API');
    }

    // Salva no estado global para a função selecionarArtefato funcionar
    window.artefatos = data;
    
    // 2️⃣ Renderiza a lista de cards
    renderizarListaArtefatos(listaArtefatosEl);
    
    // 3️⃣ Seleciona o primeiro artefato desbloqueado (se houver)
    const primeiroDesbloqueado = window.artefatos.find(a => a.desbloqueado);
    if (primeiroDesbloqueado) {
      carregarArtefatoNoCarousel(primeiroDesbloqueado);
    }

  } catch (err) {
    console.error('Erro ao carregar artefatos:', err);
    if (listaArtefatosEl) {
      listaArtefatosEl.innerHTML = '<p class="error">⚠️ Não foi possível carregar os artefatos.</p>';
    }
  }

  // 4️⃣ Configura botões do carousel
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      atualizarCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      atualizarCarousel();
    });
  }

  // Suporte a teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  /**
   * Renderiza a grade de cards dos artefatos (usuário logado)
   */
  function renderizarListaArtefatos(container) {
    const artefatos = window.artefatos;
    
    if (!artefatos || !artefatos.length) {
      container.innerHTML = '<p class="vazio">Nenhum artefato encontrado.</p>';
      return;
    }

    const html = artefatos.map(artefato => `
      <div 
        class="artefato-card ${artefato.desbloqueado ? 'desbloqueado' : 'bloqueado'}" 
        data-id="${artefato.id}"
        ${artefato.desbloqueado ? `onclick="selecionarArtefato(${artefato.id})"` : ''}
        title="${!artefato.desbloqueado ? `Complete o capítulo ${artefato.capitulo_requisito} para desbloquear` : ''}"
      >
        <div class="card-overlay">
          ${!artefato.desbloqueado ? '<span class="cadeado">🔒</span>' : ''}
        </div>
        
        <img 
          src="/assets/img/${artefato.imagem_url}" 
          alt="${artefato.titulo}" 
          class="card-img"
          ${!artefato.desbloqueado ? 'draggable="false"' : ''}
        />
        
        <div class="card-content">
          <h3>${artefato.titulo}</h3>
          <p class="descricao-curta">${artefato.descricao_curta || ''}</p>
          
          ${!artefato.desbloqueado 
            ? `<p class="bloqueado-msg">Cap. ${artefato.capitulo_requisito}</p>` 
            : `<span class="status-desbloqueado">✓ Desbloqueado</span>`
          }
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Renderiza cards bloqueados + mensagem de login (usuário NÃO logado)
   */
  function renderizarArtefatosBloqueados(container) {
    // Lista estática de artefatos para exibir como "preview"
    const artefatosPreview = [
      { id: 1, titulo: 'Product Backlog', imagem_url: 'product_backlog.png', capitulo_requisito: 1 },
      { id: 2, titulo: 'Sprint Backlog', imagem_url: 'sprint_backlog.png', capitulo_requisito: 2 },
      { id: 3, titulo: 'Incremento', imagem_url: 'incremento.png', capitulo_requisito: 3 },
    ];

    const html = `
      <p class="info-login">🔐 Faça login para desbloquear e coletar os artefatos!</p>
      ${artefatosPreview.map(artefato => `
        <div class="artefato-card bloqueado" title="Faça login para desbloquear">
          <div class="card-overlay">
            <span class="cadeado">🔒</span>
          </div>
          <img src="/assets/img/${artefato.imagem_url}" alt="${artefato.titulo}" class="card-img" draggable="false" />
          <div class="card-content">
            <h3>${artefato.titulo}</h3>
            <p class="bloqueado-msg">Cap. ${artefato.capitulo_requisito}</p>
          </div>
        </div>
      `).join('')}
    `;
    
    container.innerHTML = html;
  }

  /**
   * Carrega um artefato no carousel e área de descrição
   */
  function carregarArtefatoNoCarousel(artefato) {
    if (!artefato?.desbloqueado) return;
    
    artefatoAtual = artefato;
    currentIndex = 0;

    // Atualiza título
    if (nomeArtefatoEl) {
      nomeArtefatoEl.textContent = artefato.titulo.toUpperCase();
    }

    // Atualiza carousel
    if (carouselFrame) {
      carouselFrame.innerHTML = `
        <div class="carousel-slide active" data-artefato="${artefato.id}">
          <img src="/assets/img/${artefato.imagem_url}" alt="${artefato.titulo}" />
        </div>
      `;
      slides = document.querySelectorAll('.carousel-slide');
    }

    // Atualiza descrição (innerHTML para renderizar HTML do banco)
    if (descricaoArtefatoEl && artefato.conteudo_longo) {
      descricaoArtefatoEl.innerHTML = artefato.conteudo_longo;
    }

    // Atualiza destaque nos cards
    document.querySelectorAll('.artefato-card').forEach(card => {
      card.classList.remove('selecionado');
      if (parseInt(card.dataset.id) === artefato.id) {
        card.classList.add('selecionado');
      }
    });
  }

  /**
   * Atualiza visual do carousel (para múltiplos slides)
   */
  function atualizarCarousel() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  }
});

/**
 * Função global para selecionar artefato ao clicar no card
 * (Necessário porque o onclick inline chama escopo global)
 */
function selecionarArtefato(id) {
  const artefato = window.artefatos?.find(a => a.id === id);
  if (artefato?.desbloqueado) {
    // Verifica se a função existe no escopo global
    if (typeof window.carregarArtefatoNoCarousel === 'function') {
      window.carregarArtefatoNoCarousel(artefato);
    }
  }
}

// Expõe a função para escopo global (para o onclick inline funcionar)
window.carregarArtefatoNoCarousel = carregarArtefatoNoCarousel;