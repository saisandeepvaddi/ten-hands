import { BrowserWindow } from "electron";

let isQuitting: boolean = false;

export function setIsAppQuitting(isAppQuitting: boolean) {
  isQuitting = isAppQuitting;
}

export function isAppQuitting(): boolean {
  return isQuitting;
}
