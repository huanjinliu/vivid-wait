var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wait = void 0;
    const REQUIRE_DURATION = 16.6; // "requestAnimationFrame" one call need 1000ms/60(16.6ms)
    const STAY_PERCENT_WHEN_HANDLE_TIMEOUT = 0.99;
    /**
     * compatible with browsers and node environments
     * @param {Function} handler callback
     */
    function requestAnimation(handler) {
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
    function pureWait(duration = 0, mode, onUpdate) {
        var _a;
        let percent = 0;
        const easingFunctions = {
            ease: (timing) => Math.pow((timing / duration), 4),
            'ease-in': (timing) => Math.pow((timing / duration), 2),
            'ease-in-out': (timing) => {
                let t = timing / (duration / 2);
                return t < 1 ? Math.pow(t, 2) / 2 : -(--t * (t - 2) - 1) / 2;
            },
            'ease-out': (timing) => -(timing / duration) * (timing / duration - 2),
            linear: (timing) => timing / duration,
            random: (timing) => percent + Math.pow((Math.random() * (timing / duration) * (1 - percent)), 3),
        };
        const modeKeys = Object.keys(easingFunctions);
        const easingFunction = mode === 'random'
            ? easingFunctions[modeKeys[Math.floor(Math.random() * modeKeys.length)]]
            : (_a = easingFunctions[mode]) !== null && _a !== void 0 ? _a : easingFunctions['random'];
        return new Promise((resolve) => {
            let initTime = new Date().getTime();
            let timing = 0;
            const waiting = () => {
                requestAnimation(() => {
                    timing = new Date().getTime() - initTime;
                    percent = easingFunction(timing);
                    if (timing >= duration) {
                        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(1);
                        resolve(timing);
                    }
                    else {
                        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(percent);
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
    function wait(duration, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mode = 'random', handler, onUpdate } = options;
            let waitFinallyPercent = handler ? STAY_PERCENT_WHEN_HANDLE_TIMEOUT : 1;
            const handlerPromise = handler ? handler() : Promise.resolve();
            const waitPromise = yield pureWait(duration, mode, (percent) => {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(percent * waitFinallyPercent);
            });
            const [handlerResult] = yield Promise.all([handlerPromise, waitPromise]);
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(1);
            return handlerResult;
        });
    }
    exports.wait = wait;
});
