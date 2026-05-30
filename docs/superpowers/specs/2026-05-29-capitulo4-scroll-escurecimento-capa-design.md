# Capitulo 4 - Escurecimento Progressivo da Capa no Scroll

## Contexto

O usuario quer construir o Capitulo 4 bem devagar e com validacoes curtas por etapas.
Nesta fase inicial, o foco e um unico comportamento visual:

- depois da abertura/capa, ao rolar a pagina para baixo, a tela deve ficar cada vez mais escura;
- no fim da capa, o escurecimento deve chegar a preto total;
- transicao deve ser linear;
- cuidado com encoding para evitar mojibake.

## Objetivo desta fase

Implementar somente o efeito de escurecimento da capa no scroll, sem alterar a narrativa, sem criar novas cenas e sem mexer na logica de progresso da historia.

## Escopo

Arquivos alvo:

- `public/pages/capitulo4.ejs`
- `public/assets/css/capitulo4.css`
- `public/assets/js/capitulo4.js`

Fora de escopo nesta fase:

- reestruturacao completa do capitulo;
- criacao de novas secoes/cenas;
- mudancas na API de progresso;
- ajustes em outros capitulos.

## Comportamento aprovado

1. O escurecimento usa uma camada preta sobre a capa.
2. A opacidade dessa camada comeca em `0`.
3. Durante o scroll dentro da capa, a opacidade cresce linearmente ate `1`.
4. No fim da capa, a opacidade deve estar em `1` (preto total).
5. Depois do fim da capa, a opacidade permanece em `1`.

## Regras de calculo

Definicoes:

- `heroTop`: posicao Y absoluta do topo da capa.
- `heroHeight`: altura da capa em pixels.
- `scrollY`: scroll atual da janela.
- `scrolledInHero = scrollY - heroTop`.
- `progress = clamp(scrolledInHero / heroHeight, 0, 1)`.

Aplicacao:

- `overlayOpacity = progress`.

Fallback:

- se `heroHeight <= 0`, manter `0` no topo e `1` apos ultrapassar a capa.

## Implementacao tecnica

### EJS

- Garantir elemento dedicado para blackout da capa, com `aria-hidden="true"`.

### CSS

- Overlay absoluto cobrindo toda a capa (`inset: 0`).
- Cor preta (`background: #000`), opacidade inicial `0`.
- `pointer-events: none` para nao bloquear interacoes.

### JS

- Criar funcao dedicada para configurar o blackout por scroll.
- Escutar `scroll` e `resize`.
- Em `scroll`, usar `requestAnimationFrame` para performance.
- Recalcular medidas no `resize` para desktop e mobile.

## Acessibilidade e UX

- Overlay apenas decorativo com `aria-hidden`.
- Interacoes da capa continuam clicaveis.
- Sem dependencia de hover.

## Criterios de aceite

1. No topo da pagina, capa visivel sem blackout total.
2. Ao rolar dentro da capa, escurecimento cresce de forma linear.
3. No fim da capa, preto total sempre.
4. Em mobile e desktop, ponto final continua correto.
5. Nenhum texto novo com caracteres corrompidos (sem mojibake).

## Plano de validacao

1. Abrir `/capitulo4`.
2. Verificar opacidade no topo (esperado: `0`).
3. Rolar ate metade da capa (esperado: opacidade aproximada `0.5`).
4. Rolar ate o fim da capa (esperado: opacidade `1`).
5. Testar resize e repetir passos 2 a 4.
