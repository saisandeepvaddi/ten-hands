import { browser, Tabs } from "webextension-polyfill-ts";
export function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}