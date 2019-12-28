const ascii = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~ `;

export function generateKey() {
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += ascii[Math.floor(Math.random()*ascii.length)];
  }
  return key;
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}