/**
 * easing modes
 */
type EasingMode =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'random';

/**
 * more options
 */
interface WaitOptions<HandlerReturn>
  extends Partial<{
    /**
     * name of the easing mode
     * @defaultValue The default is `random`
     */
    mode: EasingMode;
    /**
     * execute during the waiting process
     */
    handler: () => Promise<HandlerReturn> | HandlerReturn;
    /**
     * listen the update of time
     * @remarks When the handler execution time exceeds the waiting time, the progress will be maintained at 99% until completed
     */
    onUpdate: (percent: number) => void;
  }> {}

const REQUIRE_DURATION = 16.6; // "requestAnimationFrame" one call need 1000ms/60(16.6ms)
const STAY_PERCENT_WHEN_HANDLE_TIMEOUT = 0.99;

/**
 * compatible with browsers and node environments
 * @param {Function} handler callback
 */
function requestAnimation(handler: FrameRequestCallback) {
  if (typeof window !== 'undefined')
    return window.requestAnimationFrame(handler);
  // use setTimeout in a non-browser environment
  const timer = setTimeout(() => {
    handler(timer);
    clearTimeout(timer);
  }, REQUIRE_DURATION);
  return timer;
}

/**
 * pure method of waiting.
 * @param {number} duration time in ms
 * @param {string} mode easing mode, the default value is random
 * @param {Function} onUpdate listen the update of time
 * @returns {Promise<number>} new percent
 */
function pureWait(
  duration: number = 0,
  mode: EasingMode,
  onUpdate?: (percent: number) => void
): Promise<number> {
  let percent = 0;

  const easingFunctions: Record<EasingMode, (timing: number) => number> = {
    ease: (timing) => (timing / duration) ** 4,
    'ease-in': (timing) => (timing / duration) ** 2,
    'ease-in-out': (timing) => {
      let t = timing / (duration / 2);
      return t < 1 ? t ** 2 / 2 : -(--t * (t - 2) - 1) / 2;
    },
    'ease-out': (timing) => -(timing / duration) * (timing / duration - 2),
    linear: (timing) => timing / duration,
    random: (timing) =>
      percent + (Math.random() * (timing / duration) * (1 - percent)) ** 3,
  };

  const modeKeys = Object.keys(easingFunctions);

  const easingFunction =
    mode === 'random'
      ? easingFunctions[modeKeys[Math.floor(Math.random() * modeKeys.length)]]
      : easingFunctions[mode] ?? easingFunctions['random'];

  return new Promise<number>((resolve) => {
    let initTime = new Date().getTime();
    let timing = 0;

    const waiting = () => {
      requestAnimation(() => {
        timing = new Date().getTime() - initTime;
        percent = easingFunction(timing);
        if (timing >= duration) {
          onUpdate?.(1);
          resolve(timing);
        } else {
          onUpdate?.(percent);
          waiting();
        }
      });
    };
    waiting();
  });
}

/**
 * simulate a wait operation with progress updates, i call it vivid-wait.
 * @param {number} duration time to wait in ms
 * @param {Object} options more options {@link WaitOptions}
 * @returns the result of the handler if it exists
 */
export async function wait<HandlerReturn>(
  duration: number,
  options: WaitOptions<HandlerReturn> = {}
) {
  const { mode = 'random', handler, onUpdate } = options;

  let waitFinallyPercent = handler ? STAY_PERCENT_WHEN_HANDLE_TIMEOUT : 1;

  const handlerPromise = handler ? handler() : Promise.resolve();

  const waitPromise = await pureWait(duration, mode, (percent: number) => {
    onUpdate?.(percent * waitFinallyPercent);
  });

  const [handlerResult] = await Promise.all([handlerPromise, waitPromise]);

  onUpdate?.(1);

  return handlerResult;
}
