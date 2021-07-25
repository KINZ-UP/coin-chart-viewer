export default function debounce(callback: () => any, delay?: number) {
  let timeoutId: number | null = null;
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay || 100);
  };
}
