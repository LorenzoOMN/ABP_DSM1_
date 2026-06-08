-- =========================================================
-- ARTEFATOS — CATÁLOGO BASE
-- =========================================================

CREATE TABLE IF NOT EXISTS public.artefatos (
  id INTEGER PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao_curta VARCHAR(255),
  conteudo_longo TEXT,
  imagem VARCHAR(255),
  capitulo_requisito INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- ARTEFATOS — SEED VERSIONADO
-- =========================================================

INSERT INTO public.artefatos (
  id,
  titulo,
  descricao_curta,
  conteudo_longo,
  imagem,
  capitulo_requisito
)
VALUES
(
  1,
  'Product Backlog',
  'Necessidades organizadas de acordo com seu valor',
  $html$
    <p>
      Cada linha revela uma necessidade da missão, um requisito perdido,
      uma melhoria possível ou um problema que ainda precisa ser resolvido.
      Nada aqui está escrito por acaso: os itens mais importantes brilham no topo,
      indicando o que deve receber atenção primeiro.
    </p>

    <p>
      O <strong>Product Backlog</strong> ajuda o <strong>time Scrum</strong>
      a entender o que precisa ser feito, quais itens têm mais valor e quais
      desafios devem ser enfrentados primeiro. Ele é <strong>atualizado</strong>
      ao longo da jornada, conforme novas descobertas, <strong>mudanças</strong>
      e aprendizados surgem.
    </p>
  $html$,
  'product-backlog-icon.png',
  1
),
(
  2,
  'Medalhão dos Papéis',
  'Direção, facilitação e execução',
  $html$
    <p>
      O Medalhão dos Papéis ajuda o jogador a lembrar que o Scrum depende
      do equilíbrio e do <strong>trabalho em equipe</strong>. São
      <strong>três papéis</strong> a serem desempenhados.
    </p>

    <p>
      Sem Product Owner, o time perde prioridade. Sem Scrum Master,
      o fluxo se desorganiza. Sem Dev Team, nada é entregue.
    </p>

    <ul>
      <li>
        O <strong>Product Owner</strong> é a voz do produto. Ele entende as
        necessidades dos stakeholders, organiza o <strong>Product Backlog</strong>
        e define quais itens têm mais valor para a jornada. Sua função é garantir
        que o time esteja seguindo na direção certa.
      </li>

      <li>
        O <strong>Scrum Master</strong> é o guardião do fluxo. Ele não manda
        no time, mas ajuda todos a entenderem e aplicarem o Scrum.
        <strong>Remove impedimentos, facilita os eventos e protege o time de distrações</strong>
        que podem quebrar o ritmo da missão.
      </li>

      <li>
        O <strong>Dev Team</strong> é formado pelos aventureiros que fazem acontecer.
        Possuem habilidades diferentes, mas trabalham juntos para transformar ideias
        em <strong>incrementos reais de valor</strong>.
      </li>
    </ul>
  $html$,
  'medalhao-icon.png',
  2
),
(
  3,
  'Ampulheta da Sprint',
  'Não existe perfeição imediata, apenas melhoria contínua.',
  $html$
    <p>
      Sua areia brilha como se marcasse o ritmo da própria Dungeon. Ela revela
      que a jornada deve acontecer em <strong>ciclos curtos</strong>, com começo,
      fim e objetivo claro. Cada ciclo é uma <strong>Sprint</strong>: um período
      fixo de trabalho em que o time se organiza para gerar uma
      <strong>entrega de valor</strong>.
    </p>

    <p>
      Durante a Sprint, o foco deve ser mantido. O time segue o plano,
      enfrenta os desafios e, ao final, entrega um novo incremento da missão.
    </p>

    <blockquote>
      “Não existe perfeição imediata… apenas melhoria contínua.”
    </blockquote>

    <p>
      <strong>Função:</strong> a Ampulheta da Sprint lembra que o Scrum avança
      por ciclos de tempo fixo, <strong>geralmente de 1 a 4 semanas</strong>,
      onde o time trabalha com foco para entregar valor ao final de cada etapa.
    </p>
  $html$,
  'ampulheta-icon.png',
  3
),
(
  4,
  'Baú da Iteração',
  'Ele não revela um tesouro comum: revela perguntas.',
  $html$
    <p>
      Ele convida os aventureiros a olharem para a própria jornada e refletirem
      sobre o que funcionou, o que deu errado e o que pode melhorar antes do
      próximo ciclo.
    </p>

    <blockquote>
      “Equipes fortes não nascem prontas… elas evoluem a cada ciclo.”
    </blockquote>

    <p>
      O Baú da Iteração representa o momento de
      <strong>inspeção e melhoria do time</strong>. Ele ensina que, no Scrum,
      cada ciclo é uma chance de <strong>aprender</strong>,
      <strong>ajustar o processo</strong> e <strong>evoluir</strong>
      para a próxima Sprint.
    </p>

    <p>
      A mecânica de uma iteração no framework Scrum é dividida em eventos
      essenciais e funciona da seguinte forma:
    </p>

    <ul>
      <li>
        <strong>Planejamento — Sprint Planning:</strong> reunião que inicia
        a iteração. A equipe define o que será feito e como.
      </li>

      <li>
        <strong>Trabalho Diário — Daily Scrum:</strong> encontros rápidos diários,
        geralmente de 15 minutos, para inspecionar o progresso rumo à meta e
        adaptar o plano.
      </li>

      <li>
        <strong>Revisão — Sprint Review:</strong> reunião ao final da Sprint
        onde o incremento é inspecionado e o backlog pode ser ajustado com base
        no feedback.
      </li>

      <li>
        <strong>Retrospectiva — Sprint Retrospective:</strong> momento focado
        na melhoria contínua da equipe, dos processos e das ferramentas.
      </li>
    </ul>
  $html$,
  'bau-iteracao-icon.png',
  4
),
(
  5,
  'Chapéu do Scrum Master',
  'Ele pertence àquele que entende o fluxo.',
  $html$
    <p>
      Ao tocá-lo, memórias da jornada surgem: você <strong>ajudando</strong>
      o time a se organizar, mantendo o <strong>foco nas Sprints</strong>,
      conectando os artefatos e removendo <strong>impedimentos</strong>
      pelo caminho.
    </p>

    <p>
      Então você entende: o verdadeiro <strong>Scrum Master</strong> não controla
      o time. Ele facilita, protege o processo e ajuda todos a trabalharem melhor
      juntos.
    </p>

    <blockquote>
      “Aquele que domina o fluxo… não controla o time. Ele liberta o potencial dele.”
    </blockquote>

    <p>
      O Chapéu do Scrum Master representa a compreensão final do Scrum. Ele mostra
      que o papel do Scrum Master é facilitar o trabalho do time, remover impedimentos,
      apoiar os eventos Scrum e garantir que todos possam evoluir juntos a cada ciclo.
    </p>
  $html$,
  'chapeu-scrum.png',
  5
)
ON CONFLICT (id) DO UPDATE
SET
  titulo = EXCLUDED.titulo,
  descricao_curta = EXCLUDED.descricao_curta,
  conteudo_longo = EXCLUDED.conteudo_longo,
  imagem = EXCLUDED.imagem,
  capitulo_requisito = EXCLUDED.capitulo_requisito;

  -- =========================================================
-- ARTEFATOS — COLETA PERMANENTE POR USUÁRIO
-- =========================================================

CREATE TABLE IF NOT EXISTS public.usuario_artefatos (
  id_usuario_artefato INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  id_usuario INTEGER NOT NULL,
  id_artefato INTEGER NOT NULL,
  desbloqueado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_usuario_artefato_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES public.usuarios (id_usuario)
    ON DELETE CASCADE,

  CONSTRAINT fk_usuario_artefato_artefato
    FOREIGN KEY (id_artefato)
    REFERENCES public.artefatos (id)
    ON DELETE CASCADE,

  CONSTRAINT uq_usuario_artefato
    UNIQUE (id_usuario, id_artefato)
);

CREATE INDEX IF NOT EXISTS idx_usuario_artefatos_usuario
  ON public.usuario_artefatos (id_usuario);

CREATE INDEX IF NOT EXISTS idx_usuario_artefatos_artefato
  ON public.usuario_artefatos (id_artefato);

-- =========================================================
-- ARTEFATOS — MIGRAÇÃO DO MODELO ANTIGO
-- Mantém desbloqueios de quem já concluiu histórias antes da tabela nova.
-- =========================================================

  INSERT INTO public.usuario_artefatos (
  id_usuario,
  id_artefato
)
SELECT
  ph.id_usuario,
  a.id
FROM public.progresso_historia ph
INNER JOIN public.artefatos a
  ON a.capitulo_requisito = ph.id_modulo
WHERE ph.concluido = true
ON CONFLICT (id_usuario, id_artefato)
DO NOTHING;