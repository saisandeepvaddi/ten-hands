/// <reference types="react-scripts" />

declare module "react-query-devtools" {
  const ReactQueryDevtools: React.ComponentType<{
    initialIsOpen?: boolean;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    closeButtonProps?: JSX.IntrinsicElements["button"];
    toggleButtonProps?: JSX.IntrinsicAttributes["button"];
    panelProps?: JSX.IntrinsicAttributes["div"];
  }>;
}
