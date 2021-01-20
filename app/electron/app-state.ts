let isQuitting = false;

export function setIsAppQuitting(quitting: boolean) {
  isQuitting = quitting;
}

export function isAppQuitting(): boolean {
  return isQuitting;
}
