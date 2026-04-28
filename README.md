# SafeKey
Gerador de senhas seguras e aleatórias

Product Requirements Document (PRD)
SafeKey — Gerador de Senhas Seguras (Web & CLI)
Versão: 1.0  
Status: Aprovado para Desenvolvimento  
Data: 24 de Abril de 2026
---
1. Visão Geral do Produto
O SafeKey é uma aplicação leve e especializada para a geração de senhas aleatórias de alta entropia, disponível tanto como aplicação web responsiva quanto como interface de linha de comando (CLI). O produto resolve o problema da criação manual de credenciais fracas ou reutilizadas, oferecendo ao usuário controle total sobre o comprimento, a composição de caracteres e a complexidade da senha final.
O diferencial do SafeKey está na simplicidade de uso aliada à segurança criptográfica: nenhuma senha gerada trafega por servidores de terceiros, todo o processo de randomização ocorre localmente (no navegador via Web Crypto API ou no terminal via geradores criptográficos do sistema operacional).
---
2. Objetivo
2.1 Objetivo Principal
Fornecer uma ferramenta acessível, confiável e de alto desempenho que permita a criação de senhas fortes e personalizadas em menos de 30 segundos, eliminando a necessidade de fórmulas manuais ou geradores não auditáveis.
2.2 Objetivos Específicos
Entregar um MVP funcional em até 4 semanas, cobrindo a interface web e o utilitário CLI.
Garantir que todas as senhas sejam produzidas por um Gerador de Números Aleatórios Criptograficamente Seguro (CSPRNG).
Alcançar compatibilidade cross-platform (Windows, macOS, Linux para CLI; e navegadores modernos para Web).
Assegurar conformidade com requisitos mínimos de acessibilidade digital (WCAG 2.1 nível AA).
---
3. Público-Alvo
Persona	Descrição	Necessidades Principais
Usuário Final Não Técnico	Pessoas físicas que desejam proteger contas pessoais (redes sociais, bancos, e-mails).	Interface intuitiva, cliques mínimos, botão de copiar óbvio.
Desenvolvedores & Profissionais de TI	DevOps, administradores de sistemas e engenheiros de software.	Geração rápida via terminal para variáveis de ambiente, pipelines CI/CD e provisionamento.
Estudantes de Segurança da Informação	Académicos e entusiastas que estudam criptografia e políticas de senhas.	Transparência do algoritmo, exibição de métricas de entropia e controlo granular de caracteres.
