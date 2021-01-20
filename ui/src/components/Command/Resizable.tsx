import { Icon } from "@blueprintjs/core";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const clamp = (n: number, min: number, max: number) =>
  Math.max(Math.min(n, max), min);
function Resizable({ children, onResize, width, height }) {
  const [isDragging, setIsDragging] = useState(false);
  const onResizeFn = React.useRef<any>(onResize);

  useEffect(() => {
    height.onChange(() => {
      onResizeFn.current?.();
    });
  }, []);
  const handleDrag = React.useCallback((event, info) => {
    const newHeight = height.get() + info.delta.y;
    const h = clamp(newHeight, 200, 900);
    height.set(h);
  }, []);

  return (
    <div>
      <motion.div
        style={{
          height,
          width,
          cursor: isDragging ? "row-resize" : "",
        }}
        layout
      >
        {children}
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 0 }}>
        <motion.div
          style={{
            cursor: "row-resize",
            textAlign: "center",
          }}
          drag="y"
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
          <Icon
            icon="drag-handle-horizontal"
            style={{ left: "50%", cursor: "ns-resize" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(Resizable);
