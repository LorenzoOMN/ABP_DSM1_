# Capítulo 4 - O Ciclo do Tempo

## Base narrativa

Este roteiro refaz o Capítulo 4 a partir do trecho **Capítulo 4 - O Ciclo do Tempo** do arquivo `Roteiro Conteúdo Dungeon Scrum .md`.

O ponto de partida continua o mesmo:

- O grupo acabou de conquistar a **Ampulheta da Sprint**.
- A areia não cai.
- O time está preso em um looping temporal.
- O Product Backlog e o Sprint Backlog são abertos no centro do caminho.
- O capítulo termina com pressão dos Stakeholders, reflexão do time e desbloqueio do **Baú da Melhoria Contínua**.

Mudança necessária:

O roteiro original ensina bem Sprint Review, Stakeholders e Retrospectiva, mas não cobre todo o conteúdo cobrado nas questões do módulo 4. Esta versão mantém a narrativa original e adiciona os conceitos de Kanban, WIP, DoD, CI, CD, testes automatizados, dívida técnica, refatoração e métricas ágeis.

Regra:

**A metáfora pode dramatizar, mas o termo real precisa aparecer claramente.**

## Objetivo de aprendizagem

Ao terminar o Capítulo 4, o jogador deve entender que uma Sprint saudável não depende apenas de começar tarefas ou entregar rápido.

Uma equipe ágil precisa:

- Visualizar fluxo.
- Controlar trabalho em andamento.
- Evitar gargalos.
- Definir o que significa pronto.
- Embutir qualidade no processo.
- Integrar e testar frequentemente.
- Automatizar entrega quando possível.
- Tratar dívida técnica.
- Usar métricas para transparência e melhoria, não punição.
- Aprender com Stakeholders sem virar refém de urgências.

## Conceitos obrigatórios do módulo 4

O roteiro precisa preparar o jogador para responder questões sobre:

- Kanban.
- Fluxo contínuo.
- Gargalo.
- WIP, Work In Progress.
- Definition of Done, DoD.
- Qualidade do incremento.
- Integração Contínua, CI.
- Entrega Contínua, CD.
- Testes automatizados.
- Dívida técnica.
- Refatoração.
- Burndown Chart.
- Burnup Chart.
- Velocity.
- Lead Time.
- Cycle Time.
- Métricas usadas corretamente.
- Risco de usar métricas para punição.
- Valor percebido pelo cliente.
- Qualidade como responsabilidade compartilhada.
- Retrospectiva e melhoria contínua.

## Tom narrativo

Clima:

- Tempo instável.
- Pressão.
- Sala escura.
- Tochas.
- Parede com quadro de tarefas.
- Ponte suspensa.
- Stakeholders como muitas vozes na escuridão.
- Corvo mais direto e menos misterioso.

Tom correto:

> "Isto é Kanban. O quadro não mede esforço heroico. Ele mostra o fluxo do trabalho. Quando uma coluna acumula itens demais, existe um gargalo."

Tom errado:

> "As runas do destino dançam no caos do tempo."

Isso pode soar bonito, mas não ensina.

## Estrutura nova do capítulo

### Cena 01 - A Ampulheta Travada

#### Narrativa

Depois da terceira porta, o grupo ainda está no pântano nebuloso. A **Ampulheta da Sprint** flutua no centro do caminho, mas a areia não cai.

O Corvo observa o objeto.

> "Vocês descobriram a Sprint. Mas descobrir o ciclo não faz o trabalho fluir."

O Product Backlog e o Sprint Backlog se abrem no chão. As tarefas brilham como marcas de luz. Algumas avançam. Outras piscam. Outras ficam presas.

O Bardo tenta começar tudo de uma vez.

O Corvo interrompe.

> "Trabalho iniciado não é trabalho concluído."

#### Conceitos

- Sprint é um ciclo de trabalho.
- Uma Sprint precisa de foco e fluxo.
- Começar tarefas não significa entregar valor.

#### Frase de fixação

> "A Sprint só respira quando o trabalho flui."

#### Interação sugerida

O jogador observa a ampulheta. Ao passar o mouse ou clicar:

> Trabalho iniciado não é trabalho concluído.

---

### Cena 02 - O Quadro das Tarefas Presas

#### Narrativa

A névoa se abre. Surge uma parede de pedra com quatro colunas:

- A Fazer.
- Em Desenvolvimento.
- Teste.
- Concluído.

O Bardo aponta.

> "Isto é um quadro Kanban. Ele mostra o caminho do trabalho."

Os cartões se acumulam em **Em Desenvolvimento**. A coluna **Teste** quase não se move.

O Corvo corta a discussão.

> "Não confundam muitas tarefas iniciadas com progresso."

O grupo entende que o Kanban enfatiza **fluxo contínuo de trabalho**. Quando uma etapa acumula mais itens que as outras, existe um **gargalo**.

No topo da coluna Em Desenvolvimento aparece:

> WIP 3/2

O Corvo explica:

> "WIP significa Work In Progress. É o limite de trabalho em andamento. Ele impede que o time comece mais tarefas do que consegue terminar."

#### Conceitos

- Kanban enfatiza fluxo contínuo.
- Gargalo ocorre quando uma etapa acumula mais itens que as demais.
- WIP controla fluxo e evita sobrecarga.
- A ação correta é respeitar o limite de WIP e terminar antes de iniciar mais trabalho.

#### Frase de fixação

> "Começar menos pode ser o caminho para terminar mais."

#### Interação sugerida

Quadro Kanban interativo:

- Cartões podem avançar para a próxima coluna.
- A coluna Em Desenvolvimento começa acima do WIP.
- O jogador precisa mover cartões para Teste antes de iniciar mais trabalho.
- Cartão bloqueado mostra aviso: "Este item está bloqueado. Resolva o impedimento antes de mover."

---

### Cena 03 - A Forja da Definition of Done

#### Narrativa

Quando o fluxo melhora, uma porta de ferro aparece. Sobre ela está escrito:

> "Somente incrementos prontos atravessam."

Ao lado da porta existe uma forja. O guerreiro tenta empurrar uma tarefa quase finalizada. A forja se apaga.

O Bardo lê a inscrição:

> Definition of Done.

O Corvo explica:

> "Definition of Done, ou DoD, é o acordo que define quando um incremento pode ser considerado realmente pronto."

A forja exige critérios:

- Código integrado.
- Testes executados.
- Critérios de aceitação atendidos.
- Revisão realizada.
- Sem defeitos críticos conhecidos.

Quando todos os critérios são marcados, a forja acende e a porta abre.

#### Conceitos

- DoD está ligada à qualidade do incremento.
- DoD garante consistência de qualidade entre incrementos.
- Qualidade não deve ser deixada para o final.
- Qualidade é responsabilidade compartilhada pelo time.

#### Frase de fixação

> "Pronto é um acordo visível, não uma sensação."

#### Interação sugerida

Checklist de Definition of Done:

- O botão "Liberar incremento" só acende quando todos os critérios forem marcados.
- Se faltar critério, mostrar:

> Quase pronto ainda não é pronto.

---

### Cena 04 - A Ponte CI/CD

#### Narrativa

A porta da forja leva a uma ponte mecânica. No chão existem duas runas:

- CI.
- CD.

A primeira runa acende quando o time junta uma parte nova do código ao restante do trabalho.

O Corvo explica:

> "CI significa Integração Contínua. O objetivo é integrar e testar frequentemente o código produzido."

O grupo tenta atravessar sem testes. A ponte treme.

O Bardo encontra pequenas lâminas gravadas:

- Testes automatizados.
- Build.
- Verificação.

Quando os testes passam, a primeira parte da ponte se estabiliza.

A segunda runa acende.

> "CD significa Entrega Contínua. Ela está associada à automação do deploy."

O portal de saída só abre quando o caminho de entrega está automatizado e confiável.

#### Conceitos

- CI: integrar e testar frequentemente o código.
- Testes automatizados reduzem defeitos.
- Sem testes automatizados em CI, aumentam falhas e retrabalho.
- CD: automação do processo de deploy.

#### Frase de fixação

> "Integrar sem testar é espalhar o erro mais depressa."

#### Interação sugerida

Pipeline visual:

1. Código.
2. Integração.
3. Testes automatizados.
4. Build.
5. Deploy.

Se o jogador tentar pular os testes:

> A ponte falha. Integração Contínua precisa de validação frequente.

---

### Cena 05 - As Correntes da Dívida Técnica

#### Narrativa

Depois da ponte, o time começa a andar mais devagar. Correntes aparecem nos tornozelos dos Developers.

Cada corrente tem uma inscrição:

- "Duplicamos para terminar rápido."
- "Pulamos testes."
- "Deixamos para arrumar depois."
- "Aceitamos código frágil."

O Corvo fala:

> "Isso tem nome: dívida técnica."

Dívida técnica é o resultado de decisões técnicas inadequadas que facilitam o presente, mas geram retrabalho futuro.

Uma bancada aparece.

> Refatoração.

O Bardo lê:

> "Refatorar é melhorar a estrutura interna do código sem alterar seu comportamento externo."

Quando o time refatora, algumas correntes caem.

#### Conceitos

- Dívida técnica gera retrabalho futuro.
- Entregar rápido com problemas técnicos acumulados indica dívida técnica.
- Refatoração melhora a estrutura interna sem mudar comportamento.
- Adiar refatoração aumenta a dívida técnica.
- Retrospectivas e refatoração apoiam melhoria contínua da qualidade.

#### Frase de fixação

> "Atalhos técnicos cobram juros."

#### Interação sugerida

Escolhas rápidas:

- Remendar rápido.
- Refatorar sem mudar comportamento.

Ao escolher remendar:

> A corrente fica mais pesada.

Ao escolher refatorar:

> O comportamento continua igual, mas o caminho fica mais seguro.

---

### Cena 06 - O Oráculo das Métricas

#### Narrativa

A sala seguinte é circular. Relógios, gráficos e ampulhetas flutuam no escuro.

Uma voz pergunta:

> "Vocês medem para aprender ou para punir?"

O Oráculo apresenta cinco instrumentos.

#### Instrumento 1 - Burndown Chart

Uma ampulheta mostra o trabalho restante diminuindo.

> "Burndown Chart acompanha o trabalho restante ao longo do tempo."

#### Instrumento 2 - Burnup Chart

Um baú se enche de luz.

> "Burnup Chart mostra o progresso acumulado do trabalho concluído."

#### Instrumento 3 - Velocity

Um marcador mostra o ritmo do próprio grupo.

> "Velocity apoia previsões internas da própria equipe. Não serve para comparar equipes diferentes nem avaliar desempenho individual."

#### Instrumento 4 - Lead Time

Um relógio começa quando o pedido nasce.

> "Lead Time mede o tempo total desde a solicitação até a entrega."

#### Instrumento 5 - Cycle Time

Outro relógio começa quando alguém inicia o desenvolvimento.

> "Cycle Time mede o tempo que um item leva em desenvolvimento até ser concluído."

O Oráculo mostra uma visão sombria: métricas usadas para punição. Os números começam a mentir. O time esconde problemas.

> "Quando métricas viram chicote, os dados se distorcem e a confiança morre."

#### Conceitos

- Burndown: trabalho restante.
- Burnup: progresso concluído acumulado.
- Velocity: previsão interna da equipe.
- Lead Time: da solicitação até a entrega.
- Cycle Time: do início do desenvolvimento até a conclusão.
- Métricas devem gerar transparência e melhoria contínua.
- Métricas usadas para punição causam distorção de dados e perda de confiança.

#### Frase de fixação

> "Métrica é bússola, não chicote."

#### Interação sugerida

Mini-jogo de associação:

- "Trabalho restante" -> Burndown.
- "Progresso acumulado" -> Burnup.
- "Previsão interna" -> Velocity.
- "Pedido até entrega" -> Lead Time.
- "Início do desenvolvimento até conclusão" -> Cycle Time.

---

### Cena 07 - A Ponte dos Stakeholders

#### Narrativa

Uma ponte suspensa aparece. Dos dois lados, olhos brilham na escuridão.

Vozes surgem:

> "Entreguem mais rápido!"

> "Mudem isso agora!"

> "Coloquem só mais uma coisa!"

A figura encapuzada do roteiro original aparece. Ela carrega um relógio em uma mão e um baú vazio na outra.

As vozes falam juntas:

> "Nós representamos os que aqui não estão. Somos os Stakeholders."

O grupo mostra seus incrementos. Os Stakeholders gostam do que veem, mas percebem que ainda falta valor para completar todos os requisitos.

O Bardo sofre com o excesso de vozes.

O Corvo aponta para o quadro, para a DoD e para as métricas.

> "Feedback importa. Mas urgência sem valor quebra o fluxo."

O Product Owner organiza os pedidos:

- O que gera valor entra no Product Backlog.
- O que não cabe agora fica para depois.
- O que não agrega valor é recusado.

O Oráculo mostra uma Velocity alta, mas o cliente continua insatisfeito.

> "Alta velocidade com baixo valor percebido não é sucesso. É só pressa bem medida."

#### Conceitos

- Stakeholders representam interesses reais.
- Feedback deve alimentar o Product Backlog.
- Valor percebido importa mais que velocidade isolada.
- Alta Velocity com baixo valor indica foco excessivo em velocidade.
- Toda mudança precisa ser avaliada, não aceita de forma caótica.

#### Frase de fixação

> "Nem toda urgência é valor."

#### Interação sugerida

Triagem de pedidos dos Stakeholders:

- Gerar valor agora.
- Guardar no backlog.
- Recusar ou adiar.

---

### Cena 08 - O Baú da Melhoria Contínua

#### Narrativa

Depois da ponte, as vozes desaparecem.

Não há inimigo visível.

O guerreiro olha para a espada desgastada.

O arqueiro observa flechas desperdiçadas.

O Bardo afina o alaúde em silêncio.

O Corvo pousa diante do time.

> "Antes vocês olharam para o produto. Agora olhem para o processo."

Um baú aparece. É o mesmo baú citado no roteiro original, agora fechado.

Para abrir, o grupo precisa responder:

- O que fizemos bem?
- O que deu errado?
- O que vamos melhorar?

O time percebe que melhoria contínua depende de retrospectiva, qualidade, refatoração, testes, análise de gargalos e uso saudável de métricas.

O baú se abre.

#### Artefato desbloqueado

## Baú da Melhoria Contínua

Descrição:

> "Equipes fortes não nascem prontas. Elas evoluem a cada ciclo."

#### Conceitos

- Retrospectiva.
- Melhoria contínua.
- Qualidade como responsabilidade compartilhada por toda a equipe.
- Análise do processo, não só do produto.

#### Frase de fixação

> "Não é só sobre o que entregamos. É sobre como aprendemos a entregar melhor."

#### Interação sugerida

Três campos curtos:

- O que fizemos bem?
- O que deu errado?
- O que vamos melhorar?

Pode ser salvo no artefato, se for simples implementar.

---

## Encerramento do capítulo

A ampulheta finalmente volta a funcionar. A areia cai no ritmo certo.

O Corvo observa o time.

> "Vocês não aprenderam apenas a correr. Aprenderam a proteger o fluxo."

A porta do quarto desafio se abre.

Botão:

> Encarar o desafio do módulo 4

Mensagem antes do questionário:

> A Horda de Stakeholders Selvagens se aproxima. Para atravessar, prove que entende fluxo, qualidade, métricas e melhoria contínua.

## Vitória no desafio

As vozes recuam.

O quadro Kanban estabiliza.

A forja permanece acesa.

As correntes da dívida técnica se soltam.

O Baú da Melhoria Contínua brilha.

O Corvo sorri.

> "Vocês não entregaram apenas mais rápido. Vocês aprenderam a entregar melhor."

## Falha no desafio

O trabalho volta a se acumular.

As métricas se distorcem.

A ponte range sob o peso da dívida técnica.

O Corvo surge entre a névoa.

> "O fluxo quebrou. Voltem, observem o quadro e tentem de novo."

## Checklist de cobertura das questões do módulo 4

| Conceito cobrado | Cena que cobre | Como aparece |
| --- | --- | --- |
| CI | Cena 04 | Integração e testes frequentes |
| Kanban | Cena 02 | Quadro com fluxo contínuo |
| DoD | Cena 03 | Forja da Definition of Done |
| WIP | Cena 02 | Limite WIP 3/2 e sobrecarga |
| Dívida técnica | Cena 05 | Correntes dos atalhos técnicos |
| Cycle Time | Cena 06 | Relógio que inicia no desenvolvimento |
| Gargalo em Kanban | Cena 02 | Acúmulo em Em Desenvolvimento |
| Velocity | Cena 06 e Cena 07 | Previsão interna, não comparação |
| Métricas como punição | Cena 06 | Distorção dos dados e perda de confiança |
| Burndown | Cena 06 | Trabalho restante |
| CD | Cena 04 | Automação de deploy |
| Refatoração | Cena 05 | Melhorar estrutura sem mudar comportamento |
| Lead Time | Cena 06 | Solicitação até entrega |
| Qualidade consistente | Cena 03 | DoD e incremento |
| Retrospectiva e refatoração | Cena 05 e Cena 08 | Melhoria contínua da qualidade |
| Testes automatizados | Cena 04 | Redução de defeitos |
| Burnup | Cena 06 | Progresso acumulado concluído |
| Lead Time x Cycle Time | Cena 06 | Dois relógios com início diferente |
| Qualidade embutida | Cena 03 e Cena 08 | Qualidade no processo |
| Métricas saudáveis | Cena 06 | Transparência e melhoria contínua |
| Valor percebido | Cena 07 | Velocidade sem valor não basta |
| Otimização local | Cena 02 e Cena 06 | Melhorar sem olhar gargalo não melhora o sistema |
| Qualidade compartilhada | Cena 03 e Cena 08 | Responsabilidade de todo o time |

## Observações para implementação

- O capítulo deve ter mais cenas que o roteiro original. Quatro cenas não cobrem o módulo.
- Cada cena precisa ter texto curto, termo real destacado e uma interação simples.
- Não esconder conceito crítico apenas em tooltip.
- Os termos reais devem aparecer no texto principal.
- Manter a narrativa dos Stakeholders e do Baú da Melhoria Contínua, porque ela vem do roteiro base.
- Evitar transformar o capítulo em aula seca. A cena ensina, depois a interação fixa.
- A ordem recomendada é: fluxo -> qualidade -> automação -> dívida técnica -> métricas -> stakeholders -> retrospectiva.
