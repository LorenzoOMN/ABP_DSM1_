# 🏗️ Arquitetura — Scrum Dungeon

> Voltar para o [README](../README.md).

---

## Visão Geral

O projeto segue uma arquitetura em três camadas com separação clara entre apresentação, lógica de negócio e persistência.

```
Cliente (HTML / CSS / JS)
         │
         │  HTTP (EJS renderizado no servidor)
         ▼
  Node.js + Express
  ┌───────────────────────────────┐
  │  Rotas → Controllers          │
  │  Middleware (JWT, validação)  │
  │  Lógica de negócio            │
  └───────────────────────────────┘
         │
         │  SQL (DDL / DML direto, sem ORM)
         ▼
      PostgreSQL
  ┌───────────────────────────────┐
  │  usuarios                     │
  │  questoes                     │
  │  exames                       │
  │  respostas                    │
  │  progresso                    │
  └───────────────────────────────┘
```

> Toda lógica de negócio (cálculo de notas, controle de tentativas, geração de certificado) reside exclusivamente no back-end — nunca exposta ao front-end.

---

## Rotas da API

Todas as rotas partem de `/api`. Rotas marcadas com 🔒 exigem token JWT no header `Authorization: Bearer <token>`.

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Autenticação por CPF e senha, retorna JWT |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/usuarios/cadastro` | Cadastro com nome, e-mail, CPF e senha |
| `GET` | `/api/usuarios/me` 🔒 | Retorna dados do usuário autenticado |
| `PATCH` | `/api/usuarios/cpf` 🔒 | Atualiza CPF |
| `PATCH` | `/api/usuarios/nome` 🔒 | Atualiza nome |
| `PATCH` | `/api/usuarios/email` 🔒 | Atualiza e-mail |
| `PATCH` | `/api/usuarios/senha` 🔒 | Atualiza senha |

### Questões

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/questoes/proxima-questao` 🔒 | Retorna a próxima questão do exame atual |
| `POST` | `/api/questoes/responder` 🔒 | Submete resposta para uma questão |
| `PATCH` | `/api/questoes/proxima-tentativa` 🔒 | Inicia segunda tentativa no módulo atual |
| `PATCH` | `/api/questoes/proximo-modulo` 🔒 | Avança para o próximo módulo (ou reinicia run se reprovado 2x) |
| `GET` | `/api/questoes/modulos-respondidos` 🔒 | Lista módulos já respondidos pelo usuário |
| `GET` | `/api/questoes/resultado-atual` 🔒 | Retorna resultado do módulo atual |

### Progresso

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/progresso/mapa` 🔒 | Retorna estado de todos os módulos para o mapa |
| `PATCH` | `/api/progresso/historia/:idModulo/concluir` 🔒 | Marca história do módulo como concluída e cria exame inicial |

### Certificados

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/certificados/hash/:hash` | Valida e retorna certificado por hash público |
| `GET` | `/api/certificados/desempenho` 🔒 | Retorna desempenho consolidado para emissão do certificado |

### Navbar

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/navbar/status` 🔒 | Verifica se a barra de navegação está desbloqueada |
| `POST` | `/api/navbar/desbloquear` 🔒 | Desbloqueia a barra de navegação inferior |

---

## Modelo de Dados

![Modelo de Dados](./assets/images/modelo-dados.png)

---

## Diagramas UML

### Caso de Uso

![Caso de Uso](./diagramas/caso-de-uso.png)

---

### Diagramas de Classe

| Diagrama | Visualização |
|----------|-------------|
| Certificado | ![](./diagramas/classe-certificado.png) |
| Certificado — Tela | ![](./diagramas/classe-certificado-tela.png) |
| Criar Conta | ![](./diagramas/classe-criar-conta.png) |
| Login | ![](./diagramas/classe-login.png) |
| Menu Artefatos | ![](./diagramas/classe-menu-artefatos.png) |
| Menu Inicial | ![](./diagramas/classe-menu-inicial.png) |
| Nível | ![](./diagramas/classe-nivel.png) |
| Nota Final | ![](./diagramas/classe-nota-final.png) |
| Progresso | ![](./diagramas/classe-progresso.png) |
| Responder Questionários | ![](./diagramas/classe-responder-questionarios.png) |
| Selecionar Questões | ![](./diagramas/classe-selecionar-questoes.png) |

---

### Diagramas de Sequência

| Diagrama | Visualização |
|----------|-------------|
| Login | ![](./diagramas/sequencia-login.png) |
| Erro de Login | ![](./diagramas/sequencia-erro-login.png) |
| Criar Conta | ![](./diagramas/sequencia-criar-conta.png) |
| Selecionar Questões | ![](./diagramas/sequencia-selecionar-questoes.png) |
| Menu Artefatos | ![](./diagramas/sequencia-menu-artefatos.png) |
| Consultar Progresso | ![](./diagramas/sequencia-consultar-progresso.png) |
| Emitir Certificado | ![](./diagramas/sequencia-emitir-certificado.png) |