# SafeKey — Gerador de Senhas Seguras (Web & CLI)

## Storytelling: Como a IA Impulsionou a Entrega

Este projeto foi construído a partir de um Product Requirements Document (PRD) completo, evoluindo rapidamente de um conceito documental para um produto funcional com a ajuda de assistentes de IA. A colaboração acelerou decisivamente as seguintes frentes:

✨ **Geração do PRD estruturado** com visão de produto, regras de negócio, critérios de aceitação (BDD) e roadmap de evoluções futuras  
✨ **Arquitetura de referência separada em camadas** — HTML semântico, CSS isolado e módulo JavaScript com JSDoc  
✨ **Implementação criptográfica auditável** com uso obrigatório de `crypto.getRandomValues` e *rejection sampling*, eliminando por completo o uso de `Math.random()`  
✨ **Documentação técnica embutida** via docstrings nos scripts e comentários estruturais nos arquivos de estilo

## Limitações Identificadas

Apesar do ganho de velocidade, alguns pontos exigiram intervenção manual ou estão pendentes de iteração:

⚠️ A IA propôs inicialmente um arquivo **HTML monolítico**; a separação de responsabilidades em três arquivos distintos exigiu orientação explícita do desenvolvedor  
⚠️ **Testes automatizados** de entropia e auditoria de CSPRNG não foram gerados pela IA — a cobertura atual é manual  
⚠️ A **interface CLI** (Node.js/Python) prevista no PRD para a v2.0 ainda não foi implementada neste MVP Web  
⚠️ Validações rigorosas de **acessibilidade (WCAG 2.1 AA)** — como contraste dinâmico em modo escuro e ordem de foco — precisaram de revisão humana

## Como Usar

A versão MVP é puramente front-end e não requer build ou instalação de dependências.

```bash
# 1. Clone ou baixe os arquivos
git clone https://github.com/seuusuario/safekey.git
cd safekey

# 2. Abra diretamente no navegador
open index.html
# Ou sirva localmente via servidor HTTP simples:
python -m http.server 8080
# npm: npx serve .

