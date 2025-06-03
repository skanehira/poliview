import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts
(
  globalThis as unknown as { ResizeObserver: typeof ResizeObserver }
).ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe() {}
  unobserve() {}
  disconnect() {}
};
