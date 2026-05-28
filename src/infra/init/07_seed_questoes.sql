INSERT INTO public.questoes (
  id_questao, id_modulo, grupo, numero, dificuldade,
  enunciado, alternativa_correta,
  alternativa_a, alternativa_b, alternativa_c, alternativa_d, imagem, criado_em
)
VALUES
-- ========================
-- MÓDULO 1 | GRUPO 1
-- ========================
(1,1,1,1,'fácil','A chamada "crise do software" foi um dos fatores que impulsionaram o surgimento das metodologias ágeis. Qual problema estava fortemente associado a essa crise?','b','Excesso de linguagens de programação','Dificuldade em lidar com mudanças frequentes de requisitos','Uso insuficiente de hardware moderno','Falta de padronização de bancos de dados',NULL, CURRENT_TIMESTAMP),
(2,1,1,2,'fácil','As metodologias ágeis diferenciam-se dos modelos tradicionais principalmente pela forma como o software é entregue. Qual alternativa representa essa diferença?','b','Entrega única ao final do projeto','Entregas frequentes e incrementais','Documentação extensa antes da codificação','Fases rígidas e sequenciais',NULL, CURRENT_TIMESTAMP),
(3,1,1,3,'fácil','O Manifesto Ágil apresenta valores fundamentais para o desenvolvimento de software. Qual alternativa corresponde corretamente a um desses valores?','c','Processos e ferramentas mais que indivíduos','Seguir um plano mais que responder a mudanças','Indivíduos e interações mais que processos e ferramentas','Documentação mais que software funcionando',NULL, CURRENT_TIMESTAMP),
(4,1,1,4,'média','O Manifesto Ágil é composto por valores e princípios. Quantos princípios fazem parte do Manifesto Ágil?','d','4','8','10','12',NULL, CURRENT_TIMESTAMP),
(5,1,1,5,'média','Em metodologias ágeis, o conceito de iteração é central. O que caracteriza uma iteração?','b','Um longo período sem entregas','Um ciclo curto que gera parte funcional do produto','Uma fase exclusivamente de testes','Um documento de planejamento detalhado',NULL, CURRENT_TIMESTAMP),
(6,1,1,6,'média','Observe o diagrama abaixo, que representa um ciclo de vida de desenvolvimento de software. Uma equipe de desenvolvimento entrega versões funcionais do software em intervalos curtos (semanas) e utiliza o feedback constante do cliente para realizar ajustes e melhorias no produto final. Com base na imagem e na descrição, esse comportamento é característico de qual abordagem?','b','Modelo em Cascata, pois foca em fases sequenciais onde o cliente só vê o produto no final','Desenvolvimento Ágil, pois prioriza a entrega contínua de valor e a resposta rápida a mudanças','Modelo em V, pois estabelece uma relação rígida e simétrica entre as fases de teste e desenvolvimento','Desenvolvimento Orientado a Documentação, pois exige que todos os requisitos sejam congelados antes do início do código','questao_6.png', CURRENT_TIMESTAMP),
(7,1,1,7,'média','Nas metodologias ágeis, mudanças de requisitos ao longo do projeto são vistas como:','c','Erros de planejamento','Falhas de comunicação','Oportunidades de agregar valor','Problemas que devem ser evitados',NULL, CURRENT_TIMESTAMP),
(8,1,1,8,'difícil','Observe a imagem abaixo que resume os quatro pilares fundamentais do Manifesto para Desenvolvimento Ágil de Software. O Manifesto Ágil afirma explicitamente que, embora haja valor nos itens descritos à direita, valoriza-se mais os itens listados à esquerda. Considerando essa filosofia, a interpretação correta dessa afirmação é:','c','Processos e ferramentas devem ser abandonados para evitar burocracia','Itens como documentação e planejamento perdem sua razão de existir em projetos modernos','A agilidade foca na priorização de interações e entrega de valor, sem ignorar a necessidade de suporte dos itens da direita','O sucesso de um projeto depende exclusivamente das pessoas, tornando os contratos e planos irrelevantes','questao_8.png', CURRENT_TIMESTAMP),
(9,1,1,9,'difícil','Uma equipe afirma seguir metodologias ágeis, mas evita qualquer mudança após o início do projeto. Essa postura indica:','b','Boa aplicação dos princípios ágeis','Uma interpretação incorreta da agilidade','Um benefício das metodologias ágeis','Um exemplo de maturidade ágil',NULL, CURRENT_TIMESTAMP),
(10,1,1,10,'difícil','Segundo os princípios ágeis, a principal medida de progresso de um projeto é:','c','O cumprimento do cronograma inicial','A quantidade de documentação produzida','O software funcionando e entregando valor','O número de reuniões realizadas',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 1 | GRUPO 2
-- ========================
(11,1,2,1,'fácil','Em metodologias ágeis, o cliente é considerado:','c','Um fiscal do contrato','Um aprovador final','Um parceiro ativo no desenvolvimento','Um agente externo',NULL, CURRENT_TIMESTAMP),
(12,1,2,2,'fácil','Qual alternativa apresenta apenas metodologias ágeis?','a','Scrum, Kanban e XP','Cascata, Scrum e RUP','Espiral, V-Model e XP','RUP, Kanban e Cascata',NULL, CURRENT_TIMESTAMP),
(13,1,2,3,'fácil','As metodologias ágeis priorizam a entrega de:','c','Documentação detalhada','Código complexo','Valor ao cliente','Relatórios técnicos',NULL, CURRENT_TIMESTAMP),
(14,1,2,4,'média','Equipes auto-organizadas são um conceito importante nas metodologias ágeis. O que define esse tipo de equipe?','b','Ausência de liderança','Autonomia para decidir como executar o trabalho','Falta de planejamento','Dependência total da gerência',NULL, CURRENT_TIMESTAMP),
(15,1,2,5,'média','Um dos benefícios diretos das entregas incrementais é:','b','Eliminar a necessidade de testes','Reduzir riscos ao longo do projeto','Aumentar a documentação','Congelar os requisitos',NULL, CURRENT_TIMESTAMP),
(16,1,2,6,'média','A imagem abaixo apresenta dois artefatos do Scrum utilizados por uma equipe de desenvolvimento: um Product Backlog e um Sprint Backlog, organizados de forma visual para facilitar o entendimento do fluxo de trabalho. Com base na análise da imagem e nos conceitos do Scrum, assinale a alternativa correta.','b','O Product Backlog contém apenas os itens selecionados para a Sprint atual, enquanto o Sprint Backlog representa todas as funcionalidades do produto','O Sprint Backlog é um subconjunto do Product Backlog, contendo os itens escolhidos para serem trabalhados durante a Sprint','O Product Backlog é criado pelos Developers, enquanto o Sprint Backlog é mantido exclusivamente pelo Scrum Master','Os itens do Sprint Backlog permanecem inalterados e não possuem relação direta com o Product Backlog','questao_16.png', CURRENT_TIMESTAMP),
(17,1,2,7,'média','O feedback frequente é essencial nas metodologias ágeis porque:','b','Substitui o planejamento','Permite ajustes contínuos no produto','Evita a comunicação','Elimina mudanças',NULL, CURRENT_TIMESTAMP),
(18,1,2,8,'difícil','A afirmação "responder a mudanças mais que seguir um plano" indica que:','c','O planejamento é desnecessário','Mudanças devem ser evitadas','O plano pode e deve ser adaptado','Não deve existir planejamento',NULL, CURRENT_TIMESTAMP),
(19,1,2,9,'difícil','As metodologias ágeis são mais adequadas para projetos que:','c','Possuem requisitos totalmente estáveis','Não aceitam mudanças','Estão sujeitos a incertezas','Exigem documentação extensa',NULL, CURRENT_TIMESTAMP),
(20,1,2,10,'difícil','Um erro comum ao adotar agilidade é acreditar que ela elimina:','c','A necessidade de testes','A importância das pessoas','O planejamento contínuo','A entrega de valor',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 1 | GRUPO 3
-- ========================
(21,1,3,1,'fácil','Em que ano o Manifesto Ágil foi publicado?','c','1998','1999','2001','2004',NULL, CURRENT_TIMESTAMP),
(22,1,3,2,'fácil','Qual é o principal foco das metodologias ágeis?','b','Cumprir rigorosamente o plano inicial','Entregar valor ao cliente','Produzir documentação detalhada','Evitar mudanças',NULL, CURRENT_TIMESTAMP),
(23,1,3,3,'fácil','Observe a imagem abaixo, que ilustra um ciclo iterativo de desenvolvimento de software, no qual o trabalho é organizado em períodos curtos e repetitivos. Em cada ciclo, a equipe realiza planejamento, desenvolvimento, testes e revisão, incorporando continuamente o feedback das partes interessadas para aprimorar o produto. Esse tipo de abordagem valoriza a adaptação a mudanças, a entrega contínua de valor e a colaboração constante com o cliente ao longo do processo de desenvolvimento. Com base na imagem e na descrição apresentada, qual das alternativas abaixo representa uma prática alinhada aos princípios da agilidade no desenvolvimento de software?','b','Testes apenas no final do projeto','Entregas frequentes de software funcional','Planejamento fixo e imutável desde o início','Desenvolvimento sem feedback do cliente','questao_23.png', CURRENT_TIMESTAMP),
(24,1,3,4,'média','A melhoria contínua nas metodologias ágeis está relacionada a:','c','Eliminar retrospectivas','Repetir sempre o mesmo processo','Refletir regularmente sobre a forma de trabalhar','Centralizar decisões',NULL, CURRENT_TIMESTAMP),
(25,1,3,5,'média','Qual característica diferencia fortemente métodos ágeis de tradicionais?','b','Uso de tecnologia moderna','Forma de lidar com mudanças','Quantidade de pessoas','Uso de bancos de dados',NULL, CURRENT_TIMESTAMP),
(26,1,3,6,'média','A entrega frequente de software funcional contribui principalmente para:','c','Aumentar a complexidade','Reduzir o envolvimento do cliente','Obter feedback rápido','Eliminar testes',NULL, CURRENT_TIMESTAMP),
(27,1,3,7,'média','O valor "software funcionando mais que documentação abrangente" indica que:','b','Documentação não é necessária','A prioridade é o produto utilizável','A documentação deve ser extensa','O código não precisa funcionar',NULL, CURRENT_TIMESTAMP),
(28,1,3,8,'difícil','Uma equipe entrega software frequentemente, mas ignora feedback do cliente. Essa situação contraria qual princípio ágil?','b','Entregas incrementais','Colaboração com o cliente','Simplicidade','Auto-organização',NULL, CURRENT_TIMESTAMP),
(29,1,3,9,'difícil','O conceito de "valor" em metodologias ágeis está mais relacionado a:','c','Quantidade de código','Complexidade técnica','Utilidade percebida pelo cliente','Tamanho da equipe',NULL, CURRENT_TIMESTAMP),
(30,1,3,10,'difícil','A principal diferença conceitual entre métodos tradicionais e ágeis está:','c','No uso de ferramentas','Na forma de organizar equipes','Na abordagem sobre pessoas, mudanças e entregas','Na ausência de processos',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 2 | GRUPO 1
-- ========================
(31,2,1,1,'fácil','O Scrum é amplamente utilizado em projetos de desenvolvimento de software ágil. Qual alternativa define corretamente o Scrum?','b','Uma metodologia prescritiva com etapas fixas','Um framework para gerenciamento e desenvolvimento de produtos complexos','Um modelo tradicional de engenharia de software','Uma ferramenta de controle de tarefas',NULL, CURRENT_TIMESTAMP),
(32,2,1,2,'fácil','O Scrum baseia-se no conceito de empirismo. Quais são os três pilares do empirismo no Scrum?','b','Planejamento, execução e controle','Transparência, inspeção e adaptação','Escopo, prazo e custo','Comunicação, documentação e validação',NULL, CURRENT_TIMESTAMP),
(33,2,1,3,'fácil','No Scrum, os papéis são chamados atualmente de "accountabilities". Qual alternativa apresenta corretamente os três papéis do Scrum?','b','Gerente de Projetos, Analista e Desenvolvedor','Product Owner, Scrum Master e Developers','Cliente, Gerente e Equipe Técnica','Líder Técnico, Testador e Cliente',NULL, CURRENT_TIMESTAMP),
(34,2,1,4,'média','O Product Owner é um papel central no Scrum. Qual é a principal responsabilidade do Product Owner?','c','Garantir que o Scrum seja seguido corretamente','Desenvolver o código do sistema','Maximizar o valor do produto resultante do trabalho do time','Controlar o tempo e o custo do projeto',NULL, CURRENT_TIMESTAMP),
(35,2,1,5,'média','O Product Backlog é um dos principais artefatos do Scrum. Qual alternativa descreve corretamente o Product Backlog?','c','Uma lista fixa de tarefas técnicas','Um conjunto imutável de requisitos','Uma lista ordenada de tudo o que é necessário no produto','Um cronograma detalhado do projeto',NULL, CURRENT_TIMESTAMP),
(36,2,1,6,'média','No Scrum, o Sprint Backlog é criado a partir do Product Backlog. O Sprint Backlog representa:','c','Todas as funcionalidades do produto','Apenas as tarefas técnicas da equipe','Os itens selecionados para a Sprint e o plano para entregá-los','O histórico completo do projeto',NULL, CURRENT_TIMESTAMP),
(37,2,1,7,'média','O Incremento é um artefato fundamental do Scrum. Qual definição melhor representa um Incremento?','c','Um relatório de progresso da Sprint','Uma versão parcial do código ainda não testada','Um conjunto de itens do Product Backlog concluídos e utilizáveis','Uma documentação técnica detalhada',NULL, CURRENT_TIMESTAMP),
(38,2,1,8,'difícil','No Scrum, cada artefato possui um compromisso associado. Qual alternativa associa corretamente o artefato ao seu compromisso?','c','Product Backlog – Definition of Done','Sprint Backlog – Product Goal','Incremento – Definition of Done','Sprint Backlog – Product Goal',NULL, CURRENT_TIMESTAMP),
(39,2,1,9,'difícil','O Scrum Master tem um papel específico dentro do time Scrum. Qual das situações abaixo caracteriza corretamente a atuação do Scrum Master?','c','Definir prioridades do Product Backlog','Distribuir tarefas para os Developers','Atuar como facilitador e remover impedimentos','Aprovar tecnicamente o código produzido',NULL, CURRENT_TIMESTAMP),
(40,2,1,10,'difícil','Uma equipe Scrum decide alterar a Definition of Done durante uma Sprint sem alinhamento. Essa situação indica:','b','Um comportamento esperado e recomendado','Uma violação do princípio de transparência','Um exemplo de adaptação correta','Um benefício do empirismo',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 2 | GRUPO 2
-- ========================
(41,2,2,1,'fácil','Qual papel do Scrum é responsável por garantir que o framework seja compreendido e aplicado corretamente?','b','Product Owner','Scrum Master','Developer','Gerente de Projetos',NULL, CURRENT_TIMESTAMP),
(42,2,2,2,'fácil','O Scrum Team é composto por:','a','Product Owner, Scrum Master e Developers','Cliente, gerente e desenvolvedores','Apenas desenvolvedores','Product Owner e gerente',NULL, CURRENT_TIMESTAMP),
(43,2,2,3,'fácil','Qual artefato contém a visão de longo prazo do produto?','c','Sprint Backlog','Incremento','Product Backlog','Burndown Chart',NULL, CURRENT_TIMESTAMP),
(44,2,2,4,'média','A Definition of Done (DoD) tem como principal objetivo:','b','Definir prazos do projeto','Padronizar quando um incremento pode ser considerado concluído','Controlar custos da Sprint','Registrar falhas do sistema',NULL, CURRENT_TIMESTAMP),
(45,2,2,5,'média','Quem é responsável por criar e manter o Product Backlog?','c','Scrum Master','Developers','Product Owner','Cliente',NULL, CURRENT_TIMESTAMP),
(46,2,2,6,'média','Durante o refinamento do Product Backlog, normalmente ocorre:','b','Execução de testes finais','Detalhamento e reordenação dos itens','Aprovação formal do cliente','Encerramento da Sprint',NULL, CURRENT_TIMESTAMP),
(47,2,2,7,'média','No Scrum, os Developers são responsáveis por:','b','Apenas codificar funcionalidades','Planejar, construir e entregar o Incremento','Priorizar requisitos','Gerenciar o orçamento',NULL, CURRENT_TIMESTAMP),
(48,2,2,8,'difícil','Um Product Owner que não está disponível para o time compromete principalmente:','b','A auto-organização dos Developers','A transparência e a maximização de valor','A realização da Daily Scrum','O cumprimento do time-box',NULL, CURRENT_TIMESTAMP),
(49,2,2,9,'difícil','O Scrum não define cargos técnicos específicos (como analista ou testador) porque:','b','Essas funções não são necessárias','O Scrum foca em equipes multifuncionais','O Scrum elimina especializações','O Scrum substitui a engenharia de software',NULL, CURRENT_TIMESTAMP),
(50,2,2,10,'difícil','Quando o Product Backlog não está claramente ordenado, o principal impacto ocorre em:','b','Daily Scrum','Sprint Planning','Sprint Retrospective','Sprint Review',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 2 | GRUPO 3
-- ========================
(51,2,3,1,'fácil','O Sprint Backlog é de responsabilidade de:','c','Product Owner','Scrum Master','Developers','Cliente',NULL, CURRENT_TIMESTAMP),
(52,2,3,2,'fácil','Qual artefato representa o resultado de uma Sprint?','c','Product Backlog','Sprint Backlog','Incremento','Roadmap',NULL, CURRENT_TIMESTAMP),
(53,2,3,3,'fácil','O Scrum recomenda que o time seja:','b','Grande e altamente especializado','Pequeno e multifuncional','Dividido por áreas técnicas','Hierarquicamente estruturado',NULL, CURRENT_TIMESTAMP),
(54,2,3,4,'média','Qual é a relação correta entre Product Goal e Product Backlog?','b','O Product Goal substitui o Product Backlog','O Product Backlog evolui para atender ao Product Goal','O Product Goal é definido pelos Developers','O Product Goal é opcional',NULL, CURRENT_TIMESTAMP),
(55,2,3,5,'média','O Sprint Goal serve principalmente para:','b','Medir desempenho individual','Guiar o trabalho da Sprint','Controlar custos','Documentar requisitos',NULL, CURRENT_TIMESTAMP),
(56,2,3,6,'média','Se a Definition of Done não existir ou não for clara, o principal risco é:','b','Atraso na Daily Scrum','Incrementos sem qualidade e inconsistentes','Falta de retrospectivas','Excesso de reuniões',NULL, CURRENT_TIMESTAMP),
(57,2,3,7,'média','Quem pode cancelar uma Sprint no Scrum?','c','Scrum Master','Developers','Product Owner','Cliente',NULL, CURRENT_TIMESTAMP),
(58,2,3,8,'difícil','Uma equipe que entrega funcionalidades "quase prontas" ao final da Sprint está violando principalmente:','c','O Sprint Goal','O Product Goal','A Definition of Done','O Sprint Backlog',NULL, CURRENT_TIMESTAMP),
(59,2,3,9,'difícil','No Scrum, a responsabilidade pela qualidade do Incremento é:','c','Exclusiva do Scrum Master','Exclusiva do Product Owner','Compartilhada por todo o Scrum Team','Apenas dos Developers',NULL, CURRENT_TIMESTAMP),
(60,2,3,10,'difícil','O Scrum evita a figura do gerente de projetos tradicional principalmente porque:','b','Não há planejamento no Scrum','O Scrum substitui gestão por auto-organização','Projetos ágeis não precisam de liderança','O Scrum elimina responsabilidades',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 3 | GRUPO 1
-- ========================
(61,3,1,1,'fácil','No Scrum, a Sprint é o evento central em torno do qual todo o trabalho é organizado. Qual alternativa define corretamente uma Sprint?','b','Uma fase final de testes','Um ciclo fixo de até um mês para criar um Incremento','Uma reunião de planejamento do projeto','Um período exclusivo de codificação',NULL, CURRENT_TIMESTAMP),
(62,3,1,2,'fácil','Qual evento do Scrum tem como objetivo planejar o trabalho a ser realizado durante a Sprint?','c','Sprint Review','Sprint Retrospective','Sprint Planning','Daily Scrum',NULL, CURRENT_TIMESTAMP),
(63,3,1,3,'fácil','A Daily Scrum ocorre com qual frequência?','c','Uma vez por Sprint','Duas vezes por semana','Diariamente','Apenas quando há problemas',NULL, CURRENT_TIMESTAMP),
(64,3,1,4,'média','O principal objetivo da Sprint Planning é:','b','Avaliar o desempenho do time','Definir o Sprint Goal e planejar como atingi-lo','Apresentar o Incremento ao cliente','Revisar problemas da Sprint anterior',NULL, CURRENT_TIMESTAMP),
(65,3,1,5,'média','Durante a Sprint Planning, quem participa obrigatoriamente do evento?','c','Apenas o Product Owner','Apenas os Developers','Todo o Scrum Team','Apenas o Scrum Master e o Product Owner',NULL, CURRENT_TIMESTAMP),
(66,3,1,6,'média','A Daily Scrum é um evento voltado principalmente para:','b','O Product Owner acompanhar o progresso','Os Developers inspecionarem o progresso em direção ao Sprint Goal','A validação formal do Incremento','A resolução de conflitos organizacionais',NULL, CURRENT_TIMESTAMP),
(67,3,1,7,'média','Qual artefato é mais diretamente inspecionado durante a Sprint Review?','c','Sprint Backlog','Product Backlog','Incremento','Definition of Done',NULL, CURRENT_TIMESTAMP),
(68,3,1,8,'difícil','Uma Sprint pode ser cancelada antes de seu término em qual situação?','c','Quando o Scrum Master identifica falhas técnicas','Quando os Developers não concluem as tarefas','Quando o Sprint Goal se torna obsoleto','Quando o cliente solicita mudanças',NULL, CURRENT_TIMESTAMP),
(69,3,1,9,'difícil','A ausência frequente do Product Owner na Sprint Review compromete principalmente:','a','A transparência e o feedback sobre o Incremento','A realização da Daily Scrum','O cumprimento do time-box','A auto-organização dos Developers',NULL, CURRENT_TIMESTAMP),
(70,3,1,10,'difícil','Quando a Daily Scrum é utilizada para resolver problemas técnicos detalhados, ocorre:','c','Um uso correto do evento','Um exemplo de adaptação ágil','Um desvio do objetivo do evento','Um benefício do empirismo',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 3 | GRUPO 2
-- ========================
(71,3,2,1,'fácil','Qual evento do Scrum tem foco na inspeção do Incremento e coleta de feedback dos stakeholders?','c','Sprint Planning','Daily Scrum','Sprint Review','Sprint Retrospective',NULL, CURRENT_TIMESTAMP),
(72,3,2,2,'fácil','A Sprint Retrospective ocorre:','c','Antes da Sprint Planning','No início do projeto','Após a Sprint Review','Apenas ao final do projeto',NULL, CURRENT_TIMESTAMP),
(73,3,2,3,'fácil','Qual evento do Scrum é voltado à melhoria contínua do processo de trabalho do time?','b','Sprint Review','Sprint Retrospective','Sprint Planning','Daily Scrum',NULL, CURRENT_TIMESTAMP),
(74,3,2,4,'média','O principal resultado esperado da Sprint Review é:','b','Um relatório de desempenho individual','A atualização do Product Backlog com base no feedback','A definição da Definition of Done','O encerramento formal do projeto',NULL, CURRENT_TIMESTAMP),
(75,3,2,5,'média','Quem participa da Sprint Review?','c','Apenas o Scrum Team','Apenas o Product Owner e o cliente','Scrum Team e stakeholders relevantes','Apenas os Developers',NULL, CURRENT_TIMESTAMP),
(76,3,2,6,'média','A Sprint Retrospective tem como foco principal:','b','Avaliar o produto entregue','Identificar melhorias no processo, pessoas e ferramentas','Planejar o escopo da próxima Sprint','Validar requisitos com o cliente',NULL, CURRENT_TIMESTAMP),
(77,3,2,7,'média','Qual prática está mais alinhada com o objetivo da Sprint Retrospective?','b','Revisar código-fonte','Identificar ações de melhoria para a próxima Sprint','Repriorizar o Product Backlog','Medir velocidade da equipe',NULL, CURRENT_TIMESTAMP),
(78,3,2,8,'difícil','Quando a Sprint Review se transforma em uma reunião apenas de apresentação, sem diálogo, ocorre:','c','Um uso adequado do evento','Um aumento de produtividade','Uma perda de oportunidade de inspeção e adaptação','Um benefício do time-box',NULL, CURRENT_TIMESTAMP),
(79,3,2,9,'difícil','Ignorar sistematicamente a Sprint Retrospective pode resultar principalmente em:','b','Falhas no Product Backlog','Estagnação do processo de melhoria contínua','Atrasos na Daily Scrum','Problemas no Sprint Goal',NULL, CURRENT_TIMESTAMP),
(80,3,2,10,'difícil','No Scrum, todos os eventos existem principalmente para:','c','Controlar pessoas','Reduzir comunicação','Garantir transparência, inspeção e adaptação','Substituir documentação',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 3 | GRUPO 3
-- ========================
(81,3,3,1,'fácil','Qual é a duração máxima recomendada para uma Sprint?','c','Uma semana','Duas semanas','Um mês','Três meses',NULL, CURRENT_TIMESTAMP),
(82,3,3,2,'fácil','Qual evento do Scrum possui time-box de 15 minutos?','d','Sprint Planning','Sprint Review','Sprint Retrospective','Daily Scrum',NULL, CURRENT_TIMESTAMP),
(83,3,3,3,'fácil','O Sprint Goal é definido em qual evento?','b','Sprint Review','Sprint Planning','Daily Scrum','Sprint Retrospective',NULL, CURRENT_TIMESTAMP),
(84,3,3,4,'média','O Sprint Goal tem como principal função:','b','Controlar o desempenho individual','Guiar e dar coerência ao trabalho da Sprint','Definir a arquitetura do sistema','Estimar custos do projeto',NULL, CURRENT_TIMESTAMP),
(85,3,3,5,'média','Se durante a Sprint surgir uma necessidade de ajuste no plano de trabalho, isso pode ocorrer:','c','Apenas com aprovação formal do cliente','Apenas na próxima Sprint','Desde que o Sprint Goal seja respeitado','Somente pelo Scrum Master',NULL, CURRENT_TIMESTAMP),
(86,3,3,6,'média','A inspeção diária do progresso em relação ao Sprint Goal ocorre principalmente na:','c','Sprint Review','Sprint Planning','Daily Scrum','Sprint Retrospective',NULL, CURRENT_TIMESTAMP),
(87,3,3,7,'média','Qual evento encerra formalmente uma Sprint?','d','Sprint Planning','Daily Scrum','Sprint Review','Sprint Retrospective',NULL, CURRENT_TIMESTAMP),
(88,3,3,8,'difícil','Uma equipe frequentemente não atinge o Sprint Goal, mas mantém todas as cerimônias. Esse cenário indica principalmente:','b','Excesso de eventos','Falha no planejamento ou na inspeção','Uso correto do Scrum','Falta de Product Backlog',NULL, CURRENT_TIMESTAMP),
(89,3,3,9,'difícil','Quando o Sprint Goal deixa de orientar as decisões do time durante a Sprint, o principal risco é:','b','Aumento da documentação','Perda de foco e valor entregue','Redução do time-box','Excesso de reuniões',NULL, CURRENT_TIMESTAMP),
(90,3,3,10,'difícil','A existência de time-boxes nos eventos do Scrum tem como principal objetivo:','c','Reduzir custos','Limitar a comunicação','Promover foco, previsibilidade e disciplina','Acelerar a codificação',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 4 | GRUPO 1
-- ========================
(91,4,1,1,'fácil','Em ambientes ágeis, a prática de Integração Contínua (CI) é amplamente utilizada. Qual é o principal objetivo da Integração Contínua?','b','Aumentar a documentação do projeto','Integrar e testar frequentemente o código produzido','Reduzir o número de desenvolvedores','Postergar testes para o final do projeto',NULL, CURRENT_TIMESTAMP),
(92,4,1,2,'fácil','O Kanban é uma abordagem ágil que enfatiza principalmente:','b','Papéis e eventos fixos','Fluxo contínuo de trabalho','Sprints com duração fixa','Planejamento de longo prazo',NULL, CURRENT_TIMESTAMP),
(93,4,1,3,'fácil','A Definition of Done (DoD) está diretamente relacionada a qual aspecto?','b','Prazo do projeto','Qualidade do Incremento','Custo do desenvolvimento','Hierarquia da equipe',NULL, CURRENT_TIMESTAMP),
(94,4,1,4,'média','Uma das práticas fundamentais do Kanban é o uso de limites de WIP (Work In Progress). Qual é o principal objetivo desses limites?','b','Aumentar a quantidade de tarefas iniciadas','Controlar o fluxo e evitar sobrecarga','Eliminar a necessidade de planejamento','Substituir métricas de desempenho',NULL, CURRENT_TIMESTAMP),
(95,4,1,5,'média','Em um contexto ágil, a Dívida Técnica refere-se a:','c','Custos financeiros do projeto','Falhas de infraestrutura','Decisões técnicas inadequadas que geram retrabalho futuro','Erros de usuários finais',NULL, CURRENT_TIMESTAMP),
(96,4,1,6,'média','Qual métrica ágil indica o tempo médio necessário para que um item seja concluído após o início de seu desenvolvimento?','c','Velocity','Lead Time','Cycle Time','Burndown',NULL, CURRENT_TIMESTAMP),
(97,4,1,7,'média','A imagem abaixo apresenta um quadro Kanban utilizado por uma equipe de desenvolvimento. Observa-se que a coluna "Teste" possui poucos cartões, enquanto a coluna "Em Desenvolvimento" apresenta vários itens acumulados. Além disso, não há indicação visual clara de limites de WIP no quadro. Considerando os princípios do Kanban, qual ação seria mais adequada para melhorar o fluxo de trabalho da equipe?','b','Incentivar a equipe a iniciar ainda mais tarefas para aumentar a velocidade','Definir e respeitar limites de WIP, evitando iniciar novas tarefas antes de concluir as existentes','Eliminar a coluna "Teste" para simplificar o fluxo','Transferir automaticamente todos os cartões de "Em Desenvolvimento" para "Concluído"','questao_97.png', CURRENT_TIMESTAMP),
(98,4,1,8,'difícil','Uma equipe ágil entrega funcionalidades rapidamente, mas acumula muitos problemas técnicos não resolvidos. Esse cenário indica principalmente:','c','Uso inadequado de métricas','Ausência de Definition of Ready','Acúmulo de dívida técnica','Excesso de retrospectivas',NULL, CURRENT_TIMESTAMP),
(99,4,1,9,'difícil','A métrica Velocity deve ser utilizada principalmente para:','c','Comparar o desempenho entre equipes diferentes','Avaliar desempenho individual','Apoiar previsões internas da própria equipe','Medir qualidade do código',NULL, CURRENT_TIMESTAMP),
(100,4,1,10,'difícil','Quando métricas ágeis são usadas para punir equipes, o efeito mais provável é:','c','Diminuição da transparência','Mudança contínua do processo','Distorção dos dados e perda de confiança','Redução da necessidade de retrospectivas',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 4 | GRUPO 2
-- ========================
(101,4,2,1,'fácil','O Burndown Chart é uma ferramenta utilizada para:','b','Medir a qualidade do código','Acompanhar o trabalho restante ao longo do tempo','Avaliar desempenho individual','Controlar custos financeiros',NULL, CURRENT_TIMESTAMP),
(102,4,2,2,'fácil','Qual prática ágil está mais diretamente associada à Entrega Contínua (CD)?','b','Entregar o software apenas ao final do projeto','Automatizar o processo de deploy','Evitar testes automatizados','Congelar requisitos',NULL, CURRENT_TIMESTAMP),
(103,4,2,3,'fácil','A refatoração tem como principal objetivo:','b','Adicionar novas funcionalidades','Melhorar a estrutura interna do código sem alterar seu comportamento','Reduzir a documentação','Aumentar o tamanho do sistema',NULL, CURRENT_TIMESTAMP),
(104,4,2,4,'média','Qual métrica é mais adequada para analisar o fluxo contínuo em Kanban?','b','Velocity','Lead Time','Pontos de história','Sprint Goal',NULL, CURRENT_TIMESTAMP),
(105,4,2,5,'média','A Definition of Done contribui diretamente para:','b','Aumentar a velocidade da equipe','Garantir consistência de qualidade entre incrementos','Eliminar testes automatizados','Reduzir a comunicação',NULL, CURRENT_TIMESTAMP),
(106,4,2,6,'média','Em ambientes ágeis, a melhoria contínua da qualidade é fortemente apoiada por:','b','Documentação extensa','Retrospectivas e refatoração','Controle rígido da gerência','Redução de feedback',NULL, CURRENT_TIMESTAMP),
(107,4,2,7,'média','Uma equipe de desenvolvimento utiliza o quadro Kanban ilustrado abaixo para gerenciar seu fluxo de trabalho. Observa-se que a coluna "Em Desenvolvimento" possui um número significativamente maior de cartões do que as demais colunas, enquanto as colunas seguintes apresentam poucos itens concluídos. Com base nos princípios do Kanban, a análise mais adequada dessa situação é:','b','A equipe está demonstrando alta produtividade, pois iniciou muitas tarefas simultaneamente','O quadro indica um gargalo no fluxo de trabalho, possivelmente causado pela ausência ou violação de limites de WIP','O excesso de cartões em "Em Desenvolvimento" é esperado em fluxos ágeis','A situação indica que o Kanban está sendo corretamente aplicado, priorizando velocidade','questao_107.png', CURRENT_TIMESTAMP),
(108,4,2,8,'difícil','Comparar Velocities de equipes diferentes é inadequado porque:','c','Cada equipe utiliza métricas distintas','Velocity é uma métrica financeira','Velocity depende do contexto e das estimativas da própria equipe','Velocity mede apenas qualidade',NULL, CURRENT_TIMESTAMP),
(109,4,2,9,'difícil','Quando a refatoração é constantemente adiada, o risco mais significativo é:','b','Redução do escopo','Aumento da dívida técnica','Perda do Sprint Goal','Excesso de planejamento',NULL, CURRENT_TIMESTAMP),
(110,4,2,10,'difícil','A ausência de testes automatizados em um ambiente de integração contínua tende a:','c','Acelerar entregas com qualidade','Reduzir riscos','Aumentar falhas e retrabalho','Eliminar a necessidade de métricas',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 4 | GRUPO 3
-- ========================
(111,4,3,1,'fácil','O Cycle Time mede:','c','O tempo total desde a solicitação até a entrega','O tempo de execução de uma Sprint','O tempo que um item leva em desenvolvimento','A duração das reuniões',NULL, CURRENT_TIMESTAMP),
(112,4,3,2,'fácil','Qual prática contribui diretamente para a redução de defeitos em ambientes ágeis?','a','Testes automatizados frequentes','Aumento da documentação','Redução de feedback','Planejamento rígido',NULL, CURRENT_TIMESTAMP),
(113,4,3,3,'fácil','Em Kanban, um gargalo ocorre quando:','c','Há poucas tarefas em andamento','O fluxo de trabalho é equilibrado','Uma etapa acumula mais itens que as demais','Não existem limites de WIP',NULL, CURRENT_TIMESTAMP),
(114,4,3,4,'média','Considerando a representação dos gráficos abaixo e o objetivo de visualizar a evolução do trabalho concluído ao longo do tempo, qual deles é o mais indicado para essa finalidade?','b','Burndown Chart, pois ele demonstra o quanto de trabalho ainda resta','Burnup Chart, pois ele ilustra o progresso acumulado do trabalho realizado','Burndown Chart, que é uma ferramenta para identificar causas-raiz de problemas','Burnup Chart, que serve para definir responsabilidades em atividades ou decisões','questao_114.png', CURRENT_TIMESTAMP),
(115,4,3,5,'média','A principal diferença entre Lead Time e Cycle Time é que:','a','Lead Time considera o tempo total desde a solicitação','Cycle Time mede o tempo até a entrega ao cliente','Ambos possuem o mesmo significado','Lead Time ignora filas',NULL, CURRENT_TIMESTAMP),
(116,4,3,6,'média','Uma equipe que busca alta qualidade em ambientes ágeis deve priorizar:','c','Entregas rápidas sem testes','Velocidade acima de tudo','Qualidade embutida no processo','Documentação extensa',NULL, CURRENT_TIMESTAMP),
(117,4,3,7,'média','A utilização adequada de métricas ágeis deve ter como foco principal:','b','Controle e recuperação','Transparência e melhoria contínua','Comparação entre equipes','Avaliação individual',NULL, CURRENT_TIMESTAMP),
(118,4,3,8,'difícil','Uma equipe apresenta alta velocidade, mas baixo valor percebido pelo cliente. Isso indica principalmente:','c','Uso correto de métricas','Falta de retrospectivas','Foco excessivo em velocidade em detrimento de valor','Excesso de testes',NULL, CURRENT_TIMESTAMP),
(119,4,3,9,'difícil','Em Kanban, melhorar o fluxo sem analisar gargalos pode resultar em:','c','Redução do Lead Time','Melhoria automática da qualidade','Otimização local sem ganho sistêmico','Eliminação de métricas',NULL, CURRENT_TIMESTAMP),
(120,4,3,10,'difícil','A qualidade em métodos ágeis é considerada:','c','Responsabilidade exclusiva do testador','Uma etapa final do projeto','Responsabilidade compartilhada por toda a equipe','Um fator secundário',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 5 | GRUPO 1
-- ========================
(121,5,1,1,'fácil','Uma equipe ágil trabalha em Sprints e entrega incrementos frequentes ao cliente. Essa prática contribui principalmente para:','c','Eliminar a necessidade de planejamento','Aumentar a previsibilidade absoluta','Obter feedback rápido e reduzir riscos','Reduzir a comunicação com stakeholders',NULL, CURRENT_TIMESTAMP),
(122,5,1,2,'fácil','Durante o desenvolvimento de um sistema, o cliente solicita uma mudança de requisito após o início do projeto. Segundo os princípios ágeis, a melhor postura da equipe é:','c','Rejeitar a mudança automaticamente','Aceitar a mudança apenas no final do projeto','Avaliar a mudança e adaptar o plano','Manter o plano inicial sem alterações',NULL, CURRENT_TIMESTAMP),
(123,5,1,3,'fácil','Em um ambiente ágil, o Product Owner prioriza o backlog considerando principalmente:','c','Preferências pessoais','Complexidade técnica','Valor de negócio','Facilidade de implementação',NULL, CURRENT_TIMESTAMP),
(124,5,1,4,'média','Uma equipe frequentemente não consegue concluir tudo o que planejou para a Sprint. Qual ação é mais adequada segundo o Scrum?','c','Aumentar a duração da Sprint','Reduzir transparência nas estimativas','Ajustar planejamento e estimativas futuras','Eliminar o Sprint Goal',NULL, CURRENT_TIMESTAMP),
(125,5,1,5,'média','Durante uma Sprint Review, os stakeholders sugerem ajustes importantes no produto. Qual deve ser o próximo passo adequado?','b','Ignorar sugestões para não comprometer o plano','Atualizar o Product Backlog com base no feedback','Encerrar o projeto','Alterar imediatamente o Sprint Backlog da Sprint encerrada',NULL, CURRENT_TIMESTAMP),
(126,5,1,6,'média','Uma equipe Scrum percebe conflitos recorrentes de comunicação interna. Qual evento é mais apropriado para tratar esse problema?','c','Daily Scrum','Sprint Planning','Sprint Retrospective','Sprint Review',NULL, CURRENT_TIMESTAMP),
(127,5,1,7,'média','Um Product Owner constantemente altera prioridades durante a Sprint. Esse comportamento tende a comprometer principalmente:','b','A Sprint Review','O Sprint Goal','A Definition of Done','A Retrospective',NULL, CURRENT_TIMESTAMP),
(128,5,1,8,'difícil','Uma equipe entrega incrementos frequentes, mas o cliente demonstra insatisfação contínua. Qual análise é mais coerente nesse cenário?','b','O time entrega rápido demais','O foco pode estar em velocidade, não em valor','O Scrum não é adequado ao projeto','As Sprints são longas demais',NULL, CURRENT_TIMESTAMP),
(129,5,1,9,'difícil','Um Scrum Master atua como gerente tradicional, distribuindo tarefas e cobrando resultados individuais. Esse comportamento impacta negativamente principalmente:','b','A transparência','A auto-organização do time','O Product Backlog','A Sprint Review',NULL, CURRENT_TIMESTAMP),
(130,5,1,10,'difícil','Uma equipe evita retrospectivas para "ganhar tempo". A consequência mais provável dessa decisão é:','c','Aumento da velocidade','Melhoria contínua do processo','Repetição dos mesmos problemas','Maior previsibilidade',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 5 | GRUPO 2
-- ========================
(131,5,2,1,'fácil','O uso de User Stories em ambientes ágeis tem como principal objetivo:','b','Substituir requisitos funcionais','Representar necessidades do usuário de forma simples','Eliminar documentação','Reduzir testes',NULL, CURRENT_TIMESTAMP),
(132,5,2,2,'fácil','Uma User Story bem escrita geralmente contém:','c','Apenas requisitos técnicos','Código-fonte','Papel, necessidade e benefício','Cronograma detalhado',NULL, CURRENT_TIMESTAMP),
(133,5,2,3,'fácil','Critérios de aceitação servem principalmente para:','b','Medir desempenho individual','Definir quando uma User Story está completa','Controlar custo','Planejar Sprints',NULL, CURRENT_TIMESTAMP),
(134,5,2,4,'média','Durante o planejamento, a equipe percebe que não compreende totalmente uma User Story. Qual ação é mais adequada?','c','Estimar mesmo assim','Remover a story do backlog','Refinar e esclarecer a story','Ignorar os critérios de aceitação',NULL, CURRENT_TIMESTAMP),
(135,5,2,5,'média','Uma User Story grande demais tende a gerar:','b','Melhor previsibilidade','Dificuldade de estimativa e entrega','Maior velocidade','Menor risco',NULL, CURRENT_TIMESTAMP),
(136,5,2,6,'média','Em ambientes ágeis, a estimativa é utilizada principalmente para:','c','Cobrança individual','Comparação entre equipes','Apoiar planejamento e previsões','Eliminar incertezas',NULL, CURRENT_TIMESTAMP),
(137,5,2,7,'média','Uma equipe decide ignorar critérios de aceitação para ganhar velocidade. Esse comportamento compromete diretamente:','c','A Sprint Review','O Sprint Backlog','A qualidade e a satisfação do cliente','A Daily Scrum',NULL, CURRENT_TIMESTAMP),
(138,5,2,8,'difícil','Estimativas em métodos ágeis são consideradas:','b','Compromissos contratuais fixos','Previsões baseadas em informação incompleta','Garantias de entrega','Métricas de desempenho individual',NULL, CURRENT_TIMESTAMP),
(139,5,2,9,'difícil','Quando o backlog não é refinado continuamente, o principal risco é:','b','Aumento da velocidade','Planejamento ineficiente das Sprints','Redução de retrospectivas','Eliminação do Product Owner',NULL, CURRENT_TIMESTAMP),
(140,5,2,10,'difícil','Uma equipe entrega todas as stories planejadas, mas com baixo valor percebido. Isso indica principalmente:','c','Planejamento excessivo','Falta de métricas','Problemas na priorização do backlog','Excesso de testes',NULL, CURRENT_TIMESTAMP),

-- ========================
-- MÓDULO 5 | GRUPO 3
-- ========================
(141,5,3,1,'fácil','O planejamento de releases tem como principal objetivo:','b','Eliminar mudanças','Definir entregas futuras de alto nível','Substituir Sprints','Detalhar tarefas técnicas',NULL, CURRENT_TIMESTAMP),
(142,5,3,2,'fácil','Em projetos ágeis, riscos são tratados preferencialmente por meio de:','b','Documentação extensa','Entregas frequentes e feedback','Contratos rígidos','Planejamento fixo',NULL, CURRENT_TIMESTAMP),
(143,5,3,3,'fácil','Um dos princípios ágeis incentiva:','c','Trabalho isolado','Comunicação mínima','Colaboração constante','Planejamento rígido',NULL, CURRENT_TIMESTAMP),
(144,5,3,4,'média','Quando uma equipe enfrenta mudanças frequentes de escopo, a abordagem ágil ajuda principalmente porque:','b','Elimina a necessidade de controle','Facilita adaptação contínua','Evita interação com o cliente','Aumenta a documentação',NULL, CURRENT_TIMESTAMP),
(145,5,3,5,'média','Uma decisão técnica que acelera a entrega agora, mas gera retrabalho futuro, caracteriza:','c','Melhoria contínua','Otimização de fluxo','Dívida técnica','Refatoração',NULL, CURRENT_TIMESTAMP),
(146,5,3,6,'média','A gestão ágil de riscos está mais associada a:','b','Previsão detalhada de todos os problemas','Respostas rápidas baseadas em feedback','Eliminação de mudanças','Centralização das decisões',NULL, CURRENT_TIMESTAMP),
(147,5,3,7,'média','Uma equipe madura em agilidade demonstra principalmente:','b','Alta velocidade constante','Capacidade de aprender e se adaptar','Ausência de erros','Planejamento rígido',NULL, CURRENT_TIMESTAMP),
(148,5,3,8,'difícil','A adoção "mecânica" do Scrum, sem entendimento de seus princípios, tende a resultar em:','d','Maior agilidade','Melhoria contínua','Cumprimento automático de metas','Perda de efetividade do framework',NULL, CURRENT_TIMESTAMP),
(149,5,3,9,'difícil','Quando decisões são tomadas sem considerar feedback do cliente, o principal risco é:','c','Aumento da velocidade','Redução da transparência','Entregar funcionalidades sem valor','Eliminação do backlog',NULL, CURRENT_TIMESTAMP),
(150,5,3,10,'difícil','O sucesso em projetos ágeis depende principalmente de:','c','Ferramentas sofisticadas','Processos rígidos','Pessoas, colaboração e aprendizado contínuo','Documentação extensa',NULL, CURRENT_TIMESTAMP)

ON CONFLICT (id_questao)
DO UPDATE SET
  id_modulo            = EXCLUDED.id_modulo,
  grupo                = EXCLUDED.grupo,
  numero               = EXCLUDED.numero,
  dificuldade          = EXCLUDED.dificuldade,
  enunciado            = EXCLUDED.enunciado,
  alternativa_correta  = EXCLUDED.alternativa_correta,
  alternativa_a        = EXCLUDED.alternativa_a,
  alternativa_b        = EXCLUDED.alternativa_b,
  alternativa_c        = EXCLUDED.alternativa_c,
  alternativa_d        = EXCLUDED.alternativa_d,
  imagem               = EXCLUDED.imagem,
  criado_em            = COALESCE(questoes.criado_em, CURRENT_TIMESTAMP); -- 👈 PRESERVA A DATA ORIGINAL