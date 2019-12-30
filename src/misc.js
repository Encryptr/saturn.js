export function generateKey() {
  return (
    Math.random().toString(36).slice(2, 9)+
    Math.random().toString(36).slice(2, 9)
  );
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}