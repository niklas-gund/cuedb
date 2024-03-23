/**
 * Prevents a function being called to many times in a time span (e.g. on resize)
 * @param fn function to debounce
 * @param timeOutMs minimal interval between executions
 * @param immediately execute the function without respecting the timing constraints
 */
export default function debounce(
  fn: (...params: unknown[]) => unknown,
  timeOutMs: number,
  immediately = false
) {
  let timer: number | undefined = undefined;
  return function (this: unknown, ...args: unknown[]) {
    if (timer === undefined && immediately) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), timeOutMs);
    return timer;
  };
}
