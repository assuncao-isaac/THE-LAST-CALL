# `>_ Último Chamado`

### Horror Game · JavaScript · HTML5 · CSS3

```text
Projeto acadêmico desenvolvido para a Universidade Projeção.

Uma ambulância. Um mundo pós-apocalíptico.
Sobreviver é apenas parte da missão.

Desvie dos obstáculos, resgate os sobreviventes
e retorne à base sem perder o controle.
```

---

## `> about the project`

**Último Chamado** é um jogo desenvolvido como projeto acadêmico para a disciplina de **Front-End**, na Universidade Projeção, a pedido do professor Pimentel.

O projeto tem como objetivo aplicar os conhecimentos adquiridos durante as aulas para dar vida a um jogo funcional, utilizando **HTML, CSS e principalmente JavaScript**.

A proposta vai além da construção de uma página web tradicional, explorando lógica de programação, interatividade, manipulação de elementos, colisões e gerenciamento de estados para criar uma experiência de jogo.

> **Conceito:** desenvolver um jogo simples e funcional utilizando os fundamentos do desenvolvimento web, com foco na implementação das mecânicas através de JavaScript.

---

## `> game overview`

Em um cenário caótico e pós-apocalíptico, os poucos profissionais de saúde que restaram tentam salvar os sobreviventes.

Entretanto, com boa parte dos recursos destruídos ou indisponíveis, a ambulância perdeu até mesmo seus freios.

O jogador assume o controle dessa ambulância, que está em movimento constante. Sua missão é percorrer caminhos perigosos, desviar das serras espalhadas pela pista, encontrar os sobreviventes e retornar em segurança à base.

**Mas atenção:** o caminho de volta apresenta os mesmos perigos. Um único erro pode colocar tudo a perder.

---

## `> gameplay`

### Controles e mecânicas

- A ambulância se movimenta constantemente para frente.
- O jogador pode direcioná-la para a esquerda ou para a direita.
- Cada fase apresenta um percurso diferente.
- É necessário desviar das serras espalhadas pelo caminho.
- Após encontrar o sobrevivente, é preciso retornar à base.

### Obstacles

Existem dois tipos principais de obstáculos:

| Obstáculo | Consequência |
|---|---|
| Borda da pista | A ambulância desliza e perde tempo, mas não é destruída. |
| Serra | Ao encostar em uma serra, a ambulância explode e ocorre Game Over. |

---

## `> game levels`

O jogo possui três fases com dificuldades progressivas.

### Fase 01 — Introdução

`EASY`

- 2 serras.
- Velocidade mais baixa.
- Introdução às mecânicas do jogo.

### Fase 02 — Desafio Médio

`MEDIUM`

- 4 serras.
- Velocidade maior.
- Maior exigência de atenção e precisão.

### Fase 03 — Desafio Extremo

`HARD`

- 6 serras.
- Maior velocidade do jogo.
- Nível máximo de dificuldade.

---

## `> tech stack`

### Frontend & Programming

<p>
<img src="https://img.shields.io/badge/HTML5-0D1117?style=for-the-badge&logo=html5&logoColor=E34F26" />
<img src="https://img.shields.io/badge/CSS3-0D1117?style=for-the-badge&logo=css3&logoColor=1572B6" />
<img src="https://img.shields.io/badge/JavaScript-0D1117?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
</p>

### Development

<p>
<img src="https://img.shields.io/badge/Git-0D1117?style=for-the-badge&logo=git&logoColor=F05032" />
<img src="https://img.shields.io/badge/GitHub-0D1117?style=for-the-badge&logo=github&logoColor=FFFFFF" />
</p>

---

## `> architecture`

O projeto utiliza diferentes arquivos JavaScript para organizar os sistemas e responsabilidades do jogo.

| Arquivo | Responsabilidade |
|---|---|
| `main.js` | Gerenciamento principal do jogo, loop, colisões e estados. |
| `player.js` | Lógica relacionada ao jogador e à ambulância. |
| `collision.js` | Sistema de detecção e tratamento de colisões. |
| `audio.js` | Gerenciamento dos recursos de áudio. |
| `hub.js` | Funcionamento do menu principal. |

### Main systems

**Game Loop**

Responsável pela atualização contínua dos elementos e da lógica do jogo.

**Player Movement**

Controle da ambulância por meio do teclado, permitindo movimentação para a esquerda e direita.

**Collision System**

Identificação das interações entre a ambulância e os obstáculos presentes na pista.

**Explosion System**

Execução do efeito de destruição da ambulância em caso de colisão com serras.

**Audio System**

Gerenciamento dos sons e elementos sonoros do jogo.

**Hub / Menu**

Interface de navegação e gerenciamento do menu principal.

**Game States**

Gerenciamento de seis estados diferentes para controlar os momentos e comportamentos da aplicação.

---

## `> execution`

### Como executar o projeto

Não é necessário instalar dependências, configurar servidores ou utilizar ferramentas adicionais.

```bash
1. Acesse o repositório no GitHub.
2. Clique no botão Code <>.
3. Selecione Download ZIP.
4. Descompacte o arquivo baixado.
5. Entre na pasta do projeto.
6. Abra o arquivo index.html.
```

<badge color="success">Execução local</badge> <badge color="info">Sem instalação de dependências</badge>

### Recommended browser

**Google Chrome**

Recomendamos utilizar o Google Chrome para executar o projeto, devido à sua boa compatibilidade com as tecnologias utilizadas e ao seu ambiente de execução JavaScript, adequado para as mecânicas do jogo.

---

## `> project structure`

```text
├── assets
│   ├── audio
│   └── images
├── css
│   └── style.css
├── index.html
├── js
│   ├── audio.js
│   ├── collision.js
│   ├── hub.js
│   ├── level.js
│   ├── main.js
│   └── player.js
└── README.md

```

*Estrutura ilustrativa dos principais arquivos. Os diretórios internos podem variar conforme a organização do repositório.*

---

## `> academic purpose`

O Último Chamado foi desenvolvido como uma atividade prática da disciplina de **Front-End**, na Universidade Projeção, sob orientação do professor Pimentel.

Durante o desenvolvimento, foram aplicados conceitos trabalhados em sala de aula, principalmente:

- Lógica de programação.
- Manipulação de elementos com JavaScript.
- Estruturação com HTML.
- Estilização com CSS.
- Eventos e interatividade.
- Sistemas de colisão.
- Controle de estados.
- Organização de código.

O projeto demonstra como os fundamentos do desenvolvimento web podem ser utilizados para construir uma aplicação interativa e funcional, explorando JavaScript como principal ferramenta para implementação da lógica de um jogo.

---

## `> contributors`

### Isaac Assunção

### Emily Moraes

**Instituição:** Universidade Projeção  
**Disciplina:** Front-End  
**Professor:** Pimentel

---

```text
>_ END OF TRANSMISSION

"Uma última chamada.
Uma última chance.
Um último resgate."

JavaScript • HTML • CSS • Game Development
```

