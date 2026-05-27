# Capítulo 4 - O Ciclo do Tempo

## Intenção do capítulo

Este capítulo deve ensinar práticas ágeis, métricas e qualidade sem abandonar a fantasia da Scrum Dungeon.

A regra principal é: **o termo real aparece junto da metáfora**.

O jogador pode ver uma ampulheta, uma ponte, uma forja ou um quadro antigo, mas o texto precisa nomear claramente os conceitos reais: Kanban, WIP, Definition of Done, Integração Contínua, Entrega Contínua, dívida técnica, refatoração, Burndown, Burnup, Velocity, Lead Time e Cycle Time.

O capítulo deve parecer uma continuação natural do Capítulo 1: cenas curtas, objetos simbólicos, frases memoráveis e explicação embutida na jornada.

## Objetivo de aprendizagem

Ao terminar o capítulo, o jogador deve entender que agilidade não é apenas entregar rápido. Uma equipe ágil precisa manter fluxo, qualidade, transparência e melhoria contínua.

O conteúdo precisa preparar o jogador para responder às questões do módulo 4, que tratam de:

- Kanban, fluxo contínuo, gargalos e limites de WIP.
- Definition of Done e qualidade do incremento.
- Integração Contínua, Entrega Contínua e testes automatizados.
- Dívida técnica e refatoração.
- Burndown, Burnup, Velocity, Lead Time e Cycle Time.
- Uso saudável de métricas.
- Qualidade como responsabilidade compartilhada.

## Tom narrativo

O capítulo deve ter clima de urgência, tempo instável e pressão externa.

O grupo acabou de descobrir a Sprint no capítulo anterior, mas ainda não sabe como manter uma Sprint saudável. A ampulheta existe, mas está travada. O tempo não flui porque o trabalho também não flui.

A fantasia deve ajudar a memorizar, não substituir o conceito real.

Exemplo de tom correto:

> No quadro antigo, os cartões não eram apenas tarefas. Eram itens de trabalho atravessando um fluxo Kanban. Quando muitos se acumulavam em uma única coluna, o problema tinha nome: gargalo.

Exemplo de tom a evitar:

> As runas do tempo revelam a dança dos pergaminhos eternos.

Esse segundo tipo pode soar bonito, mas não ensina o termo real.

## Estrutura narrativa sugerida

### 1. A Ampulheta Travada

Depois de atravessar a terceira porta, vocês permanecem no pântano nebuloso. A ampulheta recém-encontrada flutua no centro do caminho, mas a areia não cai.

O Corvo observa em silêncio.

> "Vocês descobriram a Sprint... mas ainda não aprenderam a fazê-la fluir."

O Product Backlog e o Sprint Backlog se abrem no chão. As tarefas brilham como pequenas marcas de luz, mas algumas piscam, outras se apagam, e outras parecem presas no mesmo lugar.

Você percebe que o problema não é apenas escolher o que fazer. O problema é fazer o trabalho atravessar o caminho até ficar pronto.

Conceito apresentado:

- Uma Sprint precisa de foco, mas também precisa de fluxo saudável.
- Trabalho iniciado não é o mesmo que trabalho concluído.

Frase de fixação:

> "A Sprint só respira quando o trabalho flui."

### 2. O Quadro das Tarefas Presas

A névoa se abre e revela uma parede de pedra coberta por colunas. No topo de cada coluna há uma inscrição:

- A Fazer.
- Em Desenvolvimento.
- Teste.
- Concluído.

O Bardo toca uma nota baixa.

> "Isto é um quadro Kanban. Ele mostra o caminho do trabalho."

Vários cartões estão empilhados em "Em Desenvolvimento". A coluna "Teste" quase não tem movimento. O time começa a discutir, mas o Corvo interrompe:

> "Não confundam muitas tarefas iniciadas com progresso."

Você entende que Kanban enfatiza o **fluxo contínuo de trabalho**. Ele ajuda a visualizar onde o trabalho está parado e onde o time está sobrecarregado.

Quando uma coluna acumula muito mais cartões que as outras, existe um **gargalo**.

Para controlar isso, o grupo grava um limite no topo da coluna:

> WIP: 2

O Corvo explica:

> "WIP significa Work In Progress. É o limite de trabalho em andamento. Ele impede que o time comece mais tarefas do que consegue terminar."

Conceitos apresentados:

- Kanban: abordagem focada em fluxo contínuo.
- Gargalo: acúmulo de trabalho em uma etapa.
- WIP: limite de trabalho em andamento para evitar sobrecarga.

Frase de fixação:

> "Começar menos pode ser o caminho para terminar mais."

### 3. A Forja do Pronto

Quando os cartões começam a se mover, uma porta de ferro aparece. Sobre ela está escrito:

> "Somente incrementos prontos atravessam."

Ao lado da porta existe uma forja. Cada item concluído precisa passar por ela antes de seguir. O guerreiro tenta empurrar um cartão quase finalizado, mas a forja se apaga.

O Bardo lê uma placa:

> "Definition of Done."

Você entende que a **Definition of Done**, ou DoD, é o acordo que define quando um incremento pode ser considerado realmente pronto. Ela está ligada à **qualidade do incremento**.

A forja exige critérios claros:

- Código integrado.
- Testes executados.
- Critérios de aceitação atendidos.
- Revisão realizada.
- Sem defeitos críticos conhecidos.

O Corvo bate as asas.

> "Quase pronto ainda não é pronto."

Conceitos apresentados:

- Definition of Done define o que significa "pronto".
- A DoD garante consistência de qualidade entre incrementos.
- Qualidade não deve ser deixada para o final.

Frase de fixação:

> "Pronto é um acordo visível, não uma sensação."

### 4. As Runas de CI e CD

Depois da forja, o grupo encontra duas runas gravadas em uma ponte mecânica:

- CI - Integração Contínua.
- CD - Entrega Contínua.

A primeira runa acende sempre que um novo trecho de código é unido ao restante do trabalho. Mas, quando o grupo tenta atravessar sem testar, a ponte treme.

O Corvo explica:

> "Integração Contínua, ou CI, significa integrar e testar frequentemente o código produzido. O objetivo é descobrir problemas cedo."

A segunda runa controla o portal de saída. Quando os testes passam e a DoD é respeitada, o portal se abre de forma estável.

O Bardo completa:

> "Entrega Contínua, ou CD, está ligada à automação do processo de deploy. Entregar fica menos arriscado quando o caminho é confiável."

Você percebe que testes automatizados são parte essencial dessa segurança. Sem eles, integrar código frequentemente pode apenas espalhar problemas mais rápido.

Conceitos apresentados:

- CI: integrar e testar frequentemente o código.
- CD: automatizar o processo de deploy.
- Testes automatizados reduzem defeitos e retrabalho.

Frase de fixação:

> "Integrar sem testar é só espalhar o erro mais depressa."

### 5. As Correntes da Dívida Técnica

Ao atravessar a ponte, as armas do grupo ficam mais pesadas. Correntes surgem presas aos tornozelos dos Developers.

Cada corrente carrega uma inscrição:

- "Duplicamos para terminar mais rápido."
- "Pulamos os testes."
- "Deixamos para arrumar depois."

O Corvo fica sério.

> "Isso tem nome: dívida técnica."

Dívida técnica acontece quando decisões técnicas inadequadas facilitam uma entrega no presente, mas criam retrabalho no futuro.

Uma bancada aparece ao lado da ponte. Nela está escrito:

> Refatoração.

Refatorar não muda o comportamento externo do produto. Refatorar melhora a estrutura interna do código para que ele continue evoluindo com menos risco.

Conforme o time refatora partes críticas, algumas correntes se soltam.

Conceitos apresentados:

- Dívida técnica: decisões técnicas ruins ou apressadas que geram retrabalho futuro.
- Refatoração: melhoria interna do código sem alterar seu comportamento.
- Adiar refatoração aumenta a dívida técnica.

Frase de fixação:

> "Atalhos técnicos cobram juros."

### 6. O Oráculo das Métricas

A sala seguinte é circular. Relógios, gráficos e ampulhetas flutuam ao redor do grupo. No centro, uma voz pergunta:

> "Vocês medem para aprender... ou para punir?"

O Oráculo das Métricas apresenta cinco instrumentos.

O primeiro é uma ampulheta descendo:

> **Burndown Chart:** mostra quanto trabalho ainda resta ao longo do tempo.

O segundo é um baú enchendo de luz:

> **Burnup Chart:** mostra o progresso acumulado do trabalho concluído.

O terceiro é um marcador de ritmo do próprio grupo:

> **Velocity:** ajuda a equipe a fazer previsões internas. Não deve ser usada para comparar equipes diferentes.

O quarto é um relógio que começa quando o pedido nasce:

> **Lead Time:** mede o tempo total desde a solicitação até a entrega.

O quinto é um relógio que começa quando alguém inicia o trabalho:

> **Cycle Time:** mede o tempo que um item leva depois que começa seu desenvolvimento até ser concluído.

O Oráculo então mostra uma cena sombria: métricas sendo usadas para punir o time. Os números começam a mentir, os cartões desaparecem e ninguém admite problemas.

Você entende: quando métricas são usadas para punição, o efeito mais provável é distorção dos dados e perda de confiança.

Conceitos apresentados:

- Burndown: trabalho restante.
- Burnup: trabalho concluído acumulado.
- Velocity: previsão interna da própria equipe.
- Lead Time: do pedido até a entrega.
- Cycle Time: do início do desenvolvimento até a conclusão.
- Métricas devem apoiar transparência e melhoria contínua.

Frase de fixação:

> "Métrica é bússola, não chicote."

### 7. A Ponte dos Stakeholders

A porta seguinte se abre para uma ponte suspensa. Dos dois lados, olhos surgem na escuridão.

Vozes começam a gritar:

> "Mudem isso!"

> "Entreguem mais rápido!"

> "Coloquem só mais uma coisa!"

O Bardo, como Product Owner, tenta ouvir tudo ao mesmo tempo. Sua música falha. O time percebe que feedback é importante, mas precisa virar decisão consciente.

Os Stakeholders não são inimigos por existir. Eles representam interesses reais. O perigo está em transformar toda urgência em interrupção e toda métrica em cobrança.

Você ajuda o Bardo a separar os pedidos:

- O que gera valor entra no Product Backlog.
- O que não cabe agora fica para discussão posterior.
- O que não agrega valor é recusado ou adiado.

O Corvo aponta para a Velocity brilhando no chão.

> "Cuidado. Alta velocidade com baixo valor percebido não é sucesso. É só pressa bem medida."

Conceitos apresentados:

- Valor percebido importa mais que velocidade isolada.
- Feedback deve alimentar o backlog.
- Mudanças precisam ser avaliadas, não aceitas de forma caótica.

Frase de fixação:

> "Nem toda urgência é valor."

### 8. O Baú da Melhoria Contínua

Após atravessar a ponte, as vozes desaparecem. Não há inimigo visível. Não há nova criatura. Apenas o time cansado, olhando para as próprias marcas.

O guerreiro observa a espada desgastada.

O arqueiro percebe flechas desperdiçadas.

O Bardo afina o alaúde em silêncio.

O Corvo pousa no centro do grupo.

> "Antes vocês olharam para o produto. Agora olhem para o processo."

Um baú fechado surge diante de vocês. Para abri-lo, o time precisa responder três perguntas:

- O que fizemos bem?
- O que deu errado?
- O que vamos melhorar?

Você entende que melhoria contínua não acontece por acaso. Ela é construída com retrospectivas, análise sincera do processo, refatoração, testes, qualidade e atenção aos gargalos.

O baú se abre.

Artefato desbloqueado:

## Baú da Melhoria Contínua

Descrição:

> "Equipes fortes não nascem prontas. Elas evoluem a cada ciclo."

Conceitos apresentados:

- Retrospectiva.
- Melhoria contínua.
- Qualidade como responsabilidade compartilhada por toda a equipe.

Frase de fixação:

> "Não é só sobre o que entregamos. É sobre como aprendemos a entregar melhor."

## Encerramento e chamada para o desafio

Com o Baú da Melhoria Contínua aberto, a ampulheta finalmente volta a funcionar. A areia cai no ritmo certo.

O Corvo olha para a próxima porta.

> "Agora vocês conhecem o fluxo. Mas conhecer não basta. A próxima porta vai testar se vocês sabem protegê-lo."

Botão sugerido:

> Concluir história e encarar a quarta porta

Mensagem antes do questionário:

> A Horda de Stakeholders Selvagens se aproxima. Para atravessar, você precisa provar que entende fluxo, qualidade, métricas e melhoria contínua.

## Vitória no desafio

As vozes recuam para a escuridão. O quadro Kanban se estabiliza, a forja permanece acesa e a ampulheta já não está travada.

O Product Owner respira aliviado. Os Developers recolhem suas ferramentas. O Corvo sorri.

> "Vocês não correram apenas mais rápido. Vocês aprenderam a avançar melhor."

## Falha no desafio

O trabalho se acumula no quadro. As métricas perdem sentido. A ponte range sob o peso da dívida técnica.

O Corvo surge entre a névoa.

> "O fluxo quebrou, mas agora vocês sabem onde procurar. Voltem, observem o quadro e tentem de novo."

## Checklist de cobertura das questões do capítulo 4

Este checklist garante que o roteiro ensina os termos cobrados no questionário.

| Termo real | Como o capítulo ensina |
| --- | --- |
| Kanban | Quadro das Tarefas Presas, com colunas de fluxo |
| Fluxo contínuo | Trabalho atravessando o quadro até Concluído |
| WIP | Limite gravado na coluna Em Desenvolvimento |
| Gargalo | Acúmulo de cartões em uma etapa |
| Definition of Done | Forja do Pronto |
| Qualidade do incremento | Incremento só passa pela porta quando atende à DoD |
| CI | Runa de Integração Contínua |
| CD | Runa de Entrega Contínua e portal automatizado |
| Testes automatizados | Validação necessária para a ponte não falhar |
| Dívida técnica | Correntes causadas por atalhos técnicos |
| Refatoração | Bancada que remove correntes sem mudar o comportamento externo |
| Burndown | Ampulheta do trabalho restante |
| Burnup | Baú enchendo com progresso concluído |
| Velocity | Ritmo interno usado para previsão da própria equipe |
| Lead Time | Relógio que começa quando o pedido nasce |
| Cycle Time | Relógio que começa quando o desenvolvimento inicia |
| Métricas saudáveis | Oráculo ensina transparência e melhoria, não punição |
| Valor percebido | Ponte dos Stakeholders mostra que velocidade sem valor não basta |
| Qualidade compartilhada | Baú final reforça responsabilidade de toda a equipe |

## Observações para implementação futura

- O texto principal deve aparecer em blocos narrativos curtos, como no Capítulo 1.
- Os termos reais devem aparecer em destaque no próprio texto, não apenas em tooltips ou cards escondidos.
- O capítulo pode inovar nas cenas, mas deve manter a lógica: cena, descoberta, conceito, frase de fixação e avanço.
- Não reutilizar `capitulo1.js` diretamente sem adaptação, porque ele usa `ID_MODULO = 1`.
- O ideal é criar `capitulo4.js` com `ID_MODULO = 4` ou parametrizar a lógica comum.
