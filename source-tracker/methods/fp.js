const fp = () => {
  const [entry] = performance.getEntriesByName('first-paint');
  return entry;
}
export default fp