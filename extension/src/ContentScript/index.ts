import Messenger, { Messages } from "../common/Messenger";


class ContentScript {
  async init() {
    const testMessageFromBG = await Messenger.sendMessageAsync(Messages.TEST);
    console.log('Test Message from BG:', testMessageFromBG)
  }
}




window.addEventListener("load", () => {
  const cs = new ContentScript();
  cs.init();
})