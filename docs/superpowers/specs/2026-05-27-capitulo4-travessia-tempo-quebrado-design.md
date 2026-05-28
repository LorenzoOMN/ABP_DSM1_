# Capitulo 4: Travessia do Tempo Quebrado

## Objetivo

Recriar o Capitulo 4 como uma experiencia continua, cinematografica e didatica. O capitulo deixa de parecer uma lista de atos e passa a funcionar como uma travessia em scroll: voce e o time atravessam uma dungeon onde a Sprint esta em crise, a ampulheta nao flui e cada problema do processo aparece como obstaculo narrativo.

A experiencia deve ensinar os conceitos reais do modulo 4 sem esconder os nomes tecnicos: Kanban, WIP, gargalo, Definition of Done, CI, CD, testes automatizados, divida tecnica, refatoracao, Burndown, Burnup, Velocity, Lead Time, Cycle Time, stakeholders, retrospectiva e melhoria continua.

## Direcao Aprovada

- Formato: Jornada cinematografica.
- Estrutura: Travessia em scroll cinematografico.
- Ritmo: Linear.
- Minigames: Livres, sem bloquear a leitura principal.
- Personagem do jogador: voce mesmo, como no Capitulo 1.
- Visual: fantasia sombria com composicao cinematografica.
- Imagens: novas imagens para o Capitulo 4.
- Personagens recorrentes: Corvo, Bardo/Product Owner e Developers.
- Conceitos reais: aparecem no texto/dialogo e tambem em Cartoes do Corvo.
- Boss: nao aparece na historia; entra apenas no questionario.
- Chamada final: A Horda de Stakeholders Selvagens se aproxima.

## Continuidade Narrativa

O capitulo parte diretamente do final do Capitulo 3. Voce e o time descobriram a Sprint e receberam a Ampulheta da Sprint, mas agora percebem que a areia nao cai. Isso mostra que conhecer a Sprint nao basta: e preciso manter o fluxo, proteger a qualidade, lidar com feedback, medir com responsabilidade e melhorar o processo.

Os artefatos anteriores devem aparecer como elementos de continuidade:

- Product Backlog: ajuda a lembrar valor, prioridade e origem dos pedidos.
- Sprint Backlog: mostra o trabalho selecionado para o ciclo.
- Medalhao dos Papeis: reforca a diferenca entre direcao, facilitacao e execucao.
- Ampulheta da Sprint: vira o centro visual do conflito.
- Bau da Melhoria Continua: e desbloqueado no encerramento.

## Estrutura Da Travessia

### Cena 1: A Ampulheta Parada

Voce percebe que a Sprint comecou, mas o tempo nao flui. Product Backlog e Sprint Backlog se abrem no chao. O Corvo explica que trabalho iniciado nao e trabalho concluido.

Minigame livre: interagir com a ampulheta para revelar o estado da Sprint e o conceito de fluxo saudavel.

### Cena 2: O Corredor Dos Cartoes Presos

O caminho se transforma em um fluxo Kanban. Cartoes se acumulam em Desenvolvimento e a coluna de Teste quase nao se move.

Minigame livre: mover cartoes no quadro, observar limite de WIP e entender gargalo.

### Cena 3: A Forja Do Quase Pronto

Um incremento brilhante parece concluido, mas racha quando chega perto da forja. O Corvo reforca que quase pronto ainda nao e pronto.

Minigame livre: checklist da Definition of Done com criterios de qualidade.

### Cena 4: A Ponte Das Runas CI/CD

Uma ponte mecanica exige que as runas sejam ativadas na ordem certa: integrar, testar e preparar entrega.

Minigame livre: pipeline curto de CI/CD. A cena deve explicar que CI integra e testa frequentemente, enquanto CD automatiza o caminho de entrega.

### Cena 5: As Correntes Do Atalho

Os Developers ficam mais lentos. Correntes surgem com inscricoes como "pulamos os testes" e "depois arruma".

Minigame livre: identificar divida tecnica e acionar refatoracao. A explicacao deve deixar claro que refatoracao melhora a estrutura interna sem mudar o comportamento externo.

### Cena 6: O Oraculo Das Metricas

Instrumentos flutuam ao redor do time. O Oraculo pergunta se voces medem para aprender ou para punir.

Minigame livre: selecionar metricas e ver explicacoes curtas para Burndown, Burnup, Velocity, Lead Time e Cycle Time.

### Cena 7: As Vozes Na Escuridao

Stakeholders aparecem como pressao abstrata: vozes, olhos e pedidos surgindo nas laterais da cena, sem revelar o boss.

Minigame livre: classificar pedidos entre Product Backlog, depois ou recusar. A cena deve ensinar que feedback alimenta o backlog, mas nao deve destruir o foco da Sprint.

### Cena 8: O Bau Da Melhoria Continua

O ruido externo desaparece. O time olha para o proprio processo. A retrospectiva acontece como fechamento da travessia.

Minigame livre: responder o que fizemos bem, o que nos atrapalhou e qual melhoria testar na proxima Sprint. Ao completar, a ampulheta e restaurada e o bau da melhoria continua se abre.

## Modelo Visual Responsivo

Usar um modelo hibrido:

- Fundos cinematograficos para ambientacao ampla.
- Personagens recortados em camadas quando houver dialogo, feedback ou interacao.
- Objetos magicos como pontos de interacao: ampulheta, quadro, forja, ponte, correntes, oraculo, pedidos e bau.
- Paineis didaticos curtos abrindo a partir dos objetos, sem parecer atividade escolar separada.

Essa escolha melhora a responsividade porque fundos podem cortar nas laterais sem perder a leitura, enquanto personagens e paineis podem ser reposicionados em telas menores.

## Dialogo E Didatica

O texto deve ser mais natural e cinematografico que a versao atual, mas sempre nomear o conceito real. A fantasia ajuda a memorizar; ela nao substitui a explicacao.

Padrao recomendado:

1. Cena visual e conflito.
2. Fala curta de personagem.
3. Nome real do conceito.
4. Interacao livre.
5. Cartao do Corvo com resumo estudavel.

Exemplo de tom:

> O Bardo aperta o alaude contra o peito. "Feedback importa. Mas se toda voz entrar agora, a Sprint vira ruido."
>
> O Corvo pousa sobre o Product Backlog. "Stakeholders ajudam a revelar valor. O perigo e transformar toda urgencia em interrupcao."

## Componentes Da Pagina

O novo Capitulo 4 deve manter:

- partials existentes: alert, header, botao_voltar, navegacao_inferior e footer.
- scripts `main.js` e `capitulo4.js`.
- registro de conclusao da historia do modulo 4.
- porta final para o desafio.

O novo Capitulo 4 deve substituir:

- navegacao por atos numerados;
- blocos repetitivos de ato;
- secoes com visual de card narrativo tradicional.

O novo Capitulo 4 deve introduzir:

- uma trilha de cenas cinematograficas em scroll;
- Cartao do Corvo mais integrado;
- imagens de fundo por cena;
- personagens em camadas;
- minigames livres e embutidos na cena.

## Dados E Estado No Frontend

O JS deve organizar o estado de forma simples e local:

- quais minigames foram experimentados;
- estado da ampulheta;
- mensagem atual do Corvo;
- estado visual de cada cena.

Os minigames nao bloqueiam a leitura, mas podem alimentar indicadores visuais de progresso. A conclusao da historia permanece no botao final e continua usando a API atual de progresso.

## Acessibilidade E Responsividade

- Todo objeto interativo deve ser botao real ou controle acessivel por teclado.
- Imagens decorativas devem usar `alt=""`; imagens de conteudo devem ter `alt` descritivo.
- Dialogos e paineis devem manter contraste alto.
- Em mobile, personagens em camada podem virar retratos menores acima do dialogo.
- Minigames devem funcionar em toque, clique e teclado.
- Textos nao devem depender de hover para serem compreendidos.

## Plano De Implementacao Em Alto Nivel

1. Reestruturar `capitulo4.ejs` para a travessia continua.
2. Criar a base visual em `capitulo4.css`: cenas full-screen, fundos, camadas, dialogos e paineis.
3. Reorganizar `capitulo4.js` em modulos de interacao por cena.
4. Criar ou adicionar imagens novas do Capitulo 4.
5. Validar renderizacao de `/capitulo4`, responsividade e funcionamento dos minigames.

## Fora De Escopo Nesta Recriacao

- Alterar o questionario do modulo 4.
- Criar o boss dentro da historia.
- Alterar a API de progresso.
- Gravar respostas da retrospectiva no banco nesta primeira versao.
- Refatorar capitulos 1, 2 ou 3.

## Criterios De Sucesso

- O capitulo parece uma travessia continua, nao uma lista de atos.
- O jogador entende os conceitos reais do modulo 4.
- Os minigames sao opcionais, mas melhoram a aprendizagem.
- O visual conversa com os capitulos anteriores e fica mais cinematografico.
- A experiencia funciona em desktop e mobile.
- A quarta porta continua levando ao desafio do modulo 4.
