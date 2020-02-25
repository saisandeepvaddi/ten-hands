import React, { useEffect } from "react";

export const useMountedState = () => {
  let mountedRef = React.useRef<boolean>(false);
  const isMounted = React.useCallback(() => mountedRef.current, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return isMounted;
};
