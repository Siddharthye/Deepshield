/** Lets the browser paint and handle input between heavy scan steps. */
export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export function deferToIdle(fn: () => void) {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => fn(), { timeout: 3000 });
  } else {
    setTimeout(fn, 50);
  }
}
