import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts
(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe() {}
  unobserve() {}
  disconnect() {}
};
