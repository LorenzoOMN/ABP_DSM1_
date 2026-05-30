# Capitulo 4 - Introducao em Tela Preta com Ampulheta Travada

## Contexto

O Capitulo 4 ja possui:

- capa inicial;
- blackout linear da viewport durante o scroll;
- blocos temporarios abaixo da hero para permitir validacao do scroll.

O proximo passo e transformar esse blackout em parte da narrativa. Em vez de apenas escurecer, a tela preta deve introduzir a historia do capitulo com texto e uma nova imagem central da ampulheta travada.

## Objetivo

Criar uma introducao cinematografica entre a capa e o restante do capitulo:

- uma frase curta aparece enquanto a tela ainda esta escurecendo;
- quando o blackout chega a preto total, a introducao continua na tela preta;
- uma ampulheta travada pixelada aparece grande no centro;
- 4 a 6 frases apresentam o conflito narrativo;
- depois a introducao perde forca e o usuario segue para o restante da pagina.

## Direcao aprovada

- Formato: scroll cinematografico com sobreposicao narrativa.
- Ritmo: medio, com 4 a 6 frases.
- Estrutura: duas fases de texto.
- Imagem: nova ampulheta pixelada, central, no mesmo estilo da capa.
- Posicionamento da imagem: centro da viewport, grande, como foco principal.
- Estilo: fantasia sombria, dourado envelhecido, brilho contido, pixel art.

## Estrutura visual

### Camada 1 - Capa

A hero do Capitulo 4 continua existindo e continua sendo a origem do scroll.

### Camada 2 - Blackout

O blackout da viewport continua linear e continua indo ate preto total no fim da capa.

### Camada 3 - Introducao narrativa

Por cima do preto, entram:

- a frase inicial curta durante o escurecimento;
- a ampulheta travada pixelada, central e grande;
- as frases seguintes em sequencia curta depois do preto total.

O resultado deve parecer uma abertura narrativa, nao um card didatico.

## Comportamento por fase

### Fase A - Escurecimento com frase inicial

Do topo ate o fim da capa:

- o blackout aumenta linearmente;
- aparece uma primeira frase curta;
- a frase serve como prenuncio do colapso do fluxo.

### Fase B - Preto total e surgimento da ampulheta

Quando o blackout atinge `1`:

- a ampulheta comeca a aparecer;
- a imagem usa fade in;
- a imagem pode reduzir um blur inicial leve ate ficar nitida;
- pode haver brilho muito sutil, sem exagero.

### Fase C - Sequencia de frases

Depois da ampulheta surgir:

- entram 4 a 6 frases curtas;
- as frases aparecem sem clique;
- o ritmo precisa permitir leitura confortavel;
- o texto deve funcionar em desktop e mobile.

### Fase D - Transicao para a pagina

Ao fim da introducao:

- a sobreposicao narrativa perde forca;
- o usuario segue para os blocos do capitulo;
- a leitura principal continua naturalmente.

## Conteudo narrativo esperado

O texto deve apresentar:

- a terceira porta ficou para tras;
- a ampulheta foi conquistada, mas esta travada;
- a Sprint existe, mas o fluxo falhou;
- a travessia do capitulo 4 comeca nesse colapso.

O tom deve ser curto, cinematografico e memoravel, sem parecer explicacao escolar.

## Imagem nova

Criar uma nova imagem raster para o Capitulo 4:

- assunto: ampulheta travada;
- linguagem: pixel art;
- clima: sombrio, magico, gasto, ritualistico;
- paleta: ouro envelhecido, areia apagada, fundo escuro;
- composicao: central, vertical, leitura limpa sobre fundo preto;
- uso: sobreposicao narrativa na introducao.

Nome sugerido:

- `public/assets/img/capitulo_4/ampulheta-travada-pixel.png`

## Implementacao tecnica

Arquivos alvo:

- `public/pages/capitulo4.ejs`
- `public/assets/css/capitulo4.css`
- `public/assets/js/capitulo4.js`
- `public/assets/img/capitulo_4/ampulheta-travada-pixel.png`

### EJS

- adicionar contenedor da introducao narrativa na viewport;
- separar area da frase inicial, area da ampulheta e area das frases sequenciais;
- manter tudo acessivel e semanticamente simples.

### CSS

- controlar visibilidade, opacidade e empilhamento das camadas;
- centralizar a ampulheta na viewport;
- manter contraste alto;
- garantir responsividade em mobile.

### JS

- derivar estados visuais a partir do progresso do blackout;
- disparar a introducao completa quando o preto total for alcancado;
- controlar sequencia de frases sem exigir clique;
- evitar animacoes pesadas.

## Acessibilidade

- texto com contraste alto sobre o fundo preto;
- elementos narrativos marcados como texto real, nao imagem;
- imagem com `alt` descritivo se relevante para conteudo;
- sem dependencia de hover;
- mobile e teclado continuam funcionando.

## Criterios de sucesso

1. A tela preta deixa de ser apenas transicao e passa a introduzir a historia.
2. A primeira frase aparece durante o escurecimento.
3. A ampulheta trava aparece grande no centro depois do preto total.
4. O texto e a imagem mantem unidade visual com a capa.
5. A introducao funciona em desktop e mobile.
6. Nao ha mojibake no texto novo.
