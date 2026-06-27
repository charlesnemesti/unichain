const DEFAULTS = {
  text: '',
  tickMs: 38,
  deleteTickMs: 24,
  holdMs: 2600,
  clearMs: 420,
  cycleMs: null,
  holdRatio: 0.42,
  cursorChar: '▌',
};

/**
 * @param {string} text
 * @param {number} cycleMs
 * @param {{ clearMs?: number, holdRatio?: number }} options
 */
function resolveTypewriterTiming(text, cycleMs, options = {}) {
  const clearMs = options.clearMs ?? DEFAULTS.clearMs;
  const holdRatio = options.holdRatio ?? DEFAULTS.holdRatio;
  const charSteps = Math.max(text.length, 1);
  const holdMs = Math.round(cycleMs * holdRatio);
  const typeDeleteBudget = Math.max(cycleMs - holdMs - clearMs, charSteps * 28);
  const typeBudget = Math.floor(typeDeleteBudget * 0.68);
  const deleteBudget = Math.max(typeDeleteBudget - typeBudget, charSteps * 16);
  const tickMs = Math.max(14, Math.floor(typeBudget / charSteps));
  const deleteTickMs = Math.max(10, Math.floor(deleteBudget / charSteps));

  return { tickMs, deleteTickMs, holdMs, clearMs };
}

/**
 * Cinematic molecular typewriter — type → hold → delete → loop.
 *
 * @param {HTMLElement} element
 * @param {{
 *   text?: string,
 *   tickMs?: number,
 *   deleteTickMs?: number,
 *   holdMs?: number,
 *   clearMs?: number,
 *   cycleMs?: number | null,
 *   holdRatio?: number,
 *   cursorChar?: string,
 * }} [options]
 */
export function createHackedTypewriter(element, options = {}) {
  const base = { ...DEFAULTS, ...options };
  const target = base.text;

  const timing = base.cycleMs
    ? resolveTypewriterTiming(target, base.cycleMs, base)
    : {
        tickMs: base.tickMs,
        deleteTickMs: base.deleteTickMs,
        holdMs: base.holdMs,
        clearMs: base.clearMs,
      };

  const config = { ...base, ...timing };

  /** @type {'type' | 'hold' | 'delete' | 'clear'} */
  let phase = 'type';
  let visibleCount = 0;

  /** @type {ReturnType<typeof setTimeout> | null} */
  let tickTimeout = null;

  /** @type {ReturnType<typeof setTimeout> | null} */
  let phaseTimeout = null;

  const clearPhaseTimeout = () => {
    if (phaseTimeout !== null) {
      clearTimeout(phaseTimeout);
      phaseTimeout = null;
    }
  };

  const buildFrame = () => {
    if (phase === 'clear') return '';

    const output = escapeHtml(target.slice(0, visibleCount));

    if (phase !== 'clear') {
      return `${output}<span class="hero-typewriter-cursor" aria-hidden="true">${config.cursorChar}</span>`;
    }

    return output;
  };

  const render = () => {
    element.innerHTML = buildFrame();
  };

  const resetType = () => {
    phase = 'type';
    visibleCount = 0;
    render();
  };

  const beginHold = () => {
    phase = 'hold';
    render();

    clearPhaseTimeout();
    phaseTimeout = setTimeout(() => {
      phase = 'clear';
      render();

      clearPhaseTimeout();
      phaseTimeout = setTimeout(() => {
        phase = 'delete';
      }, config.clearMs);
    }, config.holdMs);
  };

  const onTick = () => {
    if (phase === 'type') {
      if (visibleCount < target.length) {
        visibleCount += 1;
      }
      if (visibleCount >= target.length) {
        beginHold();
        return;
      }
      render();
      return;
    }

    if (phase === 'delete') {
      if (visibleCount > 0) {
        visibleCount -= 1;
      }
      if (visibleCount <= 0) {
        resetType();
        return;
      }
      render();
    }
  };

  const start = () => {
    dispose();
    resetType();

    const schedule = (delay) => {
      tickTimeout = setTimeout(() => {
        onTick();
        const nextDelay = phase === 'delete' ? config.deleteTickMs : config.tickMs;
        schedule(nextDelay);
      }, delay);
    };

    schedule(config.tickMs);
  };

  const dispose = () => {
    clearPhaseTimeout();

    if (tickTimeout !== null) {
      clearTimeout(tickTimeout);
      tickTimeout = null;
    }
  };

  return { start, dispose, render };
}

function escapeHtml(char) {
  return char
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export { HERO_TYPEWRITER_TEXT } from './config/brand.js';
