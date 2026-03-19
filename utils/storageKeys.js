export function scopedKey(baseKey, email) {
  if (!email) return baseKey;
  return `${baseKey}::${email.toLowerCase()}`;
}

export function migrateLegacyKey(baseKey, email) {
  if (typeof window === "undefined" || !email) return;
  const oldValue = localStorage.getItem(baseKey);
  const scoped = scopedKey(baseKey, email);
  const scopedValue = localStorage.getItem(scoped);
  if (oldValue && !scopedValue) {
    localStorage.setItem(scoped, oldValue);
  }
}
