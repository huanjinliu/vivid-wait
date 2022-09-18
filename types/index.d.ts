declare type UpdateMode = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'random';
/**
 * simulate a wait operation with progress updates, i call it vivid-wait.
 * @param {number} duration total time in ms
 * @param {Object} options more configuration
 * @param {string} options.mode easing mode, the default value is random
 * @param {Function} options.handler execute during the waiting process, if the execution time exceeds the waiting time, the progress will stay at 0.99
 * @param {Function} options.onUpdate listen the update of progress
 * @returns the result of the handler if it exists
 */
export declare function wait<HandlerReturn>(duration: number, options?: Partial<{
    mode: UpdateMode;
    handler: () => Promise<HandlerReturn>;
    onUpdate: Function;
}>): Promise<void | HandlerReturn>;
export {};
