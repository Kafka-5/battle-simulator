// performing delay to perform asynchronos actions

export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
