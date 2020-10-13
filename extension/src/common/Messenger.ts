import { browser } from "webextension-polyfill-ts";
export enum Messages {
  TEST,
}


class Messenger {
  static sendMessageAsync(type: Messages, data = null) {
    return browser.runtime.sendMessage({ type, data }).then((response) => {
      try {
        const obj = JSON.parse(response);
        return obj;
      } catch (error) {
        return response;
      }
    });
  }
}

export default Messenger;
