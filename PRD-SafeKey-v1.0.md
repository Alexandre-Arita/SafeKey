# Product Requirements Document (PRD)

## SafeKey — Gerador de Senhas Seguras (Web \& CLI)

**Versão:** 1.0  
**Status:** Aprovado para Desenvolvimento  
**Data:** 24 de Abril de 2026

\---

## 1\. Visão Geral do Produto

O **SafeKey** é uma aplicação leve e especializada para a geração de senhas aleatórias de alta entropia, disponível tanto como **aplicação web responsiva** quanto como **interface de linha de comando (CLI)**. O produto resolve o problema da criação manual de credenciais fracas ou reutilizadas, oferecendo ao usuário controle total sobre o comprimento, a composição de caracteres e a complexidade da senha final.

O diferencial do SafeKey está na simplicidade de uso aliada à segurança criptográfica: nenhuma senha gerada trafega por servidores de terceiros, todo o processo de randomização ocorre localmente (no navegador via Web Crypto API ou no terminal via geradores criptográficos do sistema operacional).

\---

## 2\. Objetivo

### 2.1 Objetivo Principal

Fornecer uma ferramenta acessível, confiável e de alto desempenho que permita a criação de senhas fortes e personalizadas em menos de 30 segundos, eliminando a necessidade de fórmulas manuais ou geradores não auditáveis.

### 2.2 Objetivos Específicos

* Entregar um **MVP funcional** em até 4 semanas, cobrindo a interface web e o utilitário CLI.
* Garantir que todas as senhas sejam produzidas por um **Gerador de Números Aleatórios Criptograficamente Seguro (CSPRNG)**.
* Alcançar compatibilidade cross-platform (Windows, macOS, Linux para CLI; e navegadores modernos para Web).
* Assegurar conformidade com requisitos mínimos de acessibilidade digital (WCAG 2.1 nível AA).

\---

## 3\. Público-Alvo

|Persona|Descrição|Necessidades Principais|
|-|-|-|
|**Usuário Final Não Técnico**|Pessoas físicas que desejam proteger contas pessoais (redes sociais, bancos, e-mails).|Interface intuitiva, cliques mínimos, botão de copiar óbvio.|
|**Desenvolvedores \& Profissionais de TI**|DevOps, administradores de sistemas e engenheiros de software.|Geração rápida via terminal para variáveis de ambiente, pipelines CI/CD e provisionamento.|
|**Estudantes de Segurança da Informação**|Académicos e entusiastas que estudam criptografia e políticas de senhas.|Transparência do algoritmo, exibição de métricas de entropia e controlo granular de caracteres.|

\---

## 4\. Requisitos Funcionais

|ID|Requisito|Descrição|Prioridade|
|-|-|-|-|
|**RF-001**|Definição de Comprimento|Permitir que o utilizador defina o tamanho da palavra-passe entre 6 e 128 caracteres, via slider e input numérico (Web) ou flag `--length` (CLI). Valor padrão: 16.|Must|
|**RF-002**|Seleção de Tipos de Caracteres|Checkboxes (Web) ou flags booleanas (CLI) para inclusão de: maiúsculas (A-Z), minúsculas (a-z), números (0-9) e símbolos especiais.|Must|
|**RF-003**|Geração Criptográfica|Executar a geração da palavra-passe apenas quando o utilizador acionar o comando/botão, utilizando CSPRNG nativo.|Must|
|**RF-004**|Garantia de Conjuntos Selecionados|A palavra-passe resultante deve conter **no mínimo um caractere** de cada tipo de conjunto explicitamente selecionado pelo utilizador.|Must|
|**RF-005**|Cópia para Área de Transferência|Funcionalidade de copiar a senha gerada para o clipboard com um único clique (Web) ou opção `--copy` (CLI, quando suportado pelo SO). Feedback visual/toast de confirmação na Web.|Must|
|**RF-006**|Exclusão de Caracteres Ambíguos|Opção para remover caracteres visualmente confundíveis (ex.: `0` e `O`, `1` e `l`, `I` e `5` e `S`) do pool de geração.|Should|
|**RF-007**|Indicador de Força Básica|Exibir medidor visual (fraca, média, forte) baseado na entropia estimada da palavra-passe gerada.|Should|
|**RF-008**|Responsividade Completa|Layout adaptável a dispositivos móveis, tablets e desktops sem perda de funcionalidade.|Must|
|**RF-009**|Interface CLI Específica|Comando central `safekey generate` com argumentos explícitos para tamanho, tipos de caracteres e exclusão de ambíguos.|Must|
|**RF-010**|Atalhos de Teclado|Permitir `Ctrl+C` (ou `Cmd+C`) para copiar a senha quando o campo estiver focado, e `Enter`/`Space` para gerar nova palavra-passe.|Could|

\---

## 5\. Requisitos Não Funcionais

|ID|Requisito|Descrição|
|-|-|-|
|**RNF-001**|**Segurança Criptográfica**|Uso obrigatório de CSPRNG (`crypto.getRandomValues` no navegador; `secrets.choice` ou `os.urandom` no Python; `crypto.randomBytes` ou `crypto.randomInt` no Node.js). É expressamente proibido o uso de `Math.random()` ou geradores pseudoaleatórios determinísticos.|
|**RNF-002**|**Zero Trust de Dados**|A aplicação não deve transmitir, persistir em base de dados remota ou registar a palavra-passe gerada. Toda a operação deve ser stateless do ponto de vista do servidor.|
|**RNF-003**|**Performance**|A geração da palavra-passe e a renderização na interface devem ocorrer em menos de 50 ms para senhas de até 128 caracteres. A carga inicial da página não deve exceder 200 KB.|
|**RNF-004**|**Responsividade**|Design mobile-first. Breakpoints primários: 320px, 768px e 1024px. Não deve haver scroll horizontal em viewports maiores que 320px.|
|**RNF-005**|**Acessibilidade (a11y)**|Conformidade com WCAG 2.1 nível AA: contraste mínimo de 4.5:1 para textos, navegação total por teclado, labels ARIA para leitores de ecrã e foco visível em todos os elementos interativos.|
|**RNF-006**|**Compatibilidade**|Web: suporte às duas últimas versões estáveis de Chrome, Firefox, Safari e Edge. CLI: compatibilidade com Node.js 18+ ou Python 3.9+.|
|**RNF-007**|**Disponibilidade**|Hospedagem da aplicação web com uptime mínimo de 99.9% (aplicável apenas ao front-end estático e assets).|

\---

## 6\. Stack Tecnológica

### Opção A — Ecosystem Full-Stack JavaScript (Recomendada para coerência Web/CLI)

* **Front-end Web:** HTML5, CSS3 (com Tailwind CSS ou Vanilla CSS), JavaScript ES2022+ (módulos nativos). Bundler opcional: **Vite**.
* **CLI:** Node.js 18+ com biblioteca **Commander.js**.
* **Hospedagem Web:** Vercel, Netlify ou GitHub Pages (deploy contínuo a partir do repositório Git).
* **Versionamento \& CI:** Git, GitHub Actions (lint, testes unitários de geração).

### Opção B — Python-Centric (Recomendada para utilizadores que priorizam a CLI)

* **Front-end Web:** HTML5, CSS3, JavaScript Vanilla (pode ser servido via **FastAPI** como `StaticFiles` ou desacoplado no Nginx).
* **CLI:** Python 3.9+ com **Typer** ou **Click**.
* **Criptografia:** Módulo nativo `secrets` da biblioteca padrão Python.
* **Hospedagem Web:** Railway, Render, ou servir o front-end estático via CDN (desacoplado do back).

**Nota de Decisão:** se a equipa for maioritariamente front-end, adotar **Opção A**. Se o produto for primariamente um utilitário de terminal com web como complemento, adotar **Opção B**.

\---

## 7\. Regras de Negócio

|ID|Regra|Validação / Comportamento Esperado|
|-|-|-|
|**RN-001**|Comprimento Mínimo e Máximo|O sistema deve rejeitar tentativas de gerar palavras-passe com menos de 6 caracteres ou mais de 128, exibindo mensagem: *"O comprimento deve estar entre 6 e 128 caracteres."*|
|**RN-002**|Seleção Obrigatória de Tipo|É obrigatória a seleção de pelo menos um conjunto de caracteres (maiúsculas, minúsculas, números ou símbolos). Caso nenhum esteja ativo, o botão de gerar deve ficar desabilitado e uma mensagem deve alertar: *"Selecione ao menos um tipo de caractere."*|
|**RN-003**|Presença Obrigatória por Conjunto|Para cada tipo de caractere selecionado, a palavra-passe gerada deve conter no mínimo uma ocorrência desse tipo.|
|**RN-004**|Caracteres Ambíguos|Quando ativada a opção de exclusão, os caracteres `0`, `O`, `1`, `l`, `I`, `5`, `S` devem ser removidos dos respectivos pools antes da randomização.|
|**RN-005**|Alerta de Segurança|Se o utilizador gerar uma palavra-passe com menos de 8 caracteres utilizando apenas um tipo de caractere, o sistema deve exibir um alerta visual persistente: *"Esta senha não é recomendada para uso em produção ou dados sensíveis."*|
|**RN-006**|Descarte de Estado|Após a geração de uma nova palavra-passe, a instância da palavra-passe anterior deve ser elegível para garbage collection (não manter histórico não solicitado em memória).|

\---

## 8\. Critérios de Aceitação

### CA-001 — Geração com Comprimento Definido

* **Dado** que o utilizador acede à aplicação Web,
* **Quando** ele define o comprimento para 12 e clica em "Gerar Senha",
* **Então** a senha exibida deve conter exatamente 12 caracteres.

### CA-002 — Respeito aos Tipos Selecionados

* **Dado** que apenas as opções "Números" e "Símbolos" estão selecionadas,
* **Quando** o utilizador solicita a geração,
* **Então** a senha resultante deve conter apenas números e símbolos, garantindo pelo menos um de cada.

### CA-003 — Validação de Tipo Mínimo

* **Dado** que todas as checkboxes de tipos de caracteres estão desmarcadas,
* **Quando** o utilizador tenta clicar em "Gerar",
* **Então** o botão deve estar desabilitado e uma mensagem de erro deve ser exibida abaixo do controlo.

### CA-004 — Cópia e Feedback

* **Dado** que uma senha foi gerada com sucesso,
* **Quando** o utilizador clica no ícone de "Copiar",
* **Então** a senha deve ser transferida para a área de transferência e um toast com o texto "Senha copiada!" deve aparecer por 2 segundos.

### CA-005 — Auditoria de Criptografia

* **Dado** que o código-fonte está disponível,
* **Quando** um revisor busca por funções de randomização,
* **Então** não deve encontrar o uso de `Math.random()`, `random.random()` ou equivalentes não criptográficos.

### CA-006 — Geração via CLI

* **Dado** que o utilizador executa o comando `safekey generate --length 24 --uppercase --symbols`,
* **Quando** o processamento termina,
* **Então** o terminal deve imprimir uma senha de 24 caracteres contendo ao menos uma letra maiúscula e um símbolo.

### CA-007 — Responsividade Mobile

* **Dado** que um utilizador acede à URL pelo navegador de um smartphone com largura de 375px,
* **Quando** a página carrega completamente,
* **Então** todos os controles devem ser visíveis, legíveis e acessíveis sem necessidade de scroll horizontal.

\---

## 9\. Evoluções Futuras (Roadmap)

|Versão|Prazo Estimado|Funcionalidade|
|-|-|-|
|**v1.1**|Curto prazo (1-2 meses pós MVP)|**Modo Escuro (Dark Mode)**: alternância manual e deteção de preferência do sistema operacional.|
|**v1.2**|Curto prazo|**Força Avançada**: integração com biblioteca de estimativa de quebra (ex.: zxcvbn), exibição de tempo estimado para ataque por força bruta e comparação com vazamentos públicos (Have I Been Pwned API, verificação de hash sem expor a senha).|
|**v1.3**|Médio prazo|**Passphrases (Diceware)**: modo alternativo para gerar frases-senha memoráveis e de alta entropia a partir de listas de palavras.|
|**v2.0**|Médio-Longo prazo|**Geração em Lote**: permitir gerar de 1 a 100 palavras-passe simultâneas com exportação para `.txt` ou `.csv`.|
|**v2.1**|Longo prazo|\*\*P|





Instruções de uso



Crie uma pasta de projeto (ex: safekey/).



Salve os três arquivos acima com os nomes:



index.html

safekey.css

safekey.js



Abra o index.html em um navegador moderno.



Não é necessário servidor backend — tudo é processado localmente no cliente.



Notas de arquitetura



Separação de responsabilidades: O HTML estrutura semanticamente a interface e pontos de acessibilidade (ARIA); o CSS contém toda a apresentação e temas; o JS contém apenas lógica de negócio, criptografia e manipulação de estado.



Zero dependências externas: Funciona offline, sem frameworks ou bibliotecas de terceiros.

Segurança: O módulo JavaScript utiliza exclusivamente window.crypto.getRandomValues, conforme especificado nos requisitos não-funcionais (RNF-001).















