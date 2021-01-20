import { Toaster } from "@blueprintjs/core";

export const toaster = {
  success: (message: string) => {
    const handle = Toaster.create({
      className: "recipe-toaster",
      position: "top",
    });
    handle.show({
      intent: "success",
      message,
    });
  },
  error: (message: string) => {
    const handle = Toaster.create({
      className: "recipe-toaster",
      position: "top",
    });
    handle.show({
      intent: "danger",
      message,
    });
  },
};
