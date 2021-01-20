import React from "react";
import PopupLayout from "./components/PopupLayout/PopupLayout";
import { useConfig } from "./stores/ConfigStore.ext";
import { useSockets } from "./stores/SocketStore.ext";

const Popup = () => {
  const { config } = useConfig();
  const { isSocketInitialized, initializeSocket } = useSockets();

  React.useEffect(() => {
    try {
      initializeSocket();
    } catch (error) {
      console.error("error: ", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isSocketInitialized || !config) {
    return null;
  }

  return <PopupLayout />;
};

export default Popup;
