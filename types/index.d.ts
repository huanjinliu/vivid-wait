/**
 * easing modes
 */
declare type EasingMode = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'random';
/**
 * more options
 */
interface WaitOptions<HandlerReturn> extends Partial<{
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
    onUpdate: (percent: number, cancel?: () => void) => void;
}> {
}
/**
 * simulate a wait operation with progress updates, i call it vivid-wait.
 * @param {number} duration time to wait in ms
 * @param {Object} options more options {@link WaitOptions}
 * @returns the result of the handler if it exists
 */
export declare function wait<HandlerReturn>(duration: number, options?: WaitOptions<HandlerReturn>): Promise<void | HandlerReturn>;
export {};
