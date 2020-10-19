import { browser } from "webextension-polyfill-ts";
import { Messages } from "../common/Messenger";
import { IMessage } from "../types";

export class BackgroundScript {
  requests = new Map();

  _handleTest = async () => {
    // Use arrow function
    try {
      return "Test Success from Background Script";
    } catch (error) {
      console.error("error: ", error);
      return "Test Error from Background Script";
    }
  };

  registerMessengerRequests() {
    // Map requests from CS, Popup to background here.
    this.requests.set(Messages.TEST, this._handleTest);
  }

  listenForMessages() {
    browser.runtime.onMessage.addListener((message: IMessage) => {
      const { type, data } = message;
      return this.requests.get(type)(data);
    });
  }
  init() {
    console.log("Background Started");

    this.registerMessengerRequests();
    this.listenForMessages();
  }
}
