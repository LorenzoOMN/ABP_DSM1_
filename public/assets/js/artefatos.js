document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    // Elementos de texto dinâmico
    const nomeArtefatoEl = document.getElementById('nomeArtefato');
    const descricaoArtefatoEl = document.getElementById('descricaoArtefato');
    
    let currentIndex = 0;
  
    // Dados dos artefatos (Expanda aqui quando tiver mais fotos)
    const artefatosData = {
      backlog: {
        nome: 'PRODUCT BACKLOG',
        descricao: `
          <p>Pense no <strong>Product Backlog</strong> como a <span class="highlight">lista de missões</span>.</p>
          <p>É basicamente um inventário de tudo que precisa ser feito para evoluir na quest (ou <strong>produto</strong>). Cada item é uma missão (ex: "criar novo inimigo", "melhorar o mapa", "corrigir bug do pulo")</p>
          <p>As missões ficam <span class="highlight">ordenadas por prioridade</span> (as mais importantes ficam no topo). O time vai pegando as missões uma por vez e assim segue avançando na campanha.</p>
          <p>O <strong>Product Backlog</strong> é criado transformando a ideia do produto em uma lista de subtarefas, detalhadas com o time e organizadas por prioridade — e ele <span class="highlight">continua evoluindo durante todo o desenvolvimento</span>. O responsável por este artefato é o <strong>Product Owner</strong>.</p>
        `
      }
      // Adicione outros artefatos:
      // sprint: { nome: 'SPRINT BACKLOG', descricao: '...' },
    };
  
    if (!slides.length) return;
  
    const updateCarousel = () => {
      // Atualiza visual do slide
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      
      // Atualiza textos dinamicamente
      const activeSlide = slides[currentIndex];
      const artefatoKey = activeSlide?.dataset.artefato;
      
      if (artefatoKey && artefatosData[artefatoKey]) {
        const data = artefatosData[artefatoKey];
        if (nomeArtefatoEl) nomeArtefatoEl.textContent = data.nome;
        if (descricaoArtefatoEl) descricaoArtefatoEl.innerHTML = data.descricao;
      }
    };
  
    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  
    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });
  
    // Suporte a teclas
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevBtn?.click();
      if (e.key === 'ArrowRight') nextBtn?.click();
    });
  
    // Inicializa
    updateCarousel();
  });