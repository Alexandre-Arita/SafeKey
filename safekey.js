/**
 * safekey.js
 * Módulo principal de lógica do SafeKey.
 *
 * Requisitos atendidos:
 *   - Uso exclusivo de CSPRNG via crypto.getRandomValues (sem Math.random);
 *   - Garantia de presença mínima de um caractere por conjunto selecionado;
 *   - Exclusão de caracteres ambíguos sob demanda;
 *   - Cálculo aproximado de entropia para o medidor de força;
 *   - Ausência total de transmissão de dados a servidores.
 *
 * @module SafeKey
 */

(function () {
  'use strict';

  /* ============================================================
     CONSTANTES / CONFIGURAÇÕES
     ============================================================ */

  /**
   * Conjuntos de caracteres permitidos e metadados descritivos.
   * @constant {Object<string, {chars: string, label: string}>}
   */
  const SETS = Object.freeze({
    upper:  { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', label: 'Maiúsculas' },
    lower:  { chars: 'abcdefghijklmnopqrstuvwxyz', label: 'Minúsculas' },
    number: { chars: '0123456789',                   label: 'Números' },
    symbol: { chars: '!@#$%^&*()_+-=[]{}|;:,.<>?',  label: 'Símbolos' }
  });

  /**
   * Caracteres tipicamente confundíveis visualmente.
   * Filtrados do pool quando o usuário ativa a opção correspondente.
   * @constant {Set<string>}
   */
  const AMBIGUOUS = new Set(['0', 'O', '1', 'l', 'I', '5', 'S']);

  /* ============================================================
     REFERÊNCIAS DOM
     ============================================================ */

  const form             = document.getElementById('passwordForm');
  const output           = document.getElementById('passwordOutput');
  const copyBtn          = document.getElementById('copyBtn');
  const lengthRange      = document.getElementById('lengthRange');
  const lengthNumber     = document.getElementById('lengthNumber');
  const checkUpper       = document.getElementById('checkUpper');
  const checkLower       = document.getElementById('checkLower');
  const checkNumber      = document.getElementById('checkNumber');
  const checkSymbol      = document.getElementById('checkSymbol');
  const checkAmbiguous   = document.getElementById('checkAmbiguous');
  const generateBtn      = document.getElementById('generateBtn');
  const typeError        = document.getElementById('typeError');
  const securityWarning  = document.getElementById('securityWarning');
  const strengthLabel    = document.getElementById('strengthLabel');
  const strengthFill     = document.getElementById('strengthFill');
  const toast            = document.getElementById('toast');

  /* ============================================================
     FUNÇÕES CRIPTOGRÁFICAS / UTILITÁRIAS
     ============================================================ */

  /**
   * Gera um byte aleatório seguro (0–255) via CSPRNG do navegador.
   * @returns {number} Byte aleatório.
   */
  function getRandomByte() {
    const arr = new Uint8Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0];
  }

  /**
   * Retorna um inteiro aleatório uniformemente distribuído no intervalo
   * [0, max). Utiliza rejection sampling para eliminar viés de módulo.
   *
   * @param {number} max - Limite exclusivo (deve ser > 0).
   * @returns {number} Inteiro aleatório no intervalo [0, max).
   */
  function secureRandomInt(max) {
    if (max <= 0) return 0;
    const limit = 256 - (256 % max);
    let byte;
    do {
      byte = getRandomByte();
    } while (byte >= limit);
    return byte % max;
  }

  /**
   * Embaralha um array in-place utilizando o algoritmo Fisher-Yates
   * com fonte aleatória segura.
   *
   * @param {Array} array - Array a ser embaralhado.
   * @returns {Array} O mesmo array, com ordem aleatória.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* ============================================================
     LÓGICA DE NEGÓCIO
     ============================================================ */

  /**
   * Retorna o pool de caracteres para uma determinada chave (SET),
   * aplicando o filtro de ambíguos quando necessário.
   *
   * @param {string} key - Chave do conjunto em SETS ('upper'|'lower'|'number'|'symbol').
   * @returns {string} Pool filtrado de caracteres.
   */
  function getFilteredSet(key) {
    let pool = SETS[key].chars;
    if (checkAmbiguous.checked) {
      pool = pool
        .split('')
        .filter((ch) => !AMBIGUOUS.has(ch))
        .join('');
    }
    return pool;
  }

  /**
   * Coleta quais conjuntos de caracteres estão atualmente selecionados
   * pelo utilizador via interface.
   *
   * @returns {string[]} Array com as chaves dos tipos ativos.
   */
  function getSelectedKeys() {
    const keys = [];
    if (checkUpper.checked)  keys.push('upper');
    if (checkLower.checked)  keys.push('lower');
    if (checkNumber.checked) keys.push('number');
    if (checkSymbol.checked) keys.push('symbol');
    return keys;
  }

  /**
   * Exibe um toast temporário na interface.
   *
   * @param {string} message - Texto a ser apresentado.
   */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  /**
   * Avalia e atualiza o medidor visual de força da senha com base
   * na entropia calculada: H = L * log2(N).
   *
   * @param {string} password - Senha gerada.
   * @param {number} poolSize - Tamanho médio efetivo do pool de caracteres.
   */
  function updateStrength(password, poolSize) {
    if (!password) {
      strengthLabel.textContent = '—';
      strengthFill.style.width = '0%';
      strengthFill.style.background = 'transparent';
      return;
    }
    const entropy = password.length * Math.log2(Math.max(2, poolSize));
    let label = 'Fraca';
    let color = 'var(--danger)';
    let width = '25%';

    if (entropy >= 120) {
      label = 'Muito Forte';
      color = '#059669';
      width = '100%';
    } else if (entropy >= 80) {
      label = 'Forte';
      color = 'var(--success)';
      width = '75%';
    } else if (entropy >= 50) {
      label = 'Média';
      color = 'var(--warning)';
      width = '50%';
    }

    strengthLabel.textContent = `${label} (${Math.round(entropy)} bits)`;
    strengthFill.style.width = width;
    strengthFill.style.background = color;
  }

  /**
   * Valida se existe pelo menos um tipo de caractere selecionado.
   * Caso contrário, desabilita o botão de geração e exibe erro.
   *
   * @returns {boolean} Verdadeiro se a seleção for válida.
   */
  function validateTypes() {
    const selected = getSelectedKeys();
    if (selected.length === 0) {
      generateBtn.disabled = true;
      typeError.classList.add('visible');
      return false;
    }
    generateBtn.disabled = false;
    typeError.classList.remove('visible');
    return true;
  }

  /**
   * Atualiza o aviso de segurança quando a senha é curta e usa
   * apenas um tipo de caractere (conforme regra de negócio RN-005).
   *
   * @param {number} length - Comprimento da senha gerada.
   * @param {number} selectedCount - Quantidade de tipos selecionados.
   */
  function updateSecurityWarning(length, selectedCount) {
    if (length < 8 && selectedCount === 1) {
      securityWarning.classList.add('visible');
    } else {
      securityWarning.classList.remove('visible');
    }
  }

  /**
   * Motor principal de geração de senhas.
   *
   * Passos executados:
   *   1. Obtém os tipos selecionados e o comprimento desejado;
   *   2. Garante pelo menos um caractere de cada tipo (aleatório);
   *   3. Preenche o restante com sorteio uniforme no pool combinado;
   *   4. Embaralha o resultado para dispersar os caracteres fixos.
   *
   * @returns {string} Senha gerada ou string vazia em caso de inválido.
   */
  function generatePassword() {
    const length = parseInt(lengthNumber.value, 10) || 16;
    const selected = getSelectedKeys();

    if (selected.length === 0) return '';

    // Guarda contra comprimento menor que a quantidade de tipos obrigatórios
    if (length < selected.length) {
      showToast('Tamanho insuficiente para os tipos selecionados.');
      return '';
    }

    const passwordChars = [];
    let poolSize = 0;
    const allPools = [];

    // Passo 1: garante presença mínima de cada tipo escolhido
    for (const key of selected) {
      const pool = getFilteredSet(key);
      if (pool.length === 0) continue;
      const char = pool[secureRandomInt(pool.length)];
      passwordChars.push(char);
      allPools.push(pool);
      poolSize += pool.length;
    }

    // Passo 2: preenche o restante do comprimento
    const combinedPool = allPools.join('');
    const remaining = length - passwordChars.length;

    for (let i = 0; i < remaining; i++) {
      const char = combinedPool[secureRandomInt(combinedPool.length)];
      passwordChars.push(char);
    }

    // Passo 3: embaralha para não revelar posições fixas
    shuffleArray(passwordChars);
    return passwordChars.join('');
  }

  /**
   * Orquestra o fluxo completo de (re)geração: valida entradas,
   * produz a senha, atualiza estados da UI e força.
   */
  function regenerate() {
    if (!validateTypes()) return;

    const pwd = generatePassword();
    if (!pwd) return;

    output.value = pwd;
    output.select();
    output.focus();

    const selected = getSelectedKeys();
    let totalPool = 0;
    for (const key of selected) totalPool += getFilteredSet(key).length;
    const effectivePool = selected.length ? (totalPool / selected.length) : 0;

    updateStrength(pwd, effectivePool);
    updateSecurityWarning(pwd.length, selected.length);
  }

  /* ============================================================
     EVENTOS / INICIALIZAÇÃO
     ============================================================ */

  /** Sincroniza o slider com o campo numérico. */
  lengthRange.addEventListener('input', () => {
    lengthNumber.value = lengthRange.value;
  });

  /** Sincroniza o campo numérico com o slider, aplicando clamp. */
  lengthNumber.addEventListener('input', () => {
    let v = parseInt(lengthNumber.value, 10);
    if (isNaN(v)) v = 16;
    v = Math.max(6, Math.min(128, v));
    lengthNumber.value = v;
    lengthRange.value = v;
  });

  /** Re-gera automaticamente quando opções de caracteres mudam. */
  [checkUpper, checkLower, checkNumber, checkSymbol, checkAmbiguous].forEach((el) => {
    el.addEventListener('change', () => {
      validateTypes();
      regenerate();
    });
  });

  /** Submissão do formulário (botão Gerar / Enter no contexto do form). */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    regenerate();
  });

  /** Ação de copiar para a área de transferência com fallback legado. */
  copyBtn.addEventListener('click', async () => {
    const text = output.value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Senha copiada!');
    } catch (err) {
      output.select();
      const ok = document.execCommand('copy');
      showToast(ok ? 'Senha copiada!' : 'Não foi possível copiar.');
    }
  });

  /* Inicialização: garante estado consistente ao carregar. */
  validateTypes();
  regenerate();
})();
